'use client';

import { useState, useEffect, PropsWithChildren } from 'react';
// @ts-ignore
import Sidebar from './Sidebar';
import Footer from './Footer';
import CookieBanner from '@/components/CookieBanner/CookieBanner';

export default function EmergencyLayout({ children }: PropsWithChildren) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Por defecto abierto

  useEffect(() => {
    // Ajustar el estado inicial basado en el tamaño de la pantalla
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768); // 768px es el breakpoint de md en Tailwind
    };

    // Establecer estado inicial
    handleResize();

    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div
        className={`flex flex-col flex-1 transition-margin duration-300 w-full ${isSidebarOpen ? 'md:ml-72' : 'ml-0'}`}
      >
        <main className="p-4 flex flex-1 justify-center items-center lg:items-start">
          <div className="max-w-7xl w-full">{children}</div>
        </main>
        <Footer />
        <CookieBanner />
      </div>
    </div>
  );
}
