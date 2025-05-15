const express = require('express');
const router = express.Router();
const {
  getAllStatusAnak,
  getAnakById // ⬅️ tambahkan ini!
} = require('../controllers/anakController');

const { updateAnakById } = require('../controllers/anakController');
const { deleteAnakById } = require('../controllers/anakController');
router.delete('/status-anak/:id', deleteAnakById);
router.put('/status-anak/:id', updateAnakById);
router.get('/status-anak', getAllStatusAnak);
router.get('/status-anak/:id', getAnakById); // << ini endpoint barunya

module.exports = router;
