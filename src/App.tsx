import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { MobileApp } from './components/mobile/MobileApp';
import { MobileLogin } from './components/mobile/MobileLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLogin } from './components/admin/AdminLogin';
import { StorageService } from './services/storage';
import type { Petugas, RencanaKunjungan, Kunjungan, HistoriLog, AdminUser } from './types';

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
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [currentOfficer, setCurrentOfficer] = useState<Petugas | null>(null);

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
    setCurrentAdmin(StorageService.getAdminSession());
    setCurrentOfficer(StorageService.getOfficerSession());
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

  const handleAdminLogout = () => {
    StorageService.clearAdminSession();
    setCurrentAdmin(null);
  };

  const handleOfficerLogout = () => {
    StorageService.clearOfficerSession();
    setCurrentOfficer(null);
  };

  return (
    <div
      className={`bg-[#090d16] text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white ${
        viewMode === 'MOBILE' ? 'h-screen max-h-screen overflow-hidden' : 'min-h-screen'
      }`}
    >
      {/* Main View Container */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {viewMode === 'MOBILE' ? (
          !currentOfficer ? (
            <MobileLogin
              petugasList={petugasList}
              onLoginSuccess={(officer) => setCurrentOfficer(officer)}
            />
          ) : (
            <MobileApp
              petugasList={petugasList}
              rencanas={rencanas}
              kunjungans={kunjungans}
              logs={logs}
              isOnline={true}
              currentOfficer={currentOfficer}
              onLogout={handleOfficerLogout}
              onSelectOfficer={(officer) => setCurrentOfficer(officer)}
              onRefreshData={refreshAllData}
            />
          )
        ) : !currentAdmin ? (
          <AdminLogin onLoginSuccess={(admin) => setCurrentAdmin(admin)} />
        ) : (
          <AdminDashboard
            petugasList={petugasList}
            rencanas={rencanas}
            kunjungans={kunjungans}
            logs={logs}
            currentAdmin={currentAdmin}
            onLogout={handleAdminLogout}
            onRefreshData={refreshAllData}
          />
        )}
      </main>

      {/* Footer Info (Only shown on Admin Web Dashboard view when logged in) */}
      {viewMode === 'ADMIN' && currentAdmin && (
        <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-800/60 mt-auto">
          <p>VisitData Pro • Sistem Manajemen Kunjungan Lapangan Kejaksaan RI</p>
        </footer>
      )}
    </div>
  );
};

export default App;
