const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const userModel = require('../models/userModel');
const { generateToken } = require('../utils/jwt');

// 🔐 REGISTER
const register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password || password.length < 6) {
    return res.status(400).json({ error: true, message: 'Invalid input' });
  }

  const userExist = await userModel.findByUsername(username);
  if (userExist) {
    return res.status(409).json({ error: true, message: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await userModel.createUser(username, hashedPassword);

  res.status(201).json({ error: false, message: 'User Created' });
};

// 🔑 LOGIN
const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await userModel.findByUsername(username);

  if (!user) {
    return res.status(404).json({ error: true, message: 'User not found' });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: true, message: 'Invalid password' });
  }

  const token = generateToken({ userId: user.id, username: user.username });

  res.status(200).json({
    error: false,
    message: 'success',
    loginResult: {
      userId: user.id,
      username: user.username,
      token,
    },
  });
};

// 🙋‍♂️ GET PROFILE (protected)
const getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token missing' });

    const SECRET = process.env.SECRET_KEY || 'default_secret';
    const decoded = jwt.verify(token, SECRET);

    const result = await pool.query('SELECT id, username FROM admin WHERE id = $1', [decoded.userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: '✅ Profil berhasil diambil',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('[DEBUG] JWT Error:', err.message);
    res.status(401).json({ message: 'Token tidak valid atau expired' });
  }
};


// 🚪 LOGOUT (opsional, frontend hapus token)
const logout = (req, res) => {
  res.json({ message: '✅ Logout berhasil (hapus token di client)' });
};

module.exports = {
  register,
  login,
  getProfile,
  logout
};
