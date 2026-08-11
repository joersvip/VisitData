import type { Petugas, RencanaKunjungan, Kunjungan, HistoriLog, SyncQueueItem, LokasiDikunjungi } from '../types';
import jsPDF from 'jspdf';

const STORAGE_KEYS = {
  PETUGAS: 'visitdata_petugas_v1',
  RENCANA: 'visitdata_rencana_v1',
  KUNJUNGAN: 'visitdata_kunjungan_v1',
  LOGS: 'visitdata_logs_v1',
  SYNC_QUEUE: 'visitdata_sync_queue_v1',
  ONLINE_STATUS: 'visitdata_online_status_v1',
};

const SEED_PETUGAS: Petugas[] = [
  {
    id: 'p-1',
    nama: 'Ahmad Hidayat',
    nip: '19880412 201201 1 001',
    jabatan: 'Koordinator Lapangan',
    unit: 'Inspeksi & Pengawasan',
    telepon: '0812-3456-7890',
    email: 'ahmad.hidayat@visitdata.id',
    fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    active: true,
    totalKunjungan: 37,
  },
  {
    id: 'p-2',
    nama: 'Budi Santoso',
    nip: '19910815 201503 1 002',
    jabatan: 'Inspector Kunjungan',
    unit: 'Inspeksi & Pengawasan',
    telepon: '0813-9876-5432',
    email: 'budi.santoso@visitdata.id',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    active: true,
    totalKunjungan: 29,
  },
  {
    id: 'p-3',
    nama: 'Candra Wijaya',
    nip: '19940220 201802 1 003',
    jabatan: 'Field Specialist',
    unit: 'Pengujian Teknis',
    telepon: '0857-1122-3344',
    email: 'candra.wijaya@visitdata.id',
    fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    active: true,
    totalKunjungan: 18,
  },
  {
    id: 'p-4',
    nama: 'Dedi Kurniawan',
    nip: '19961105 202001 1 004',
    jabatan: 'Field Surveyor',
    unit: 'Pemetaan & Survey',
    telepon: '0819-5566-7788',
    email: 'dedi.kurniawan@visitdata.id',
    fotoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200',
    active: true,
    totalKunjungan: 24,
  },
];

const SEED_RENCANA: RencanaKunjungan[] = [
  {
    id: 'r-1',
    nomorRencana: 'RC-2026-0801',
    tanggal: '2026-08-11',
    jamMulai: '09:00',
    jamSelesai: '12:00',
    lokasiNama: 'Kantor Pusat PT Solusi Utama',
    alamat: 'Jl. Sudirman No. 45, Jakarta Selatan',
    latitude: -6.2088,
    longitude: 106.8456,
    agenda: 'Monitoring & Verifikasi Fasilitas Lapangan',
    targetHasil: 'Tersusun laporan audit kelayakan dan foto geotag',
    petugasIds: ['p-1', 'p-2'],
    status: 'PROSES',
    reminderEnabled: true,
    isRecurring: false,
  },
  {
    id: 'r-2',
    nomorRencana: 'RC-2026-0802',
    tanggal: '2026-08-11',
    jamMulai: '13:30',
    jamSelesai: '16:00',
    lokasiNama: 'Substation Industri Jaya',
    alamat: 'Kawasan Industri Daan Mogot Km. 12, Tangerang',
    latitude: -6.1783,
    longitude: 106.6319,
    agenda: 'Inspeksi Rutin Perangkat Listrik & Panel Kontrol',
    targetHasil: 'Pemeriksaan status fisik & kesiapan cadangan daya',
    petugasIds: ['p-1', 'p-3', 'p-4'],
    status: 'DIJADWALKAN',
    reminderEnabled: true,
    isRecurring: true,
  },
  {
    id: 'r-3',
    nomorRencana: 'RC-2026-0803',
    tanggal: '2026-08-12',
    jamMulai: '10:00',
    jamSelesai: '14:00',
    lokasiNama: 'Depo Logistik Wilayah III',
    alamat: 'Jl. Ahmad Yani No. 88, Bekasi Timur',
    latitude: -6.2383,
    longitude: 106.9756,
    agenda: 'Survey Ketersediaan Material & Peralatan Lapangan',
    targetHasil: 'Berita acara pemeriksaan fisik gudang',
    petugasIds: ['p-2', 'p-4'],
    status: 'DIJADWALKAN',
    reminderEnabled: false,
    isRecurring: false,
  },
];

