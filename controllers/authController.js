const userModel = require('../models/userModel');
const { generateToken } = require('../utils/jwt');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
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

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await userModel.findByUsername(username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: true, message: 'Invalid credentials' });
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
