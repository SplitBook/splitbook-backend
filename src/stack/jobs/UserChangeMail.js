const { sendEmail, EnumEmailTypes } = require('../../email');

module.exports = {
  key: 'UserChangeMail',
  async handle({ data }) {
    const { to, properties } = data;

    return sendEmail(to, EnumEmailTypes.USER_CHANGE, properties);
  },
};
