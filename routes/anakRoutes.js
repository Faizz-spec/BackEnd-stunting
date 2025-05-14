const express = require('express');
const router = express.Router();
const {
  getAllStatusAnak,
  getAnakById // ⬅️ tambahkan ini!
} = require('../controllers/anakController');


router.get('/status-anak', getAllStatusAnak);
router.get('/status-anak/:id', getAnakById); // << ini endpoint barunya

module.exports = router;
