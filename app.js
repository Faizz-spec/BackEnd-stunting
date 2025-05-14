require('dotenv').config();
require('./migrate');
const express = require('express');
const cors = require('cors');
const path = require('path'); // ⬅️ Tambahkan ini

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);
const anakRoutes = require('./routes/anakRoutes');
app.use('/api', anakRoutes);

const mlRoutes = require('./routes/mlRoutes');
app.use('/ml', mlRoutes); 

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('API Stunting Aktif');
});

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
