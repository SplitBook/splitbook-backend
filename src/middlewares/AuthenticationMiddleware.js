const { decode, EnumTokenTypes } = require('../utils/TokenUtils');
const Config = require('../utils/ConfigUtils');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not found.' });
  }

  const parts = authHeader.split(' ');

  if (!parts.length === 2) {
    return res.status(401).json({ error: 'Invalid token sintax.' });
  }

  const [schema, token] = parts;

  if (!/^Bearer$/i.test(schema))
    return res.status(401).json({ error: 'Invalid token sintax.' });

  try {
    const decoded = decode(token);

    if (decoded.type !== EnumTokenTypes.LOGIN) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    if (!decoded['charge'] || !decoded['profile_id']) {
      return res
        .status(401)
        .json({ error: 'Invalid profile token. Please sign your profile.' });
    }

    req.user_id = decoded.user_id;
    req.charge = decoded.charge;
    req.profile_id = decoded.profile_id;

    try {
      req.school_year_id = await Config.getConfig(
        Config.EnumConfigs.CURRENT_SCHOOL_YEAR_ID.key
      );
    } catch (err) {
      req.school_year_id = 1;
    }

    res.set('School-Year-ID', req.school_year_id);

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
};
