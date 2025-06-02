const { Pool } = require('pg');

// const useSSL = true; // ganti jadi true kalau pakai database online kayak Render

// const pool = new Pool({
//   host: 'dpg-d0dbhmqdbo4c73b0i7ig-a.oregon-postgres.render.com',
//   user: 'stuntingdb_y8s5_user',
//   password: 'QAwZBMxGgDSytVqJeYIqQ2B5TjnddPlA',
//   database: 'stuntingdb_y8s5',
//   port: 5432,
//   ssl: useSSL ? { rejectUnauthorized: false } : false,
// });

// Koneksi lokal tanpa SSL
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'agusbuntung',
  database: 'stuntingdb',
  port: 5432,
  // Hapus: ssl: ...
});







async function renderDatabaseInfo(req, res) {
  try {
    const client = await pool.connect();

    const tableResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    `);

    const tables = tableResult.rows.map(r => r.table_name);
    let html = `<h2>📊 Struktur Database: <code>stuntingdb</code></h2>`;

    if (tables.length === 0) {
      html += `<p><em>⚠️ Tidak ada tabel di database.</em></p>`;
    }

    for (const table of tables) {
const dataResult = await client.query(`SELECT * FROM ${table}`);
      const rows = dataResult.rows;

      html += `<h3>📁 Tabel: <code>${table}</code></h3>`;

      if (rows.length === 0) {
        html += `<p><em>(Kosong)</em></p>`;
        continue;
      }

      html += `<table border="1" cellpadding="6" style="border-collapse: collapse; font-family: monospace;">`;
      html += `<thead><tr>${Object.keys(rows[0]).map(col => `<th>${col}</th>`).join('')}</tr></thead><tbody>`;

      for (const row of rows) {
        html += `<tr>${Object.values(row).map(val => `<td>${val}</td>`).join('')}</tr>`;
      }

      html += `</tbody></table><br>`;
    }

    client.release();
    res.send(html);
  } catch (err) {
    console.error('❌ Gagal ambil info database:', err);
    res.status(500).send('<p style="color:red;">❌ Gagal mengambil info dari database</p>');
  }
}

module.exports = { renderDatabaseInfo };
