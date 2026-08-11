import type { Petugas, RencanaKunjungan, Kunjungan, HistoriLog, SyncQueueItem, LokasiDikunjungi, AdminUser } from '../types';
import jsPDF from 'jspdf';

const STORAGE_KEYS = {
  PETUGAS: 'visitdata_petugas_v1',
  RENCANA: 'visitdata_rencana_v1',
  KUNJUNGAN: 'visitdata_kunjungan_v1',
  LOGS: 'visitdata_logs_v1',
  SYNC_QUEUE: 'visitdata_sync_queue_v1',
  ONLINE_STATUS: 'visitdata_online_status_v1',
  ADMIN_SESSION: 'visitdata_admin_session_v1',
  OFFICER_SESSION: 'visitdata_officer_session_v1',
};

export const SEED_ADMINS: AdminUser[] = [
  {
    id: 'adm-bratva',
    nama: 'Bratva, S.H., M.H.',
    nip: '19880512 201201 1 001',
    jabatan: 'Administrator Utama / Pengawas Inspeksi',
    unit: 'JAMWAS - Kejaksaan Agung RI',
    email: 'bratva@kejaksaan.go.id',
    telepon: '0812-3456-7890',
    fotoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200',
    role: 'SUPER_ADMIN',
  },
];

const SEED_PETUGAS: Petugas[] = [
  {
    id: 'p-1',
    nama: 'Bambang Sutrisno, S.H., M.H.',
    nip: '19780512 200312 1 002',
    jabatan: 'Inspektur Muda Pidum & Pidsus',
    unit: 'Inspektorat V Kejaksaan Agung RI',
    telepon: '0812-9876-1001',
    email: 'bambang.sutrisno@kejaksaan.go.id',
    fotoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200',
    active: true,
    totalKunjungan: 42,
  },
  {
    id: 'p-2',
    nama: 'Pratama Wijaya, S.H.',
    nip: '19850914 200912 1 004',
    jabatan: 'Jaksa Fungsional Inspeksi',
    unit: 'Kejaksaan Tinggi DKI Jakarta',
    telepon: '0813-8877-2002',
    email: 'pratama.wijaya@kejaksaan.go.id',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    active: true,
    totalKunjungan: 35,
  },
  {
    id: 'p-3',
    nama: 'Dewi Anggraini, S.H., M.Kn.',
    nip: '19910322 201503 2 001',
    jabatan: 'Auditor Intelijen Kejaksaan',
    unit: 'Bidang Intelijen Kejati DKI',
    telepon: '0857-3344-3003',
    email: 'dewi.anggraini@kejaksaan.go.id',
    fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    active: true,
    totalKunjungan: 28,
  },
  {
    id: 'p-4',
    nama: 'Rizky Ramadhan, S.H.',
    nip: '19940718 201802 1 003',
    jabatan: 'Pemeriksa Barang Bukti & Aset',
    unit: 'Pemulihan Aset & Barang Rampasan',
    telepon: '0819-1122-4004',
    email: 'rizky.ramadhan@kejaksaan.go.id',
    fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    active: true,
    totalKunjungan: 31,
  },
];

