'use client';
import { HeartHandshake, Package, Search, MapPin } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Tab from './Tab';

export default function TabNavigation({ count = { solicitudes: 0, ofertas: 0, puntos: 0 } }) {
  const pathname = usePathname();
  return (
    <>
      <div className="grid grid-cols-4 gap-2 bg-white p-2 rounded-lg shadow">
        <Tab
          isPath={pathname === '/casos-activos/solicitudes' || pathname === '/casos-activos'}
          href="/casos-activos/solicitudes"
          color="red"
        >
          <Search className="h-6 w-6 mb-1" />
          <span className="text-xs sm:text-sm font-medium">Solicitudes ({count.solicitudes || 0})</span>
        </Tab>
        <Tab isPath={pathname === '/casos-activos/ofertas'} href="/casos-activos/ofertas" color="green">
          <HeartHandshake className="h-6 w-6 mb-1" />
          <span className="text-xs sm:text-sm font-medium">Ofertas ({count.ofertas || 0})</span>
        </Tab>
        <Tab isPath={pathname === '/casos-activos/puntos'} href="/casos-activos/puntos" color="blue">
          <Package className="h-6 w-6 mb-1" />
          <span className="text-xs sm:text-sm font-medium">P. Recogida ({count.puntos || 0})</span>
        </Tab>
        <Tab isPath={pathname === '/casos-activos/mapa'} href="/casos-activos/mapa" color="orange">
          <MapPin className="h-6 w-6 mb-1" />
          <span className="text-xs sm:text-sm font-medium">Mapa</span>
        </Tab>
      </div>
    </>
  );
}
