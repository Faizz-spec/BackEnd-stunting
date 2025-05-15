const pool = require('../config/database');

const createRiwayat = async (req, res) => {
  const {
    anak_id,
    tanggal_pemeriksaan,
    tinggi_badan,
    berat_badan,
    umur_bulan,
    status
  } = req.body;

  if (!anak_id || !tanggal_pemeriksaan || !tinggi_badan || !berat_badan || !umur_bulan || !status) {
    return res.status(400).json({ message: "❌ Field tidak lengkap" });
  }

  try {
    const result = await pool.query(`
      INSERT INTO riwayat_pemeriksaan
      (anak_id, tanggal_pemeriksaan, tinggi_badan, berat_badan, umur_bulan, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [anak_id, tanggal_pemeriksaan, tinggi_badan, berat_badan, umur_bulan, status]);

    res.status(201).json({
      message: '✅ Riwayat pemeriksaan berhasil ditambahkan',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Gagal tambah riwayat:', error);
    res.status(500).json({ message: '❌ Gagal menambahkan riwayat' });
  }
};


const getRiwayatByAnakId = async (req, res) => {
  const { anak_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM riwayat_pemeriksaan WHERE anak_id = $1 ORDER BY tanggal_pemeriksaan DESC`,
      [anak_id]
    );

    res.json({
      message: '✅ Riwayat pemeriksaan berhasil diambil',
      data: result.rows
    });
  } catch (error) {
    console.error('❌ Gagal ambil riwayat:', error);
    res.status(500).json({ message: '❌ Gagal mengambil data riwayat' });
  }
};

const deleteRiwayatById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`DELETE FROM riwayat_pemeriksaan WHERE id = $1`, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: '❌ Riwayat tidak ditemukan' });
    }

    res.json({ message: '✅ Riwayat berhasil dihapus' });
  } catch (error) {
    console.error('❌ Gagal hapus riwayat:', error);
    res.status(500).json({ message: '❌ Gagal menghapus riwayat' });
  }
};

module.exports = {
createRiwayat,
getRiwayatByAnakId,
deleteRiwayatById
};