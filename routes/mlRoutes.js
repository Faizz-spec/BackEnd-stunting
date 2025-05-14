const express = require('express');
const router = express.Router();
const mlController = require('../controllers/mlController');
router.post('/predict', mlController.predictData);

module.exports = router;
