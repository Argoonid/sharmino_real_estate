import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'SHARMINO | Элитная курортная недвижимость Египта',
  description: 'Аренда вилл и покупка апартаментов в Шарм-эль-Шейхе и Сахль Хашиш',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${inter.className} bg-[#FAFAF7] text-slate-900 antialiased min-h-screen flex flex-col justify-between`}>
        <AppProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}