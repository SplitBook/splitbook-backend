const { sendEmail, EnumEmailTypes } = require('../../email');

module.exports = {
  key: 'ChangePasswordMail',
  async handle({ data }) {
    const { to, properties } = data;

    return sendEmail(to, EnumEmailTypes.CHANGE_PASSWORD, properties);
  },
};
