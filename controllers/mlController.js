const tf = require('@tensorflow/tfjs');
const pool = require('../config/database');
let model = null;

const loadModel = async () => {
  if (!model) {
model = await tf.loadGraphModel('https://backend-stunting.onrender.com/public/ml-model/model/model.json');

    // model = await tf.loadGraphModel('http://localhost:5000/public/ml-model/model/model.json');
    
    console.log('✅ ML model loaded');
  }
};

const labels = ["Normal", "Stunted", "Severely Stunted"];

const predictData = async (req, res) => {
  try {
    await loadModel();

    const inputList = req.body;

    if (!Array.isArray(inputList) || inputList.length === 0) {
      return res.status(400).json({ error: 'Input harus berupa array JSON dan tidak boleh kosong' });
    }

    const results = [];

    for (const item of inputList) {
      const { nama, jenis_kelamin, umur_bulan, tinggi_badan, berat_badan } = item;

      if (!nama || !jenis_kelamin || umur_bulan == null || tinggi_badan == null || berat_badan == null) {
        return res.status(400).json({ error: 'Field tidak lengkap. Harap isi nama, jenis_kelamin, umur_bulan, tinggi_badan, dan berat_badan.' });
      }

      const genderNumeric = jenis_kelamin.toLowerCase() === 'laki-laki' ? 1 : 0;
      const inputArray = [tinggi_badan, berat_badan, umur_bulan, genderNumeric];
      const inputTensor = tf.tensor2d([inputArray], [1, 4]);
      const prediction = model.predict(inputTensor);
      const probabilities = prediction.dataSync();
      const predictedClass = probabilities.indexOf(Math.max(...probabilities));
      const predictedLabel = labels[predictedClass];

      // Simpan ke DB
      await pool.query(`
        INSERT INTO status_anak 
        (nama, jenis_kelamin, umur_bulan, tinggi_badan, berat_badan, predicted_class, label)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [nama, jenis_kelamin, umur_bulan, tinggi_badan, berat_badan, predictedClass, predictedLabel]);

      results.push({
        nama,
        jenis_kelamin,
        umur_bulan,
        tinggi_badan,
        berat_badan,
        predicted_class: predictedClass,
        label: predictedLabel
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


// const tf = require('@tensorflow/tfjs');
// let model = null;

// const loadModel = async () => {
//   if (!model) {
//     model = await tf.loadGraphModel('http://localhost:5000/public/ml-model/model/model.json');
//     console.log('✅ ML model loaded');
//   }
// };
// const labels = [
//   "Normal",               // class 0
//   "Stunted",              // class 1
//   "Severely Stunted"      // class 2
// ];

// const predictData = async (req, res) => {
//   try {
//     await loadModel();

//     const inputArray = req.body.input;
//     if (!Array.isArray(inputArray) || inputArray.length !== 4) {
//       return res.status(400).json({ error: 'Input harus berupa array dengan 4 angka [tinggi, berat, umur, jenis_kelamin]' });
//     }

//     const inputTensor = tf.tensor2d([inputArray], [1, 4]); // shape [1, 4]
//     const prediction = model.predict(inputTensor);
//     const probabilities = prediction.dataSync(); // Float32Array
//     const predictedClass = probabilities.indexOf(Math.max(...probabilities));
//     const predictedLabel = labels[predictedClass];

//     res.json({
//       result: Array.from(probabilities),
//       predicted_class: predictedClass,
//       label: predictedLabel
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Gagal melakukan prediksi' });
//   }
// };


// module.exports = { predictData };
