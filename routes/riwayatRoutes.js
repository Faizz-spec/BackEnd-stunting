const express = require('express');
const router = express.Router();
const {
  createRiwayat,
  getRiwayatByAnakId,
  deleteRiwayatById
} = require('../controllers/riwayatController');

router.post('/riwayat', createRiwayat);
router.get('/riwayat/:anak_id', getRiwayatByAnakId);
router.delete('/riwayat/:id', deleteRiwayatById);

module.exports = router;
