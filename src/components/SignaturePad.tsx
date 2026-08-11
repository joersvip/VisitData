import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Check, PenTool } from 'lucide-react';
import type { TandaTangan } from '../types';

interface SignaturePadProps {
  onSave: (signature: TandaTangan) => void;
  initialSignature?: TandaTangan;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, initialSignature }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const [namaPihak, setNamaPihak] = useState(initialSignature?.namaPihak || '');
  const [jabatanPihak, setJabatanPihak] = useState(initialSignature?.jabatanPihak || '');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (initialSignature?.signatureDataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        setHasContent(true);
      };
      img.src = initialSignature.signatureDataUrl;
    }
  }, [initialSignature]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.beginPath();
    ctx.moveTo((clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.lineTo((clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY);
    ctx.stroke();
    setHasContent(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasContent(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasContent || !namaPihak) return;

    const signatureDataUrl = canvas.toDataURL('image/png');
    const signature: TandaTangan = {
      namaPihak,
      jabatanPihak: jabatanPihak || 'Pihak Terkait',
      signatureDataUrl,
      timestamp: new Date().toLocaleString('id-ID'),
    };
    onSave(signature);
  };

  return (
    <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <PenTool className="w-4 h-4 text-blue-400" />
          Tanda Tangan Digital Pihak Terkait
        </label>
        {hasContent && (
          <button
            type="button"
            onClick={clearCanvas}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
          >
            <Eraser className="w-3.5 h-3.5" /> Bersihkan
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="Nama Pihak Yang Ditemui *"
          value={namaPihak}
          onChange={(e) => setNamaPihak(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          placeholder="Jabatan Pihak (mis. Manager / SPV)"
          value={jabatanPihak}
          onChange={(e) => setJabatanPihak(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="relative bg-slate-950 rounded-lg border border-dashed border-slate-700 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={360}
          height={140}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-36 touch-none cursor-crosshair"
        />
        {!hasContent && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs text-slate-600">
            Goreskan tanda tangan di sini
          </div>
        )}
      </div>

      <button
        type="button"
        disabled={!hasContent || !namaPihak}
        onClick={handleSave}
        className={`w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
          hasContent && namaPihak
            ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-500/25'
            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
        }`}
      >
        <Check className="w-4 h-4" /> Simpan Tanda Tangan Digital
      </button>
    </div>
  );
};
