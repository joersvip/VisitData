export type UserRole = 'ADMIN' | 'SUPERVISOR' | 'PETUGAS';

export type OfficialRole =
  | 'SUPER_ADMIN'
  | 'INSPEKTUR_UTAMA'
  | 'INSPEKTUR_MUDA'
  | 'JAKSA_FUNGSIONAL'
  | 'AUDITOR_INTEL'
  | 'PETUGAS_LAPANGAN';

export type StatusKunjungan = 'DIJADWALKAN' | 'PROSES' | 'SELESAI' | 'BATAL';
export type PrioritasType = 'RENDAH' | 'SEDANG' | 'TINGGI';

export interface Petugas {
  id: string;
  nama: string;
  nip: string;
  jabatan: string;
  unit: string;
  telepon: string;
  email: string;
  fotoUrl: string;
  active: boolean;
  totalKunjungan: number;
  role?: OfficialRole;
  tim?: string;
}

export interface RencanaKunjungan {
  id: string;
  nomorRencana: string;
  tanggal: string; // YYYY-MM-DD
  jamMulai: string; // HH:mm
  jamSelesai: string; // HH:mm
  lokasiNama: string;
  alamat: string;
  latitude: number;
  longitude: number;
  agenda: string;
  targetHasil: string;
  petugasIds: string[];
  status: StatusKunjungan;
  reminderEnabled: boolean;
  isRecurring?: boolean;
}

export interface DokumentasiFoto {
  id: string;
  url: string; // base64 or object URL
  timestamp: string;
  latitude: number;
  longitude: number;
  alamat: string;
  keterangan: string;
}

export interface TandaTangan {
  namaPihak: string;
  jabatanPihak: string;
  signatureDataUrl: string; // base64 png
  timestamp: string;
}

export interface Kunjungan {
  id: string;
  rencanaId: string;
  nomorKunjungan: string;
  tanggal: string;
  checkInTime?: string;
  checkOutTime?: string;
  checkInLat?: number;
  checkInLng?: number;
  checkOutLat?: number;
  checkOutLng?: number;
  kondisiLokasi: string; // e.g. 'Baik', 'Cukup', 'Tidak Baik'
  temuan: string;
  rekomendasi: string;
  prioritas: PrioritasType;
  fotos: DokumentasiFoto[];
  tandaTangan?: TandaTangan;
  status: 'PROSES' | 'SELESAI';
  synced: boolean;
  createdAt: string;
}

export interface HistoriLog {
  id: string;
  timestamp: string;
  deskripsi: string;
  tipe: 'CHECKIN' | 'CHECKOUT' | 'FOTO' | 'FORM' | 'RENCANA' | 'SYNC';
  userNama: string;
  lokasiNama: string;
}

export interface SyncQueueItem {
  id: string;
  action: 'CREATE_KUNJUNGAN' | 'UPDATE_STATUS' | 'ADD_FOTO';
  payload: any;
  timestamp: string;
}

export interface LokasiDikunjungi {
  lokasiNama: string;
  alamat: string;
  latitude: number;
  longitude: number;
  totalVisits: number;
  lastVisitDate: string;
  lastKondisi: string;
  kunjunganList: Kunjungan[];
}

export interface AdminUser {
  id: string;
  nama: string;
  nip: string;
  jabatan: string;
  unit: string;
  email: string;
  telepon: string;
  fotoUrl: string;
  role: 'SUPER_ADMIN' | 'INSPEKTUR' | 'ADMIN_PEMBINAAN';
}
