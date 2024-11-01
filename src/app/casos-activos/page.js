'use client';

import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function CasosActivos() {
  const [activeTab, setActiveTab] = useState('solicitudes');
  const [solicitudes, setSolicitudes] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const [puntosRecogida, setPuntosRecogida] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch help requests (solo solicitudes de ayuda)
        const { data: solicitudesData, error: solicitudesError } = await supabase
          .from('help_requests')
          .select('*')
          .eq('type', 'necesita') // Filtramos solo las solicitudes de tipo "necesita"
          .order('created_at', { ascending: false });

        if (solicitudesError) {
          console.error('Error fetching solicitudes:', solicitudesError);
          setSolicitudes([]);
        } else {
          setSolicitudes(solicitudesData || []);
        }

        // Fetch help offers (solo ofertas de ayuda)
        const { data: ofertasData, error: ofertasError } = await supabase
          .from('help_requests')
          .select('*')
          .eq('type', 'ofrece') // Filtramos solo las solicitudes de tipo "ofrece"
          .order('created_at', { ascending: false });

        if (ofertasError) {
          console.error('Error fetching ofertas:', ofertasError);
          setOfertas([]);
        } else {
          setOfertas(ofertasData || []);
        }

        // Fetch collection points
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
  }, []);

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
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-2 bg-white p-2 rounded-lg shadow">
        <button
          onClick={() => setActiveTab('solicitudes')}
          className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
            activeTab === 'solicitudes'
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Solicitudes de Ayuda ({solicitudes.length})
        </button>
        <button
          onClick={() => setActiveTab('ofertas')}
          className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
            activeTab === 'ofertas'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Ofertas de Ayuda ({ofertas.length})
        </button>
        <button
          onClick={() => setActiveTab('puntos')}
          className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
            activeTab === 'puntos'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Puntos de Recogida ({puntosRecogida.length})
        </button>
      </div>

      {/* Lista de casos */}
      <div className="grid gap-4">
        {activeTab === 'solicitudes' && (
          <div className="grid gap-4">
            {solicitudes.map((caso) => (
              <div key={caso.id} className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-red-600">
                    {caso.name || "Necesita Ayuda"}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    caso.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    caso.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    {caso.status === 'pending' ? 'Pendiente' :
                     caso.status === 'in_progress' ? 'En proceso' :
                     'Activo'}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{caso.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Ubicación:</span> {caso.location}
                  </div>
                  <div>
                    <span className="font-semibold">Fecha:</span>{' '}
                    {new Date(caso.created_at).toLocaleDateString()}
                  </div>
                  {caso.contact_info && typeof caso.contact_info === 'object' && (
                    <>
                      {caso.contact_info.phone && (
                        <div>
                          <span className="font-semibold">Número de tlf:</span> {caso.contact_info.phone}
                        </div>
                      )}
                      {caso.contact_info.email && (
                        <div>
                          <span className="font-semibold">Email:</span> {caso.contact_info.email}
                        </div>
                      )}
                    </>
                  )}
                  {caso.urgency && (
                    <div>
                      <span className="font-semibold">Urgencia:</span>{' '}
                      <span className={`${
                        caso.urgency === 'high' ? 'text-red-600' :
                        caso.urgency === 'medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {caso.urgency === 'alta' ? 'Alta' :
                         caso.urgency === 'media' ? 'Media' :
                         'Baja'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ofertas' && (
          <div className="grid gap-4">
            {ofertas.map((caso) => (
              <div key={caso.id} className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-green-600">
                    Ofrece: {caso.help_type ? 
                      (typeof caso.help_type === 'string' ? 
                        caso.help_type.split(',').join(', ') : 
                        Array.isArray(caso.help_type) ? 
                          caso.help_type.join(', ') : 
                          caso.help_type
                      ) : "Ayuda general"}
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                    {caso.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{caso.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Ubicación:</span> {caso.location}
                  </div>
                  <div>
                    <span className="font-semibold">Fecha:</span>{' '}
                    {new Date(caso.created_at).toLocaleDateString()}
                  </div>
                  {/* Información de contacto */}
                  {caso.contact_info && (
                    <div className="col-span-2 space-y-2">
                      {typeof caso.contact_info === 'object' ? (
                        <>
                          {caso.contact_info.name && (
                            <div>
                              <span className="font-semibold">Nombre:</span> {caso.contact_info.name}
                            </div>
                          )}
                          {caso.contact_info.phone && (
                            <div>
                              <span className="font-semibold">Contacto:</span> {caso.contact_info.phone}
                            </div>
                          )}
                          {caso.contact_info.email && (
                            <div>
                              <span className="font-semibold">Email:</span> {caso.contact_info.email}
                            </div>
                          )}
                          {caso.contact_info.additional_info && (
                            <div>
                              <span className="font-semibold">Información adicional:</span> {caso.contact_info.additional_info}
                            </div>
                          )}
                        </>
                      ) : (
                        <div>
                          <span className="font-semibold">Contacto:</span> {caso.contact_info}
                        </div>
                      )}
                    </div>
                  )}
                  {caso.availability && (
                    <div className="col-span-2">
                      <span className="font-semibold">Disponibilidad:</span> {caso.availability}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'puntos' && puntosRecogida.map((punto) => (
          <div key={punto.id} className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-blue-600">{punto.name}</h3>
                <div className="flex items-center text-gray-600 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{punto.location}</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                {punto.status === 'active' ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm mt-4">
              <div>
                <span className="font-semibold">Ciudad:</span> {punto.city}
              </div>
              {punto.contact_name && (
                <div>
                  <span className="font-semibold">Responsable:</span> {punto.contact_name}
                </div>
              )}
              {punto.contact_phone && (
                <div>
                  <span className="font-semibold">Teléfono:</span> {punto.contact_phone}
                </div>
              )}
              {punto.accepted_items && (
                <div className="col-span-2">
                  <span className="font-semibold">Acepta:</span>{' '}
                  {Array.isArray(punto.accepted_items) 
                    ? punto.accepted_items.join(', ')
                    : punto.accepted_items}
                </div>
              )}
              {punto.urgent_needs && (
                <div className="col-span-2">
                  <span className="font-semibold">Necesidades urgentes:</span>
                  <p className="text-gray-700 mt-1">{punto.urgent_needs}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 