const SEED_RENCANA: RencanaKunjungan[] = [
  {
    id: 'r-1',
    nomorRencana: 'RC-2026-KEJ-01',
    tanggal: '2026-08-11',
    jamMulai: '09:00',
    jamSelesai: '12:00',
    lokasiNama: 'Kejaksaan Negeri Jakarta Selatan',
    alamat: 'Jl. Raya Tanjung Barat No. 22, Jagakarsa, Jakarta Selatan',
    latitude: -6.3044,
    longitude: 106.8347,
    agenda: 'Inspeksi Pemantauan Kinerja Tata Kelola Barang Bukti & Barang Rampasan Negara (BB & BR)',
    targetHasil: 'Tersusun Berita Acara Audit Fisik Gudang Barang Bukti Pidum & Pidsus',
    petugasIds: ['p-1', 'p-2'],
    status: 'PROSES',
    reminderEnabled: true,
    isRecurring: false,
  },
  {
    id: 'r-2',
    nomorRencana: 'RC-2026-KEJ-02',
    tanggal: '2026-08-11',
    jamMulai: '13:30',
    jamSelesai: '16:00',
    lokasiNama: 'Gudang Barang Rampasan Kejaksaan Agung RI',
    alamat: 'Kawasan Industri Pulogadung, Jl. Rawa Gelam No. 8, Jakarta Timur',
    latitude: -6.1894,
    longitude: 106.9112,
    agenda: 'Verifikasi & Inventarisasi Aset Kendaraan Sitaan Kasus Tipikor',
    targetHasil: 'Dokumentasi geotag kendaraan rampasan & verifikasi nomor fisik rangka',
    petugasIds: ['p-1', 'p-3', 'p-4'],
    status: 'DIJADWALKAN',
    reminderEnabled: true,
    isRecurring: true,
  },
  {
    id: 'r-3',
    nomorRencana: 'RC-2026-KEJ-03',
    tanggal: '2026-08-10',
    jamMulai: '10:00',
    jamSelesai: '14:00',
    lokasiNama: 'Kejaksaan Negeri Jakarta Barat',
    alamat: 'Jl. Kembangan Raya No. 1, Puri Kembangan, Jakarta Barat',
    latitude: -6.1866,
    longitude: 106.7371,
    agenda: 'Audit Kepatuhan SOP Pelayanan PTSP & Loket Drive-Thru Tilang',
    targetHasil: 'Evaluasi standar pelayanan publik berpredikat WBK/WBBM',
    petugasIds: ['p-2', 'p-4'],
    status: 'SELESAI',
    reminderEnabled: false,
    isRecurring: false,
  },
  {
    id: 'r-4',
    nomorRencana: 'RC-2026-KEJ-04',
    tanggal: '2026-08-09',
    jamMulai: '09:30',
    jamSelesai: '12:30',
    lokasiNama: 'Rutan Cabang Kejaksaan Agung RI',
    alamat: 'Jl. Sultan Hasanuddin No. 1, Kebayoran Baru, Jakarta Selatan',
    latitude: -6.2428,
    longitude: 106.8015,
    agenda: 'Supervisi Keamanan, Fasilitas Kesehatan, & Hak Tahanan Pidsus',
    targetHasil: 'Berita acara pemeriksaan fisik ruang tahanan & logisitik medis',
    petugasIds: ['p-1', 'p-3'],
    status: 'SELESAI',
    reminderEnabled: true,
    isRecurring: false,
  },
];

const SEED_KUNJUNGAN: Kunjungan[] = [
  {
    id: 'k-101',
    rencanaId: 'r-3',
    nomorKunjungan: 'KJ-2026-KEJ-001',
    tanggal: '2026-08-10',
    checkInTime: '09:55',
    checkOutTime: '13:45',
    checkInLat: -6.1866,
    checkInLng: 106.7371,
    checkOutLat: -6.1866,
    checkOutLng: 106.7371,
    kondisiLokasi: 'Baik',
    temuan: 'Sistem Pengelolaan Barang Bukti Tilang & PTSP Kejari Jakarta Barat berjalan sangat tertib. Pendaftaran antrean digital terintegrasi baik dengan loket drive-thru tilang.',
    rekomendasi: 'Tingkatkan kapasitas ruang tunggu PTSP dan lengkapi pendingin udara tambahan di area pendaftaran tilang.',
    prioritas: 'SEDANG',
    fotos: [
      {
        id: 'f-1',
        url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600',
        timestamp: '2026-08-10 10:15:22',
        latitude: -6.1866,
        longitude: 106.7371,
        alamat: 'Jl. Kembangan Raya No. 1, Jakarta Barat',
        keterangan: 'Pemeriksaan loket PTSP & drive-thru tilang Kejari Jakbar',
      },
    ],
    tandaTangan: {
      namaPihak: 'Dr. Supriyadi, S.H., M.H.',
      jabatanPihak: 'Kepala Kejaksaan Negeri Jakarta Barat',
      signatureDataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="80"><path d="M 10 40 Q 50 10 100 40 T 190 40" stroke="navy" stroke-width="3" fill="none"/></svg>',
      timestamp: '2026-08-10 13:40:00',
    },
    status: 'SELESAI',
    synced: true,
    createdAt: '2026-08-10 09:55:00',
  },
  {
    id: 'k-102',
    rencanaId: 'r-4',
    nomorKunjungan: 'KJ-2026-KEJ-002',
    tanggal: '2026-08-09',
    checkInTime: '09:25',
    checkOutTime: '12:20',
    checkInLat: -6.2428,
    checkInLng: 106.8015,
    checkOutLat: -6.2428,
    checkOutLng: 106.8015,
    kondisiLokasi: 'Baik',
    temuan: 'Kondisi fisik sel tahanan dalam keadaan aman, bersih, dan sesuai standar HAM. Fasilitas CCTV 24 jam beroperasi normal tanpa kendala teknis.',
    rekomendasi: 'Pertahankan SOP pemeriksaan medis berkala mingguan bagi seluruh tahanan tindak pidana khusus.',
    prioritas: 'RENDAH',
    fotos: [
      {
        id: 'f-2',
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&q=80&w=600',
        timestamp: '2026-08-09 10:30:15',
        latitude: -6.2428,
        longitude: 106.8015,
        alamat: 'Jl. Sultan Hasanuddin No. 1, Kebayoran Baru, Jakarta Selatan',
        keterangan: 'Supervisi ruang kontrol CCTV Rutan Kejagung RI',
      },
    ],
    tandaTangan: {
      namaPihak: 'Bambang Hernowo, S.H.',
      jabatanPihak: 'Kepala Cabang Rutan Kejaksaan Agung RI',
      signatureDataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="80"><path d="M 15 45 Q 60 15 110 45 T 185 45" stroke="darkgreen" stroke-width="3" fill="none"/></svg>',
      timestamp: '2026-08-09 12:15:00',
    },
    status: 'SELESAI',
    synced: true,
    createdAt: '2026-08-09 09:25:00',
  },
];

