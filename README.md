# Otomatisasi Data BD

Aplikasi web untuk mengekstrak data dari dokumen PDF **Bukti Distribusi Barang (BD)** ke format Excel secara otomatis — **100% client-side, tanpa server**.

![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-Ready-222?logo=github&logoColor=white)

## Demo

Deploy ke GitHub Pages dan buka langsung di browser. Tidak perlu instalasi server.

## Fitur

- Upload satu atau banyak file PDF sekaligus (drag & drop)
- Ekstraksi data otomatis menggunakan PDF.js + regex pattern matching
- Preview hasil dalam tabel interaktif
- Download hasil ke format Excel (.xlsx)
- **Tidak memerlukan server atau API key** — semua berjalan di browser

## Data yang Diekstrak

| Kolom Excel | Field | Contoh |
|-------------|-------|--------|
| B | Unit Kerja | Ka Instal Rikkes RSPAD GS Puskesad |
| C | Nomor Nota Dinas | B/ND-83/XII/2025 |
| D | Tanggal Nota Dinas | 24 Desember 2025 |
| E | Informasi BD | Pembersih TW I TA 2026 |
| F | Tanggal Pembuatan BD | 05 February 2026 |

## Cara Pakai

### Opsi 1: GitHub Pages

1. Push repository ini ke GitHub
2. Pergi ke **Settings → Pages → Source: Deploy from a branch → Branch: main → / (root)**
3. Tunggu beberapa menit, lalu buka URL Pages yang diberikan

### Opsi 2: Buka Langsung

```bash
# Clone repository
git clone https://github.com/USERNAME/otomatisasi-data-bd.git
cd otomatisasi-data-bd

# Buka langsung di browser (perlu web server sederhana untuk PDF.js)
python3 -m http.server 8000
# Buka http://localhost:8000
```

## Struktur Proyek

```
├── index.html           # Halaman utama
├── style.css            # Custom CSS
├── script.js            # Logika ekstraksi PDF + UI
├── .gitignore           # File yang diabaikan Git
└── README.md            # Dokumentasi
```

## Cara Penggunaan

1. **Unggah PDF** — Drag & drop atau klik untuk memilih file PDF Bukti Distribusi
2. **Proses** — Klik tombol "Proses Ekstraksi" untuk mengekstrak data
3. **Unduh Excel** — Periksa hasil di tabel, lalu klik "Unduh .XLSX"

## Tech Stack

- **PDF Parsing**: [PDF.js](https://mozilla.github.io/pdf.js/) (Mozilla)
- **Data Extraction**: Regex pattern matching (JavaScript)
- **UI**: HTML, [Tailwind CSS](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/)
- **Excel Export**: [SheetJS](https://sheetjs.com/)

## Lisensi

MIT License
