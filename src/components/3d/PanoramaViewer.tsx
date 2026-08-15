'use client';

import React, { useState } from 'react';
import { Compass, Loader2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface PanoramaViewerProps {
  panoramaUrl?: string;
}

export const PanoramaViewer: React.FC<PanoramaViewerProps> = ({ panoramaUrl }) => {
  const { lang } = useApp();
  const isRu = lang === 'ru';
  const [isLoading, setIsLoading] = useState(true);

  const defaultPanorama = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2500&q=80";
  const targetPanorama = panoramaUrl || defaultPanorama;

  // Формируем URL плеера Pannellum
  const embedUrl = `https://cdn.pannellum.org/2.5/pannellum.htm#panorama=${encodeURIComponent(targetPanorama)}&autoLoad=true&autoRotate=-2`;

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 bg-slate-900 border border-slate-200 h-[380px] sm:h-[500px] group">
      
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-teal-400 z-10">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <span className="text-xs font-bold animate-pulse tracking-widest uppercase">
            {isRu ? 'Загрузка 360° VR-тура...' : 'Loading 360° VR Tour...'}
          </span>
        </div>
      )}

      <iframe
        key={targetPanorama} // Пересоздаем iframe при смене объекта
        src={embedUrl}
        className="w-full h-full border-0"
        allowFullScreen
        onLoad={() => setIsLoading(false)}
      ></iframe>

      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex items-center space-x-2.5 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl border border-teal-500/30 text-teal-300 text-[11px] sm:text-xs font-bold shadow-lg pointer-events-none">
        <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
        <span>
          {isRu ? '360° VR-Тур (Вращайте мышью/пальцем)' : '360° VR Tour (Drag to look around)'}
        </span>
      </div>
    </div>
  );
};