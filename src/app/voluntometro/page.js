'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { HeartHandshake, Check, Mail, Thermometer } from 'lucide-react';
import { mapToIdAndLabel, tiposAyudaOptions as _tiposAyudaOptions } from '@/helpers/constants';
import OfferHelp from '@/components/OfferHelp';

export default function Voluntometro() {
  const [pueblos, setPueblos] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [town, setTown] = useState(0);

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  async function fetchVolunteers() {
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

    setPueblos(updatedPueblos);
  }

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
    };
  };
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-orange-500 flex items-center gap-2">
          <Thermometer className="h-8 w-8" />
          Voluntómetro
        </h1>
        <button
          onClick={() => {
            window.location.href =
              'mailto:info@ajudadana.es?subject=Solicitud%20de%20nuevo%20pueblo%20para%20Voluntómetro';
          }}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap"
        >
          <Mail className="h-5 w-5" />
          Solicitar nuevo pueblo
        </button>
      </div>

      {/* Widget de Estadísticas actualizado */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-orange-500">Resumen de Voluntarios del {getFechaHoy()}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-green-600 font-medium">Mayor participación hoy</h3>
            {getTopAndBottomPueblos().top.length > 0 ? (
              getTopAndBottomPueblos().top.map((pueblo) => (
                <div
                  key={pueblo.id}
                  className="flex flex-col xl:flex-row items-start md:items-center justify-between bg-green-50 p-3 rounded-lg"
                >
                  <span className="font-medium">{pueblo.name}</span>
                  <div className="flex flex-col lg:flex-row items-start md:items-center">
                    <div>
                      <span className="text-green-600 font-bold">{pueblo.count}</span>
                      <span className="text-gray-500 ml-1">voluntarios</span>
                    </div>
                    <span className="text-semibold px-2 hidden lg:block">|</span>
                    <div>
                      <span className="text-green-600 font-bold">{pueblo.needHelp}</span>
                      <span className="text-gray-500 ml-1">necesitan ayuda</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 italic">No hay voluntarios registrados hoy</div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-red-600 font-medium">Necesitan más apoyo</h3>
            {getTopAndBottomPueblos().bottom.map((pueblo) => (
              <div
                key={pueblo.id}
                className="flex flex-col xl:flex-row items-start md:items-center justify-between bg-red-50 p-3 rounded-lg"
              >
                <span className="font-medium">{pueblo.name}</span>
                <div className="flex flex-col lg:flex-row items-start md:items-center">
                  <div>
                    <span className="text-red-600 font-bold">{pueblo.count}</span>
                    <span className="text-gray-500 ml-1">voluntarios</span>
                  </div>
                  <span className="text-semibold px-2 hidden lg:block">|</span>
                  <div>
                    <span className="text-red-600 font-bold">{pueblo.needHelp}</span>
                    <span className="text-gray-500 ml-1">necesitan ayuda</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pueblos.map((pueblo) => (
          <div key={pueblo.name} className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-2">{pueblo.name}</h2>
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg">
                <span className="font-semibold">{pueblo.count}</span> voluntarios
              </div>
              <button
                onClick={() => {
                  setShowModal(true);
                  setTown(pueblo);
                }}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              >
                Voy
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal with full form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <OfferHelp town={town} onClose={closeModal} isModal={true} />
        </div>
      )}
    </div>
  );
}
