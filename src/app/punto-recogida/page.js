'use client';

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { MapPin, Phone, Package, House, Contact, Megaphone } from 'lucide-react';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import { isValidPhone } from '@/helpers/utils';
import { PhoneInput } from '@/components/PhoneInput';

export default function PuntosRecogida() {
  const initialFormData = {
    name: '',
    type: 'permanente',
    location: '',
    city: '',
    contact_name: '',
    contact_phone: '',
    accepted_items: [],
    urgent_needs: '',
    status: 'active',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [collectionPoints, setCollectionPoints] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const tiposAyuda = ['Alimentos', 'Agua', 'Ropa', 'Mantas', 'Medicamentos', 'Productos de higiene'];

  const handlePhoneChange = useCallback((phoneNumber) => {
    setFormData((formData) => ({ ...formData, contact_phone: phoneNumber }));
  }, []);

  useEffect(() => {
    fetchCollectionPoints();
  }, []);

  async function fetchCollectionPoints() {
    try {
      let { data, error } = await supabase
        .from('collection_points')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCollectionPoints(data || []);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar los puntos de recogida');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const requiredFields = ['name', 'location', 'contact_phone'];
      const missingFields = requiredFields.filter((field) => !formData[field]);

      if (missingFields.length > 0) {
        throw new Error('Por favor completa todos los campos obligatorios');
      }

      if (!isValidPhone(formData.contact_phone)) {
        alert('El teléfono de contacto no es válido.');
        return;
      }

      console.log('FormData before submission:', formData); // Debug log

      const pointData = {
        name: formData.name,
        type: 'permanente',
        location: formData.location,
        city: formData.city || null,
        contact_name: formData.contact_name || null,
        contact_phone: formData.contact_phone,
        accepted_items: formData.accepted_items || [],
        urgent_needs: formData.urgent_needs || null,
        status: 'active',
      };

      console.log('PointData for submission:', pointData); // Debug log

      const { error: insertError } = await supabase.from('collection_points').insert([pointData]);

      if (insertError) throw insertError;

      await fetchCollectionPoints();
      setSuccess(true);
      setShowForm(false);
      setFormData(initialFormData);

      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error al registrar punto de recogida:', error);
      setError(error.message || 'Error al registrar el punto de recogida');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Package className="h-6 w-6 text-blue-500 mr-2" />
          Puntos de recogida
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors whitespace-nowrap"
        >
          <Package className="h-5 w-5" />
          Registrar Punto de Recogida
        </button>
      </div>

      {/* Lista de puntos de recogida */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {collectionPoints.length > 0 ? (
          collectionPoints.map((point) => (
            <div key={point.id} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-gray-800">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-blue-600">{point.name}</h3>
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{point.location}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap mr-2 bg-purple-300`}>
                  Referencia: {point.id}
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium whitespace-nowrap">
                  {point.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                {point.city && (
                  <div className="flex items-center gap-2">
                    <House className="h-4 w-4 text-gray-500" />
                    <span className="font-semibold">Ciudad:</span> {point.city}
                  </div>
                )}
                {point.contact_name && (
                  <div className="flex items-center gap-2">
                    <Contact className="h-4 w-4 text-gray-500" />
                    <span className="font-semibold">Nombre de contacto:</span> {point.contact_name}
                  </div>
                )}
                {point.accepted_items && (
                  <div className="flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-gray-500" />
                    <span className="break-words">
                      <span className="font-semibold">Necesita:</span>{' '}
                      {Array.isArray(point.accepted_items)
                        ? point.accepted_items
                            .map((tipo) => {
                              return tipo;
                            })
                            .join(', ')
                        : 'Ayuda general'}
                    </span>
                  </div>
                )}
                {point.contact_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="font-semibold">Teléfono:</span> {point.contact_phone}
                  </div>
                )}
                {point.urgent_needs && (
                  <div className="mt-2 text-gray-600">
                    <span className="font-semibold">Necesidades urgentes:</span>
                    <p className="mt-1">{point.urgent_needs}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-gray-50 rounded-lg p-8 text-center">
            <Package className="h-12 w-12 text-gray-800 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No hay puntos de recogida registrados</h3>
            <p className="text-gray-600 mb-4">
              Sé el primero en registrar un punto de recogida para ayudar con la logística de suministros.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors inline-flex items-center gap-2"
            >
              <Package className="h-5 w-5" />
              Registrar punto
            </button>
          </div>
        )}
      </div>

      {/* Modal2 de formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">Registrar Punto de Recogida</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del centro *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección completa *</label>
                <AddressAutocomplete
                  onSelect={(address) => {
                    console.log('Address selected:', address); // Debug log
                    setFormData((prev) => ({
                      ...prev,
                      location: address.fullAddress,
                      city: address.details.city,
                      coordinates: address.coordinates
                        ? {
                            lat: address.coordinates.lat,
                            lng: address.coordinates.lon,
                          }
                        : null,
                    }));
                  }}
                  placeholder="Buscar dirección..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipos de ayuda que se aceptan*</label>
                <div className="grid grid-cols-2 gap-2">
                  {tiposAyuda.map((tipo) => (
                    <label
                      key={tipo}
                      className={`flex items-center p-3 rounded cursor-pointer ${
                        formData.accepted_items.includes(tipo)
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.accepted_items.includes(tipo)}
                        onChange={(e) => {
                          const newItems = e.target.checked
                            ? [...formData.accepted_items, tipo]
                            : formData.accepted_items.filter((item) => item !== tipo);
                          setFormData({ ...formData, accepted_items: newItems });
                        }}
                        className="sr-only"
                      />
                      <span>{tipo}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Persona responsable</label>
                  <input
                    type="text"
                    value={formData.contact_name}
                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <PhoneInput phoneNumber={formData.contact_phone} onChange={handlePhoneChange} required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Necesidades urgentes</label>
                <textarea
                  value={formData.urgent_needs}
                  onChange={(e) => setFormData({ ...formData, urgent_needs: e.target.value })}
                  className="w-full p-2 border rounded"
                  rows="3"
                  placeholder="¿Qué se necesita con más urgencia?"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData(initialFormData);
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                  {loading ? 'Registrando...' : 'Registrar punto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mensajes de éxito/error */}
      {success && (
        <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 p-4 rounded shadow-lg z-50">
          <div className="flex items-center">
            <div className="text-green-700">Punto de recogida registrado correctamente</div>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 p-4 rounded shadow-lg z-50">
          <div className="flex items-center">
            <div className="text-red-700">{error}</div>
          </div>
        </div>
      )}
    </div>
  );
}
