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
  Home,
  Thermometer,
  Truck,
  Inbox,
  Landmark,
  Scale,
  MessageCircleQuestion,
} from 'lucide-react';
import UserInfo from '../UserInfo';
import { useSession } from '@/context/SessionProvider';
import { useQuery } from '@tanstack/react-query';
import { SelectedHelpData } from '@/types/Requests';
import { getOffersByUser, getRequestsByUser } from '@/lib/actions';

type SidebarProps = {
  isOpen: boolean;
  toggleAction: () => void;
};
export default function Sidebar({ isOpen, toggleAction }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const session = useSession();

  const userId = session.user?.id;

  const { data: requests } = useQuery<SelectedHelpData[]>({
    queryKey: ['help_requests', { user_id: userId, type: 'necesita' }],
    queryFn: () => getRequestsByUser(userId),
  });
  const { data: offers } = useQuery<SelectedHelpData[]>({
    queryKey: ['help_requests', { user_id: userId, type: 'ofrece' }],
    queryFn: () => getOffersByUser(userId),
  });
  const hasRequests = (requests?.length ?? 0) > 0;
  const hasOffers = (offers?.length ?? 0) > 0;

  const menuItems = [
    {
      icon: Home,
      title: 'Inicio',
      path: '/',
      color: 'text-gray-600',
      isHome: true,
    },
    {
      icon: AlertCircle,
      title: 'Casos Activos',
      description: 'Ver todos los casos activos',
      path: '/casos-activos/solicitudes',
      color: 'text-orange-600',
      highlight: true,
    },
    {
      icon: Inbox,
      title: 'Mis solicitudes',
      description: 'Edita o elimina tus solicitudes',
      path: '/solicitudes',
      isLogged: true,
      color: 'text-red-500',
      hide: !hasRequests,
    },
    {
      icon: Inbox,
      title: 'Mis ofertas',
      description: 'Edita o elimina tus ofertas',
      path: '/ofertas',
      isLogged: true,
      color: 'text-green-500',
      hide: !hasOffers,
    },
    {
      icon: Thermometer,
      title: 'Voluntómetro',
      description: 'Medidor de voluntarios por localidad',
      path: '/voluntometro',
      color: 'text-yellow-500',
    },
    {
      icon: Search,
      title: 'Solicitar Ayuda',
      description: 'Si necesitas asistencia',
      path: '/solicitar-ayuda',
      isLogged: true,
      color: 'text-red-600',
    },
    {
      icon: HeartHandshake,
      title: 'Ofrecer Ayuda',
      description: 'Si puedes ayudar a otros',
      path: '/ofrecer-ayuda',
      isLogged: true,
      color: 'text-green-600',
    },
    {
      icon: UserSearch,
      title: 'Desaparecidos',
      description: 'Reportar o buscar',
      path: '/personas-animales-desaparecidos',
      color: 'text-purple-600',
    },
    {
      icon: Package,
      title: 'Punto de Recogida',
      description: 'Gestionar donaciones',
      path: '/punto-recogida',
      color: 'text-blue-600',
    },
    {
      icon: Truck,
      title: 'Puntos de Entrega',
      description: 'Para transportistas y logística',
      path: '/puntos-entrega',
      color: 'text-gray-800',
    },
    {
      icon: Scale,
      title: 'Servicio Notarial',
      description: 'Servicio notarial gratuito',
      path: 'https://valencia.notariado.org/portal/-/20241031-servicio-notarial-de-ayuda-gratuito-para-los-afectados-por-la-dana-noticia-p%C3%BAblica-',
      color: 'text-indigo-600',
      isHref: true,
    },
    {
      icon: Landmark,
      title: 'Reclamar a Consorcio',
      description: 'Seguro de riesgos extraordinarios',
      path: 'https://www.consorseguros.es/ambitos-de-actividad/seguros-de-riesgos-extraordinarios/solicitud-de-indemnizacion',
      color: 'text-pink-600',
      isHref: true,
    },
    {
      icon: MessageCircleQuestion,
      title: 'Ayuda Psicológica',
      description: 'Conecta con psicólogos voluntarios',
      path: 'https://ayudana.org/',
      color: 'text-teal-600',
      isHref: true,
    },
  ];

  return (
    <>
      {/* Quitamos el overlay con fondo negro */}
      {isOpen && <div className="fixed inset-0 z-20 md:hidden" onClick={toggleAction} />}

      {/* Toggle button for mobile */}
      <button
        onClick={toggleAction}
        className="fixed top-4 left-4 z-30 md:hidden bg-white p-2 rounded-lg shadow-lg hover:bg-gray-100"
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-xl z-30 
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          w-72 flex flex-col`}
      >
        {/* Logo or title */}
        <div className="p-4 border-b flex-shrink-0">
          <Link href="/" passHref>
            <h1 className="text-xl font-bold text-gray-800 cursor-pointer">Ajuda Dana</h1>
          </Link>
        </div>

        {/* Menu items - Contenedor con scroll */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map((item) =>
              !item.hide ? (
                item.isHref ? (
                  <button
                    key={item.path}
                    onClick={() => window.open(item.path, '_blank')}
                    className={`w-full text-left transition-colors ${
                      item.isHome
                        ? 'p-3 rounded-lg flex items-center gap-2 hover:bg-gray-50'
                        : `p-4 rounded-lg ${pathname === item.path ? 'bg-gray-100 shadow-sm' : 'hover:bg-gray-50'} ${
                            item.highlight ? 'bg-red-50 border-2 border-red-200 hover:bg-red-100 animate-pulse' : ''
                          }`
                    }`}
                  >
                    <>
                      <div className="flex items-center mb-2">
                        <item.icon className={`h-6 w-6 ${item.color} mr-3 ${item.highlight ? 'animate-bounce' : ''}`} />
                        <span className={`font-semibold ${item.highlight ? 'text-orange-700' : ''}`}>{item.title}</span>
                      </div>
                      <p className={`text-sm ml-9 ${item.highlight ? 'text-orange-600' : 'text-gray-600'}`}>
                        {item.description}
                      </p>
                    </>
                  </button>
                ) : (
                  <button
                    key={item.path}
                    onClick={() => {
                      router.push(item?.isLogged && !userId ? '/auth?redirect=' + item.path : item.path);
                      if (window.innerWidth < 768) toggleAction();
                    }}
                    className={`w-full text-left transition-colors ${
                      item.isHome
                        ? 'p-3 rounded-lg flex items-center gap-2 hover:bg-gray-50'
                        : `p-4 rounded-lg ${pathname === item.path ? 'bg-gray-100 shadow-sm' : 'hover:bg-gray-50'} ${
                            item.highlight ? 'bg-red-50 border-2 border-red-200 hover:bg-red-100 animate-pulse' : ''
                          }`
                    }`}
                  >
                    <>
                      <div className="flex items-center mb-2">
                        <item.icon className={`h-6 w-6 ${item.color} mr-3 ${item.highlight ? 'animate-bounce' : ''}`} />
                        <span className={`font-semibold ${item.highlight ? 'text-orange-700' : ''}`}>{item.title}</span>
                      </div>
                      <p className={`text-sm ml-9 ${item.highlight ? 'text-orange-600' : 'text-gray-600'}`}>
                        {item.description}
                      </p>
                    </>
                  </button>
                )
              ) : null,
            )}
          </div>
        </nav>

        {/* User info and login */}
        <div className="p-4">
          <UserInfo
            toggleAction={() => {
              if (window.innerWidth < 768) toggleAction();
            }}
          />
        </div>

        {/* Toggle button for desktop */}
        <button
          onClick={toggleAction}
          className="hidden md:flex absolute -right-12 top-4 bg-white p-2 rounded-r-lg shadow-md hover:bg-gray-50 focus:outline-none group"
          aria-label={isOpen ? 'Contraer menú' : 'Expandir menú'}
        >
          <Menu className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </>
  );
}
