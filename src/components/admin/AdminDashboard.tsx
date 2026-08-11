import React, { useState } from 'react';
import {
  Users,
  Calendar,
  CheckCircle,
  Plus,
  Download,
  FileText,
  MapPin,
  Search,
  Filter,
  Shield,
  Activity,
  UserPlus,
  Database,
  Building,
  Eye,
  Trash2,
  Edit3,
  LogOut,
  Phone,
  ShieldCheck,
  Mail,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import type { Petugas, RencanaKunjungan, Kunjungan, HistoriLog, LokasiDikunjungi, AdminUser } from '../../types';
import { StorageService } from '../../services/storage';
import { VisitMap } from '../VisitMap';

interface AdminDashboardProps {
  petugasList: Petugas[];
  rencanas: RencanaKunjungan[];
  kunjungans: Kunjungan[];
  logs: HistoriLog[];
  currentAdmin?: AdminUser | null;
  onLogout?: () => void;
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  petugasList,
  rencanas,
  kunjungans,
  logs,
  currentAdmin,
  onLogout,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SCHEDULER' | 'OFFICERS' | 'REPORTS' | 'LOCATIONS'>('OVERVIEW');
  const [selectedRencanaId, setSelectedRencanaId] = useState<string>(rencanas[0]?.id || '');
  const [selectedLocationHistory, setSelectedLocationHistory] = useState<LokasiDikunjungi | null>(null);
  const [showAdminProfileModal, setShowAdminProfileModal] = useState(false);

  // Form State: Schedule (Create & Edit)
  const [showAddRencanaModal, setShowAddRencanaModal] = useState(false);
  const [editingRencanaId, setEditingRencanaId] = useState<string | null>(null);
  const [statusRencana, setStatusRencana] = useState<RencanaKunjungan['status']>('DIJADWALKAN');
  const [lokasiNama, setLokasiNama] = useState('');
  const [alamat, setAlamat] = useState('');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [jamMulai, setJamMulai] = useState('09:00');
  const [jamSelesai, setJamSelesai] = useState('12:00');
  const [agenda, setAgenda] = useState('');
  const [targetHasil, setTargetHasil] = useState('');
  const [selectedPetugasIds, setSelectedPetugasIds] = useState<string[]>(['p-1']);
  const latitude = -6.2088;
  const longitude = 106.8456;

  // Form State: New Officer & Deletion
  const [showAddPetugasModal, setShowAddPetugasModal] = useState(false);
  const [petugasToDelete, setPetugasToDelete] = useState<Petugas | null>(null);
  const [namaPetugas, setNamaPetugas] = useState('');
  const [nipPetugas, setNipPetugas] = useState('');
  const [jabatanPetugas, setJabatanPetugas] = useState('Inspector Lapangan');
  const [teleponPetugas, setTeleponPetugas] = useState('0812-0000-1111');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const databaseLokasi = StorageService.getDatabaseLokasiDikunjungi();

  const handleOpenCreateRencana = () => {
    setEditingRencanaId(null);
    setLokasiNama('');
    setAlamat('');
    setTanggal(new Date().toISOString().split('T')[0]);
    setJamMulai('09:00');
    setJamSelesai('12:00');
    setAgenda('');
    setTargetHasil('');
    setSelectedPetugasIds(petugasList.length > 0 ? [petugasList[0].id] : ['p-1']);
    setStatusRencana('DIJADWALKAN');
    setShowAddRencanaModal(true);
  };

  const handleOpenEditRencana = (rencana: RencanaKunjungan) => {
    setEditingRencanaId(rencana.id);
    setLokasiNama(rencana.lokasiNama);
    setAlamat(rencana.alamat);
    setTanggal(rencana.tanggal);
    setJamMulai(rencana.jamMulai);
    setJamSelesai(rencana.jamSelesai);
    setAgenda(rencana.agenda);
    setTargetHasil(rencana.targetHasil || '');
    setSelectedPetugasIds(rencana.petugasIds || []);
    setStatusRencana(rencana.status);
    setShowAddRencanaModal(true);
  };

  const handleSaveRencana = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lokasiNama || !alamat || !agenda) return;

    if (editingRencanaId) {
      const existing = rencanas.find((r) => r.id === editingRencanaId);
      if (existing) {
        StorageService.updateRencana({
          ...existing,
          tanggal,
          jamMulai,
          jamSelesai,
          lokasiNama,
          alamat,
          agenda,
          targetHasil: targetHasil || 'Laporan audit fisik & dokumentasi geotag',
          petugasIds: selectedPetugasIds,
          status: statusRencana,
        });
        alert('✅ Rencana Kunjungan Lapangan Berhasil Diperbarui!');
      }
    } else {
      StorageService.addRencana({
        tanggal,
        jamMulai,
        jamSelesai,
        lokasiNama,
        alamat,
        latitude,
        longitude,
        agenda,
        targetHasil: targetHasil || 'Laporan audit fisik & dokumentasi geotag',
        petugasIds: selectedPetugasIds,
        reminderEnabled: true,
        isRecurring: false,
      });
      alert('✅ Rencana Kunjungan Lapangan Baru Berhasil Dijadwalkan!');
    }

    onRefreshData();
    setShowAddRencanaModal(false);
  };

  const handleCreatePetugas = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaPetugas || !nipPetugas) return;

    StorageService.addPetugas({
      nama: namaPetugas,
      nip: nipPetugas,
      jabatan: jabatanPetugas,
      unit: 'Inspeksi Lapangan',
      telepon: teleponPetugas,
      email: `${namaPetugas.toLowerCase().replace(/\s+/g, '.')}@visitdata.id`,
      fotoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      active: true,
    });

    onRefreshData();
    setShowAddPetugasModal(false);
    setNamaPetugas('');
    setNipPetugas('');
    alert('✅ Master Data Petugas Baru Berhasil Ditambahkan!');
  };

  const handleInitiateDeletePetugas = (p: Petugas) => {
    if (p.id === 'p-bratva' || p.email?.toLowerCase() === 'bratva@kejaksaan.go.id') {
      alert('⚠️ Akun Administrator Utama (Bratva, S.H., M.H.) dilindungi dan tidak dapat dihapus.');
      return;
    }
    setPetugasToDelete(p);
  };

  const handleConfirmDeletePetugas = () => {
    if (!petugasToDelete) return;
    const deletedName = petugasToDelete.nama;
    StorageService.deletePetugas(petugasToDelete.id);
    onRefreshData();
    setPetugasToDelete(null);
    alert(`✅ Petugas "${deletedName}" berhasil dihapus dari Master Data.`);
  };

  const handleExportCSV = () => {
    const csvContent = StorageService.exportToCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `VisitData_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRencanas = rencanas.filter((r) => {
    const matchSearch =
      r.lokasiNama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.nomorRencana.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.alamat.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredLokasiDb = databaseLokasi.filter((loc) =>
    loc.lokasiNama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.alamat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 animate-fade-in">
      {/* Top Banner & Quick Controls */}
      <div className="glass-panel p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-amber-500/30">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-950 p-2 flex items-center justify-center border border-amber-500/40 shadow-xl shadow-amber-500/20 shrink-0">
            <img src="/logo.png" alt="Logo Kejaksaan RI" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-extrabold uppercase tracking-wider mb-0.5">
              <Shield className="w-4 h-4 text-amber-400" /> PEMBINAAN KEJAKSAAN REPUBLIK INDONESIA
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Dashboard Monitoring Inspeksi Lapangan</h2>
            <p className="text-xs text-slate-400 mt-1">
              Pantau pergerakan tim petugas, jadwal kunjungan, database lokasi pernah dikunjungi, dan hasil laporan secara real-time.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Live DB Sync Indicator */}
          <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1.5 rounded-2xl shadow-md text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-[11px] font-bold text-emerald-200 hidden md:inline">
              DB Mobile & Web Terhubung
            </span>
            <button
              type="button"
              onClick={() => onRefreshData()}
              className="p-1 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-800/40 transition-all ml-0.5"
              title="Singkronkan Data Sekarang"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {currentAdmin && (
            <div className="flex items-center gap-2.5 bg-slate-950/90 p-2 rounded-2xl border border-amber-500/40 shadow-lg">
              <button
                onClick={() => setShowAdminProfileModal(true)}
                className="flex items-center gap-2.5 hover:opacity-90 transition-all text-left"
                title="Lihat Profil Lengkap Pegawai Admin"
              >
                <div className="relative">
                  <img
                    src={currentAdmin.fotoUrl}
                    alt={currentAdmin.nama}
                    className="w-9 h-9 rounded-full object-cover border-2 border-amber-400"
                  />
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-950 absolute -bottom-0.5 -right-0.5" />
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-black text-white truncate max-w-[160px]">
                    {currentAdmin.nama}
                  </div>
                  <div className="text-[10px] text-amber-400 font-semibold font-mono">
                    NIP: {currentAdmin.nip}
                  </div>
                </div>
              </button>

              {onLogout && (
                <button
                  onClick={() => {
                    if (confirm('Apakah Anda yakin ingin keluar dari sesi Admin?')) {
                      onLogout();
                    }
                  }}
                  className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 transition-all ml-0.5"
                  title="Keluar (Logout Admin)"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          <button
            onClick={handleOpenCreateRencana}
            className="btn btn-primary font-extrabold"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Buat Rencana Kunjungan
          </button>

          <button
            onClick={handleExportCSV}
            className="btn btn-secondary"
          >
            <Download className="w-4 h-4 text-amber-400" /> Export Excel/CSV
          </button>
        </div>
      </div>

      {/* Top Statistics Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 flex items-center gap-4 border-l-4 border-l-amber-500">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Total Rencana</span>
            <span className="text-2xl font-bold text-white">{rencanas.length}</span>
            <span className="text-[10px] text-amber-400 font-semibold block mt-0.5">Jadwal Aktif</span>
          </div>
        </div>

        <div className="glass-panel p-4 flex items-center gap-4 border-l-4 border-l-emerald-500">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Kunjungan Selesai</span>
            <span className="text-2xl font-bold text-emerald-400">{kunjungans.length}</span>
            <span className="text-[10px] text-emerald-400/80 font-semibold block mt-0.5">Sudah Terverifikasi</span>
          </div>
        </div>

        <div className="glass-panel p-4 flex items-center gap-4 border-l-4 border-l-yellow-400">
          <div className="w-12 h-12 rounded-xl bg-yellow-400/10 text-yellow-400 flex items-center justify-center border border-yellow-400/30">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Lokasi Dikunjungi</span>
            <span className="text-2xl font-bold text-yellow-400">{databaseLokasi.length}</span>
            <span className="text-[10px] text-yellow-400/80 font-semibold block mt-0.5">Master Site Record</span>
          </div>
        </div>

        <div className="glass-panel p-4 flex items-center gap-4 border-l-4 border-l-purple-500">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Petugas Lapangan</span>
            <span className="text-2xl font-bold text-purple-400">{petugasList.length}</span>
            <span className="text-[10px] text-purple-400/80 font-semibold block mt-0.5">Anggota Siap Tugas</span>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="flex items-center gap-2 border-b border-amber-500/20 pb-3 flex-wrap">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'OVERVIEW'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 font-extrabold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          Peta Monitoring & Overview
        </button>
        <button
          onClick={() => setActiveTab('LOCATIONS')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'LOCATIONS'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 font-extrabold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Database className="w-3.5 h-3.5" /> Database Lokasi Dikunjungi
        </button>
        <button
          onClick={() => setActiveTab('SCHEDULER')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'SCHEDULER'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 font-extrabold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          Penjadwalan Rencana
        </button>
        <button
          onClick={() => setActiveTab('OFFICERS')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'OFFICERS'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 font-extrabold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          Master Tim Petugas
        </button>
        <button
          onClick={() => setActiveTab('REPORTS')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'REPORTS'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 font-extrabold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          Laporan & Rekapitulasi
        </button>
      </div>

      {/* TAB 1: OVERVIEW & MAP MONITORING */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Column */}
          <div className="lg:col-span-2 glass-panel p-4 space-y-3 border-amber-500/25">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" /> Live Spasial Peta Kunjungan Lapangan
              </h3>
              <span className="text-xs text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                Total {rencanas.length} Titik Terdaftar
              </span>
            </div>
            <div className="h-[460px] border border-amber-500/20 rounded-xl overflow-hidden">
              <VisitMap
                rencanas={rencanas}
                kunjungans={kunjungans}
                selectedRencanaId={selectedRencanaId}
                onSelectRencana={(id) => setSelectedRencanaId(id)}
              />
            </div>
          </div>

          {/* Right Side: Active Activity Log & Quick Details */}
          <div className="glass-panel p-4 space-y-4 border-amber-500/25">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" /> Audit Log Pergerakan Tim
            </h3>

            <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="bg-slate-900/90 p-3 rounded-xl border border-amber-500/20 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-bold text-amber-400">{log.userNama}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <p className="text-slate-200">{log.deskripsi}</p>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 font-semibold">
                    <MapPin className="w-3 h-3 text-amber-400" /> {log.lokasiNama}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NEW TAB: DATABASE LOKASI DIKUNJUNGI */}
      {activeTab === 'LOCATIONS' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 space-y-4 border-amber-500/25">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Building className="w-4 h-4 text-amber-400" /> Master Database Lokasi / Site Yang Pernah Dikunjungi
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Arsip historis tempat kunjungan lengkap dengan frekuensi kedatangan, kondisi terakhir, dan log transaksi.
                </p>
              </div>

              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari nama tempat, alamat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-amber-500/20 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLokasiDb.map((loc, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/90 rounded-2xl p-4 border border-amber-500/30 space-y-3 shadow-lg hover:border-amber-400 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {loc.totalVisits} Kali Dikunjungi
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Terakhir: {loc.lastVisitDate}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-amber-400 shrink-0" />
                      {loc.lokasiNama}
                    </h4>
                    <p className="text-[11px] text-slate-400 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{loc.alamat}</span>
                    </p>
                  </div>

                  <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Kondisi Terakhir:</span>
                    <span className="font-bold text-emerald-400">{loc.lastKondisi}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
                    <button
                      onClick={() => setSelectedLocationHistory(loc)}
                      className="btn btn-secondary flex-1 text-xs py-1.5 font-semibold inline-flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" /> Lihat Detail ({loc.kunjunganList.length})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal / Panel Detail History Per Location */}
          {selectedLocationHistory && (
            <div className="glass-panel p-5 space-y-4 border-amber-500/40 animate-fade-in">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">REKAP HISTORIS LOKASI</span>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Building className="w-5 h-5 text-amber-400" /> {selectedLocationHistory.lokasiNama}
                  </h3>
                  <p className="text-xs text-slate-400">{selectedLocationHistory.alamat}</p>
                </div>

                <button
                  onClick={() => setSelectedLocationHistory(null)}
                  className="px-3 py-1 bg-slate-800 text-slate-300 rounded text-xs font-bold hover:bg-slate-700"
                >
                  ✕ Tutup Detail
                </button>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-amber-400">Riwayat Kunjungan Petugas Di Lokasi Ini:</h4>
                <div className="space-y-3">
                  {selectedLocationHistory.kunjunganList.map((k) => (
                    <div
                      key={k.id}
                      className="bg-slate-950/90 p-4 rounded-xl border border-amber-500/25 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono font-bold text-amber-400">{k.nomorKunjungan}</span>
                        <span className="text-slate-400">📅 Tanggal: {k.tanggal} ({k.checkInTime} - {k.checkOutTime})</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                        <div>
                          <strong className="text-amber-400 block text-[10px]">Temuan Lapangan:</strong>
                          <p className="text-slate-200">{k.temuan}</p>
                        </div>
                        <div>
                          <strong className="text-emerald-400 block text-[10px]">Rekomendasi Tindak Lanjut:</strong>
                          <p className="text-slate-200">{k.rekomendasi}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px]">
                        <span className="text-slate-400">
                          📷 {k.fotos ? k.fotos.length : 0} Foto Geotag • {k.tandaTangan ? '✍ Tanda Tangan Disetujui' : 'Belum Tanda Tangan'}
                        </span>
                        <button
                          onClick={() => {
                            const r = rencanas.find((ren) => ren.id === k.rencanaId);
                            StorageService.generatePDFReport(k, r, petugasList);
                          }}
                          className="btn btn-primary text-xs py-1 px-3 font-extrabold inline-flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" /> Cetak PDF Laporan
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SCHEDULER & LIST */}
      {activeTab === 'SCHEDULER' && (
        <div className="glass-panel p-5 space-y-4 border-amber-500/25">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari lokasi, nomor rencana..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-amber-500/20 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-amber-500/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="ALL">Semua Status</option>
                <option value="DIJADWALKAN">DIJADWALKAN</option>
                <option value="PROSES">PROSES</option>
                <option value="SELESAI">SELESAI</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/90 text-slate-400 font-semibold border-b border-amber-500/20">
                  <th className="p-3">No. Rencana</th>
                  <th className="p-3">Lokasi & Alamat</th>
                  <th className="p-3">Tanggal & Jam</th>
                  <th className="p-3">Petugas Penanggung Jawab</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {filteredRencanas.map((r) => {
                  const assigned = petugasList.filter((p) => r.petugasIds?.includes(p.id));
                  return (
                    <tr key={r.id} className="hover:bg-slate-800/50 transition-all">
                      <td className="p-3 font-mono font-bold text-amber-400">{r.nomorRencana}</td>
                      <td className="p-3">
                        <div className="font-bold text-white">{r.lokasiNama}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{r.alamat}</div>
                      </td>
                      <td className="p-3">
                        <div>{r.tanggal}</div>
                        <div className="text-[11px] text-amber-400 font-semibold">{r.jamMulai} - {r.jamSelesai}</div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {assigned.map((p) => (
                            <span
                              key={p.id}
                              className="px-2 py-0.5 rounded bg-slate-900 border border-amber-500/30 text-[10px] text-amber-300 font-semibold"
                            >
                              {p.nama}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`badge ${
                            r.status === 'SELESAI'
                              ? 'badge-selesai'
                              : r.status === 'PROSES'
                              ? 'badge-proses'
                              : 'badge-dijadwalkan'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditRencana(r)}
                            className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded text-[11px] font-bold border border-amber-500/40 inline-flex items-center gap-1 transition-all"
                          >
                            <Edit3 className="w-3 h-3 text-amber-400" /> Edit
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRencanaId(r.id);
                              setActiveTab('OVERVIEW');
                            }}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded text-[11px] font-bold border border-slate-700 inline-flex items-center gap-1 transition-all"
                          >
                            <Eye className="w-3 h-3 text-amber-400" /> Peta
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: OFFICERS */}
      {activeTab === 'OFFICERS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Master Data Tim Petugas Lapangan</h3>
            <button
              onClick={() => setShowAddPetugasModal(true)}
              className="btn btn-primary font-extrabold"
            >
              <UserPlus className="w-4 h-4" /> Tambah Petugas Baru
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {petugasList.map((p) => (
              <div key={p.id} className="glass-panel p-4 space-y-3 border-t-4 border-t-amber-500 border-amber-500/25">
                <div className="flex items-center gap-3">
                  <img
                    src={p.fotoUrl}
                    alt={p.nama}
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-500"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{p.nama}</h4>
                    <p className="text-[11px] text-amber-400 font-semibold">{p.jabatan}</p>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-300 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  <div><strong className="text-slate-400">NIP:</strong> {p.nip}</div>
                  <div><strong className="text-slate-400">Unit:</strong> {p.unit}</div>
                  <div><strong className="text-slate-400">Telepon:</strong> {p.telepon}</div>
                  <div><strong className="text-slate-400">Total Visit:</strong> <span className="text-amber-400 font-bold">{p.totalKunjungan} Kali</span></div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className="flex-1 text-center py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                    ● STATUS LAPANGAN AKTIF
                  </span>
                  <button
                    onClick={() => handleInitiateDeletePetugas(p)}
                    className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 text-[10px] font-bold transition-all flex items-center justify-center shrink-0"
                    title="Hapus Petugas Lapangan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: REPORTS & PDF GENERATOR */}
      {activeTab === 'REPORTS' && (
        <div className="glass-panel p-5 space-y-4 border-amber-500/25">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" /> Rekapitulasi Laporan Hasil Kunjungan Lapangan
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Cetak dokumen resmi PDF Laporan Hasil Kunjungan Lapangan lengkap dengan bukti foto geotag & tanda tangan digital.
              </p>
            </div>

            <button
              onClick={handleExportCSV}
              className="btn btn-emerald font-bold"
            >
              <Download className="w-4 h-4" /> Download Rekap CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/90 text-slate-400 font-semibold border-b border-amber-500/20">
                  <th className="p-3">No. Kunjungan</th>
                  <th className="p-3">Tanggal & Check-In</th>
                  <th className="p-3">Lokasi Target</th>
                  <th className="p-3">Kondisi & Prioritas</th>
                  <th className="p-3">Foto & Tanda Tangan</th>
                  <th className="p-3 text-right">Cetak PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {kunjungans.map((k) => {
                  const r = rencanas.find((ren) => ren.id === k.rencanaId);
                  return (
                    <tr key={k.id} className="hover:bg-slate-800/50 transition-all">
                      <td className="p-3 font-mono font-bold text-amber-400">{k.nomorKunjungan}</td>
                      <td className="p-3">
                        <div>{k.tanggal}</div>
                        <div className="text-[11px] text-slate-400">⏱ {k.checkInTime} - {k.checkOutTime}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-white">{r?.lokasiNama || 'Lokasi Kunjungan'}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{r?.alamat}</div>
                      </td>
                      <td className="p-3">
                        <div>Kondisi: <strong className="text-white">{k.kondisiLokasi}</strong></div>
                        <div className="text-[11px] text-amber-400 font-semibold">Prioritas: {k.prioritas}</div>
                      </td>
                      <td className="p-3">
                        <div className="text-[11px] text-slate-300">
                          📷 {k.fotos ? k.fotos.length : 0} Foto • {k.tandaTangan ? '✍ Disetujui' : 'Belum Tanda Tangan'}
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => StorageService.generatePDFReport(k, r, petugasList)}
                          className="btn btn-primary text-xs py-1.5 font-extrabold inline-flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" /> Cetak PDF Laporan
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD RENCANA KUNJUNGAN */}
      {showAddRencanaModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-xl p-6 space-y-4 animate-fade-in border-amber-500/40">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {editingRencanaId ? <Edit3 className="w-5 h-5 text-amber-400" /> : <Calendar className="w-5 h-5 text-amber-400" />}
                {editingRencanaId ? 'Edit Detail Rencana Kunjungan' : 'Buat Rencana Kunjungan Lapangan Baru'}
              </h3>
              <button
                onClick={() => setShowAddRencanaModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRencana} className="space-y-3 text-xs">
              {editingRencanaId && (
                <div className="space-y-1 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/30">
                  <label className="text-amber-300 font-bold block">Status Rencana Kunjungan:</label>
                  <select
                    value={statusRencana}
                    onChange={(e) => setStatusRencana(e.target.value as any)}
                    className="w-full bg-slate-950 border border-amber-500/40 rounded-lg px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-500"
                  >
                    <option value="DIJADWALKAN">DIJADWALKAN</option>
                    <option value="PROSES">PROSES LAPANGAN</option>
                    <option value="SELESAI">SELESAI</option>
                    <option value="BATAL">BATAL</option>
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Nama Lokasi / Instansi Target *</label>
                <input
                  type="text"
                  required
                  placeholder="Mis. Kantor Pusat PT Solusi Utama"
                  value={lokasiNama}
                  onChange={(e) => setLokasiNama(e.target.value)}
                  className="w-full bg-slate-950 border border-amber-500/20 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Alamat Lengkap *</label>
                <input
                  type="text"
                  required
                  placeholder="Mis. Jl. Sudirman No. 45, Jakarta Selatan"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  className="w-full bg-slate-950 border border-amber-500/20 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Tanggal *</label>
                  <input
                    type="date"
                    required
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full bg-slate-950 border border-amber-500/20 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Jam Mulai</label>
                  <input
                    type="time"
                    value={jamMulai}
                    onChange={(e) => setJamMulai(e.target.value)}
                    className="w-full bg-slate-950 border border-amber-500/20 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Jam Selesai</label>
                  <input
                    type="time"
                    value={jamSelesai}
                    onChange={(e) => setJamSelesai(e.target.value)}
                    className="w-full bg-slate-950 border border-amber-500/20 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Agenda / Tujuan Kunjungan *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Mis. Monitoring & Verifikasi Fasilitas Lapangan..."
                  value={agenda}
                  onChange={(e) => setAgenda(e.target.value)}
                  className="w-full bg-slate-950 border border-amber-500/20 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Tugaskan Petugas Lapangan:</label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 bg-slate-950 rounded-lg border border-amber-500/20">
                  {petugasList.map((p) => {
                    const isSelected = selectedPetugasIds.includes(p.id);
                    return (
                      <label
                        key={p.id}
                        className={`flex items-center gap-2 p-1.5 rounded text-xs cursor-pointer border ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                            : 'border-slate-800 text-slate-400 hover:bg-slate-900'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPetugasIds((prev) => [...prev, p.id]);
                            } else {
                              setSelectedPetugasIds((prev) => prev.filter((id) => id !== p.id));
                            }
                          }}
                          className="accent-amber-500"
                        />
                        <span>{p.nama}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddRencanaModal(false)}
                  className="btn btn-secondary"
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-primary font-extrabold">
                  {editingRencanaId ? 'Simpan Perubahan' : 'Simpan & Jadwalkan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PETUGAS */}
      {showAddPetugasModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-6 space-y-4 animate-fade-in border-amber-500/40">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" /> Tambah Petugas Lapangan Baru
              </h3>
              <button
                onClick={() => setShowAddPetugasModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePetugas} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Nama Lengkap Petugas *</label>
                <input
                  type="text"
                  required
                  placeholder="Mis. Eko Prasetyo"
                  value={namaPetugas}
                  onChange={(e) => setNamaPetugas(e.target.value)}
                  className="w-full bg-slate-950 border border-amber-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">NIP / Nomor Identitas *</label>
                <input
                  type="text"
                  required
                  placeholder="Mis. 19980510 202201 1 005"
                  value={nipPetugas}
                  onChange={(e) => setNipPetugas(e.target.value)}
                  className="w-full bg-slate-950 border border-amber-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Jabatan Lapangan</label>
                <input
                  type="text"
                  value={jabatanPetugas}
                  onChange={(e) => setJabatanPetugas(e.target.value)}
                  className="w-full bg-slate-950 border border-amber-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Nomor Telepon / WhatsApp</label>
                <input
                  type="text"
                  value={teleponPetugas}
                  onChange={(e) => setTeleponPetugas(e.target.value)}
                  className="w-full bg-slate-950 border border-amber-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddPetugasModal(false)}
                  className="btn btn-secondary"
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-primary font-extrabold">
                  Simpan Petugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PROFIL PEGAWAI ADMIN LOGGED IN */}
      {showAdminProfileModal && currentAdmin && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-6 space-y-5 animate-fade-in border-amber-500/50 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" /> Profil Pejabat Administrator
              </span>
              <button
                onClick={() => setShowAdminProfileModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-center space-y-3">
              <div className="relative inline-block">
                <img
                  src={currentAdmin.fotoUrl}
                  alt={currentAdmin.nama}
                  className="w-24 h-24 rounded-full object-cover border-4 border-amber-400 shadow-xl mx-auto"
                />
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase absolute bottom-0 right-0 border-2 border-slate-950">
                  Sesi Aktif
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-white">{currentAdmin.nama}</h3>
                <p className="text-xs text-amber-400 font-semibold mt-0.5">{currentAdmin.jabatan}</p>
                <span className="inline-block text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded-md border border-slate-800 mt-1">
                  NIP: {currentAdmin.nip}
                </span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs bg-slate-950/80 p-4 rounded-2xl border border-amber-500/20">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                  <Building className="w-3.5 h-3.5 text-amber-400" /> Unit Kerja / Satker:
                </span>
                <span className="font-bold text-slate-200">{currentAdmin.unit}</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                  <Mail className="w-3.5 h-3.5 text-amber-400" /> Email Resmi:
                </span>
                <span className="font-bold text-amber-300 font-mono">{currentAdmin.email}</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                  <Phone className="w-3.5 h-3.5 text-amber-400" /> No. Telepon / WA:
                </span>
                <span className="font-bold text-slate-200">{currentAdmin.telepon}</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                  <Shield className="w-3.5 h-3.5 text-amber-400" /> Role & Hak Akses:
                </span>
                <span className="font-black text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                  {currentAdmin.role}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAdminProfileModal(false)}
                className="btn btn-secondary text-xs py-2 px-4 font-bold"
              >
                Tutup Profil
              </button>

              {onLogout && (
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminProfileModal(false);
                    if (confirm('Apakah Anda yakin ingin keluar dari sesi Admin?')) {
                      onLogout();
                    }
                  }}
                  className="btn bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs py-2 px-4 font-bold inline-flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" /> Keluar Sesi Admin
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: KONFIRMASI HAPUS PETUGAS */}
      {petugasToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0b0f19] border border-rose-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">Konfirmasi Hapus Petugas</h3>
              <p className="text-xs text-slate-400 mt-1">
                Apakah Anda yakin ingin menghapus data petugas berikut dari Master Data Inspeksi?
              </p>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-left space-y-1.5 text-xs">
              <div className="text-white font-bold text-sm">{petugasToDelete.nama}</div>
              <div className="text-amber-400 font-semibold">{petugasToDelete.jabatan}</div>
              <div className="text-slate-400 font-mono text-[11px]">NIP: {petugasToDelete.nip}</div>
              <div className="text-slate-400 text-[11px]">Unit: {petugasToDelete.unit}</div>
            </div>

            <p className="text-[11px] text-rose-400/90 font-medium">
              ⚠️ Tindakan ini akan secara permanen menghapus akses login & data profil petugas ini.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPetugasToDelete(null)}
                className="btn btn-secondary flex-1 py-2.5 text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeletePetugas}
                className="btn bg-rose-600 hover:bg-rose-700 text-white font-bold flex-1 py-2.5 text-xs shadow-lg shadow-rose-900/30"
              >
                Ya, Hapus Petugas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
