'use client';

import { useState } from 'react';
import { Package } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { isValidPhone, isNumericOrSpaces } from '@/helpers/utils';

export default function PuntoRecogida() {
  const [formData, setFormData] = useState({
    name: '',
    type: 'permanente',
    location: '',
    city: '',
    contact_name: '',
    contact_phone: '',
    accepted_items: [],
    urgent_needs: '',
    status: 'active',
  });

  const [status, setStatus] = useState({
    isSubmitting: false,
    error: null,
    success: false,
  });

  const tiposAyuda = ['Alimentos', 'Agua', 'Ropa', 'Mantas', 'Medicamentos', 'Productos de higiene'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ isSubmitting: true, error: null, success: false });

    try {
      // Validar campos requeridos
      if (!formData.name || !formData.location || !formData.city || !formData.contact_name || !formData.contact_phone) {
        throw new Error('Por favor, complete todos los campos obligatorios');
      }

      if (formData.accepted_items.length === 0) {
        throw new Error('Seleccione al menos un tipo de ayuda');
      }

      if (!isValidPhone(formData.contact_phone)) {
        throw new Error('El teléfono de contacto no es válido');
      }

      // Insertar en Supabase directamente
      const { error } = await supabase.from('collection_points').insert([formData]);

      if (error) throw error;

      // Limpiar formulario
      setFormData({
        name: '',
        type: 'permanente',
        location: '',
        city: '',
        contact_name: '',
        contact_phone: '',
        accepted_items: [],
        urgent_needs: '',
        status: 'active',
      });

      setStatus({ isSubmitting: false, error: null, success: true });
      setTimeout(() => setStatus((prev) => ({ ...prev, success: false })), 5000);
    } catch (error) {
      console.error('Error:', error);
      setStatus({
        isSubmitting: false,
        error: error.message || 'Error al registrar el punto de recogida',
        success: false,
      });
    }
  };

  return (
    <div className="space-y-6">
      {status.error && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{status.error}</p>
        </div>
      )}

      {status.success && (
        <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded">
          <p className="text-green-700">Punto de recogida registrado correctamente</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <Package className="h-6 w-6 text-blue-500 mr-2" />
          <h1 className="text-2xl font-bold">Registrar Punto de Recogida</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del centro*</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección completa*</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad*</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Persona responsable*</label>
            <input
              type="text"
              value={formData.contact_name}
              onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono de contacto*</label>
            <input
              type="tel"
              pattern="[0-9]{1,9}"
              maxLength="9"
              placeholder="Teléfono móvil preferiblemente (sin el prefijo +34)"
              value={formData.contact_phone}
              onChange={(e) =>
                isNumericOrSpaces(e.target.value) && setFormData({ ...formData, contact_phone: e.target.value })
              }
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Necesidades urgentes</label>
            <textarea
              value={formData.urgent_needs}
              onChange={(e) => setFormData({ ...formData, urgent_needs: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              rows="2"
              placeholder="¿Qué se necesita con más urgencia?"
            />
          </div>

          <button
            type="submit"
            disabled={status.isSubmitting}
            className={`w-full ${
              status.isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            } text-white py-3 px-4 rounded-lg font-semibold`}
          >
            {status.isSubmitting ? 'Registrando...' : 'Registrar Punto de Recogida'}
          </button>
        </form>
      </div>
    </div>
  );
}
