import React, { useState } from 'react';
import {
  Home,
  Calendar as CalendarIcon,
  FileText,
  Clock,
  MapPin,
  CheckCircle,
  Play,
  Share2,
  FileCheck,
  ChevronRight,
  BatteryCharging,
  Signal,
  Wifi,
  Filter,
  Award,
  Database,
  Building,
  Sparkles,
  Camera,
  PenTool,
} from 'lucide-react';
import type {
  Petugas,
  RencanaKunjungan,
  Kunjungan,
  HistoriLog,
  DokumentasiFoto,
  TandaTangan,
} from '../../types';
import { StorageService } from '../../services/storage';
import { SignaturePad } from '../SignaturePad';
import { GeotagCamera } from '../GeotagCamera';
import { VisitMap } from '../VisitMap';

interface MobileAppProps {
  petugasList: Petugas[];
  rencanas: RencanaKunjungan[];
  kunjungans: Kunjungan[];
  logs: HistoriLog[];
  isOnline: boolean;
  onRefreshData: () => void;
}

export const MobileApp: React.FC<MobileAppProps> = ({
  petugasList,
  rencanas,
  kunjungans,
  logs,
  isOnline,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'HOME' | 'CALENDAR' | 'FORM' | 'TIMELINE'>('HOME');
  const [activeRencanaId, setActiveRencanaId] = useState<string>(rencanas[0]?.id || '');
  const [historySubTab, setHistorySubTab] = useState<'LOGS' | 'LOCATIONS_DB'>('LOGS');

  // Execution Form States
  const [checkInDone, setCheckInDone] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string>('');
  const [kondisiLokasi, setKondisiLokasi] = useState('Baik');
  const [prioritas, setPrioritas] = useState<'RENDAH' | 'SEDANG' | 'TINGGI'>('SEDANG');
  const [temuan, setTemuan] = useState('');
  const [rekomendasi, setRekomendasi] = useState('');
  const [fotos, setFotos] = useState<DokumentasiFoto[]>([]);
  const [signature, setSignature] = useState<TandaTangan | undefined>(undefined);
  const [filterOfficerId, setFilterOfficerId] = useState<string>('ALL');

  const databaseLokasi = StorageService.getDatabaseLokasiDikunjungi();
  const selectedRencana = rencanas.find((r) => r.id === activeRencanaId) || rencanas[0];
  const activeOfficer: Petugas = petugasList[0] || {
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
  };

  // Current GPS coordinates
  const currentLat = selectedRencana?.latitude || -6.2088;
  const currentLng = selectedRencana?.longitude || 106.8456;

  const handleCheckIn = () => {
    const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    setCheckInTime(timeStr);
    setCheckInDone(true);

    StorageService.addLog({
      tipe: 'CHECKIN',
      userNama: activeOfficer.nama,
      lokasiNama: selectedRencana.lokasiNama,
      deskripsi: `Petugas Check-In GPS pada ${timeStr} di koordinat (${currentLat.toFixed(4)}, ${currentLng.toFixed(4)})`,
    });

    StorageService.updateRencanaStatus(selectedRencana.id, 'PROSES');
    onRefreshData();
  };

  const handleAddFoto = (foto: DokumentasiFoto) => {
    setFotos((prev) => [...prev, foto]);
    StorageService.addLog({
      tipe: 'FOTO',
      userNama: activeOfficer.nama,
      lokasiNama: selectedRencana.lokasiNama,
      deskripsi: `Menambahkan foto geotag '${foto.keterangan}'`,
    });
  };

  const handleSubmitVisit = () => {
    if (!checkInDone) return;

    const checkOutTimeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const newKunjungan: Kunjungan = {
      id: 'k-' + Date.now(),
      rencanaId: selectedRencana.id,
      nomorKunjungan: `KJ-2026-${String(kunjungans.length + 125).padStart(5, '0')}`,
      tanggal: new Date().toISOString().split('T')[0],
      checkInTime,
      checkOutTime: checkOutTimeStr,
      checkInLat: currentLat,
      checkInLng: currentLng,
      checkOutLat: currentLat,
      checkOutLng: currentLng,
      kondisiLokasi,
      temuan: temuan || 'Pemeriksaan lapangan telah selesai dilakukan dengan lancar.',
      rekomendasi: rekomendasi || 'Tindak lanjut pengawasan dilakukan pada jadwal berikutnya.',
      prioritas,
      fotos,
      tandaTangan: signature,
      status: 'SELESAI',
      synced: isOnline,
      createdAt: new Date().toISOString(),
    };

    if (!isOnline) {
      StorageService.addToSyncQueue({
        action: 'CREATE_KUNJUNGAN',
        payload: newKunjungan,
      });
    }

    StorageService.saveKunjungan(newKunjungan);
    StorageService.addLog({
      tipe: 'CHECKOUT',
      userNama: activeOfficer.nama,
      lokasiNama: selectedRencana.lokasiNama,
      deskripsi: `Check-Out kunjungan #${newKunjungan.nomorKunjungan} pada ${checkOutTimeStr}`,
    });

    onRefreshData();
    alert(`✅ Kunjungan ke ${selectedRencana.lokasiNama} Berhasil Disimpan & Selesai!`);

    // Reset Form
    setCheckInDone(false);
    setTemuan('');
    setRekomendasi('');
    setFotos([]);
    setSignature(undefined);
    setActiveTab('TIMELINE');
  };

  return (
    <div className="phone-simulator-container">
      <div className="phone-frame animate-fade-in">
        {/* Notch */}
        <div className="phone-notch">
          <div className="phone-camera-dot" />
          <div className="phone-speaker-bar" />
        </div>

        {/* Status Bar */}
        <div className="phone-status-bar">
          <span>09:41</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5 text-amber-400" />
            <Wifi className="w-3.5 h-3.5 text-amber-400" />
            <BatteryCharging className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Screen Scrollable Area */}
        <div className="phone-screen-content p-3.5 space-y-3.5">
          {/* Header Officer Card */}
          <div className="bg-slate-900/90 border border-amber-500/35 rounded-2xl p-3.5 flex items-center justify-between shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={activeOfficer.fotoUrl}
                  alt={activeOfficer.nama}
                  className="w-11 h-11 rounded-full object-cover border-2 border-amber-500 shadow-md"
                />
                <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900 absolute bottom-0 right-0" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1">
                  {activeOfficer.nama} <Award className="w-3.5 h-3.5 text-amber-400" />
                </h3>
                <p className="text-[10px] text-slate-400">{activeOfficer.jabatan} • {activeOfficer.unit}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-950 p-0.5 border border-amber-500/40 shadow-sm shrink-0">
                <img src="/logo.png" alt="Logo Kejaksaan RI" className="w-full h-full object-contain" />
              </div>
              <div className="text-right">
                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm">
                  KEJAKSAAN RI
                </span>
              </div>
            </div>
          </div>

          {/* TAB 1: HOME DASHBOARD */}
          {activeTab === 'HOME' && (
            <div className="space-y-3.5 animate-fade-in">
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-900/80 p-3 rounded-2xl border border-amber-500/30 text-center shadow-md">
                  <span className="text-[10px] text-amber-300 font-bold block mb-0.5">Total Jadwal</span>
                  <span className="text-lg font-extrabold text-amber-400">{rencanas.length}</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-2xl border border-emerald-500/30 text-center shadow-md">
                  <span className="text-[10px] text-emerald-300 font-bold block mb-0.5">Selesai</span>
                  <span className="text-lg font-extrabold text-emerald-400">{kunjungans.length}</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-2xl border border-yellow-500/30 text-center shadow-md">
                  <span className="text-[10px] text-yellow-300 font-bold block mb-0.5">Sites DB</span>
                  <span className="text-lg font-extrabold text-yellow-400">
                    {databaseLokasi.length}
                  </span>
                </div>
              </div>

              {/* Active / Next Visit Hero Card */}
              {selectedRencana && (
                <div className="bg-gradient-to-br from-amber-950/80 via-slate-900 to-slate-950 border border-amber-500/45 rounded-2xl p-4 shadow-xl relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/25 text-amber-300 border border-amber-400/40 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" /> TARGET LAPANGAN
                    </span>
                    <span className="text-[11px] text-slate-300 flex items-center gap-1 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {selectedRencana.jamMulai} - {selectedRencana.jamSelesai}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1">{selectedRencana.lokasiNama}</h3>
                  <p className="text-[11px] text-slate-300 mb-3 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{selectedRencana.alamat}</span>
                  </p>

                  {/* Agenda Bullet */}
                  <div className="bg-slate-950/85 p-3 rounded-xl border border-amber-500/20 mb-3.5 space-y-1 text-[11px]">
                    <span className="text-amber-400 font-bold block text-[10px] uppercase tracking-wider">AGENDA AUDIT LAPANGAN:</span>
                    <p className="text-slate-200 font-medium">{selectedRencana.agenda}</p>
                  </div>

                  {/* Direct Check-In Action Button */}
                  <button
                    onClick={() => {
                      setActiveRencanaId(selectedRencana.id);
                      setActiveTab('FORM');
                      if (!checkInDone) handleCheckIn();
                    }}
                    className="btn btn-primary w-full py-3 text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>{checkInDone ? 'Lanjutkan Form Lapangan' : 'Mulai Check-In GPS Lapangan'}</span>
                  </button>
                </div>
              )}

              {/* Interactive Mini Map */}
              <div className="bg-slate-900/90 rounded-2xl p-3 border border-amber-500/25 space-y-2 shadow-md">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 px-1">
                  <MapPin className="w-4 h-4 text-amber-400" /> Peta Lokasi Target Lapangan
                </span>
                <div className="h-44 rounded-xl overflow-hidden border border-amber-500/20">
                  <VisitMap rencanas={rencanas} kunjungans={kunjungans} selectedRencanaId={activeRencanaId} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CALENDAR & SCHEDULE */}
          {activeTab === 'CALENDAR' && (
            <div className="space-y-3.5 animate-fade-in">
              <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-amber-500/30 space-y-2.5 shadow-md">
                <div className="flex items-center justify-between text-xs font-bold text-white px-1">
                  <span className="flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4 text-amber-400" /> Kalender Kunjungan
                  </span>
                  <span className="text-[10px] text-amber-400 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30 font-bold">
                    Agustus 2026
                  </span>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 py-1.5 border-y border-slate-800">
                  <span>SN</span><span>SL</span><span>RB</span><span>KM</span><span>JM</span><span>SB</span><span>MG</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {Array.from({ length: 31 }).map((_, i) => {
                    const day = i + 1;
                    const isToday = day === 11;
                    const hasVisit = day === 11 || day === 12;
                    return (
                      <div
                        key={day}
                        className={`py-1.5 rounded-lg font-medium transition-all ${isToday
                            ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md shadow-amber-500/40'
                            : hasVisit
                              ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                              : 'text-slate-400 hover:bg-slate-800'
                          }`}
                      >
                        {day}
                        {hasVisit && <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mx-auto mt-0.5" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* List of Planned Visits */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-300 px-1 block">Daftar Rencana Kunjungan:</span>
                {rencanas.map((r) => {
                  const isSelected = r.id === activeRencanaId;
                  return (
                    <div
                      key={r.id}
                      onClick={() => setActiveRencanaId(r.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${isSelected
                          ? 'bg-amber-950/40 border-amber-500 shadow-md shadow-amber-500/20'
                          : 'bg-slate-900/80 border-slate-800 hover:bg-slate-800'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-bold text-amber-400">{r.nomorRencana}</span>
                        <span
                          className={`badge ${r.status === 'SELESAI'
                              ? 'badge-selesai'
                              : r.status === 'PROSES'
                                ? 'badge-proses'
                                : 'badge-dijadwalkan'
                            }`}
                        >
                          {r.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white mb-1">{r.lokasiNama}</h4>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mb-2">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {r.tanggal} ({r.jamMulai} - {r.jamSelesai})
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800 pt-2">
                        <span>Tim: {r.petugasIds?.length || 0} Petugas</span>
                        <span className="text-amber-400 font-bold flex items-center gap-0.5">
                          Pilih Target <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: FIELD FORM */}
          {activeTab === 'FORM' && (
            <div className="space-y-3.5 animate-fade-in">
              {/* Step Flow Progress Bar */}
              <div className="bg-slate-900/90 p-2.5 rounded-2xl border border-amber-500/30 flex items-center justify-between text-[10px] text-slate-300 font-bold">
                <span className={`px-2 py-1 rounded-lg ${checkInDone ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500 text-slate-950'}`}>
                  1. Check-In GPS
                </span>
                <span>➔</span>
                <span className={`px-2 py-1 rounded-lg ${fotos.length > 0 ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'}`}>
                  2. Geotag Foto
                </span>
                <span>➔</span>
                <span className={`px-2 py-1 rounded-lg ${signature ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'}`}>
                  3. Tanda Tangan
                </span>
              </div>

              <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-amber-500/30 space-y-2">
                <span className="text-[10px] font-mono font-bold text-amber-400 block">
                  KUNJUNGAN: {selectedRencana?.nomorRencana || 'RC-2026-0801'}
                </span>
                <h3 className="text-xs font-bold text-white">{selectedRencana?.lokasiNama}</h3>

                {/* GPS Status Card */}
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-amber-500/20 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <MapPin className="w-4 h-4" />
                    <span>GPS Active ({currentLat.toFixed(4)}, {currentLng.toFixed(4)})</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Akurasi ~3m</span>
                </div>
              </div>

              {/* Step 1: Check-In Button */}
              {!checkInDone ? (
                <div className="bg-gradient-to-br from-amber-950/70 via-slate-900 to-slate-950 p-4.5 rounded-2xl border border-amber-500/40 text-center space-y-3.5 shadow-lg">
                  <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center border border-amber-500/40 shadow-inner">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-white">Anda Belum Check-In di Lokasi Target</h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Tekan tombol di bawah untuk mencatat koordinat GPS & timestamp waktu kedatangan Anda.
                    </p>
                  </div>
                  <button
                    onClick={handleCheckIn}
                    className="btn btn-primary w-full py-3 text-xs font-extrabold flex items-center justify-center gap-2 shadow-xl"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Check-In GPS Sekarang</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {/* Check-In Success Indicator */}
                  <div className="bg-emerald-500/10 border border-emerald-500/35 p-3 rounded-2xl flex items-center justify-between text-xs text-emerald-300 font-semibold shadow-sm">
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Check-In Terdaftar
                    </span>
                    <span className="font-mono text-[11px] text-amber-400 font-bold">{checkInTime} WIB</span>
                  </div>

                  {/* Form Inputs */}
                  <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-amber-500/25 space-y-3 shadow-md">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300">Kondisi Lokasi Kunjungan:</label>
                      <select
                        value={kondisiLokasi}
                        onChange={(e) => setKondisiLokasi(e.target.value)}
                        className="w-full bg-slate-950 border border-amber-500/25 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="Baik">Sangat Baik / Sesuai Standar</option>
                        <option value="Cukup">Cukup / Ada Catatan Ringan</option>
                        <option value="Tidak Baik">Tidak Baik / Perlu Penanganan Kritis</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300">Tingkat Prioritas Lapangan:</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['RENDAH', 'SEDANG', 'TINGGI'] as const).map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setPrioritas(p)}
                            className={`py-2 rounded-xl text-xs font-extrabold transition-all border ${prioritas === p
                                ? p === 'TINGGI'
                                  ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/30'
                                  : p === 'SEDANG'
                                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                                    : 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-500/30'
                                : 'bg-slate-950 text-slate-400 border-slate-800'
                              }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300">Hasil Pembicaraan & Temuan Lapangan:</label>
                      <textarea
                        rows={3}
                        placeholder="Tuliskan temuan fisik, kondisi perangkat, atau hasil diskusi..."
                        value={temuan}
                        onChange={(e) => setTemuan(e.target.value)}
                        className="w-full bg-slate-950 border border-amber-500/25 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300">Rekomendasi Tindak Lanjut:</label>
                      <textarea
                        rows={2}
                        placeholder="Langkah perbaikan atau kunjungan balasan berikutnya..."
                        value={rekomendasi}
                        onChange={(e) => setRekomendasi(e.target.value)}
                        className="w-full bg-slate-950 border border-amber-500/25 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Component 1: Camera Geotag */}
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 px-1">
                      <Camera className="w-4 h-4 text-amber-400" /> Geotag Kamera Dokumen
                    </span>
                    <GeotagCamera
                      onAddFoto={handleAddFoto}
                      currentLat={currentLat}
                      currentLng={currentLng}
                      alamatLokasi={selectedRencana.alamat}
                    />
                  </div>

                  {/* Fotos Badge */}
                  {fotos.length > 0 && (
                    <div className="p-2.5 bg-slate-900/90 rounded-2xl border border-amber-500/25 flex items-center justify-between text-xs text-slate-300 shadow-sm">
                      <span>Dokumentasi Foto Tersimpan:</span>
                      <span className="font-extrabold text-amber-400">{fotos.length} Foto Geotag</span>
                    </div>
                  )}

                  {/* Component 2: Digital Signature */}
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 px-1">
                      <PenTool className="w-4 h-4 text-amber-400" /> Tanda Tangan Digital Pihak Lapangan
                    </span>
                    <SignaturePad
                      onSave={(sig) => {
                        setSignature(sig);
                        alert('✅ Tanda Tangan Digital Pihak Lapangan Berhasil Disimpan!');
                      }}
                      initialSignature={signature}
                    />
                  </div>

                  {/* Step 5: Check-Out & Finish Button */}
                  <button
                    onClick={handleSubmitVisit}
                    className="btn btn-primary w-full py-3.5 text-xs font-extrabold flex items-center justify-center gap-2 shadow-xl"
                  >
                    <FileCheck className="w-4 h-4 fill-slate-950" />
                    <span>Selesaikan & Check-Out Kunjungan</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: TIMELINE & HISTORI / DATABASE LOKASI */}
          {activeTab === 'TIMELINE' && (
            <div className="space-y-3.5 animate-fade-in">
              {/* Sub-tab Switcher: Log Audit vs Database Lokasi */}
              <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-amber-500/25">
                <button
                  onClick={() => setHistorySubTab('LOGS')}
                  className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all ${historySubTab === 'LOGS'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                    }`}
                >
                  Log Kunjungan Selesai
                </button>
                <button
                  onClick={() => setHistorySubTab('LOCATIONS_DB')}
                  className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${historySubTab === 'LOCATIONS_DB'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                    }`}
                >
                  <Database className="w-3.5 h-3.5" /> DB Lokasi Dikunjungi
                </button>
              </div>

              {historySubTab === 'LOGS' ? (
                <>
                  {/* Filter Officer */}
                  <div className="bg-slate-900/90 p-3 rounded-2xl border border-amber-500/25 flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Filter className="w-3.5 h-3.5 text-amber-400" /> Filter Officer:
                    </span>
                    <select
                      value={filterOfficerId}
                      onChange={(e) => setFilterOfficerId(e.target.value)}
                      className="bg-slate-950 border border-amber-500/20 rounded-xl px-3 py-1 text-[11px] text-white focus:outline-none"
                    >
                      <option value="ALL">Semua Petugas</option>
                      {petugasList.map((p) => (
                        <option key={p.id} value={p.id}>{p.nama}</option>
                      ))}
                    </select>
                  </div>

                  {/* Completed Visits Cards */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold text-slate-300 px-1 block">Kunjungan Selesai:</span>
                    {kunjungans.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500 bg-slate-900/50 rounded-2xl border border-slate-800">
                        Belum ada kunjungan selesai terdaftar.
                      </div>
                    ) : (
                      kunjungans.map((k) => {
                        const r = rencanas.find((ren) => ren.id === k.rencanaId);
                        return (
                          <div
                            key={k.id}
                            className="bg-slate-900/90 rounded-2xl p-3.5 border border-amber-500/25 space-y-2.5 shadow-md"
                          >
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-mono font-bold text-amber-400">{k.nomorKunjungan}</span>
                              <span className="badge badge-selesai">SELESAI</span>
                            </div>

                            <h4 className="text-xs font-bold text-white">{r?.lokasiNama || 'Kunjungan Lapangan'}</h4>
                            <p className="text-[10px] text-slate-400">
                              ⏱ {k.checkInTime} - {k.checkOutTime} • Prioritas: <strong className="text-amber-400">{k.prioritas}</strong>
                            </p>

                            <div className="bg-slate-950/80 p-2.5 rounded-xl text-[11px] text-slate-300 border border-slate-800">
                              <span className="text-amber-400 font-bold block text-[10px]">Temuan:</span>
                              <p>{k.temuan}</p>
                            </div>

                            <button
                              onClick={() => StorageService.generatePDFReport(k, r, petugasList)}
                              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-amber-500/30 transition-all shadow-sm"
                            >
                              <Share2 className="w-3.5 h-3.5" /> Unduh Laporan PDF Resmi
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Activity Audit Trail */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-slate-300 px-1 block">Audit Log Pergerakan:</span>
                    <div className="space-y-2">
                      {logs.slice(0, 5).map((log) => (
                        <div
                          key={log.id}
                          className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] space-y-1"
                        >
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span className="font-bold text-amber-400">{log.userNama}</span>
                            <span>{log.timestamp}</span>
                          </div>
                          <p className="text-slate-200">{log.deskripsi}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                /* DATABASE LOKASI PERNAH DIKUNJUNGI (MOBILE VIEW) */
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-amber-400 px-1 block">Master Database Lokasi Dikunjungi:</span>
                  {databaseLokasi.map((loc, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/90 rounded-2xl p-3.5 border border-amber-500/30 space-y-2 shadow-md"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-white flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-amber-400" /> {loc.lokasiNama}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/40">
                          {loc.totalVisits} Visit
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">{loc.alamat}</p>
                      <div className="bg-slate-950/80 p-2.5 rounded-xl text-[10px] flex items-center justify-between border border-slate-800">
                        <span className="text-slate-400">Terakhir Dikunjungi:</span>
                        <span className="font-bold text-amber-400">{loc.lastVisitDate} ({loc.lastKondisi})</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Bar (Bottom Tabs) */}
        <div className="phone-nav-bar">
          <button
            onClick={() => setActiveTab('HOME')}
            className={`phone-nav-btn ${activeTab === 'HOME' ? 'active' : ''}`}
          >
            <Home className="w-4 h-4" />
            <span>Beranda</span>
          </button>

          <button
            onClick={() => setActiveTab('CALENDAR')}
            className={`phone-nav-btn ${activeTab === 'CALENDAR' ? 'active' : ''}`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Jadwal</span>
          </button>

          <button
            onClick={() => setActiveTab('FORM')}
            className={`phone-nav-btn ${activeTab === 'FORM' ? 'active' : ''}`}
          >
            <FileText className="w-4 h-4" />
            <span>Form Field</span>
          </button>

          <button
            onClick={() => setActiveTab('TIMELINE')}
            className={`phone-nav-btn ${activeTab === 'TIMELINE' ? 'active' : ''}`}
          >
            <Clock className="w-4 h-4" />
            <span>Histori & DB</span>
          </button>
        </div>
      </div>
    </div>
  );
};
