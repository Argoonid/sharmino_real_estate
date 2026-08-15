'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Property } from '@/types';
import { PropertyCard } from '../catalog/PropertyCard';
import { useApp } from '@/context/AppContext';

// Исправление путей для стандартных иконок Leaflet в Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapProps {
  properties: Property[];
}

export default function PropertyMap({ properties }: MapProps) {
  const { lang } = useApp();

  if (!properties.length) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-slate-100 rounded-3xl border border-slate-200">
        <p className="text-slate-500 font-bold">Нет объектов в данной локации</p>
      </div>
    );
  }

  // Центрируем карту по первому объекту в списке
  const center = { lat: properties[0].location.lat, lng: properties[0].location.lng };

  return (
    <div className="h-[700px] w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200 relative z-0">
      <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {properties.map((prop) => (
          <Marker key={prop.id} position={[prop.location.lat, prop.location.lng]} icon={icon}>
            <Popup className="custom-leaflet-popup" minWidth={300}>
              {/* Мини-превью карточки прямо на карте */}
              <div className="-m-5">
                <PropertyCard property={prop} />
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}