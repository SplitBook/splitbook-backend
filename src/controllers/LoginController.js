const knex = require('../database');
const { validatePassword, encript } = require('../utils/PasswordUtils');
const { generate, decode } = require('../utils/TokenUtils');

module.exports = {
  async login(req, res, next) {
    const { email, password } = req.body;

    const [user] = await knex('users')
      .where('email', email)
      .whereNull('deleted_at')
      .select('*');

    const isPasswordValid = await validatePassword(password, user.password);

    if (user && user.email_confirmed && isPasswordValid) {
      // TODO - Return information needed for user
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

      // user.profiles = [account, teacher, guardian].filter((elm) => elm);

      const token = generate({
        user_id: user.user_id,
      });

      return res.json({ user, token });
    }

    return res.status(403).json({ error: 'Email or password invalid.' });
  },

  async register(req, res, next) {
    const { token } = req.query;
    const { password } = req.body;

    try {
      const { email } = decode(token);

      if (email === undefined || email === null) {
        return res.status(406).json({ error: 'Invalid token' });
      }

      const [user] = await knex('users')
        .where('email', email)
        .whereNull('deleted_at')
        .select('*');

      if (user) {
        if (!user.email_confirmed) {
          user.password = await encript(password);

          await knex('users').where('id', user.id).update({
            email_confirmed: true,
            password: user.password,
          });

          return res.status(204).send();
        }

        return res.status(203).json({ success: 'Password already setted' });
      }

      return res.status(404).json({ error: 'User not found' });
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token.' });
    }
  },
};
