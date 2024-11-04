'use client';

import Ofertas from '@/app/casos-activos/ofertas/page';
import Puntos from '@/app/casos-activos/puntos/page';
import Solicitudes from '@/app/casos-activos/solicitudes/page';
import { HeartHandshake, Package, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Tab from './Tab';
import { Suspense } from 'react';

export default function TabNavigation({ count = { solicitudes: 0, ofertas: 0, puntos: 0 }, towns }) {
  const pathname = usePathname();
  return (
    <>
      <div className="grid grid-cols-3 gap-2 bg-white p-2 rounded-lg shadow">
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
      </div>
      <div className="grid gap-4">
        {pathname === '/casos-activos/solicitudes' && (
          <Suspense fallback={<div>Loading...</div>}>
            <Solicitudes towns={towns} />
          </Suspense>
        )}
        {pathname === '/casos-activos' && (
          <Suspense fallback={<div>Loading...</div>}>
            <Solicitudes towns={towns} />
          </Suspense>
        )}

        {pathname === '/casos-activos/ofertas' && (
          <Suspense fallback={<div>Loading...</div>}>
            <Ofertas towns={towns} />
          </Suspense>
        )}

        {pathname === '/casos-activos/puntos' && (
          <Suspense fallback={<div>Loading...</div>}>
            <Puntos towns={towns} />
          </Suspense>
        )}

        {/* {pathname === '/casos-activos/mapa' && (
          <Mapa markers={solicitudesMarkers} center={PAIPORTA_LAT_LNG} zoom={10}></Mapa>
        )} */}
      </div>
    </>
  );
}
