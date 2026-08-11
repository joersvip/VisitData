import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { MobileApp } from './components/mobile/MobileApp';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StorageService } from './services/storage';
import type { Petugas, RencanaKunjungan, Kunjungan, HistoriLog } from './types';

const getInitialViewMode = (): 'MOBILE' | 'ADMIN' => {
  const path = window.location.pathname.toLowerCase();
  const search = window.location.search.toLowerCase();
  const hash = window.location.hash.toLowerCase();

  if (path.includes('/mobile') || search.includes('mode=mobile') || hash === '#mobile') {
    return 'MOBILE';
  }
  if (path.includes('/admin') || search.includes('mode=admin') || hash === '#admin') {
    return 'ADMIN';
  }

  if (Capacitor.isNativePlatform()) {
    return 'MOBILE';
  }
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  const isSmallScreen = window.innerWidth < 768;
  return isMobileUA || isSmallScreen ? 'MOBILE' : 'ADMIN';
};

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'MOBILE' | 'ADMIN'>(getInitialViewMode);

  // State data
  const [petugasList, setPetugasList] = useState<Petugas[]>([]);
  const [rencanas, setRencanas] = useState<RencanaKunjungan[]>([]);
  const [kunjungans, setKunjungans] = useState<Kunjungan[]>([]);
  const [logs, setLogs] = useState<HistoriLog[]>([]);

  const refreshAllData = () => {
    setPetugasList(StorageService.getPetugas());
    setRencanas(StorageService.getRencana());
    setKunjungans(StorageService.getKunjungan());
    setLogs(StorageService.getLogs());
  };

  useEffect(() => {
    StorageService.initStorage();
    refreshAllData();

    const handlePopState = () => {
      setViewMode(getInitialViewMode());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Main View Container */}
      <main className="flex-1 flex flex-col">
        {viewMode === 'MOBILE' ? (
          <MobileApp
            petugasList={petugasList}
            rencanas={rencanas}
            kunjungans={kunjungans}
            logs={logs}
            isOnline={true}
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

      {/* Footer Info (Only shown on Admin Web Dashboard view) */}
      {viewMode === 'ADMIN' && (
        <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-800/60 mt-auto">
          <p>VisitData Pro • Sistem Manajemen Kunjungan Lapangan Kejaksaan RI</p>
        </footer>
      )}
    </div>
  );
};

export default App;
