const { sendEmail, EnumEmailTypes } = require('../../email');

module.exports = {
  key: 'RegisterMail',
  async handle({ data }) {
    const { to, properties } = data;

    return sendEmail(to, EnumEmailTypes.REGISTER, properties);
  },
};
