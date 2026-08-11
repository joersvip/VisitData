# VisitData Pro - Web Admin Dashboard (Kejaksaan RI)

Repositori dan struktur khusus untuk modul **Web Admin Dashboard** Sistem Pengawasan & Inspeksi Kunjungan Lapangan Kejaksaan RI.

## 🏢 Fitur Web Admin Dashboard
- **Monitoring Real-Time**: Pemantauan statistik jadwal kunjungan, inspeksi selesai, dan log aktivitas petugas.
- **Penjadwalan Kunjungan**: Pembuatan rencana kunjungan lapangan baru beserta alokasi tim petugas dan target hasil.
- **Database Lokasi Dikunjungi**: Pelacakan riwayat lokasi publik/instansi yang pernah diinspeksi.
- **Peta Interaktif (Leaflet GIS)**: Pemetaan titik lokasi inspeksi berbasis koordinat GPS.
- **Laporan Resmi PDF & Excel**: Generasi otomatis dokumen laporan hasil inspeksi berformat resmi Kejaksaan RI.

## 🚀 Menjalankan Web Admin Dashboard
```bash
# Jalankan Dev Server
npm run dev

# Buka Langsung Mode Web Admin di Browser
http://localhost:5173/?mode=admin
```

## 📦 Build Produksi Web Admin
```bash
npm run build
```
File hasil build akan berada di direktori `dist/` siap untuk di-deploy ke Web Server / Nginx / Cloud.
