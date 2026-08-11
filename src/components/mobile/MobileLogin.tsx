import React, { useState } from 'react';
import { Shield, Lock, Mail, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { StorageService } from '../../services/storage';
import type { Petugas } from '../../types';

interface MobileLoginProps {
  petugasList: Petugas[];
  onLoginSuccess: (officer: Petugas) => void;
}

export const MobileLogin: React.FC<MobileLoginProps> = ({ petugasList, onLoginSuccess }) => {
  const defaultPetugas = petugasList[0] || {
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

  const [identifier, setIdentifier] = useState(defaultPetugas.email);
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const officer = StorageService.loginOfficer(identifier, password);
      setIsLoading(false);

      if (officer) {
        onLoginSuccess(officer);
      } else {
        setErrorMsg('Email/NIP atau PIN tidak valid. Coba lagi.');
      }
    }, 400);
  };

  return (
    <div className="h-screen bg-[#070a12] flex flex-col justify-between p-5 relative overflow-hidden selection:bg-amber-500 selection:text-black">
      {/* Ambient background */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Branding */}
      <div className="space-y-4 pt-6 text-center z-10">
        <div className="inline-flex p-3 rounded-2xl bg-slate-950 border border-amber-500/40 shadow-2xl shadow-amber-500/20">
          <img src="/logo.png" alt="Kejaksaan RI" className="w-14 h-14 object-contain" />
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-wider mb-1">
            <Shield className="w-3 h-3 text-amber-400" /> Presensi & Inspeksi Lapangan
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">VisitData Mobile</h1>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Kejaksaan Republik Indonesia
          </p>
        </div>
      </div>

      {/* Form Area */}
      <div className="glass-panel p-5 space-y-4 border-amber-500/30 shadow-2xl backdrop-blur-xl z-10 my-auto">
        <div className="border-b border-amber-500/20 pb-2">
          <h2 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
            <LogIn className="w-4 h-4 text-amber-400" /> Login Petugas Lapangan
          </h2>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-[11px] text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="text-slate-300 font-bold text-[11px]">Email Kedinasan / NIP</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-amber-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                placeholder="petugas@kejaksaan.go.id"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-slate-950/90 border border-amber-500/30 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold text-[11px]">PIN / Kata Sandi</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-amber-400 absolute left-3 top-2.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/90 border border-amber-500/30 rounded-xl pl-9 pr-10 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-amber-400"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full py-2.5 text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 mt-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" /> Masuk Akun Petugas
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer Info */}
      <p className="text-[10px] text-slate-500 text-center pb-2 z-10">
        VisitData Mobile • Pembinaan Kejaksaan RI © 2026
      </p>
    </div>
  );
};
