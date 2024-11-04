'use client';

import React, { useState, useEffect, FC, memo } from 'react';
import { AlertTriangle, Menu, X } from 'lucide-react';

type HeaderProps = {
  toggleSidebar: () => void;
  isOpen: boolean;
};
const Header: FC<HeaderProps> = ({ toggleSidebar, isOpen }) => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Función para actualizar la hora
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      setCurrentTime(formatted);
    };

    // Actualizar inicialmente
    updateTime();

    // Actualizar cada minuto
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-red-100 border-l-4 border-red-500 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-gray-700 mr-4 focus:outline-none"
              aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
              <div>
                <h1 className="font-bold text-lg">EMERGENCIA ACTIVA</h1>
                <p className="text-sm text-red-700">Inundaciones Comunidad Valenciana</p>
              </div>
            </div>
          </div>
          <div className="text-right text-sm text-red-700">
            <p>Última actualización:</p>
            <p className="font-semibold" suppressHydrationWarning>
              {currentTime}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
