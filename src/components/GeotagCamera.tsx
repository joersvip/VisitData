import React, { useState } from 'react';
import { Camera, MapPin, Clock, Upload, Check } from 'lucide-react';
import type { DokumentasiFoto } from '../types';

interface GeotagCameraProps {
  onAddFoto: (foto: DokumentasiFoto) => void;
  currentLat: number;
  currentLng: number;
  alamatLokasi: string;
}

const SAMPLE_PHOTO_PRESETS = [
  {
    name: 'Pemeriksaan Panel Listrik Utama',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Kondisi Bangunan & Struktur Gedung',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Survey Lapangan & Aset Inventaris',
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600',
  },
];

export const GeotagCamera: React.FC<GeotagCameraProps> = ({
  onAddFoto,
  currentLat,
  currentLng,
  alamatLokasi,
}) => {
  const [selectedSample, setSelectedSample] = useState(SAMPLE_PHOTO_PRESETS[0].url);
  const [keterangan, setKeterangan] = useState(SAMPLE_PHOTO_PRESETS[0].name);

  const handleCapture = () => {
    const now = new Date();
    const timestamp =
      now.getFullYear() +
      '-' +
      String(now.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(now.getDate()).padStart(2, '0') +
      ' ' +
      String(now.getHours()).padStart(2, '0') +
      ':' +
      String(now.getMinutes()).padStart(2, '0') +
      ':' +
      String(now.getSeconds()).padStart(2, '0');

    const newFoto: DokumentasiFoto = {
      id: 'f-' + Date.now(),
      url: selectedSample,
      timestamp,
      latitude: currentLat,
      longitude: currentLng,
      alamat: alamatLokasi || 'Jl. Kunjungan Lapangan',
      keterangan: keterangan || 'Foto Dokumentasi Kunjungan Lapangan',
    };

    onAddFoto(newFoto);
  };

  return (
    <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Camera className="w-4 h-4 text-emerald-400" />
          Kamera Geotag & Dokumentasi Foto
        </label>
        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          GPS Auto-Overlay
        </span>
      </div>

      {/* Preset Photo Selector */}
      <div className="space-y-1.5">
        <span className="text-[11px] text-slate-400">Pilih Preset Kamera Foto Lapangan:</span>
        <div className="grid grid-cols-3 gap-2">
          {SAMPLE_PHOTO_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSelectedSample(preset.url);
                setKeterangan(preset.name);
              }}
              className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                selectedSample === preset.url
                  ? 'border-emerald-500 shadow-md shadow-emerald-500/30'
                  : 'border-slate-700 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
              {selectedSample === preset.url && (
                <div className="absolute top-1 right-1 bg-emerald-500 rounded-full p-0.5 text-white">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Preview with Geotag Overlay */}
      <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-900 group">
        <img src={selectedSample} alt="Preview" className="w-full h-44 object-cover" />
        
        {/* Geotag Overlay Watermark */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-2.5 text-[10px] text-slate-200 space-y-0.5">
          <div className="flex items-center gap-1 font-semibold text-emerald-400">
            <MapPin className="w-3 h-3" />
            <span>GPS: {currentLat.toFixed(5)}, {currentLng.toFixed(5)}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-300 truncate">
            <Clock className="w-3 h-3 text-blue-400" />
            <span>{new Date().toLocaleString('id-ID')} • {alamatLokasi}</span>
          </div>
        </div>
      </div>

      <input
        type="text"
        placeholder="Keterangan foto (mis. Panel Listrik Utama Gedung A)"
        value={keterangan}
        onChange={(e) => setKeterangan(e.target.value)}
        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
      />

      <button
        type="button"
        onClick={handleCapture}
        className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/25 hover:from-emerald-500 hover:to-teal-500 transition-all"
      >
        <Upload className="w-4 h-4" /> Simpan Foto Geotag Ke Laporan
      </button>
    </div>
  );
};
