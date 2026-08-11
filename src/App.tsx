import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MobileApp } from './components/mobile/MobileApp';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StorageService } from './services/storage';
import type { Petugas, RencanaKunjungan, Kunjungan, HistoriLog } from './types';
import confetti from 'canvas-confetti';

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'MOBILE' | 'ADMIN'>('MOBILE');
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // State data
  const [petugasList, setPetugasList] = useState<Petugas[]>([]);
  const [rencanas, setRencanas] = useState<RencanaKunjungan[]>([]);
  const [kunjungans, setKunjungans] = useState<Kunjungan[]>([]);
  const [logs, setLogs] = useState<HistoriLog[]>([]);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);

  const refreshAllData = () => {
    setPetugasList(StorageService.getPetugas());
    setRencanas(StorageService.getRencana());
    setKunjungans(StorageService.getKunjungan());
    setLogs(StorageService.getLogs());
    setPendingSyncCount(StorageService.getSyncQueue().length);
  };

  useEffect(() => {
    StorageService.initStorage();
    refreshAllData();
  }, []);

  const handleSync = () => {
    if (!isOnline) return;
    const syncedCount = StorageService.processSync();
    refreshAllData();
    if (syncedCount > 0) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.2 },
      });
      alert(`🎉 Berhasil mensinkronisasi ${syncedCount} data kunjungan ke cloud server!`);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Top Header Navigation */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        isOnline={isOnline}
        setIsOnline={setIsOnline}
        onSync={handleSync}
        pendingSyncCount={pendingSyncCount}
      />

      {/* Main View Container */}
      <main className="flex-1">
        {viewMode === 'MOBILE' ? (
          <MobileApp
            petugasList={petugasList}
            rencanas={rencanas}
            kunjungans={kunjungans}
            logs={logs}
            isOnline={isOnline}
            onRefreshData={refreshAllData}
          />
        ) : (
          <AdminDashboard
            petugasList={petugasList}
            rencanas={rencanas}
            kunjungans={kunjungans}
            logs={logs}
            onRefreshData={refreshAllData}
          />
        )}
      </main>

      {/* Footer Info */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-800/60 mt-auto">
        <p>VisitData Pro • Sistem Manajemen Kunjungan Lapangan End-to-End</p>
      </footer>
    </div>
  );
};

export default App;
