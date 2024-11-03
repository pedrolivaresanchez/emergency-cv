'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Truck, MapPin, Phone, Mail, Calendar, Package } from 'lucide-react';
import AddressAutocomplete from '@/components/AddressAutocomplete';

export default function PuntosEntrega() {
  const initialFormData = {
    name: '',
    location: '',
    city: '',
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    vehicle_type: '',
    cargo_type: '',
    schedule: '',
    additional_info: '',
    coordinates: null,
    status: 'active',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [points, setPoints] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const vehicleTypes = ['Camión grande (>3500kg)', 'Camión mediano', 'Furgoneta grande', 'Furgoneta mediana', 'Otro'];

  const cargoTypes = ['Alimentos', 'Ropa', 'Productos de limpieza', 'Material de construcción', 'Mobiliario', 'Varios'];

  useEffect(() => {
    fetchPoints();
  }, []);

  async function fetchPoints() {
    try {
      let { data, error } = await supabase
        .from('delivery_points')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPoints(data || []);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar los puntos de entrega');
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

      console.log('FormData before submission:', formData); // Debug log

      const pointData = {
        name: formData.name,
        location: formData.location,
        city: formData.city || null,
        contact_name: formData.contact_name || null,
        contact_phone: formData.contact_phone,
        contact_email: formData.contact_email || null,
        vehicle_type: formData.vehicle_type || null,
        cargo_type: formData.cargo_type || null,
        schedule: formData.schedule || null,
        additional_info: formData.additional_info || null,
        latitude: formData.coordinates?.lat ? parseFloat(formData.coordinates.lat) : null,
        longitude: formData.coordinates?.lon ? parseFloat(formData.coordinates.lon) : null,
        status: 'active',
      };

      console.log('PointData for submission:', pointData); // Debug log

      const { error: insertError } = await supabase.from('delivery_points').insert([pointData]);

      if (insertError) throw insertError;

      await fetchPoints();
      setSuccess(true);
      setShowForm(false);
      setFormData(initialFormData);

      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error al registrar punto de entrega:', error);
      setError(error.message || 'Error al registrar el punto de entrega');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Truck className="h-8 w-8" />
          Puntos de Entrega
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors whitespace-nowrap"
        >
          <Truck className="h-5 w-5" />
          Registrar Punto de Entrega
        </button>
      </div>

      {/* Lista de puntos de entrega */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {points.length > 0 ? (
          points.map((point) => (
            <div key={point.id} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-gray-800">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-blue-600">{point.name}</h3>
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{point.location}</span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    point.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {point.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                {point.cargo_type && (
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className="font-semibold">Tipo de carga:</span> {point.cargo_type}
                  </div>
                )}
                {point.vehicle_type && (
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-gray-500" />
                    <span className="font-semibold">Vehículos admitidos:</span> {point.vehicle_type}
                  </div>
                )}
                {point.schedule && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-semibold">Horario:</span> {point.schedule}
                  </div>
                )}
                {point.contact_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="font-semibold">Teléfono:</span> {point.contact_phone}
                  </div>
                )}
                {point.contact_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="font-semibold">Email:</span> {point.contact_email}
                  </div>
                )}
                {point.additional_info && (
                  <div className="mt-2 text-gray-600">
                    <span className="font-semibold">Información adicional:</span>
                    <p className="mt-1">{point.additional_info}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-gray-50 rounded-lg p-8 text-center">
            <Truck className="h-12 w-12 text-gray-800 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No hay puntos de entrega registrados</h3>
            <p className="text-gray-600 mb-4">
              Sé el primero en registrar un punto de entrega para ayudar con la logística de suministros.
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

      {/* Modal de formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">Registrar Punto de Entrega</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del punto *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección exacta *</label>
                <AddressAutocomplete
                  onSelect={(address) => {
                    console.log('Address selected:', address); // Debug log
                    setFormData((prev) => ({
                      ...prev,
                      location: address.fullAddress,
                      city: address.details.city,
                      coordinates: {
                        lat: address.coordinates.lat,
                        lon: address.coordinates.lon,
                      },
                    }));
                  }}
                  placeholder="Buscar dirección..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de vehículos</label>
                  <select
                    value={formData.vehicle_type}
                    onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Seleccionar...</option>
                    {vehicleTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de carga</label>
                  <select
                    value={formData.cargo_type}
                    onChange={(e) => setFormData({ ...formData, cargo_type: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Seleccionar...</option>
                    {cargoTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horario de recepción</label>
                <input
                  type="text"
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="Ej: Lunes a Viernes 9:00-18:00"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Persona de contacto</label>
                  <input
                    type="text"
                    value={formData.contact_name}
                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                  <input
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Información adicional</label>
                <textarea
                  value={formData.additional_info}
                  onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
                  className="w-full p-2 border rounded"
                  rows="3"
                  placeholder="Instrucciones especiales, requisitos, etc."
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
            <div className="text-green-700">Punto de entrega registrado correctamente</div>
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
