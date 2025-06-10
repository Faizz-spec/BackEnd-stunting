const pool = require('../config/database');

const getStatistik = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        EXTRACT(YEAR FROM created_at) AS tahun,
        label,
        COUNT(*) AS jumlah
      FROM status_anak
      GROUP BY tahun, label
      ORDER BY tahun ASC
    `);

    const statistik = {};
    result.rows.forEach(row => {
      const { tahun, label, jumlah } = row;
      if (!statistik[tahun]) {
        statistik[tahun] = {
          "Normal": 0,
          "Stunted": 0,
          "Severely Stunted": 0
        };
      }

      // Mapping label ke key statistik
      let keyStatistik = null;
      if (label === "Normal") keyStatistik = "Normal";
      else if (label === "Stunting") keyStatistik = "Stunted";
      else if (label === "Berpotensi Stunting") keyStatistik = "Severely Stunted";

      if (keyStatistik) {
        statistik[tahun][keyStatistik] += Number(jumlah);
      }
    });

    res.json({
      message: "✅ Statistik berhasil diambil",
      data: statistik
    });
  } catch (err) {
    console.error('❌ Gagal ambil statistik:', err);
    res.status(500).json({ message: '❌ Gagal mengambil statistik' });
  }
};

module.exports = { getStatistik };