const { decode } = require('../utils/TokenUtils');

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

    req.user_id = decoded.id;
    req.charge_id = decoded.charge_id;
    req.charge = decoded.charge;

    return next();
  } catch (err) {
    return res.status(401).send({ error: 'Invalid token.' });
  }
};
