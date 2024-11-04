'use client';

import { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Calendar,
  User,
  HeartHandshake,
  Users,
  Truck,
  Search,
  Package,
  MapPinIcon,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import OfferHelp from '@/components/OfferHelp';
import Mapa from '@/components/map/map';
import { getMarkerBySolicitud } from '@/helpers/format';
import SolicitudCard from '@/components/SolicitudCard';
import { tiposAyudaOptions, tiposAyudaAcepta } from '@/helpers/constants';
import Pagination from '@/components/Pagination';

const PAIPORTA_LAT_LNG = [-0.41667, 39.43333];

export default function CasosActivos() {
  const [activeTab, setActiveTab] = useState('solicitudes');
  const [solicitudes, setSolicitudes] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const [puntos, setPuntos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [towns, setTowns] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const itemsPerPage = 10;

  const numPages = (count) => {
    return Math.ceil(count / itemsPerPage) || 0;
  };

  const [currentPage, setCurrentPage] = useState({
    solicitudes: 1,
    ofertas: 1,
    puntos: 1,
  });

  const changePage = (type, newPage) => {
    setCurrentPage((prev) => ({
      ...prev,
      [type]: newPage,
    }));
  };

  const [filtroSolicitudes, setFiltroSolicitudes] = useState({
    urgencia: 'todas',
    pueblo: 'todos',
  });

  const changeSolicitudesFilter = (type, newFilter) => {
    setFiltroSolicitudes((prev) => ({
      ...prev,
      [type]: newFilter,
    }));
  };

  const [filtroOfertas, setFiltroOfertas] = useState({
    ayuda: 'todas',
  });

  const changeOfertasFilter = (type, newFilter) => {
    setFiltroOfertas((prev) => ({
      ...prev,
      [type]: newFilter,
    }));
  };

  const [filtroPuntos, setFiltroPuntos] = useState({
    acepta: 'todos',
  });

  const changePuntosFilter = (type, newFilter) => {
    setFiltroPuntos((prev) => ({
      ...prev,
      [type]: newFilter,
    }));
  };

  const [currentCount, setCurrentCount] = useState({
    solicitudesCount: 0,
    ofertasCount: 0,
    puntosCount: 0,
  });

  const changeCount = (type, newCount) => {
    setCurrentCount((prev) => ({
      ...prev,
      [type]: newCount,
    }));
  };

  useEffect(() => {
    async function fetchTowns() {
      const { data, error } = await supabase.from('towns').select('id, name');

      if (error) {
        console.log('Error fetching towns:', error);
        return;
      }

      setTowns(data);
    }
    fetchTowns();
  }, []);

  useEffect(() => {
    async function fetchRequests() {
      try {
        setLoading(true);
        setError(null);

        // Comenzamos la consulta
        const query = supabase.from('help_requests').select('*', { count: 'exact' }).eq('type', 'necesita');

        // Solo agregar filtro si no es "todos"
        if (filtroSolicitudes.pueblo !== 'todos') {
          query.eq('town_id', filtroSolicitudes.pueblo);
        }

        // Solo agregar filtro si no es "todas"
        if (filtroSolicitudes.urgencia !== 'todas') {
          query.eq('urgency', filtroSolicitudes.urgencia);
        }

        // Ejecutar la consulta con paginación
        const {
          data: solicitudesData,
          count,
          error: solicitudesError,
        } = await query
          .range((currentPage.solicitudes - 1) * itemsPerPage, currentPage.solicitudes * itemsPerPage - 1)
          .order('created_at', { ascending: false });

        if (solicitudesError) {
          console.log('Error fetching solicitudes:', solicitudesError);
          setSolicitudes([]);
        } else {
          setSolicitudes(solicitudesData || []);
          changeCount('solicitudes', count);
        }
      } catch (err) {
        console.log('Error general:', err);
        setError('Error de conexión.');
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, [filtroSolicitudes, currentPage.solicitudes]);

  useEffect(() => {
    async function fetchOffers() {
      try {
        setLoading(true);
        setError(null);

        // Comenzamos la consulta
        const query = supabase.from('help_requests').select('*', { count: 'exact' }).eq('type', 'ofrece');

        // Solo agregar filtro si no es "todos"
        if (filtroOfertas.ayuda !== 'todas') {
          query.contains('help_type', [filtroOfertas.ayuda]);
        }
        // Ejecutar la consulta con paginación
        const {
          data: ofertasData,
          count,
          error: ofertasError,
        } = await query
          .range((currentPage.ofertas - 1) * itemsPerPage, currentPage.ofertas * itemsPerPage - 1)
          .order('created_at', { ascending: false });

        if (ofertasError) {
          console.log('Error fetching ofertas:', ofertasError);
          setOfertas([]);
        } else {
          setOfertas(ofertasData || []);
          changeCount('ofertas', count);
        }
      } catch (err) {
        console.log('Error general:', err);
        setError('Error de conexión.');
      } finally {
        setLoading(false);
      }
    }
    fetchOffers();
  }, [filtroOfertas, currentPage.ofertas]);

  useEffect(() => {
    async function fetchPoints() {
      try {
        setLoading(true);
        setError(null);

        // Comenzamos la consulta
        const query = supabase.from('collection_points').select('*', { count: 'exact' });

        // Solo agregar filtro si no es "todos"
        if (filtroPuntos.ayuda !== 'todas') {
          query.contains('accepted_items', [filtroPuntos.ayuda]);
        }
        // Ejecutar la consulta con paginación
        const {
          data: puntosData,
          count,
          error: puntosError,
        } = await query
          .range((currentPage.puntos - 1) * itemsPerPage, currentPage.puntos * itemsPerPage - 1)
          .order('created_at', { ascending: false });

        if (puntosError) {
          console.log('Error fetching ofertas:', puntosError);
          setPuntos([]);
        } else {
          setPuntos(puntosData || []);
          changeCount('puntos', count);
        }
      } catch (err) {
        console.log('Error general:', err);
        setError('Error de conexión....');
      } finally {
        setLoading(false);
      }
    }
    fetchPoints();
  }, [filtroPuntos, currentPage.puntos]);

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

  // const puntosDeRecogidaMarkers = puntosRecogida.map(p => getMarkerByPuntoDeRecogida).filter(Boolean)
  const solicitudesMarkers = solicitudes.map((sol) => getMarkerBySolicitud(sol, towns)).filter(Boolean);

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
            <span className="text-xs sm:text-sm font-medium">Solicitudes ({currentCount.solicitudes})</span>
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
            <span className="text-xs sm:text-sm font-medium">Ofertas ({currentCount.ofertas})</span>
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
            <span className="text-xs sm:text-sm font-medium">P. Recogida ({currentCount.puntos})</span>
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
                    value={filtroSolicitudes.urgencia}
                    onChange={(e) => changeSolicitudesFilter('urgencia', e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm"
                  >
                    <option value="todas">Todas las prioridades</option>
                    <option value="alta">Alta prioridad</option>
                    <option value="media">Media prioridad</option>
                    <option value="baja">Baja prioridad</option>
                  </select>
                  <select
                    value={filtroSolicitudes.pueblo}
                    onChange={(e) => changeSolicitudesFilter('pueblo', e.target.value)}
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
                {solicitudes.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-lg border border-gray-300 text-center flex justify-center items-center p-10 flex-col gap-5">
                    <p className="text-gray-700 text-lg font-medium">
                      No se encontraron solicitudes que coincidan con los filtros.
                    </p>

                    <button
                      onClick={() => {
                        setShowModal(true);
                      }}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2 whitespace-nowrap"
                    >
                      <HeartHandshake className="w-5 h-5" />
                      {/* Ofrecer ayuda a {towns === "todos" ? "" : towns[filtroSolicitudes.pueblo - 1].name} */}
                    </button>
                  </div>
                ) : (
                  solicitudes.map((caso) => <SolicitudCard town={''} key={caso.id} caso={caso} />)
                )}
              </div>
            </>
          )}

          {activeTab === 'ofertas' && (
            <>
              {/* FILTROS  */}
              <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
                <p className="font-bold text-md">Filtros</p>
                <div className="flex flex-col sm:flex-row gap-2 w-full justify-end">
                  <select
                    value={filtroOfertas.ayuda}
                    onChange={(e) => changeOfertasFilter('ayuda', e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm"
                  >
                    <option value="todas">Todas las ofertas</option>
                    {Object.entries(tiposAyudaOptions).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid gap-4">
                {ofertas.map((caso) => (
                  <div
                    key={caso.id}
                    className="bg-white p-4 rounded-lg shadow-lg border-l-4 border-green-500 overflow-hidden"
                  >
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
                            Ofrece:{' '}
                            {Array.isArray(caso.help_type)
                              ? caso.help_type
                                  .map((tipo) => {
                                    return tiposAyudaOptions[tipo] || tipo;
                                  })
                                  .join(', ')
                              : 'Ayuda general'}
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
                            {typeof caso.contact_info === 'string'
                              ? caso.contact_info
                              : JSON.parse(caso.contact_info).phone}
                          </span>
                        </div>
                      )}

                      {caso.resources && (
                        <>
                          {(() => {
                            let resources;
                            try {
                              resources =
                                typeof caso.resources === 'string' ? JSON.parse(caso.resources) : caso.resources;

                              return resources.vehicle ? (
                                <div className="flex items-start gap-2">
                                  <Truck className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
                                  <span className="break-words">
                                    <span className="font-semibold">Vehículo:</span> {resources.vehicle}
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
                          {new Date(caso.created_at).toLocaleDateString() +
                            ' ' +
                            new Date(caso.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
            </>
          )}

          {activeTab === 'puntos' && (
            <>
              {/* FILTROS  */}
              <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
                <p className="font-bold text-md">Filtros</p>
                <div className="flex flex-col sm:flex-row gap-2 w-full justify-end">
                  <select
                    value={filtroPuntos.ayuda}
                    onChange={(e) => changePuntosFilter('ayuda', e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm"
                  >
                    <option value="todas">Acepta todo</option>
                    {tiposAyudaAcepta.map((acepta) => (
                      <option key={acepta} value={acepta}>
                        {acepta}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {puntos.map((punto) => (
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
                        {Array.isArray(punto.accepted_items) ? punto.accepted_items.join(', ') : punto.accepted_items}
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
                        <p className="text-gray-700 mt-1 break-words">
                          {typeof punto.additional_info === 'string'
                            ? punto.additional_info
                            : JSON.stringify(punto.additional_info)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === 'mapa' && <Mapa markers={solicitudesMarkers} center={PAIPORTA_LAT_LNG} zoom={10}></Mapa>}
          <div className="flex items-center justify-center">
            <Pagination
              currentPage={currentPage[activeTab]}
              totalPages={numPages(currentCount[activeTab])}
              activeTab={activeTab}
              onPageChange={changePage}
            />
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <OfferHelp town={towns[filtroSolicitudes.pueblo - 1]} onClose={closeModal} isModal={true} />
        </div>
      )}
    </>
  );
}
