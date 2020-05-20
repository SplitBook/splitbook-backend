const nodemailer = require('nodemailer');
const pug = require('pug');
const nodemailerConfig = require('../config/nodemailerConfig');
const path = require('path');

const configuration =
  process.env.NODE_ENV === 'test'
    ? nodemailerConfig.test
    : nodemailerConfig.development;

const email = nodemailer.createTransport(configuration);

const sendEmail = function (to, emailType, properties = {}) {
  const { subject, file, frontend_endpoint } = emailType;
  properties.subject = subject;
  properties.url =
    (process.env.FRONTEND_HOST || 'http://localhost:3000') + frontend_endpoint;

  const html = pug.renderFile(
    path.resolve(__dirname, 'templates', `${file}.pug`),
    properties
  );

  return email.sendMail({
    from: configuration.auth.user,
    to,
    subject,
    html,
  });
};

module.exports = { sendEmail };
