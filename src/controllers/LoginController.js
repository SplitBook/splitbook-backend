const knex = require('../database');
const { validatePassword } = require('../utils/PasswordUtils');
const { generate, decode, EnumTokenTypes } = require('../utils/TokenUtils');
const EnumCharges = require('../utils/enums/EnumCharges');

module.exports = {
  async login(req, res, next) {
    const { email, password } = req.body;

    const [user] = await knex('users')
      .where('email', email)
      .whereNull('deleted_at')
      .select('*');

    if (user) {
      const isPasswordValid = await validatePassword(password, user.password);

      if (user.email_confirmed && isPasswordValid) {
        user.password = undefined;

        user.profiles = await knex('accounts')
          .where('user_id', user.id)
          .whereNull('deleted_at')
          .union([
            knex('guardians')
              .where('user_id', user.id)
              .whereNull('deleted_at')
              .select('*'),
            knex('teachers')
              .where('user_id', user.id)
              .whereNull('deleted_at')
              .select('*'),
          ]);

        const token = generate({
          user_id: user.id,
        });

        return res.json({ user, token });
      }
    }

    return res.status(403).json({ error: 'Email or password invalid.' });
  },

  async profile(req, res, next) {
    const { token, charge, profile_id } = req.body;

    try {
      const { user_id, type } = decode(token);

      if (type !== EnumTokenTypes.LOGIN) {
        return res.status(401).json({ error: 'Invalid token.' });
      }

      const { table } = Object.values(EnumCharges).find(
        (chargeObject) => chargeObject.charge === charge
      );

      const [profile] = await knex(table)
        .where({ id: profile_id, user_id })
        .whereNull('deleted_at');

      if (profile) {
        const profileToken = generate({
          user_id,
          profile_id,
          charge,
        });

        return res.json({ token: profileToken, user_id, profile_id, charge });
      }

      return res.status(404).json({ error: 'Profile not found.' });
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token or charge.' });
    }
  },

  // async register(req, res, next) {
  //   const { token } = req.query;
  //   const { password } = req.body;

  //   try {
  //     const { user_id, type } = decode(token);

  //     if (
  //       user_id === undefined ||
  //       user_id === null ||
  //       type === undefined ||
  //       type === null ||
  //       type !== EnumTokenTypes.EMAIL
  //     ) {
  //       return res.status(406).json({ error: 'Invalid token' });
  //     }

  //     const [user] = await knex('users')
  //       .where('id', user_id)
  //       .whereNull('deleted_at')
  //       .select('*');

  //     if (user) {
  //       if (!user.email_confirmed) {
  //         user.password = await encript(password);

  //         await knex('users').where('id', user.id).update({
  //           email_confirmed: true,
  //           password: user.password,
  //         });

  //         return res.status(204).send();
  //       }

  //       return res.status(203).json({ success: 'Password already setted' });
  //     }

  //     return res.status(404).json({ error: 'User not found' });
  //   } catch (err) {
  //     return res.status(401).json({ error: 'Invalid token.' });
  //   }
  // },
};
