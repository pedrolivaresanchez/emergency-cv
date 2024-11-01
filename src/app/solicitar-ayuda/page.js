'use client';

import { useState } from 'react';
import { AlertTriangle, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SolicitarAyuda() {
  const [formData, setFormData] = useState({
    nombre: '',
    ubicacion: '',
    tipoAyuda: 'evacuacion',
    numeroPersonas: '',
    descripcion: '',
    urgencia: 'alta',
    situacionEspecial: '',
    contacto: '',
    consentimiento: false
  });

  const [status, setStatus] = useState({
    isSubmitting: false,
    error: null,
    success: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.consentimiento) {
      alert('Debe aceptar el consentimiento para enviar la solicitud');
      return;
    }

    setStatus({ isSubmitting: true, error: null, success: false });

    try {
      const helpRequestData = {
        type: 'necesita',
        name: formData.nombre,
        location: formData.ubicacion,
        help_type: [formData.tipoAyuda],
        description: formData.descripcion,
        urgency: formData.urgencia,
        number_of_people: parseInt(formData.numeroPersonas) || 1,
        contact_info: formData.contacto,
        additional_info: {
          special_situations: formData.situacionEspecial || null,
          consent: true
        },
        status: 'active'
      };

      const { data, error } = await supabase
        .from('help_requests')
        .insert([helpRequestData])
        .select();

      if (error) {
        throw new Error(error.message);
      }

      // Limpiar formulario
      setFormData({
        nombre: '',
        ubicacion: '',
        tipoAyuda: 'evacuacion',
        numeroPersonas: '',
        descripcion: '',
        urgencia: 'alta',
        situacionEspecial: '',
        contacto: '',
        consentimiento: false
      });

      setStatus({ isSubmitting: false, error: null, success: true });
      setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 5000);

    } catch (error) {
      console.error('Error al enviar solicitud:', error.message);
      setStatus({
        isSubmitting: false,
        error: `Error al enviar la solicitud: ${error.message}`,
        success: false
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Banner de emergencia */}
      <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
          <div>
            <h2 className="text-red-800 font-bold">EMERGENCIA ACTIVA - Inundaciones CV</h2>
            <p className="text-red-700 text-sm mt-1">
              Para emergencias médicas inmediatas, llame al 112. Este formulario es para 
              coordinar ayuda y asistencia.
            </p>
          </div>
        </div>
      </div>

      {status.error && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{status.error}</p>
        </div>
      )}

      {/* Formulario principal */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Solicitar Ayuda</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500"
              
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación exacta
            </label>
            <input
              type="text"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500"
              placeholder="Calle, número, piso, ciudad..."
              
            />
            <p className="mt-1 text-sm text-gray-500">
              Incluya todos los detalles posibles para poder localizarle (calle, número, piso, puerta, ciudad)
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de ayuda necesaria
              </label>
              <select
                name="tipoAyuda"
                value={formData.tipoAyuda}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500"
                
              >
                <option value="evacuacion">Evacuación urgente</option>
                <option value="agua">Agua potable</option>
                <option value="alimentos">Alimentos</option>
                <option value="medicinas">Medicinas</option>
                <option value="ropa">Ropa/Mantas</option>
                <option value="otros">Otros</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de personas
              </label>
              <input
                type="number"
                name="numeroPersonas"
                value={formData.numeroPersonas}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500"
                min="1"
                
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción de la situación
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500"
              rows="3"
              placeholder="Describa su situación actual y el tipo de ayuda que necesita"
              
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nivel de urgencia
            </label>
            <select
              name="urgencia"
              value={formData.urgencia}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500"
              
            >
              <option value="alta">Alta - Necesito ayuda inmediata</option>
              <option value="media">Media - Puedo esperar unas horas</option>
              <option value="baja">Baja - No es urgente</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Situaciones especiales
            </label>
            <textarea
              name="situacionEspecial"
              value={formData.situacionEspecial}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500"
              rows="2"
              placeholder="Personas mayores, niños pequeños, personas con movilidad reducida, necesidades médicas, mascotas..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono de contacto
            </label>
            <input
              type="tel"
              name="contacto"
              value={formData.contacto}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500"
              placeholder="Teléfono móvil preferiblemente"
              
            />
          </div>

          {/* Consentimiento */}
          <div className="flex items-start">
            <input
              type="checkbox"
              name="consentimiento"
              checked={formData.consentimiento}
              onChange={handleChange}
              className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              
            />
            <label className="ml-2 block text-sm text-gray-700">
              Doy mi consentimiento para el tratamiento de los datos proporcionados y confirmo que la
              información proporcionada es verídica.
            </label>
          </div>

          <button
            type="submit"
            disabled={status.isSubmitting}
            className={`w-full ${
              status.isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-red-500 hover:bg-red-600'
            } text-white py-3 px-4 rounded-lg font-semibold`}
          >
            {status.isSubmitting ? 'Enviando solicitud...' : 'Enviar Solicitud de Ayuda'}
          </button>
        </form>
      </div>

      {status.success && (
        <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 p-4 rounded shadow-lg z-50">
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-2" />
            <div>
              <p className="text-green-700 font-medium">
                Su solicitud de ayuda ha sido registrada correctamente.
              </p>
              <p className="text-green-600 text-sm mt-1">
                Se está coordinando la ayuda. En caso de empeorar la situación, contacte al 112.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}