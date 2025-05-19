require('dotenv').config(); // WAJIB paling atas!

const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET_KEY || 'default_secret';

console.log('[DEBUG] SECRET:', SECRET); // Tambahkan ini

exports.generateToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: '1d' });
};

exports.verifyToken = (token) => {
  console.log('[DEBUG] Verifying with secret:', SECRET); 
  return jwt.verify(token, SECRET);
};
