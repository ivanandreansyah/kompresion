# Kompresion

Aplikasi web untuk kompresi dan konversi file. Mendukung kompresi gambar (JPG, PNG, WEBP), PDF, DOCX, dan ZIP, serta konversi file ke PDF.

## ✨ Fitur

- **Kompresi Gambar**: Perkecil ukuran file JPG, PNG, dan WEBP dengan kualitas yang bisa diatur.
- **Kompresi PDF**: Menggunakan Ghostscript untuk memperkecil ukuran file PDF secara signifikan.
- **Kompresi Arsip**: Kompresi file `.docx` dan `.zip` dengan cara mengoptimalkan gambar di dalamnya.
- **Konversi ke PDF**: Konversi gambar dan file teks (.txt) menjadi dokumen PDF.
- **Antarmuka Modern**: UI yang bersih dan mudah digunakan dengan fitur drag-and-drop.

## 💻 Teknologi

- **Backend**:
  - [Node.js](https://nodejs.org/)
  - [Express](https://expressjs.com/)
  - [Multer](https://github.com/expressjs/multer) untuk upload file.
  - [Sharp](https://sharp.pixelplumbing.com/) untuk pemrosesan gambar super cepat.
  - [Adm-Zip](https://github.com/cthackers/adm-zip) untuk menangani file ZIP dan DOCX.
  - [Ghostscript](https://www.ghostscript.com/) (opsional, untuk kompresi PDF).

- **Frontend**:
  - HTML, CSS, JavaScript (Vanilla).
  - [jsPDF](https://github.com/parallax/jsPDF) untuk pembuatan PDF di sisi klien.

## 🚀 Instalasi & Menjalankan

1.  **Clone repositori ini:**
    ```sh
    git clone <URL_REPOSITORI_ANDA>
    cd kompresion
    ```

2.  **Install dependensi backend:**
    ```sh
    cd backend
    npm install
    ```

3.  **(Opsional) Install Ghostscript:**
    - Untuk kompresi PDF, pastikan [Ghostscript](https://www.ghostscript.com/download.html) sudah terinstal dan bisa diakses dari terminal (`gs` command).

4.  **Jalankan Backend Server:**
    - Buka terminal di folder `backend`, lalu jalankan:
    ```sh
    node server.js
    ```
    - Server akan berjalan di `http://localhost:5000`.

5.  **Jalankan Frontend:**
    - Buka terminal baru di folder root (`kompresion`), lalu jalankan:
    ```sh
    npx serve frontend/public
    ```
    - Server frontend akan berjalan di `http://localhost:3000` (atau port lain jika 3000 sudah dipakai).

6.  **Buka Aplikasi:**
    - Buka browser dan akses alamat yang diberikan oleh `serve` (contoh: `http://localhost:3000`).

---

