Dokumentasi Rest API Back End Stunting

https://backend-stunting.onrender.com/api/doc


atau ini

📘 Dokumentasi API - Monitoring Stunting
Base URL: http://localhost:5000

🔐 1. Autentikasi
1. POST /auth/register
Deskripsi: Mendaftarkan user/admin baru.

Request Body:
{
  "username": "admin2",
  "password": "rahasia123"
}
Response Sukses:
{
  "error": false,
  "message": "User Created"
}
Response Gagal:
{
  "error": true,
  "message": "Username already exists"
}
2. POST /auth/login
Deskripsi: Login dan mendapatkan token JWT.

Request Body:
{
  "username": "admin2",
  "password": "rahasia123"
}
Response Sukses:
{
  "error": false,
  "message": "success",
  "loginResult": {
    "userId": 2,
    "username": "admin2",
    "token": "JWT_TOKEN_HERE"
  }
}
Response Gagal (password salah):
{
  "error": true,
  "message": "Invalid password"
}
Response Gagal (user tidak ditemukan):
{
  "error": true,
  "message": "User not found"
}
3. GET /auth/profile
Deskripsi: Mengambil profil pengguna yang sedang login.

Header:

Authorization: Bearer <JWT_TOKEN_HERE>
Response Sukses:
{
  "message": "✅ Profil berhasil diambil",
  "data": {
    "id": 2,
    "username": "admin2"
  }
}
Response Gagal:
{
  "message": "Token tidak valid atau expired"
}
4. POST /auth/logout
Deskripsi: Logout dari sistem. (opsional - hanya menghapus token di sisi client)

Response:
{
  "message": "✅ Logout berhasil (hapus token di client)"
}
📦 2. Anak (status_anak)
Headers Authorization: Bearer

1. POST /ml/predict
Deskripsi: Memprediksi status stunting anak dan menyimpan ke database.

Request Body:
      
[
  {
    "nama": "Anak00441",
    "jenis_kelamin": "Laki-laki",
    "umur_bulan": 20,
    "tinggi_badan": 77.7,
    "berat_badan": 8.5
  }
]


Response:
{
  "message": "Data berhasil diprediksi & disimpan",
  "data": {
    "nama": "Anak001",
    "jenis_kelamin": "Laki-laki",
    "umur_bulan": 20,
    "tinggi_badan": 77.7,
    "berat_badan": 8.5,
    "predicted_class": 0,
    "label": "Normal"
  }
}
2. GET /api/status-anak
Deskripsi: Mengambil semua data hasil prediksi anak.

Response:
{
  "message": "Data status anak berhasil diambil",
  "data": [
    {
      "id": 1,
      "nama": "Anak001",
      "jenis_kelamin": "Laki-laki",
      "umur_bulan": 20,
      "tinggi_badan": 77.7,
      "berat_badan": 8.5,
      "predicted_class": 0,
      "label": "Normal",
      "created_at": "2025-05-15T08:20:11.511Z"
    }
  ]
}
3. GET /api/status-anak/:id
Deskripsi: Mengambil satu data anak berdasarkan ID.

Contoh:
GET /api/status-anak/1

Response:
{
  "message": "Data anak berhasil ditemukan",
  "data": {
    "id": 1,
    "nama": "Anak001",
    "jenis_kelamin": "Laki-laki",
    "umur_bulan": 20,
    "tinggi_badan": 77.7,
    "berat_badan": 8.5,
    "predicted_class": 0,
    "label": "Normal",
    "created_at": "2025-05-15T08:20:11.511Z"
  }
}
4. DELETE /api/status-anak/:id
Deskripsi: Menghapus data anak berdasarkan ID.

Contoh:
DELETE /api/status-anak/1

Response (berhasil):
{
  "message": "✅ Data anak berhasil dihapus"
}
Response (gagal):
{
  "message": "❌ Data anak tidak ditemukan"
}
📋 3. Riwayat Pemeriksaan
7. POST /api/riwayat
Deskripsi: Menambahkan riwayat pemeriksaan anak.

Request Body:
{
  "anak_id": 1,
  "tanggal_pemeriksaan": "2025-05-15",
  "tinggi_badan": 78.5,
  "berat_badan": 9.2,
  "umur_bulan": 21,
  "status": "Normal"
}
Response (sukses):
{
  "message": "✅ Riwayat pemeriksaan berhasil ditambahkan",
  "data": {
    "id": 1,
    "anak_id": 1,
    "tanggal_pemeriksaan": "2025-05-15",
    "tinggi_badan": 78.5,
    "berat_badan": 9.2,
    "umur_bulan": 21,
    "status": "Normal"
  }
}
8. GET /api/riwayat/:anak_id
Deskripsi: Mengambil semua riwayat pemeriksaan milik anak tertentu.

Contoh:
GET /api/riwayat/1

Response:
{
  "message": "✅ Riwayat pemeriksaan berhasil diambil",
  "data": [
    {
      "id": 1,
      "anak_id": 1,
      "tanggal_pemeriksaan": "2025-05-15",
      "tinggi_badan": 78.5,
      "berat_badan": 9.2,
      "umur_bulan": 21,
      "status": "Normal"
    }
  ]
}
9. DELETE /api/riwayat/:id
Deskripsi: Menghapus satu riwayat pemeriksaan berdasarkan ID.

Contoh:
DELETE /api/riwayat/1

Response (sukses):
{
  "message": "✅ Riwayat berhasil dihapus"
}
Response (gagal):
{
  "message": "❌ Riwayat tidak ditemukan"
}
📊 4. Statistik & Dashboard
1. GET /api/statistik
Deskripsi: Mengambil jumlah anak berdasarkan status stunting (Normal, Stunted, Severely Stunted) per tahun dari tabel status_anak.

Contoh URL:
GET /api/statistik

Headers Authorization: Bearer

Response Sukses:
{
  "message": "✅ Statistik berhasil diambil",
  "data": {
    "2025": {
      "Normal": 33,
      "Stunted": 0,
      "Severely Stunted": 0
    },
    "2024": {
      "Normal": 12,
      "Stunted": 2,
      "Severely Stunted": 1
    }
  }
}
Response Gagal:
{
  "message": "❌ Gagal mengambil statistik"
}
🏥 5. Profil Posyandu
1. POST /api/profile
2. GET /api/profile
3. PUT /api/profile
Deskripsi: Menyimpan data profil posyandu milik user yang login. Hanya bisa disimpan satu kali per user. Jika sudah ada, gunakan PUT untuk mengubah.

Header:

Authorization: Bearer <JWT_TOKEN_HERE>
Request Body:
{
  "nama_posyandu": "Posyandu Melati",
  "alamat": "Jl. Merdeka No. 45, Banyuwangi"
}
Response Sukses (201):
{
  "message": "✅ Profil berhasil dibuat"
}
Response Gagal (sudah ada profil):
{
  "message": "Profil sudah ada, gunakan PUT untuk update"
}
Response Gagal (token tidak valid):
{
  "message": "Invalid token"
}
