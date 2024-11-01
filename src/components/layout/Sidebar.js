// components/Sidebar.js

'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  HeartHandshake, 
  UserSearch, 
  Package,
  Menu,
  X,
  AlertCircle,
  Home
} from 'lucide-react';

const menuItems = [
  {
    icon: Home,
    title: "Inicio",
    description: "Volver a la página principal",
    path: "/",
    color: "text-gray-600"
  },
  {
    icon: AlertCircle,
    title: "Casos Activos",
    description: "Ver todos los casos activos",
    path: "/casos-activos",
    color: "text-red-600",
    highlight: true
  },
  {
    icon: Search,
    title: "Solicitar Ayuda",
    description: "Si necesitas asistencia urgente",
    path: "/solicitar-ayuda",
    color: "text-red-600"
  },
  {
    icon: HeartHandshake,
    title: "Ofrecer Ayuda",
    description: "Si puedes ayudar a otros",
    path: "/ofrecer-ayuda",
    color: "text-green-600"
  },
  {
    icon: UserSearch,
    title: "Persona Desaparecida",
    description: "Reportar o buscar personas",
    path: "https://desaparecidosdana.pythonanywhere.com/",
    color: "text-purple-600"
  },
  {
    icon: Package,
    title: "Punto de Recogida",
    description: "Gestionar donaciones",
    path: "/punto-recogida",
    color: "text-blue-600"
  }
];

export default function Sidebar({ isOpen, toggle }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggle}
        />
      )}

      {/* Toggle button for mobile */}
      <button
        onClick={toggle}
        className="fixed top-4 left-4 z-30 md:hidden bg-white p-2 rounded-lg shadow-lg hover:bg-gray-100"
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full bg-white shadow-xl z-30 
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          w-64`}
      >
        {/* Logo or title */}
        <div className="p-4 border-b">
          <Link href="/" passHref>
            <h1 className="text-xl font-bold text-gray-800 cursor-pointer">
              Ayuda Dana
            </h1>
          </Link>
        </div>

        {/* Menu items */}
        <nav className="p-4">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  router.push(item.path);
                  if (window.innerWidth < 768) toggle();
                }}
                className={`w-full text-left p-4 rounded-lg transition-colors ${
                  pathname === item.path 
                    ? 'bg-gray-100 shadow-sm' 
                    : 'hover:bg-gray-50'
                } ${
                  item.highlight 
                    ? 'bg-red-50 border-2 border-red-200 hover:bg-red-100 animate-pulse' 
                    : ''
                }`}
              >
                <div className="flex items-center mb-2">
                  <item.icon className={`h-6 w-6 ${item.color} mr-3 ${
                    item.highlight ? 'animate-bounce' : ''
                  }`} />
                  <span className={`font-semibold ${
                    item.highlight ? 'text-red-700' : ''
                  }`}>
                    {item.title}
                  </span>
                </div>
                <p className={`text-sm ml-9 ${
                  item.highlight ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {item.description}
                </p>
              </button>
            ))}
          </div>
        </nav>

        {/* Toggle button for desktop */}
        <button
          onClick={toggle}
          className="hidden md:flex absolute -right-12 top-4 bg-white p-2 rounded-r-lg shadow-md 
            hover:bg-gray-50 focus:outline-none group"
          aria-label={isOpen ? "Contraer menú" : "Expandir menú"}
        >
          <Menu 
            className={`transform transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>
    </>
  );
}
