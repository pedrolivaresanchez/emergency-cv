import { supabase } from '@/lib/supabase/client';
import { HeartHandshake, Search, Thermometer } from 'lucide-react';
import OfferHelp from '@/components/OfferHelp';
import Modal from '@/components/Modal';
import TownCardInfo from '@/components/TownCardInfo';

const getCount = async () => {
  const today = new Date().toISOString().split('T')[0];
  const {
    data: solicitaData,
    count: solicitaCount,
    error: solicitaError,
  } = await supabase
    .from('help_requests')
    .select('id', { count: 'exact' })
    .eq('type', 'necesita')
    .gte('created_at', today)
    .lte('created_at', `${today}T23:59:59.999Z`);

  const {
    data: ofreceData,
    count: ofreceCount,
    error: ofreceError,
  } = await supabase
    .from('help_requests')
    .select('id', { count: 'exact' })
    .eq('type', 'ofrece')
    .gte('created_at', today)
    .lte('created_at', `${today}T23:59:59.999Z`);

  if (solicitaError) {
    throw new Error('Error fetching solicita:', solicitaError);
  }
  if (ofreceError) {
    throw new Error('Error fetching ofrece:', ofreceError);
  }
  return {
    solicitudes: solicitaCount || 0,
    ofertas: ofreceCount || 0,
  };
};

const getVolunteers = async () => {
  const today = new Date().toISOString().split('T')[0];

  const { data: towns, error: townError } = await supabase.from('towns').select('id, name');

  if (townError) {
    console.log('Error fetching towns:', townError);
    return;
  }

  const { data, error } = await supabase
    .from('help_requests')
    .select('*')
    .in('type', ['ofrece', 'necesita'])
    .gte('created_at', today)
    .lte('created_at', `${today}T23:59:59.999Z`);

  if (error) {
    console.log('Error fetching help requests:', error);
    return;
  }

  const volunteersCount = new Map();
  const needHelpCount = new Map();

  data.forEach((person) => {
    const townId = person.town_id;
    if (person.type === 'ofrece') {
      volunteersCount.set(townId, (volunteersCount.get(townId) || 0) + 1);
    } else if (person.type === 'necesita') {
      needHelpCount.set(townId, (needHelpCount.get(townId) || 0) + 1);
    }
  });

  const updatedPueblos = towns.map((town) => ({
    id: town.id,
    name: town.name,
    count: volunteersCount.get(town.id) || 0,
    needHelp: needHelpCount.get(town.id) || 0,
  }));

  return updatedPueblos;
};

export default async function Voluntometro() {
  const pueblos = await getVolunteers();
  const count = await getCount();
  console.log(pueblos.ofertasButton);
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
