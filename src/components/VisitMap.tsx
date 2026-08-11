import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { RencanaKunjungan, Kunjungan } from '../types';

interface VisitMapProps {
  rencanas: RencanaKunjungan[];
  kunjungans: Kunjungan[];
  selectedRencanaId?: string;
  onSelectRencana?: (id: string) => void;
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
}

export const VisitMap: React.FC<VisitMapProps> = ({
  rencanas,
  kunjungans,
  selectedRencanaId,
  onSelectRencana,
  centerLat = -6.2088,
  centerLng = 106.8456,
  zoom = 11,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([centerLat, centerLng], zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([centerLat, centerLng], zoom);
    }

    const map = mapInstanceRef.current;
    map.invalidateSize();

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    // Add Markers for Each Rencana / Kunjungan
    rencanas.forEach((r) => {
      const isSelected = r.id === selectedRencanaId;
      const kunjungan = kunjungans.find((k) => k.rencanaId === r.id);

      let markerColor = '#3b82f6'; // blue
      if (r.status === 'SELESAI') markerColor = '#10b981'; // emerald
      if (r.status === 'PROSES') markerColor = '#f59e0b'; // amber

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background: ${markerColor};
            width: ${isSelected ? '26px' : '20px'};
            height: ${isSelected ? '26px' : '20px'};
            border-radius: 50%;
            border: 3px solid #fff;
            box-shadow: 0 0 12px ${markerColor};
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 10px;
            font-weight: bold;
          ">
            📍
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      const marker = L.marker([r.latitude, r.longitude], { icon: customIcon }).addTo(map);

      // Add GPS radius accuracy circle
      L.circle([r.latitude, r.longitude], {
        color: markerColor,
        fillColor: markerColor,
        fillOpacity: 0.15,
        radius: 300,
      }).addTo(map);

      const popupContent = `
        <div style="font-family: system-ui, sans-serif; font-size: 12px; min-width: 180px;">
          <div style="font-weight: bold; margin-bottom: 4px; color: #f8fafc;">${r.lokasiNama}</div>
          <div style="color: #94a3b8; margin-bottom: 6px;">${r.alamat}</div>
          <div style="display: inline-block; padding: 2px 8px; border-radius: 99px; font-size: 10px; font-weight: bold; background: ${markerColor}33; color: ${markerColor}; border: 1px solid ${markerColor};">
            STATUS: ${r.status}
          </div>
          ${kunjungan?.checkInTime ? `<div style="margin-top: 6px; color: #34d399; font-size: 11px;">⏱ Check-In: ${kunjungan.checkInTime}</div>` : ''}
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        if (onSelectRencana) onSelectRencana(r.id);
      });
    });
  }, [rencanas, kunjungans, selectedRencanaId, centerLat, centerLng, zoom, onSelectRencana]);

  return (
    <div className="w-full h-full min-h-[300px] relative rounded-xl overflow-hidden border border-slate-700/60 shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