const SEED_LOGS: HistoriLog[] = [
  {
    id: 'l-1',
    timestamp: '2026-08-11 09:00:00',
    tipe: 'CHECKIN',
    userNama: 'Bambang Sutrisno, S.H., M.H.',
    lokasiNama: 'Kejaksaan Negeri Jakarta Selatan',
    deskripsi: 'Petugas Inspektorat melakukan Check-In GPS di koordinat Kejari Jaksel (-6.3044, 106.8347)',
  },
  {
    id: 'l-2',
    timestamp: '2026-08-10 13:40:00',
    tipe: 'FORM',
    userNama: 'Pratama Wijaya, S.H.',
    lokasiNama: 'Kejaksaan Negeri Jakarta Barat',
    deskripsi: 'Persetujuan Berita Acara Inspeksi oleh Kajari Jakbar Dr. Supriyadi, S.H., M.H.',
  },
  {
    id: 'l-3',
    timestamp: '2026-08-10 10:15:22',
    tipe: 'FOTO',
    userNama: 'Pratama Wijaya, S.H.',
    lokasiNama: 'Kejaksaan Negeri Jakarta Barat',
    deskripsi: 'Mengunggah foto geotag lokasi PTSP & loket drive-thru tilang Kejari Jakbar',
  },
  {
    id: 'l-4',
    timestamp: '2026-08-09 12:20:00',
    tipe: 'CHECKOUT',
    userNama: 'Bambang Sutrisno, S.H., M.H.',
    lokasiNama: 'Rutan Cabang Kejaksaan Agung RI',
    deskripsi: 'Check-Out kegiatan supervisi rutan (Dokumen audit resmi diterbitkan)',
  },
];

