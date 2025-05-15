const express = require('express');
const router = express.Router();
const { getStatistik } = require('../controllers/statistikController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/statistik', authMiddleware, getStatistik);

module.exports = router;
