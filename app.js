require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API Stunting Aktif');
});

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
