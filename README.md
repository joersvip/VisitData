# VisitData Pro - Kejaksaan RI Field Visit Management System

Sistem Manajemen Kunjungan & Pengawasan Lapangan Kejaksaan Republik Indonesia berstandar produksi.

## 📁 Struktur Platform & Direktori Proyek

Proyek ini telah distrukturisasi ke dalam folder platform masing-masing untuk kemudahan pengelolaan dan pemeliharaan:

```
VisitData/
├── 🤖 android/              # Project Native APP Android (Gradle / Android Studio)
├── 🍏 ios/                  # Project Native APP Apple iOS (Xcode Project)
├── 🌐 web/                  # Konfigurasi & Modul WEB Admin Dashboard
├── 📦 src/                  # Kode Sumber Utama (React 19 + TypeScript)
│   ├── components/
│   │   ├── admin/           # Komponen Web Admin Dashboard
│   │   ├── mobile/          # Komponen Full-Screen Android/iOS Mobile App
│   │   ├── GeotagCamera.tsx
│   │   ├── SignaturePad.tsx
│   │   └── VisitMap.tsx
│   ├── services/            # StorageService & PDF Report Generator
│   └── types/               # TypeScript Definitions
├── 📲 VisitDataPro_KejaksaanRI.apk # Built Production APK Android
└── ⚙️ capacitor.config.ts   # Konfigurasi Capacitor Multi-Platform
```

---

## 🚀 Panduan Membuka & Menjalankan

### 1. 🤖 APP Android Native (`android/`)
* **Lokasi Source Project**: `android/`
* **File APK Siap Install**: `VisitDataPro_KejaksaanRI.apk`
* **Perintah Build APK**:
  ```bash
  npx cap sync android
  cd android && ./gradlew assembleDebug
  ```

### 2. 🍏 APP Apple iOS Native (`ios/`)
* **Lokasi Source Project**: `ios/`
* **File Workspace Xcode**: `ios/App/App.xcworkspace`
* **Perintah Sync iOS**:
  ```bash
  npx cap sync ios
  npx cap open ios   # Membuka otomatis di Xcode (macOS)
  ```

### 3. 🌐 WEB Admin Dashboard (`web/`)
* **Lokasi Modul Web**: `web/`
* **URL Akses Pengetesan Browser**: `http://localhost:5173/?mode=admin`
* **Perintah Run Web Dev Server**:
  ```bash
  npm run dev
  ```
* **Perintah Build Web Production**:
  ```bash
  npm run build
  ```

---

### 🛡️ Lisensi & Hak Cipta
© 2026 Inspektorat Kejaksaan Republik Indonesia. Hak Cipta Dilindungi Undang-Undang.
