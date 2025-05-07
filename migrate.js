// migrate.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // untuk Render
  },
});

async function migrate() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS admin (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          password TEXT NOT NULL
        );
      `);
      

    await pool.query(`
      CREATE TABLE IF NOT EXISTS anak (
        id SERIAL PRIMARY KEY,
        nama VARCHAR(255) NOT NULL,
        umur INT NOT NULL,
        tinggi FLOAT NOT NULL,
        berat FLOAT NOT NULL,
        jenis_kelamin VARCHAR(10) NOT NULL,
        hasil_prediksi VARCHAR(50)
      );
    `);

    console.log("✅ Migrasi berhasil dijalankan.");
  } catch (err) {
    console.error("❌ Gagal migrasi:", err);
  } finally {
    await pool.end();
  }
}

migrate();
