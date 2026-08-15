import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // 1. Включаем статический экспорт (HTML/CSS/JS)
  output: 'export',

  // 2. Отключаем серверную оптимизацию изображений для статики
  images: {
    unoptimized: true,
  },

  // 3. Указываем путь репозитория для корректных путей к скриптам и картинкам
  basePath: isProd ? '/sharmino_real_estate' : '',
  assetPrefix: isProd ? '/sharmino_real_estate/' : '',
  
  // Добавляем слеш в конце URL для стабильной маршрутизации на GitHub Pages
  trailingSlash: true,
};

export default nextConfig;