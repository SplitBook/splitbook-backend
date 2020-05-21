const nodemailer = require('nodemailer');
const pug = require('pug');
const nodemailerConfig = require('../config/nodemailerConfig');
const path = require('path');
const EnumEmailTypes = require('../utils/enums/EnumEmailTypes');

const configuration =
  process.env.NODE_ENV === 'test'
    ? nodemailerConfig.test
    : nodemailerConfig.development;

const email = nodemailer.createTransport(configuration);
const from = process.env.EMAIL_FROM || configuration.auth.user;

const sendEmail = function (to, emailType, properties = {}) {
  const { subject, file, frontend_endpoint } = emailType;
  properties.subject = subject;
  properties.url = frontend_endpoint
    ? (process.env.FRONTEND_HOST || 'http://localhost:3000') + frontend_endpoint
    : null;

  const html = pug.renderFile(
    path.resolve(__dirname, 'templates', `${file}.pug`),
    properties
  );

  console.debug(`Email sent to ${to} with subject - ${subject}`);

  return email.sendMail({
    from,
    to,
    subject,
    html,
  });
};

module.exports = { sendEmail, EnumEmailTypes };
