// components/layout/EmergencyLayout.js

'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

export default function EmergencyLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    setIsClient(true); // Solo establecer `true` en el cliente
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />

      <main
        className={`transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'md:ml-64' : 'ml-0'
        }`}
      >
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            {isClient ? children : null}
          </div>
        </div>
      </main>
    </div>
  );
}
