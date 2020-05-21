const { decode, EnumTokenTypes } = require('../utils/TokenUtils');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ error: 'Token not found.' });
  }

  const parts = authHeader.split(' ');

  if (!parts.length === 2) {
    return res.status(401).send({ error: 'Invalid token sintax.' });
  }

  const [schema, token] = parts;

  if (!/^Bearer$/i.test(schema))
    return res.status(401).send({ error: 'Invalid token sintax.' });

  try {
    const decoded = decode(token);

    if (decoded.type !== EnumTokenTypes.LOGIN) {
      return res.status(401).send({ error: 'Invalid token.' });
    }

    req.user_id = decoded.user_id;
    req.charges = decoded.charges;

    return next();
  } catch (err) {
    return res.status(401).send({ error: 'Invalid token.' });
  }
};
