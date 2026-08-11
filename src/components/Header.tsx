import React from 'react';
import { Smartphone, Monitor, Wifi, WifiOff, RefreshCw, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  viewMode: 'MOBILE' | 'ADMIN';
  setViewMode: (mode: 'MOBILE' | 'ADMIN') => void;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  onSync: () => void;
  pendingSyncCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  setViewMode,
  isOnline,
  setIsOnline,
  onSync,
  pendingSyncCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0b0f19]/90 backdrop-blur-md border-b border-amber-500/20 px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/30 border border-amber-300/40">
            <ShieldAlert className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-white">VisitData Pro</h1>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                GOLD EDITION v2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Sistem Field Visit Management & Reporting Lapangan
            </p>
          </div>
        </div>

        {/* Center: Dual View Switcher */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-amber-500/25">
          <button
            onClick={() => setViewMode('MOBILE')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'MOBILE'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android App</span>
          </button>
          <button
            onClick={() => setViewMode('ADMIN')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'ADMIN'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Web Dashboard</span>
          </button>
        </div>

        {/* Right Controls: Network Toggle & Sync Button */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              isOnline
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse'
            }`}
            title="Klik untuk simulasi Mode Online/Offline"
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Online Sync</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Offline Mode</span>
              </>
            )}
          </button>

          {/* Sync Queue Button */}
          <button
            onClick={onSync}
            disabled={!isOnline || pendingSyncCount === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              pendingSyncCount > 0
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30 animate-bounce'
                : 'bg-slate-800/80 text-slate-400 border-slate-700/80 opacity-70 cursor-not-allowed'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${pendingSyncCount > 0 ? 'animate-spin' : ''}`} />
            <span>Sync ({pendingSyncCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