const SEED_KUNJUNGAN: Kunjungan[] = [
  {
    id: 'k-101',
    rencanaId: 'r-1',
    nomorKunjungan: 'KJ-2026-00124',
    tanggal: '2026-08-10',
    checkInTime: '08:55',
    checkOutTime: '11:40',
    checkInLat: -6.2088,
    checkInLng: 106.8456,
    checkOutLat: -6.2088,
    checkOutLng: 106.8456,
    kondisiLokasi: 'Baik',
    temuan: 'Peralatan beroperasi dalam batas aman. Ditemukan 1 indikator baterai UPS memerlukan kalibrasi ulang.',
    rekomendasi: 'Jadwalkan kalibrasi UPS unit B dalam waktu 7 hari kerja.',
    prioritas: 'SEDANG',
    fotos: [
      {
        id: 'f-1',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
        timestamp: '2026-08-10 09:15:22',
        latitude: -6.2088,
        longitude: 106.8456,
        alamat: 'Jl. Sudirman No. 45, Jakarta Selatan',
        keterangan: 'Pemeriksaan panel utama gedung A',
      },
    ],
    tandaTangan: {
      namaPihak: 'Ir. Hendra Gunawan',
      jabatanPihak: 'Manager Facility PT Solusi Utama',
      signatureDataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="80"><path d="M 10 40 Q 50 10 100 40 T 190 40" stroke="navy" stroke-width="3" fill="none"/></svg>',
      timestamp: '2026-08-10 11:35:00',
    },
    status: 'SELESAI',
    synced: true,
    createdAt: '2026-08-10 08:55:00',
  },
];

const SEED_LOGS: HistoriLog[] = [
  {
    id: 'l-1',
    timestamp: '2026-08-10 08:55:00',
    tipe: 'CHECKIN',
    userNama: 'Ahmad Hidayat',
    lokasiNama: 'Kantor Pusat PT Solusi Utama',
    deskripsi: 'Petugas melakukan Check-In GPS di koordinat (-6.2088, 106.8456)',
  },
  {
    id: 'l-2',
    timestamp: '2026-08-10 09:15:22',
    tipe: 'FOTO',
    userNama: 'Ahmad Hidayat',
    lokasiNama: 'Kantor Pusat PT Solusi Utama',
    deskripsi: 'Mengambil dokumentasi foto geotag lokasi gedung A',
  },
  {
    id: 'l-3',
    timestamp: '2026-08-10 11:35:00',
    tipe: 'FORM',
    userNama: 'Ahmad Hidayat',
    lokasiNama: 'Kantor Pusat PT Solusi Utama',
    deskripsi: 'Pengisian formulir temuan & persetujuan tanda tangan digital Ir. Hendra Gunawan',
  },
  {
    id: 'l-4',
    timestamp: '2026-08-10 11:40:00',
    tipe: 'CHECKOUT',
    userNama: 'Ahmad Hidayat',
    lokasiNama: 'Kantor Pusat PT Solusi Utama',
    deskripsi: 'Check-Out kegiatan kunjungan (Durasi: 2 Jam 45 Menit)',
  },
];

