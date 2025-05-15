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


const updateAnakById = async (req, res) => {
  const { id } = req.params;
  const {
    nama,
    jenis_kelamin,
    umur_bulan,
    tinggi_badan,
    berat_badan,
    nama_orang_tua,
    alamat,
    posyandu,
    foto_url
  } = req.body;

  try {
    const result = await pool.query(`
      UPDATE status_anak
      SET
        nama = $1,
        jenis_kelamin = $2,
        umur_bulan = $3,
        tinggi_badan = $4,
        berat_badan = $5,
        nama_orang_tua = $6,
        alamat = $7,
        posyandu = $8,
        foto_url = $9
      WHERE id = $10
    `, [
      nama,
      jenis_kelamin,
      umur_bulan,
      tinggi_badan,
      berat_badan,
      nama_orang_tua,
      alamat,
      posyandu,
      foto_url,
      id
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: '❌ Data anak tidak ditemukan' });
    }

    res.json({ message: '✅ Data anak berhasil diperbarui' });
  } catch (error) {
    console.error('❌ Gagal update data anak:', error);
    res.status(500).json({ message: '❌ Gagal update data anak' });
  }
};




const deleteAnakById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`DELETE FROM status_anak WHERE id = $1`, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: '❌ Data anak tidak ditemukan' });
    }

    res.json({ message: '✅ Data anak berhasil dihapus' });
  } catch (error) {
    console.error('❌ Gagal hapus data anak:', error);
    res.status(500).json({ message: '❌ Gagal menghapus data anak' });
  }
};

module.exports = {
  getAllStatusAnak,
  getAnakById, // ⬅️ export juga di sini
  updateAnakById,
  deleteAnakById 
};

