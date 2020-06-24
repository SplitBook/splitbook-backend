const emailTypes = {
  RECOVER_PASSWORD: {
    subject: 'Recuperar a sua palava-passe - SplitBook',
    frontend_endpoint: '/reset/password',
    file: 'recover_password',
  },
  CHANGE_PASSWORD: {
    subject: 'Alterar palavra-passe - SplitBook',
    frontend_endpoint: '/reset/password',
    file: 'change_password',
  },
  REGISTER: {
    subject: 'Registar conta - SplitBook',
    frontend_endpoint: '/reset/password',
    file: 'register',
  },
  USER_CHANGE: {
    subject: 'Confirmar palavra-passe - SplitBook',
    frontend_endpoint: '/reset/password',
    file: 'user_change',
  },
};

module.exports = emailTypes;
