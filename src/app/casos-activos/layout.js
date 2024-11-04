import { supabase } from '@/lib/supabase';
import TabNavigation from '@/components/TabNavigation';

const getTowns = async () => {
  const { data, error } = await supabase.from('towns').select('id, name').order('id', { ascending: true });
  if (error) {
    throw new Error('Error fetching towns:', error);
  }
  return data;
};

const getCount = async () => {
  const {
    data: solicitaData,
    count: solicitaCount,
    error: solicitaError,
  } = await supabase.from('help_requests').select('id', { count: 'exact' }).eq('type', 'necesita');

  const {
    data: ofreceData,
    count: ofreceCount,
    error: ofreceError,
  } = await supabase.from('help_requests').select('id', { count: 'exact' }).eq('type', 'ofrece');

  const {
    data: puntosData,
    count: puntosCount,
    error: puntosError,
  } = await supabase.from('collection_points').select('id', { count: 'exact' });

  if (solicitaError) {
    throw new Error('Error fetching solicita:', solicitaError);
  }
  if (ofreceError) {
    throw new Error('Error fetching ofrece:', ofreceError);
  }
  if (puntosError) {
    throw new Error('Error fetching puntos:', puntosError);
  }

  return {
    solicitudes: solicitaCount || 0,
    ofertas: ofreceCount || 0,
    puntos: puntosCount || 0,
  };
};

export default async function CasosActivosLayout() {
  const towns = await getTowns();

  const count = await getCount();
  // const puntosDeRecogidaMarkers = puntosRecogida.map(p => getMarkerByPuntoDeRecogida).filter(Boolean)
  // const solicitudesMarkers = solicitudes.map((sol) => getMarkerBySolicitud(sol, towns)).filter(Boolean);

  return (
    <>
      <div className="space-y-6 mx-auto max-w-7xl px-4 sm:px-6">
        <TabNavigation count={count} towns={towns} />
      </div>
    </>
  );
}