export class StorageService {
  public static initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.PETUGAS)) {
      localStorage.setItem(STORAGE_KEYS.PETUGAS, JSON.stringify(SEED_PETUGAS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.RENCANA)) {
      localStorage.setItem(STORAGE_KEYS.RENCANA, JSON.stringify(SEED_RENCANA));
    }
    if (!localStorage.getItem(STORAGE_KEYS.KUNJUNGAN)) {
      localStorage.setItem(STORAGE_KEYS.KUNJUNGAN, JSON.stringify(SEED_KUNJUNGAN));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LOGS)) {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(SEED_LOGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE)) {
      localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify([]));
    }
  }

  // --- PETUGAS ---
  public static getPetugas(): Petugas[] {
    this.initStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PETUGAS) || '[]');
  }

  public static addPetugas(newPetugas: Omit<Petugas, 'id' | 'totalKunjungan'>): Petugas {
    const list = this.getPetugas();
    const created: Petugas = {
      ...newPetugas,
      id: 'p-' + Date.now(),
      totalKunjungan: 0,
    };
    list.push(created);
    localStorage.setItem(STORAGE_KEYS.PETUGAS, JSON.stringify(list));
    return created;
  }

  // --- RENCANA KUNJUNGAN ---
  public static getRencana(): RencanaKunjungan[] {
    this.initStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.RENCANA) || '[]');
  }

  public static addRencana(newRencana: Omit<RencanaKunjungan, 'id' | 'nomorRencana' | 'status'>): RencanaKunjungan {
    const list = this.getRencana();
    const count = list.length + 1;
    const created: RencanaKunjungan = {
      ...newRencana,
      id: 'r-' + Date.now(),
      nomorRencana: `RC-2026-${String(count).padStart(4, '0')}`,
      status: 'DIJADWALKAN',
    };
    list.unshift(created);
    localStorage.setItem(STORAGE_KEYS.RENCANA, JSON.stringify(list));

    this.addLog({
      tipe: 'RENCANA',
      userNama: 'Admin System',
      lokasiNama: created.lokasiNama,
      deskripsi: `Membuat rencana kunjungan baru #${created.nomorRencana} untuk tanggal ${created.tanggal}`,
    });

    return created;
  }

  public static updateRencanaStatus(id: string, status: RencanaKunjungan['status']) {
    const list = this.getRencana();
    const idx = list.findIndex((r) => r.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      localStorage.setItem(STORAGE_KEYS.RENCANA, JSON.stringify(list));
    }
  }

  // --- KUNJUNGAN (FIELD EXECUTIONS) ---
  public static getKunjungan(): Kunjungan[] {
    this.initStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.KUNJUNGAN) || '[]');
  }

  public static saveKunjungan(kunjungan: Kunjungan) {
    const list = this.getKunjungan();
    const idx = list.findIndex((k) => k.id === kunjungan.id);
    if (idx !== -1) {
      list[idx] = kunjungan;
    } else {
      list.unshift(kunjungan);
    }
    localStorage.setItem(STORAGE_KEYS.KUNJUNGAN, JSON.stringify(list));

    // Update parent plan status if completed
    if (kunjungan.status === 'SELESAI' && kunjungan.rencanaId) {
      this.updateRencanaStatus(kunjungan.rencanaId, 'SELESAI');
    }
  }

  public static getDatabaseLokasiDikunjungi(): LokasiDikunjungi[] {
    const kunjungans = this.getKunjungan();
    const rencanas = this.getRencana();

    const map = new Map<string, LokasiDikunjungi>();

    kunjungans.forEach((k) => {
      const r = rencanas.find((ren) => ren.id === k.rencanaId);
      const key = (r?.lokasiNama || 'Lokasi Kunjungan').trim();
      const existing = map.get(key);

      if (existing) {
        existing.totalVisits += 1;
        existing.kunjunganList.push(k);
        if (k.tanggal > existing.lastVisitDate) {
          existing.lastVisitDate = k.tanggal;
          existing.lastKondisi = k.kondisiLokasi;
        }
      } else {
        map.set(key, {
          lokasiNama: key,
          alamat: r?.alamat || 'Jl. Lokasi Kunjungan Lapangan',
          latitude: r?.latitude || -6.2088,
          longitude: r?.longitude || 106.8456,
          totalVisits: 1,
          lastVisitDate: k.tanggal,
          lastKondisi: k.kondisiLokasi || 'Baik',
          kunjunganList: [k],
        });
      }
    });

    return Array.from(map.values());
  }

  // --- LOGS & AUDIT ---
  public static getLogs(): HistoriLog[] {
    this.initStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || '[]');
  }

  public static addLog(log: Omit<HistoriLog, 'id' | 'timestamp'>) {
    const list = this.getLogs();
    const now = new Date();
    const timestampStr = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0') + ' ' +
      String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0') + ':' +
      String(now.getSeconds()).padStart(2, '0');

    const newLog: HistoriLog = {
      ...log,
      id: 'l-' + Date.now(),
      timestamp: timestampStr,
    };
    list.unshift(newLog);
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(list));
  }

  // --- SYNC ENGINE ---
  public static getSyncQueue(): SyncQueueItem[] {
    this.initStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE) || '[]');
  }

  public static addToSyncQueue(item: Omit<SyncQueueItem, 'id' | 'timestamp'>) {
    const queue = this.getSyncQueue();
    const newItem: SyncQueueItem = {
      ...item,
      id: 'sq-' + Date.now(),
      timestamp: new Date().toISOString(),
    };
    queue.push(newItem);
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
  }

  public static processSync(): number {
    const queue = this.getSyncQueue();
    const count = queue.length;
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify([]));

    // Mark all pending visits as synced
    const list = this.getKunjungan();
    const updated = list.map((k) => ({ ...k, synced: true }));
    localStorage.setItem(STORAGE_KEYS.KUNJUNGAN, JSON.stringify(updated));

    if (count > 0) {
      this.addLog({
        tipe: 'SYNC',
        userNama: 'Auto-Sync Service',
        lokasiNama: 'Server Cloud',
        deskripsi: `Berhasil mensinkronisasi ${count} item antrean offline ke server utama.`,
      });
    }

    return count;
  }

  // --- EXPORTS & REPORTS ---
  public static exportToCSV(): string {
    const kunjungans = this.getKunjungan();
    const rencanas = this.getRencana();

    const headers = [
      'Nomor Kunjungan',
      'Nomor Rencana',
      'Tanggal',
      'Lokasi',
      'Alamat',
      'Check-In',
      'Check-Out',
      'Kondisi Lokasi',
      'Prioritas',
      'Temuan',
      'Rekomendasi',
      'Jumlah Foto',
      'Status Tanda Tangan',
    ];

    const rows = kunjungans.map((k) => {
      const r = rencanas.find((ren) => ren.id === k.rencanaId);
      return [
        `"${k.nomorKunjungan}"`,
        `"${r?.nomorRencana || '-'}"`,
        `"${k.tanggal}"`,
        `"${r?.lokasiNama || '-'}"`,
        `"${r?.alamat || '-'}"`,
        `"${k.checkInTime || '-'}"`,
        `"${k.checkOutTime || '-'}"`,
        `"${k.kondisiLokasi || '-'}"`,
        `"${k.prioritas}"`,
        `"${(k.temuan || '').replace(/"/g, '""')}"`,
        `"${(k.rekomendasi || '').replace(/"/g, '""')}"`,
        k.fotos ? k.fotos.length : 0,
        k.tandaTangan ? `"Disetujui (${k.tandaTangan.namaPihak})"` : '"Belum"',
      ];
    });

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  }

  public static generatePDFReport(kunjungan: Kunjungan, rencana?: RencanaKunjungan, petugasList?: Petugas[]) {
    const doc = new jsPDF();
    let y = 15;

    // Header
    doc.setFillColor(15, 23, 42); // slate navy
    doc.rect(0, 0, 210, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('LAPORAN HASIL KUNJUNGAN LAPANGAN', 105, 14, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('SISTEM MANAJEMEN VISITDATA PRO • FIELD VISIT REPORT', 105, 20, { align: 'center' });

    y = 35;
    doc.setTextColor(30, 41, 59);

    // Section 1: Informasi Kunjungan
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('I. INFORMASI UMUM KUNJUNGAN', 15, y);
    doc.setLineWidth(0.5);
    doc.setDrawColor(203, 213, 225);
    doc.line(15, y + 2, 195, y + 2);

    y += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Nomor Kunjungan:', 15, y);
    doc.setFont('helvetica', 'normal');
    doc.text(kunjungan.nomorKunjungan || 'KJ-2026-001', 55, y);

    doc.setFont('helvetica', 'bold');
    doc.text('Tanggal & Waktu:', 115, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`${kunjungan.tanggal} (${kunjungan.checkInTime || '-'} s/d ${kunjungan.checkOutTime || '-'})`, 150, y);

    y += 7;
    doc.setFont('helvetica', 'bold');
    doc.text('Lokasi Tujuan:', 15, y);
    doc.setFont('helvetica', 'normal');
    doc.text(rencana?.lokasiNama || 'Lokasi Kunjungan', 55, y);

    doc.setFont('helvetica', 'bold');
    doc.text('Koordinat GPS:', 115, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`${kunjungan.checkInLat || -6.2088}, ${kunjungan.checkInLng || 106.8456}`, 150, y);

    y += 7;
    doc.setFont('helvetica', 'bold');
    doc.text('Alamat Lengkap:', 15, y);
    doc.setFont('helvetica', 'normal');
    doc.text(rencana?.alamat || 'Jl. Lokasi Kunjungan Lapangan', 55, y);

    y += 12;
    // Section 2: Tim Petugas
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('II. TIM PETUGAS YANG DITUGASKAN', 15, y);
    doc.line(15, y + 2, 195, y + 2);

    y += 8;
    doc.setFontSize(9);
    const assignedPetugas = (petugasList || []).filter((p) => rencana?.petugasIds.includes(p.id));
    if (assignedPetugas.length > 0) {
      assignedPetugas.forEach((p, idx) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`${idx + 1}. ${p.nama}`, 18, y);
        doc.setFont('helvetica', 'normal');
        doc.text(`(NIP: ${p.nip} - ${p.jabatan})`, 65, y);
        y += 6;
      });
    } else {
      doc.setFont('helvetica', 'normal');
      doc.text('- Petugas Lapangan Utama', 18, y);
      y += 6;
    }

    y += 6;
    // Section 3: Hasil & Temuan Lapangan
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('III. HASIL PERIKSA & TEMUAN LAPANGAN', 15, y);
    doc.line(15, y + 2, 195, y + 2);

    y += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Kondisi Fisik Lokasi:', 15, y);
    doc.setFont('helvetica', 'normal');
    doc.text(kunjungan.kondisiLokasi || 'Baik', 60, y);

    doc.setFont('helvetica', 'bold');
    doc.text('Tingkat Prioritas:', 115, y);
    doc.setFont('helvetica', 'normal');
    doc.text(kunjungan.prioritas || 'SEDANG', 150, y);

    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Ringkasan Temuan:', 15, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    const temuanLines = doc.splitTextToSize(kunjungan.temuan || 'Kunjungan telah dilaksanakan dengan hasil memadai.', 175);
    doc.text(temuanLines, 15, y);
    y += temuanLines.length * 5 + 4;

    doc.setFont('helvetica', 'bold');
    doc.text('Rekomendasi / Tindak Lanjut:', 15, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    const rekomLines = doc.splitTextToSize(kunjungan.rekomendasi || 'Melakukan pengawasan berkala pada kunjungan berikutnya.', 175);
    doc.text(rekomLines, 15, y);
    y += rekomLines.length * 5 + 8;

    // Section 4: Tanda Tangan Persetujuan
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('IV. PERSETUJUAN & DOKUMENTASI', 15, y);
    doc.line(15, y + 2, 195, y + 2);

    y += 12;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Petugas Pelaksana,', 25, y);
    doc.text('Pihak Yang Ditemui (Lokasi),', 125, y);

    y += 18;
    doc.setFont('helvetica', 'normal');
    doc.text(`( ${assignedPetugas[0]?.nama || 'Ahmad Hidayat'} )`, 25, y);
    doc.text(`( ${kunjungan.tandaTangan?.namaPihak || 'Ir. Hendra Gunawan'} )`, 125, y);

    y += 5;
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Jabatan: ${assignedPetugas[0]?.jabatan || 'Koordinator Lapangan'}`, 25, y);
    doc.text(`Jabatan: ${kunjungan.tandaTangan?.jabatanPihak || 'Manager Facility'}`, 125, y);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Dokumen ini dibuat secara otomatis oleh VisitData System pada ${new Date().toLocaleString('id-ID')}`, 105, 287, { align: 'center' });

    doc.save(`Laporan_Kunjungan_${kunjungan.nomorKunjungan}.pdf`);
  }
}
