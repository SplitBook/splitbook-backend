const { sendEmail, EnumEmailTypes } = require('../../email');

module.exports = {
  key: 'RecoverPasswordMail',
  async handle({ data }) {
    const { to, properties } = data;

    return sendEmail(to, EnumEmailTypes.RECOVER_PASSWORD, properties);
  },
};
