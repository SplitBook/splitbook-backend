const { sendEmail } = require('../../email');

module.exports = {
  key: 'SendMail',
  options: {
    limiter: {
      max: process.env.MAX_EMAIL_PER_MINUTE || 30,
      duration: 60000,
    },
  },
  async handle({ data }) {
    const { to, emailType, properties } = data;

    return sendEmail(to, emailType, properties);
  },
};
