const knex = require('../database');
const Queue = require('../stack');
const { decode, generate, EnumTokenTypes } = require('../utils/TokenUtils');
const { encript } = require('../utils/PasswordUtils');

module.exports = {
  async recoverPassword(req, res) {
    const { change_password } = req.query;
    const { email } = req.body;

    const [user] = await knex('users')
      .where('email', email)
      .whereNull('deleted_at');

    if (user) {
      const token = generate(
        {
          email,
        },
        EnumTokenTypes.EMAIL,
        '1h'
      );

      if (change_password) {
        await Queue.add(Queue.EnumQueuesTypes.CHANGE_PASSWORD_MAIL, {
          to: email,
          properties: { token },
        });
      } else {
        await Queue.add(Queue.EnumQueuesTypes.RECOVER_PASSWORD_MAIL, {
          to: email,
          properties: { token },
        });
      }

      return res.status(202).json({ success: `Email sent to ${email}.` });
    }

    return res.status(404).json({ error: 'User not found.' });
  },

  async changePassword(req, res) {
    const { token } = req.query;
    const { password } = req.body;

    try {
      const { email, type } = decode(token);

      if (
        email === undefined ||
        email === null ||
        type === undefined ||
        type === null ||
        type !== EnumTokenTypes.EMAIL
      ) {
        return res.status(406).json({ error: 'Invalid token' });
      }

      const [user] = await knex('users')
        .where('email', email)
        .whereNull('deleted_at')
        .select('*');

      if (user) {
        user.password = await encript(password);

        await knex('users').where('id', user.id).update({
          email_confirmed: true,
          password: user.password,
        });

        return res.status(204).send();
      }

      return res.status(404).json({ error: 'User not found' });
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token.' });
    }
  },
};
