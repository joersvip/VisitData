import React, { useState } from 'react';
import { Shield, Lock, Mail, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { StorageService } from '../../services/storage';
import type { AdminUser } from '../../types';

interface AdminLoginProps {
  onLoginSuccess: (admin: AdminUser) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState('bratva@kejaksaan.go.id');
  const [password, setPassword] = useState('12345');
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
                <span className="text-[10px] text-amber-400/90 font-mono">bratva@kejaksaan.go.id</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="bratva@kejaksaan.go.id"
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
        </div>

        {/* Footer Info */}
        <p className="text-[11px] text-slate-500 text-center">
          Sistem Pengawasan Kejaksaan Agung Republik Indonesia © 2026
        </p>
      </div>
    </div>
  );
};
