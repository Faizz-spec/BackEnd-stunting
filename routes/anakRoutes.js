const express = require('express');
const router = express.Router();
const {
  getAllStatusAnak,
  getAnakById // ⬅️ tambahkan ini!
} = require('../controllers/anakController');
const verifyToken = require('../middlewares/authMiddleware'); // ✅ import middleware

const { updateAnakById } = require('../controllers/anakController');
const { deleteAnakById } = require('../controllers/anakController');


// ✅ Proteksi semua endpoint pakai token
router.get('/status-anak', verifyToken, getAllStatusAnak);
router.get('/status-anak/:id', verifyToken, getAnakById);
router.put('/status-anak/:id', verifyToken, updateAnakById);
router.delete('/status-anak/:id', verifyToken, deleteAnakById);


module.exports = router;
