'use client';
import { HeartHandshake, Search, MapPin } from 'lucide-react';
import Tab from './Tab';

export default function TabNavigation({ count = { solicitudes: 0, ofertas: 0 } }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-2 bg-white p-2 rounded-lg shadow">
        <Tab href="/casos-activos/solicitudes" color="red">
          <Search className="h-6 w-6 mb-1" />
          <span className="text-xs sm:text-sm font-medium">Solicitudes ({count.solicitudes || 0})</span>
        </Tab>
        <Tab href="/casos-activos/ofertas" color="green">
          <HeartHandshake className="h-6 w-6 mb-1" />
          <span className="text-xs sm:text-sm font-medium">Ofertas ({count.ofertas || 0})</span>
        </Tab>
      </div>
    </>
  );
}
