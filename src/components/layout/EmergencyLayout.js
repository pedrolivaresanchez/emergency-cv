// components/layout/EmergencyLayout.js

'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function EmergencyLayout({ children }) {
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
    <div className="min-h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`transition-margin duration-300 ${isSidebarOpen ? 'md:ml-72' : 'ml-0'}`}>
        <main className="p-4">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
