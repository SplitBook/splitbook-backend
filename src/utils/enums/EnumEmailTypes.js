const emailTypes = {
  RECOVER_PASSWORD: {
    subject: 'Recuperar a sua palava-passe - SplitBook',
    frontend_endpoint: '/',
    file: 'recover_password',
  },
  CHANGE_PASSWORD: {
    subject: 'Alterar palavra-passe - SplitBook',
    frontend_endpoint: '/',
    file: 'change_password',
  },
  REGISTER: {
    subject: 'Registar conta - SplitBook',
    frontend_endpoint: '/',
    file: 'register',
  },
  USER_CHANGE: {
    subject: 'Confirmar palavra-passe - SplitBook',
    frontend_endpoint: '/',
    file: 'user_change',
  },
};

module.exports = emailTypes;
