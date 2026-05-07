/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Coordinates } from '../context/SimulationContext';
import { useEffect } from 'react';
import { useTheme } from '../context/UIContext';

let DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons
const createAmbulanceIcon = (isDark: boolean) => L.divIcon({
  className: 'custom-icon',
  html: `<div class="bg-emerald-500 p-2 rounded-xl border ${isDark ? 'border-white/20' : 'border-slate-900/10'} shadow-2xl emerald-glow scale-110"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ambulance"><path d="M10 10l-2 2 2 2m4-4l2 2-2 2"/><rect width="16" height="10" x="2" y="4" rx="2"/><path d="M7 18h0.01"/><path d="M17 18h0.01"/><path d="M21 14h-4v4h4v-4z"/><path d="M2 10h4"/></svg></div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const createHospitalIcon = (isDark: boolean) => L.divIcon({
  className: 'custom-icon',
  html: `<div class="${isDark ? 'bg-slate-800' : 'bg-white'} p-2 rounded-xl border ${isDark ? 'border-white/20' : 'border-slate-200'} shadow-2xl"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hospital"><path d="M12 6v4"/><path d="M14 14h-4"/><path d="M14 18h-4"/><path d="M14 8h-4"/><path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2"/><path d="M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18"/></svg></div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const createPatientIcon = (isDark: boolean) => L.divIcon({
  className: 'custom-icon',
  html: `<div class="bg-amber-500 p-2 rounded-xl border ${isDark ? 'border-white/20' : 'border-slate-900/10'} shadow-2xl"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

interface EmergencyMapProps {
  center?: Coordinates;
  zoom?: number;
  markers?: Array<{
    id: string;
    coords: Coordinates;
    type: 'ambulance' | 'hospital' | 'patient';
    label: string;
  }>;
  route?: Coordinates[];
}

const ChangeMapView = ({ center }: { center: Coordinates }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng]);
  }, [center, map]);
  return null;
}

export const EmergencyMap = ({ center = { lat: 12.9716, lng: 77.5946 }, zoom = 13, markers = [], route = [] }: EmergencyMapProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <MapContainer center={[center.lat, center.lng]} zoom={zoom} className="w-full h-full rounded-xl overflow-hidden z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url={isDark 
          ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        }
      />
      <ChangeMapView center={center} />
      
      {markers.map((m) => (
        <Marker 
          key={m.id} 
          position={[m.coords.lat, m.coords.lng]} 
          icon={
            m.type === 'ambulance' ? createAmbulanceIcon(isDark) : 
            m.type === 'hospital' ? createHospitalIcon(isDark) : 
            createPatientIcon(isDark)
          }
        >
          <Popup>{m.label}</Popup>
        </Marker>
      ))}

      {route.length > 1 && (
        <Polyline 
          positions={route.map(r => [r.lat, r.lng])} 
          color="#10b981" 
          weight={4} 
          dashArray="10, 10" 
          opacity={0.8}
        />
      )}
    </MapContainer>
  );
};
