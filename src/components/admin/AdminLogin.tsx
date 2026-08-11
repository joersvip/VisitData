import React, { useState } from 'react';
import { Shield, Lock, Mail, Eye, EyeOff, LogIn, UserCheck, AlertCircle } from 'lucide-react';
import { StorageService, SEED_ADMINS } from '../../services/storage';
import type { AdminUser } from '../../types';

interface AdminLoginProps {
  onLoginSuccess: (admin: AdminUser) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState('admin.jaksa@kejaksaan.go.id');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const loggedInAdmin = StorageService.loginAdmin(identifier, password);
      setIsLoading(false);

      if (loggedInAdmin) {
        onLoginSuccess(loggedInAdmin);
      } else {
        setErrorMsg('Email/NIP atau kata sandi tidak valid. Silakan coba lagi.');
      }
    }, 400);
  };

  const handleQuickLogin = (admin: AdminUser) => {
    setIdentifier(admin.email);
    setPassword('admin123');
    StorageService.setAdminSession(admin);
    onLoginSuccess(admin);
  };

  return (
    <div className="min-h-screen bg-[#070a12] flex items-center justify-center p-4 relative overflow-hidden selection:bg-amber-500 selection:text-black">
      {/* Subtle Ambient Background Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10 animate-fade-in">
        {/* Header Institution Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-slate-950 border border-amber-500/40 shadow-2xl shadow-amber-500/20">
            <img src="/logo.png" alt="Kejaksaan RI" className="w-16 h-16 object-contain" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-extrabold tracking-wider uppercase mb-1">
              <Shield className="w-3.5 h-3.5" /> Portal Autentikasi Kejaksaan RI
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">VisitData Pro Admin</h1>
            <p className="text-xs text-slate-400 mt-1">
              Sistem Pengawasan Inspeksi & Manajemen Kunjungan Lapangan
            </p>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="glass-panel p-6 sm:p-8 space-y-5 border-amber-500/30 shadow-2xl backdrop-blur-xl">
          <div className="border-b border-amber-500/20 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <LogIn className="w-4 h-4 text-amber-400" /> Masuk Sebagai Administrator
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Gunakan email kedinasan atau NIP resmi Anda
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-300 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold flex items-center justify-between">
                <span>Email Kedinasan / NIP</span>
                <span className="text-[10px] text-slate-500">Official Kejaksaan</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="admin.jaksa@kejaksaan.go.id"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-slate-950/90 border border-amber-500/30 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold">Kata Sandi</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/90 border border-amber-500/30 rounded-xl pl-9 pr-10 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-all"
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
              className="btn btn-primary w-full py-3 text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" /> Masuk Ke Dashboard Admin
                </>
              )}
            </button>
          </form>

          {/* Demo Login Quick Selector */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <span className="text-[11px] font-bold text-amber-400/90 uppercase tracking-wider block">
              ⚡ Demo Access (1-Click Login):
            </span>
            <div className="space-y-2">
              {SEED_ADMINS.map((adm) => (
                <button
                  key={adm.id}
                  type="button"
                  onClick={() => handleQuickLogin(adm)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-amber-500/20 hover:border-amber-500/60 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={adm.fotoUrl}
                      alt={adm.nama}
                      className="w-8 h-8 rounded-full object-cover border border-amber-400"
                    />
                    <div>
                      <div className="font-bold text-white text-xs group-hover:text-amber-300 transition-colors">
                        {adm.nama}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                        {adm.jabatan}
                      </div>
                    </div>
                  </div>
                  <UserCheck className="w-4 h-4 text-amber-400 shrink-0 opacity-80 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <p className="text-[11px] text-slate-500 text-center">
          Sistem Pengawasan Kejaksaan Agung Republik Indonesia © 2026
        </p>
      </div>
    </div>
  );
};
