import { supabase } from '@/lib/supabase/client';
import TabNavigation from '@/components/TabNavigation';
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

export default async function CasosActivosLayout({ children }) {
  const count = await getCount();
  return (
    <>
      <div className="space-y-6 mx-auto max-w-7xl px-4 sm:px-6">
        <TabNavigation count={count} />
        {children}
      </div>
    </>
  );
}
