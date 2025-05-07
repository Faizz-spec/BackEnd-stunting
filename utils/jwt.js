const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET_KEY || 'default_secret';

exports.generateToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: '1d' });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};
