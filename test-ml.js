






const tf = require('@tensorflow/tfjs');

const MODEL_URL = 'http://localhost:5000/public/ml-model/model/model.json';

// ✅ Mapping jenis kelamin ke nilai numerik
const GENDER_MAP = {
  'laki-laki': 0,
  'perempuan': 1
};

// ✅ Mapping label output
const LABEL_MAP = {
  0: 'Berpotensi Stunting',
  1: 'Normal',
  2: 'Stunting'
};

// 🔍 Data input (bisa banyak)
const inputList = [
  {
  nama: "Kenzo Alvaro Yulian",
  jenis_kelamin: "laki-laki",
  umur_bulan: 17,
  tinggi_badan: 80,
  berat_badan: 8.9
  }
];



// ✅ Konfigurasi preprocessing (mean & std sesuai urutan fitur input model)
const preprocessing = true;
const mean = [0.5, 16, 75, 8]; // [gender, umur, tinggi, berat]
const std = [0.5, 4, 5, 1];

function standardize(val, mean, std) {
  return (val - mean) / std;
}

async function main() {
  try {
    const model = await tf.loadGraphModel(MODEL_URL);
    console.log('============================\n✅ Model loaded');

    for (const item of inputList) {
      const {
        nama,
        jenis_kelamin,
        umur_bulan,
        tinggi_badan,
        berat_badan
      } = item;

      const genderLower = jenis_kelamin.toLowerCase();
      const genderNumeric = GENDER_MAP[genderLower] ?? 0; // fallback ke 0

      // ✅ Urutan input harus [gender, umur, tinggi, berat]
      let inputArray = [genderNumeric, umur_bulan, tinggi_badan, berat_badan];

      if (preprocessing) {
        inputArray = inputArray.map((val, i) => standardize(val, mean[i], std[i]));
      }

      const inputTensor = tf.tensor2d([inputArray], [1, 4]);
      const prediction = model.predict(inputTensor);
      const probabilities = await prediction.data();
      const predictedClass = probabilities.indexOf(Math.max(...probabilities));
      const predictedLabel = LABEL_MAP[predictedClass];

      console.log('\n🔎 Input:', item);
      console.log('🧠 Input Array (standardized):', inputArray);
      console.log('📊 Probabilities:', probabilities);
      console.log(`✅ Predicted Class Index: ${predictedClass}`);
      console.log('✅ Predicted Label:', predictedLabel);
    }
  } catch (err) {
    console.error('❌ Gagal memuat model atau prediksi:', err);
  }
}

main();