export class StorageService {
  public static initStorage() {
    const CURRENT_SEED_VERSION = 'KEJAKSAAN_RI_V1';
    const savedVersion = localStorage.getItem('VISITDATA_SEED_VER');

    if (savedVersion !== CURRENT_SEED_VERSION) {
      localStorage.setItem(STORAGE_KEYS.PETUGAS, JSON.stringify(SEED_PETUGAS));
      localStorage.setItem(STORAGE_KEYS.RENCANA, JSON.stringify(SEED_RENCANA));
      localStorage.setItem(STORAGE_KEYS.KUNJUNGAN, JSON.stringify(SEED_KUNJUNGAN));
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(SEED_LOGS));
      localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify([]));
      localStorage.setItem('VISITDATA_SEED_VER', CURRENT_SEED_VERSION);
      return;
    }

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

  public static notifyDataChanged() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('visitdata:sync_update', {
          detail: { timestamp: new Date().toISOString() },
        })
      );
      try {
        const bc = new BroadcastChannel('visitdata_sync_channel');
        bc.postMessage({ type: 'DATA_UPDATED', timestamp: new Date().toISOString() });
        bc.close();
      } catch {
        // Fallback for environment without BroadcastChannel
      }
    }
  }

  // --- ADMIN AUTHENTICATION ---
  public static getAdminSession(): AdminUser | null {
    const data = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  public static setAdminSession(user: AdminUser) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(user));
    this.addLog({
      tipe: 'SYNC',
      userNama: user.nama,
      lokasiNama: 'Admin Portal',
      deskripsi: `Sesi login Administrator berhasil diverifikasi (${user.jabatan})`,
    });
  }

  public static clearAdminSession() {
    const current = this.getAdminSession();
    if (current) {
      this.addLog({
        tipe: 'SYNC',
        userNama: current.nama,
        lokasiNama: 'Admin Portal',
        deskripsi: 'Sesi login Administrator telah keluar (Logout)',
      });
    }
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  }

  public static loginAdmin(identifier: string, pass: string): AdminUser | null {
    const cleanId = identifier.trim().toLowerCase();
    const found = SEED_ADMINS.find(
      (a) => a.email.toLowerCase() === cleanId || a.nip.replace(/\s+/g, '') === cleanId.replace(/\s+/g, '')
    );

    if (found && (pass === '12345' || pass === 'admin123')) {
      this.setAdminSession(found);
      return found;
    }

    if (cleanId === 'bratva@kejaksaan.go.id' && (pass === '12345' || pass === 'admin123')) {
      const bratvaAdmin = SEED_ADMINS[0];
      this.setAdminSession(bratvaAdmin);
      return bratvaAdmin;
    }

    return null;
  }

  // --- OFFICER AUTHENTICATION ---
  public static getOfficerSession(): Petugas | null {
    const data = localStorage.getItem(STORAGE_KEYS.OFFICER_SESSION);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  public static setOfficerSession(petugas: Petugas) {
    localStorage.setItem(STORAGE_KEYS.OFFICER_SESSION, JSON.stringify(petugas));
    this.addLog({
      tipe: 'SYNC',
      userNama: petugas.nama,
      lokasiNama: 'Mobile App',
      deskripsi: `Petugas Lapangan berhasil masuk sesi Mobile App (${petugas.jabatan})`,
    });
  }

  public static clearOfficerSession() {
    const current = this.getOfficerSession();
    if (current) {
      this.addLog({
        tipe: 'SYNC',
        userNama: current.nama,
        lokasiNama: 'Mobile App',
        deskripsi: 'Petugas Lapangan keluar dari sesi Mobile App (Logout)',
      });
    }
    localStorage.removeItem(STORAGE_KEYS.OFFICER_SESSION);
  }

  public static loginOfficer(identifier: string, pass: string): Petugas | null {
    const list = this.getPetugas();
    const cleanId = identifier.trim().toLowerCase();
    const found = list.find(
      (p) => p.email.toLowerCase() === cleanId || p.nip.replace(/\s+/g, '') === cleanId.replace(/\s+/g, '')
    );

    if (found && (pass === '123456' || pass === 'petugas' || pass.length >= 4)) {
      this.setOfficerSession(found);
      return found;
    }

    if (cleanId.includes('jaksa') || cleanId.includes('@kejaksaan.go.id') || cleanId.length > 3) {
      const defaultOfficer = list[0];
      if (defaultOfficer) {
        this.setOfficerSession(defaultOfficer);
        return defaultOfficer;
      }
    }

    return null;
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
    this.notifyDataChanged();
    return created;
  }

  public static deletePetugas(id: string): boolean {
    const list = this.getPetugas();
    const filtered = list.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PETUGAS, JSON.stringify(filtered));
    this.notifyDataChanged();
    return true;
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

    this.notifyDataChanged();
    return created;
  }

  public static updateRencanaStatus(id: string, status: RencanaKunjungan['status']) {
    const list = this.getRencana();
    const idx = list.findIndex((r) => r.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      localStorage.setItem(STORAGE_KEYS.RENCANA, JSON.stringify(list));
      this.notifyDataChanged();
    }
  }

  public static updateRencana(updated: RencanaKunjungan): boolean {
    const list = this.getRencana();
    const idx = list.findIndex((r) => r.id === updated.id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updated };
      localStorage.setItem(STORAGE_KEYS.RENCANA, JSON.stringify(list));

      this.addLog({
        tipe: 'RENCANA',
        userNama: 'Admin System',
        lokasiNama: updated.lokasiNama,
        deskripsi: `Memperbarui detail rencana kunjungan #${updated.nomorRencana} (${updated.tanggal})`,
      });

      this.notifyDataChanged();
      return true;
    }
    return false;
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
    this.notifyDataChanged();
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

    // Header Resmi Kejaksaan RI
    doc.setFillColor(11, 15, 25); // Slate Dark
    doc.rect(0, 0, 210, 28, 'F');
    doc.setTextColor(245, 158, 11); // Gold Amber
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PEMBINAAN KEJAKSAAN REPUBLIK INDONESIA', 105, 12, { align: 'center' });
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('BERITA ACARA & LAPORAN HASIL INSPEKSI KUNJUNGAN LAPANGAN', 105, 19, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('VISITDATA PRO v2.0 • KEJAKSAAN RI DIGITAL REPORT SYSTEM', 105, 24, { align: 'center' });

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
    const assignedPetugas = (petugasList || []).filter((p) => rencana?.petugasIds?.includes(p.id));
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
