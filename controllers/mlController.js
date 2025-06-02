const tf = require('@tensorflow/tfjs');
const pool = require('../config/database');
let model = null;

const MODEL_URL = 'https://backend-stunting.onrender.com/public/ml-model/model/model.json';

// Map gender dan label
const GENDER_MAP = {
  'laki-laki': 0,
  'perempuan': 1
};

const LABEL_MAP = {
  0: 'Berpotensi Stunting',
  1: 'Normal',
  2: 'Stunting'
};

// Mean dan std (urutan: gender, umur, tinggi, berat)
const mean = [0.5, 16, 75, 8];
const std = [0.5, 4, 5, 1];

const standardize = (val, mean, std) => (val - mean) / std;

const loadModel = async () => {
  if (!model) {
    model = await tf.loadGraphModel(MODEL_URL);
    console.log('✅ ML model loaded');
  }
};

const predictData = async (req, res) => {
  try {
    await loadModel();

    const inputList = req.body;

    if (!Array.isArray(inputList) || inputList.length === 0) {
      return res.status(400).json({ error: 'Input harus berupa array JSON dan tidak boleh kosong' });
    }

    const results = [];

    for (const item of inputList) {
      const {
        nama,
        jenis_kelamin,
        umur_bulan,
        tinggi_badan,
        berat_badan,
        alamat,
        posyandu,
        foto_url
      } = item;

      if (!nama || !jenis_kelamin || umur_bulan == null || tinggi_badan == null || berat_badan == null) {
        return res.status(400).json({
          error: 'Field tidak lengkap. Harap isi nama, jenis_kelamin, umur_bulan, tinggi_badan, dan berat_badan.'
        });
      }

      const genderLower = jenis_kelamin.toLowerCase();
      const genderNumeric = GENDER_MAP[genderLower] ?? 0;

      let inputArray = [genderNumeric, umur_bulan, tinggi_badan, berat_badan];
      inputArray = inputArray.map((val, i) => standardize(val, mean[i], std[i]));

      const inputTensor = tf.tensor2d([inputArray], [1, 4]);
      const prediction = model.predict(inputTensor);
      const probabilities = await prediction.data(); // ✅ pakai async
      const predictedClass = probabilities.indexOf(Math.max(...probabilities));
      const predictedLabel = LABEL_MAP[predictedClass];

      // Debugging opsional
      console.log('=====================');
      console.log('👶 Nama:', nama);
      console.log('🧠 Input Standardized:', inputArray);
      console.log('📊 Probabilities:', probabilities);
      console.log('✅ Predicted:', predictedLabel);
      console.log('=====================');

      await pool.query(`
        INSERT INTO status_anak 
        (nama, jenis_kelamin, umur_bulan, tinggi_badan, berat_badan, predicted_class, label, alamat, posyandu, foto_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [
        nama,
        jenis_kelamin,
        umur_bulan,
        tinggi_badan,
        berat_badan,
        predictedClass,
        predictedLabel,
        alamat ?? null,
        posyandu ?? null,
        foto_url ?? null
      ]);

      results.push({
        nama,
        jenis_kelamin,
        umur_bulan,
        tinggi_badan,
        berat_badan,
        predicted_class: predictedClass,
        label: predictedLabel,
        alamat: alamat ?? null,
        posyandu: posyandu ?? null,
        foto_url: foto_url ?? null
      });
    }

    res.status(201).json({
      message: '✅ Semua data berhasil diprediksi & disimpan',
      data: results
    });

  } catch (error) {
    console.error('❌ Gagal batch predict:', error);
    res.status(500).json({ error: 'Gagal memproses data batch' });
  }
};

module.exports = { predictData };
