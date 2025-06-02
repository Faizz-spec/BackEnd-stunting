import tensorflow as tf
import numpy as np

# Path model .h5 (pastikan kamu sudah konversi dari .json JS ke .h5)
MODEL_PATH = "public/ml-model/model_stunting.h5"

# Label Map sesuai indeks
label_map = {
    1: "Normal",
    2: "Stunting",
    0: "Berpotensi Stunting"
}

# Input data
input_list = [
    {
        "nama": "Kenzo Alvaro Yulian",
        "jenis_kelamin": "Laki-laki",
        "umur_bulan": 17,
        "tinggi_badan": 80,
        "berat_badan": 8.9
    }
]

# Aktifkan preprocessing
preprocessing = True
mean = [75, 8, 16, 0.5]
std = [5, 1, 4, 0.5]

def standardize(val, mean, std):
    return (val - mean) / std

def main():
    try:
        model = tf.keras.models.load_model(MODEL_PATH)
        print("============================\n✅ Model loaded")

        for item in input_list:
            nama = item["nama"]
            jenis_kelamin = item["jenis_kelamin"]
            umur_bulan = item["umur_bulan"]
            tinggi_badan = item["tinggi_badan"]
            berat_badan = item["berat_badan"]

            gender_numeric = 1 if jenis_kelamin.lower() == "laki-laki" else 0
            input_array = [tinggi_badan, berat_badan, umur_bulan, gender_numeric]

            if preprocessing:
                input_array = [standardize(val, mean[i], std[i]) for i, val in enumerate(input_array)]

            input_tensor = np.array([input_array], dtype=np.float32)
            prediction = model.predict(input_tensor)
            probabilities = prediction[0]
            predicted_class = int(np.argmax(probabilities))
            predicted_label = label_map[predicted_class]

            print("\n🔎 Input:", item)
            print("🧠 Input Array (standardized):", input_array)
            print("📊 Probabilities:", probabilities)
            print(f"✅ Predicted Class Index: {predicted_class}")
            print("✅ Predicted Label:", predicted_label)

    except Exception as e:
        print("❌ Gagal memuat model atau prediksi:", e)

if __name__ == "__main__":
    main()
