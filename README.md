# Logbook Verifikasi Pajak — Payment Request (NC)

Sistem logbook online untuk cabang mengirim berkas PDF (Payment Request) untuk verifikasi pajak, dan admin pusat melacak status + mengunggah balik berkas yang sudah diverifikasi/ditandatangani.

**Arsitektur:** HTML statis (GitHub Pages) → Google Apps Script (API) → Google Sheets (tracking) + Google Drive (penyimpanan PDF).

Tidak perlu server sendiri, tidak ada biaya hosting.

---

## Struktur Project

```
logbook-verifikasi/
├── index.html              # Form pengajuan untuk cabang
├── tracking.html            # Dashboard tracking & verifikasi untuk admin
├── assets/
│   ├── style.css
│   ├── config.js             # Tempat menaruh URL Apps Script
│   ├── app.js                 # Logic form cabang
│   └── tracking.js            # Logic dashboard admin
└── google-apps-script/
    └── Code.gs                # Backend (jalan di Google Apps Script, BUKAN di GitHub)
```

---

## Langkah Setup

Ikuti urutan ini dari atas ke bawah — semua bisa dilakukan lewat browser saja, tanpa install aplikasi apa pun.

### 1. Upload project ke GitHub

1. Buka [github.com](https://github.com) dan login (buat akun dulu jika belum punya).
2. Klik tombol **+** di pojok kanan atas → pilih **New repository**.
3. Isi **Repository name**, misalnya `logbook-verifikasi`. Pilih **Public**. Klik **Create repository**.
4. Di halaman repo yang masih kosong, cari dan klik link tulisan **uploading an existing file**.
5. Buka folder `logbook-verifikasi` hasil unduhan (`.zip`) di komputer Anda, **extract/unzip dulu** kalau belum.
6. Seret (drag & drop) **semua isi** folder tersebut ke area upload di GitHub — pastikan yang ikut ter-upload:
   - `index.html`
   - `tracking.html`
   - `README.md`
   - folder `assets` (berisi `style.css`, `config.js`, `app.js`, `tracking.js`)
   - folder `google-apps-script` (berisi `Code.gs`)
7. Scroll ke bawah, klik tombol hijau **Commit changes**.
8. Selesai — sekarang semua file project sudah ada di repo GitHub Anda dan bisa dibuka/diedit langsung lewat browser kapan saja.

### 2. Buat Google Sheet

1. Buka [sheets.google.com](https://sheets.google.com) → klik **Blank** untuk buat spreadsheet baru.
2. Beri nama, misalnya **"Tracking Verifikasi Pajak"** (klik tulisan "Untitled spreadsheet" di kiri atas untuk mengganti nama).
3. Tab/sheet boleh dibiarkan kosong — nanti otomatis dibuatkan tab bernama `Tracking` dengan header saat pertama kali diakses dari form.

### 3. Pasang Kode Backend (Apps Script)

1. Di spreadsheet tadi, klik menu **Extensions** (Ekstensi) di bagian atas → pilih **Apps Script**. Tab baru akan terbuka berisi editor kode.
2. Di editor tersebut sudah ada file `Code.gs` dengan sedikit kode contoh (`function myFunction() {...}`) — **blok semua teks itu lalu hapus** (klik di dalam kotak kode, tekan Ctrl+A / Cmd+A, lalu Delete).
3. Sekarang buka isi kode aslinya: di repo GitHub Anda (langkah 1), klik folder `google-apps-script` → klik file `Code.gs`. Isinya akan tampil sebagai teks di browser.
4. Klik ikon **copy** (biasanya di pojok kanan atas area kode) untuk menyalin semua isinya. Kalau tidak ada ikon copy, blok manual dari baris pertama sampai baris terakhir lalu Ctrl+C / Cmd+C.
5. Kembali ke tab editor Apps Script, klik di kotak kode yang sudah kosong, lalu paste (Ctrl+V / Cmd+V).
6. Klik ikon **disket/Save** di bagian atas editor (atau Ctrl+S / Cmd+S).

### 4. Deploy sebagai Web App

1. Masih di editor Apps Script, klik tombol biru **Deploy** di kanan atas → pilih **New deployment**.
2. Klik ikon gerigi ⚙️ di sebelah tulisan "Select type" → pilih **Web app**.
3. Isi bagian bawahnya:
   - **Execute as:** pilih `Me (email Anda)`
   - **Who has access:** pilih `Anyone`
4. Klik tombol **Deploy**.
5. Akan muncul jendela minta izin — klik **Authorize access**, pilih akun Google Anda, klik **Advanced**/**Lanjutan** jika ada peringatan, lalu klik **Go to (nama project) (unsafe)** dan **Allow**/**Izinkan**. (Ini normal, karena project belum diverifikasi Google — aman karena ini kode milik Anda sendiri.)
6. Setelah berhasil, akan muncul kotak **Web app URL** — klik ikon copy di sampingnya, atau blok manual dan salin. Bentuknya seperti:
   `https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxxxxxxx/exec`
7. Simpan URL ini sementara (paste ke Notes/catatan), akan dipakai di langkah berikutnya.

> ⚠️ Kalau nanti Anda mengedit ulang isi `Code.gs`, perubahan **tidak otomatis aktif**. Anda harus klik **Deploy → Manage deployments** → klik ikon pensil ✏️ → di bagian "Version" pilih **New version** → klik **Deploy** lagi.

### 5. Masukkan URL Web App ke config.js

1. Kembali ke repo GitHub Anda → buka folder `assets` → klik file `config.js`.
2. Klik ikon pensil ✏️ (**Edit this file**) di pojok kanan atas halaman file tersebut.
3. Akan terlihat baris seperti ini:
   ```js
   const API_URL = "PASTE_URL_WEB_APP_ANDA_DI_SINI";
   ```
4. Hapus tulisan `PASTE_URL_WEB_APP_ANDA_DI_SINI` (jangan hapus tanda kutip `"`), lalu paste URL Web App yang Anda salin di langkah 4. Hasilnya jadi seperti:
   ```js
   const API_URL = "https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxxxxxxx/exec";
   ```
5. Scroll ke bawah, klik tombol hijau **Commit changes**.

### 6. Aktifkan GitHub Pages

1. Di halaman utama repo GitHub Anda, klik tab **Settings** (paling kanan menu atas repo).
2. Di menu sebelah kiri, klik **Pages**.
3. Di bagian **Branch**, klik dropdown yang tadinya "None", pilih **main**, biarkan folder di sebelahnya `/ (root)`, lalu klik **Save**.
4. Tunggu 1–2 menit, refresh halaman — akan muncul link seperti:
   `https://USERNAME.github.io/logbook-verifikasi/`

### 7. Selesai — Bagikan Link

- **Cabang** mengakses: `https://USERNAME.github.io/logbook-verifikasi/index.html`
- **Admin/tim pajak** mengakses: `https://USERNAME.github.io/logbook-verifikasi/tracking.html`
- **Data mentah** selalu bisa dicek langsung di tab `Tracking` pada Google Sheet Anda.

(Ganti `USERNAME` dan `logbook-verifikasi` sesuai username GitHub dan nama repo Anda sendiri.)

---

## Alur Kerja

1. **Cabang** buka `index.html`, isi kode cabang, PIC, nomor NC, lalu unggah PDF Payment Request → otomatis tersimpan ke folder Drive `Berkas Masuk - Payment Request` dan tercatat sebagai baris baru berstatus **Menunggu Verifikasi**.
2. **Admin** buka `tracking.html`, melihat semua pengajuan dengan status real-time, bisa mencari/filter.
3. Admin klik **Verifikasi** pada baris terkait → unggah PDF hasil tanda tangan/verifikasi (opsional jika ditolak), pilih status **Terverifikasi** / **Ditolak**, isi nama admin & catatan → tersimpan ke folder Drive `Berkas Terverifikasi - Payment Request` dan status baris otomatis berubah.

## Kolom di Google Sheets

| Kolom | Keterangan |
|---|---|
| ID | ID unik otomatis (format `PR-<timestamp>`) |
| Timestamp Kirim | Waktu cabang mengirim berkas |
| Cabang | Kode 3 huruf cabang |
| Nama PIC / No Telpon | Pengaju dari cabang |
| No Payment Request / Link Payment Request | Nomor & link NC |
| File Berkas | Link Google Drive berkas asli dari cabang |
| Status | Menunggu Verifikasi / Terverifikasi / Ditolak |
| File Hasil Verifikasi | Link Google Drive berkas hasil verifikasi admin |
| Tanggal Verifikasi / Admin Verifikator / Catatan Admin | Diisi saat admin memverifikasi |

## Catatan Keamanan

- Web App di-deploy dengan akses "Anyone" agar bisa dipanggil dari GitHub Pages tanpa login Google — siapa pun yang tahu link `index.html`/`tracking.html` bisa mengirim/memverifikasi data. Jika perlu dibatasi hanya karyawan, pertimbangkan menambahkan proteksi tambahan (misalnya PIN sederhana, atau ganti akses jadi "Anyone within [domain Google Workspace]" jika perusahaan Anda pakai Google Workspace).
- File PDF di Drive di-set share "Anyone with link – view", supaya link bisa dibuka dari tabel tracking.

## Pengembangan Lanjutan (Opsional)

- Tambah kolom **deadline** & pengingat otomatis via `Utilities` + trigger waktu di Apps Script.
- Kirim notifikasi ke cabang via email (`MailApp.sendEmail`) saat status berubah.
- Tambah login sederhana untuk halaman `tracking.html` sebelum publish resmi ke seluruh cabang.
