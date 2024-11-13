import { HeartHandshake, Search, Thermometer } from 'lucide-react';
import TownCardInfo from '@/components/TownCardInfo';
import { getTodaysCountByTown } from '@/lib/actions';

export const dynamic = 'force-dynamic';

export default async function Voluntometro() {
  const towns = await getTodaysCountByTown();

  const getFechaHoy = () => {
    const fecha = new Date();
    return fecha.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const totalOffers = towns.reduce((sum, pueblo) => sum + (pueblo.offers_last_24h ?? 0), 0);
  const totalSolicitudes = towns.reduce((sum, pueblo) => sum + (pueblo.needs_last_24h ?? 0), 0);

  const sortedTowns = towns.sort((a, b) => (b.unassigned_needs ?? 0) - (a.unassigned_needs ?? 0));

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
            <h1 className="text-3xl font-bold text-gray-900">{totalOffers}+</h1>
            <p className="text-lg font-medium text-gray-600">Nuevos voluntarios hoy</p>
          </div>
        </div>
        <div className="flex flex-row bg-white p-4 rounded-lg gap-4 shadow-lg">
          <div className="bg-red-100 rounded-lg p-6">
            <Search className="w-16 h-16 text-red-600" />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-gray-900">{totalSolicitudes}+</h1>
            <p className="text-lg font-medium text-gray-600">Nuevas solicitudes hoy</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedTowns.map((townSummary) => (
          <TownCardInfo
            key={townSummary.town_id}
            townSummary={townSummary}
            route="/casos-activos/solicitudes/?pueblo="
          />
        ))}
      </div>
    </div>
  );
}
