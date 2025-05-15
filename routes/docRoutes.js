const express = require('express');
const router = express.Router();
const path = require('path');

// Serve dokumentasi HTML dari public/api-doc.html
router.get('/doc', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/api-doc.html'));
});

module.exports = router;
