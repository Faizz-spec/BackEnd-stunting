const pool = require('../config/database');

const getAllStatusAnak = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM status_anak ORDER BY created_at DESC`);
    res.json({
      message: '✅ Data status anak berhasil diambil',
      data: result.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil data anak' });
  }
};


const getAnakById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`SELECT * FROM status_anak WHERE id = $1`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Data anak tidak ditemukan' });
    }

    res.json({
      message: '✅ Data anak berhasil ditemukan',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Gagal mengambil data anak:', error);
    res.status(500).json({ error: 'Gagal mengambil data anak' });
  }
};
module.exports = {
  getAllStatusAnak,
  getAnakById // ⬅️ export juga di sini
};

