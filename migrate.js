// migrate.js
require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
//   ssl: false
// });

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

        await pool.query(`
      CREATE TABLE IF NOT EXISTS status_anak (
        id SERIAL PRIMARY KEY,
        nama VARCHAR(255) NOT NULL,
        jenis_kelamin VARCHAR(20) NOT NULL,
        umur_bulan INT NOT NULL,
        tinggi_badan FLOAT NOT NULL,
        berat_badan FLOAT NOT NULL,
        predicted_class INT,
        label VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
await pool.query(`ALTER TABLE status_anak ADD COLUMN IF NOT EXISTS nama_orang_tua VARCHAR(255);`);
await pool.query(`ALTER TABLE status_anak ADD COLUMN IF NOT EXISTS alamat TEXT;`);
await pool.query(`ALTER TABLE status_anak ADD COLUMN IF NOT EXISTS posyandu VARCHAR(100);`);
await pool.query(`ALTER TABLE status_anak ADD COLUMN IF NOT EXISTS foto_url TEXT;`);


    await pool.query(`
      ALTER TABLE status_anak
      ADD COLUMN IF NOT EXISTS nama_orang_tua VARCHAR(255),
      ADD COLUMN IF NOT EXISTS alamat TEXT,
      ADD COLUMN IF NOT EXISTS posyandu VARCHAR(100),
      ADD COLUMN IF NOT EXISTS foto_url TEXT;
    `);

    await pool.query(`
  CREATE TABLE IF NOT EXISTS riwayat_pemeriksaan (
    id SERIAL PRIMARY KEY,
    anak_id INT REFERENCES status_anak(id) ON DELETE CASCADE,
    tanggal_pemeriksaan DATE NOT NULL,
    tinggi_badan FLOAT NOT NULL,
    berat_badan FLOAT NOT NULL,
    umur_bulan INT NOT NULL,
    status VARCHAR(50) NOT NULL
  );
`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS posyandu_user (
        id SERIAL PRIMARY KEY,
        nama_posyandu VARCHAR(100) NOT NULL,
        alamat TEXT,
        username VARCHAR(100) NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);




    console.log("✅ Semua migrasi dan penambahan kolom berhasil dijalankan.");
  } catch (err) {
    console.error("❌ Gagal migrasi:", err);
  } finally {
    await pool.end();
  }
}

migrate();
