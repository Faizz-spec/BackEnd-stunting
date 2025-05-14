const { Pool } = require('pg'); // ⬅️ Tambahkan ini dulu

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: false // ⬅️ Pastikan ini juga ada
});

module.exports = pool;
