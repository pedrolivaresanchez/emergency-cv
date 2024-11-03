'use client';

import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Calendar, AlertTriangle, User, HeartHandshake, Users, Truck, Search, Package } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import OfferHelp from '@/components/OfferHelp';

export default function CasosActivos() {
  const [activeTab, setActiveTab] = useState('solicitudes');
  const [solicitudes, setSolicitudes] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const [puntosRecogida, setPuntosRecogida] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroUrgencia, setFiltroUrgencia] = useState('todas');
  const [filtroPueblo, setFiltroPueblo] = useState('todos');
  const [towns, setTowns] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const { data: solicitudesData, error: solicitudesError } = await supabase
          .from('help_requests')
          .select('*')
          .eq('type', 'necesita')
          .order('created_at', { ascending: false });

        if (solicitudesError) {
          console.error('Error fetching solicitudes:', solicitudesError);
          setSolicitudes([]);
        } else {
          setSolicitudes(solicitudesData || []);
        }

        const { data: ofertasData, error: ofertasError } = await supabase
          .from('help_requests')
          .select('*')
          .eq('type', 'ofrece')
          .order('created_at', { ascending: false });

        if (ofertasError) {
          console.error('Error fetching ofertas:', ofertasError);
          setOfertas([]);
        } else {
          setOfertas(ofertasData || []);
        }

        const { data: puntosData, error: puntosError } = await supabase
          .from('collection_points')
          .select('*')
          .order('created_at', { ascending: false });

        if (puntosError) {
          console.error('Error fetching puntos:', puntosError);
          setPuntosRecogida([]);
        } else {
          setPuntosRecogida(puntosData || []);
        }

      } catch (err) {
        console.error('Error general:', err);
        setError('Error de conexión. Por favor, verifica tu conexión a internet.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    fetchTowns();
  }, []);
	

  async function fetchTowns() {
    const { data, error } = await supabase
      .from('towns')
      .select('id, name');

    if (error) {
      console.error('Error fetching towns:', error);
      return;
    }

    setTowns(data);
  }
  const solicitudesFiltradas = solicitudes.filter(caso => {
    const cumpleUrgencia = filtroUrgencia === 'todas' ? true : caso.urgency === filtroUrgencia;
    const cumplePueblo = filtroPueblo === 'todos' ? true : caso.town_id === parseInt(filtroPueblo);
    return cumpleUrgencia && cumplePueblo;
  });

  const closeModal = () => {
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <>
    <div className="space-y-6 mx-auto max-w-7xl px-4 sm:px-6">
      {/* Tabs mejorados */}
      <div className="grid grid-cols-3 gap-2 bg-white p-2 rounded-lg shadow">
        <button
          onClick={() => setActiveTab('solicitudes')}
          className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg transition-colors ${
            activeTab === 'solicitudes'
              ? 'bg-red-500 text-white'
              : 'bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
        >
          <Search className="h-6 w-6 mb-1" />
          <span className="text-xs sm:text-sm font-medium">
            Solicitudes ({solicitudes.length})
          </span>
        </button>
        <button
          onClick={() => setActiveTab('ofertas')}
          className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg transition-colors ${
            activeTab === 'ofertas'
              ? 'bg-green-500 text-white'
              : 'bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
        >
          <HeartHandshake className="h-6 w-6 mb-1" />
          <span className="text-xs sm:text-sm font-medium">
            Ofertas ({ofertas.length})
          </span>
        </button>
        <button
          onClick={() => setActiveTab('puntos')}
          className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg transition-colors ${
            activeTab === 'puntos'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
        >
          <Package className="h-6 w-6 mb-1" />
          <span className="text-xs sm:text-sm font-medium">
            P. Recogida ({puntosRecogida.length})
          </span>
        </button>
      </div>

      {/* Lista de casos */}
      <div className="grid gap-4">
        {activeTab === 'solicitudes' && (
					<>
					{/* FILTROS  */}
					<div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
						<p className="font-bold text-md">Filtros</p>
						<div className="flex flex-col sm:flex-row gap-2 w-full justify-end">
              <select
                value={filtroUrgencia}
                onChange={(e) => setFiltroUrgencia(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm"
              >
                <option value="todas">Todas las prioridades</option>
                <option value="alta">Alta prioridad</option>
                <option value="media">Media prioridad</option>
                <option value="baja">Baja prioridad</option>
              </select>
              <select
                value={filtroPueblo}
                onChange={(e) => setFiltroPueblo(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm"
              >
                <option value="todos">Todos los pueblos</option>
                {towns.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
					</div>
      </div>
          <div className="grid gap-4">
            {solicitudesFiltradas.length === 0 ? (
              <div className="bg-white rounded-lg shadow-lg border border-gray-300 text-center flex justify-center items-center p-10 flex-col gap-5">
                <p className="text-gray-700 text-lg font-medium">No se encontraron solicitudes que coincidan con los filtros.</p>
                
              <button
                onClick={() => { setShowModal(true) }}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2 whitespace-nowrap"
              >
                <HeartHandshake className="w-5 h-5" />
                Ofrecer ayuda a {towns[filtroPueblo-1].name}
              </button>
              </div>
            ) : (solicitudesFiltradas.map((caso) => (
              <div key={caso.id} className={`bg-white p-4 rounded-lg shadow-lg border-l-4 ${
                        caso.urgency === 'alta' ? 'border-red-500' :
                        caso.urgency === 'media' ? 'border-yellow-500' :
                        'border-green-500'
                      } overflow-hidden`}>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
                  <h3 className={`text-lg font-bold break-words ${
                        caso.urgency === 'alta' ? 'text-red-600' :
                        caso.urgency === 'media' ? 'text-yellow-600' :
                        'text-green-500'
                      }`}>
                    {caso.name || "Necesita Ayuda"}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                    caso.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    caso.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    {caso.status === 'pending' ? 'Pendiente' :
                     caso.status === 'in_progress' ? 'En proceso' :
                     'Activo'}
                  </span>
                </div>
                <p className="text-gray-700 mb-4 break-words">{caso.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
                    <span className="break-words">
                      <span className="font-semibold">Ubicación:</span> {caso.location}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
                    <span className="break-words">
                      <span className="font-semibold">Fecha:</span>{' '}
                      {new Date(caso.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {caso.contact_info && (
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
                      <span className="break-words">
                        <span className="font-semibold">Contacto:</span> {caso.contact_info}
                      </span>
                    </div>
                  )}
                  {caso.urgency && (
                    <div className="flex items-start gap-2">
                      <AlertTriangle className={`h-4 w-4 flex-shrink-0 mt-1 ${
                        caso.urgency === 'alta' ? 'text-red-500' :
                        caso.urgency === 'media' ? 'text-yellow-500' :
                        'text-green-500'
                      }`} />
                      <span className="break-words">
                        <span className="font-semibold">Urgencia:</span>
                        <span className={`ml-1 ${
                          caso.urgency === 'alta' ? 'text-red-600 font-semibold' :
                          caso.urgency === 'media' ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {caso.urgency === 'alta' ? 'Alta' :
                           caso.urgency === 'media' ? 'Media' :
                           'Baja'}
                        </span>
                      </span>
                    </div>
                  )}
                  {caso.additional_info?.special_situations && (
                    <div className="mt-2 bg-gray-50 p-3 rounded">
                      <span className="font-semibold block mb-1">Situaciones especiales:</span>
                      <p className="text-gray-700 break-words">{caso.additional_info.special_situations}</p>
                    </div>
                  )}
                  {caso.number_of_people && (
                    <div className="flex items-start gap-2">
                      <Users className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
                      <span className="break-words">
                        <span className="font-semibold">Personas afectadas:</span> {caso.number_of_people}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )))}
          </div>
					</>
        )}

        {activeTab === 'ofertas' && (
          <div className="grid gap-4">
            {ofertas.map((caso) => (
              <div key={caso.id} className="bg-white p-4 rounded-lg shadow-lg border-l-4 border-green-500 overflow-hidden">
                <div className="flex justify-start mb-2">
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap bg-green-100 text-green-800">
                    {caso.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <h3 className="text-lg font-bold text-green-600">
                    <div className="flex items-start gap-2">
                      <HeartHandshake className="h-5 w-5 flex-shrink-0 mt-1" />
                      <div className="break-words">
                        Ofrece: {Array.isArray(caso.help_type) ? 
                          caso.help_type.map(tipo => {
                            const tipoAyuda = {
                              'limpieza': 'Limpieza/Desescombro',
                              'evacuacion': 'Transporte/Evacuación',
                              'alojamiento': 'Alojamiento temporal',
                              'distribucion': 'Distribución de suministros',
                              'rescate': 'Equipo de rescate',
                              'medica': 'Asistencia médica',
                              'psicologico': 'Apoyo psicológico',
                              'logistico': 'Apoyo logístico'
                            }[tipo] || tipo;
                            return tipoAyuda;
                          }).join(', ') : 
                          "Ayuda general"}
                      </div>
                    </div>
                  </h3>
                  {caso.name && (
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 flex-shrink-0 mt-1" />
                      <span className="break-words">
                        <span className="font-semibold">Nombre:</span> {caso.name}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  {caso.contact_info && (
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
                      <span className="break-words">
                        <span className="font-semibold">Teléfono:</span>{' '}
                        {typeof caso.contact_info === 'string' ? 
                          caso.contact_info : 
                          JSON.parse(caso.contact_info).phone}
                      </span>
                    </div>
                  )}

                  {caso.resources && (
                    <>
                      {(() => {
                        let resources;
                        try {
                          resources = typeof caso.resources === 'string' ? 
                            JSON.parse(caso.resources) : caso.resources;

                          return resources.vehicle ? (
                            <div className="flex items-start gap-2">
                              <Truck className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
                              <span className="break-words">
                                <span className="font-semibold">Vehículo:</span>{' '}
                                {resources.vehicle}
                              </span>
                            </div>
                          ) : null;
                        } catch (e) {
                          return null;
                        }
                      })()}
                    </>
                  )}

                  {caso.location && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
                      <span className="break-words">
                        <span className="font-semibold">Ubicación:</span> {caso.location}
                      </span>
                    </div>
                  )}

                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
                    <span className="break-words">
                      <span className="font-semibold">Fecha:</span>{' '}
                      {new Date(caso.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {caso.description && (
                  <div className="mt-4 bg-gray-50 p-3 rounded">
                    <span className="font-semibold block mb-1">Comentarios:</span>
                    <p className="text-gray-700 break-words">{caso.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'puntos' && puntosRecogida.map((punto) => (
          <div key={punto.id} className="bg-white p-4 rounded-lg shadow-lg border-l-4 border-blue-500">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
              <div>
                <h3 className="text-lg font-bold text-blue-600 break-words">{punto.name}</h3>
                <div className="flex items-start gap-2 text-gray-600 mt-1">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-1" />
                  <span className="text-sm break-words">{punto.location}</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium whitespace-nowrap">
                {punto.status === 'active' ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-4">
              <div className="break-words">
                <span className="font-semibold">Ciudad:</span> {punto.city}
              </div>
              {punto.contact_name && (
                <div className="break-words">
                  <span className="font-semibold">Responsable:</span> {punto.contact_name}
                </div>
              )}
              {punto.contact_phone && (
                <div className="break-words">
                  <span className="font-semibold">Teléfono:</span> {punto.contact_phone}
                </div>
              )}
              {punto.accepted_items && (
                <div className="col-span-1 sm:col-span-2 break-words">
                  <span className="font-semibold">Acepta:</span>{' '}
                  {Array.isArray(punto.accepted_items) 
                    ? punto.accepted_items.join(', ')
                    : punto.accepted_items}
                </div>
              )}
              {punto.urgent_needs && (
                <div className="col-span-1 sm:col-span-2">
                  <span className="font-semibold">Necesidades urgentes:</span>
                  <p className="text-gray-700 mt-1 break-words">{punto.urgent_needs}</p>
                </div>
              )}
              {punto.schedule && (
                <div className="col-span-1 sm:col-span-2">
                  <span className="font-semibold">Horario:</span>
                  <p className="text-gray-700 mt-1 break-words">{punto.schedule}</p>
                </div>
              )}
              {punto.additional_info && (
                <div className="col-span-1 sm:col-span-2 bg-gray-50 p-3 rounded">
                  <span className="font-semibold">Información adicional:</span>
                  <p className="text-gray-700 mt-1 break-words">{
                    typeof punto.additional_info === 'string' 
                      ? punto.additional_info 
                      : JSON.stringify(punto.additional_info)
                  }</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>

    {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <OfferHelp town={towns[filtroPueblo-1]} onClose={closeModal} />
        </div>
    )}
    </>
  );
}