import { HeartHandshake, Search, Thermometer } from 'lucide-react';
import TownCardInfo from '@/components/TownCardInfo';
import { helpRequestService } from '@/lib/service';

export const dynamic = 'force-dynamic';

export default async function Voluntometro() {
  const pueblos = await helpRequestService.getTodaysCountByTown();
  const count = await helpRequestService.getTodaysCount();

  const getFechaHoy = () => {
    const fecha = new Date();
    return fecha.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getTopAndBottomPueblos = () => {
    const sortedPueblos = [...pueblos].sort((a, b) => {
      const volunteersDiffA = a.count - a.needHelp;
      const volunteersDiffB = b.count - b.needHelp;
      if (volunteersDiffA !== volunteersDiffB) {
        return volunteersDiffB - volunteersDiffA;
      } else {
        return b.count - a.count;
      }
    });

    return {
      top: sortedPueblos.slice(0, 2),
      bottom: sortedPueblos.slice(-2).reverse(),
      all: sortedPueblos.reverse(),
    };
  };
  return (
    <div className="mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Thermometer className="h-8 w-8" />
          Voluntómetro
        </h1>
      </div>

      {/* Widget de Estadísticas actualizado */}
      <h2 className="text-lg font-semibold mb-4 text-gray-900">Resumen de Voluntarios del {getFechaHoy()}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="flex flex-row bg-white p-4 rounded-lg gap-4 shadow-lg">
          <div className="bg-green-100 rounded-lg p-6">
            <HeartHandshake className="w-16 h-16 text-green-600" />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-gray-900">{count.ofertas}+</h1>
            <p className="text-lg font-medium text-gray-600">Nuevos voluntarios hoy</p>
          </div>
        </div>
        <div className="flex flex-row bg-white p-4 rounded-lg gap-4 shadow-lg">
          <div className="bg-red-100 rounded-lg p-6">
            <Search className="w-16 h-16 text-red-600" />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-gray-900">{count.solicitudes}+</h1>
            <p className="text-lg font-medium text-gray-600">Nuevas solicitudes hoy</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {getTopAndBottomPueblos().all.map(
          (pueblo) =>
            pueblo.needHelp > 0 && (
              <TownCardInfo key={pueblo.id} pueblo={pueblo} route="/casos-activos/solicitudes/?pueblo=" />
            ),
        )}
      </div>
    </div>
  );
}
