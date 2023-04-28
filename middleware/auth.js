const jwt = require('jsonwebtoken');
const { unAuthorizedError } = require('../utils/errors');
//const { JWT_SECRET } = require('../utils/config');
const { NODE_ENV, JWT_SECRET } = process.env;

const handleAuthError = (res) => 
  res
    .status(unAuthorizedError)
    .send({ message: 'Authorization Error' });

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'HE DOESNT KNOW');
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  return next();
};