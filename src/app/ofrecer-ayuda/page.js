'use client';

import { useState } from 'react';
import { HeartHandshake, Check } from 'lucide-react';
import { helpRequestService } from '@/lib/service';

export default function OfrecerAyuda() {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    ubicacion: '',
    tiposAyuda: [],
    vehiculo: '',
    disponibilidad: [],
    radio: '',
    experiencia: '',
    comentarios: '',
    aceptaProtocolo: false
  });

  const [status, setStatus] = useState({
    isSubmitting: false,
    error: null,
    success: false
  });

  const tiposAyudaOptions = [
    { id: 'transporte', label: 'Transporte/Evacuación' },
    { id: 'alojamiento', label: 'Alojamiento temporal' },
    { id: 'suministros', label: 'Distribución de suministros' },
    { id: 'rescate', label: 'Equipo de rescate' },
    { id: 'medico', label: 'Asistencia médica' },
    { id: 'psicologico', label: 'Apoyo psicológico' },
    { id: 'limpieza', label: 'Limpieza/Desescombro' },
    { id: 'logistica', label: 'Apoyo logístico' }
  ];

  const diasSemana = [
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
  ];

  const handleTipoAyudaChange = (tipo) => {
    setFormData(prev => ({
      ...prev,
      tiposAyuda: prev.tiposAyuda.includes(tipo)
        ? prev.tiposAyuda.filter(t => t !== tipo)
        : [...prev.tiposAyuda, tipo]
    }));
  };

  const handleDisponibilidadChange = (dia) => {
    setFormData(prev => ({
      ...prev,
      disponibilidad: prev.disponibilidad.includes(dia)
        ? prev.disponibilidad.filter(d => d !== dia)
        : [...prev.disponibilidad, dia]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Solo validar el protocolo
    if (!formData.aceptaProtocolo) {
      alert('Debes aceptar el protocolo de actuación');
      return;
    }
  
    setStatus({ isSubmitting: true, error: null, success: false });
  
    try {
      const helpOfferData = {
        type: 'ofrece',
        name: formData.nombre || null,
        contact_info: JSON.stringify({
          phone: formData.telefono || null,
          email: formData.email || null
        }),
        location: formData.ubicacion || null,
        help_type: formData.tiposAyuda.length > 0 ? formData.tiposAyuda : null,
        description: formData.comentarios || null,
        resources: JSON.stringify({
          vehicle: formData.vehiculo || null,
          availability: formData.disponibilidad || [],
          radius: formData.radio || null,
          experience: formData.experiencia || null
        }),
        status: 'active'
      };
  
      const result = await helpRequestService.create(helpOfferData);
  
      // Limpiar formulario
      setFormData({
        nombre: '',
        telefono: '',
        email: '',
        ubicacion: '',
        tiposAyuda: [],
        vehiculo: '',
        disponibilidad: [],
        radio: '',
        experiencia: '',
        comentarios: '',
        aceptaProtocolo: false
      });
  
      setStatus({ isSubmitting: false, error: null, success: true });
      setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 5000);
  
    } catch (error) {
      console.error('Error al registrar oferta de ayuda:', error);
      setStatus({
        isSubmitting: false,
        error: `Error al registrar tu oferta de ayuda: ${error.message || 'Error desconocido'}`,
        success: false
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner informativo */}
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
        <div className="flex items-start">
          <HeartHandshake className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
          <div>
            <h2 className="text-green-800 font-semibold">Información importante</h2>
            <p className="text-green-700 text-sm mt-1">
              Al registrarte como voluntario, te comprometes a seguir las indicaciones 
              de las autoridades y los protocolos establecidos. Tu ayuda es fundamental 
              para la comunidad.
            </p>
          </div>
        </div>
      </div>

      {status.error && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{status.error}</p>
        </div>
      )}

      {/* Formulario */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Ofrecer Ayuda</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Datos personales */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
              
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación
            </label>
            <input
              type="text"
              value={formData.ubicacion}
              onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Ciudad o zona desde donde puedes ayudar"
              
            />
          </div>

          {/* Tipos de ayuda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de ayuda que puedes ofrecer
            </label>
            <div className="grid md:grid-cols-2 gap-2">
              {tiposAyudaOptions.map((tipo) => (
                <label 
                  key={tipo.id}
                  className="flex items-center p-3 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.tiposAyuda.includes(tipo.id)}
                    onChange={() => handleTipoAyudaChange(tipo.id)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="ml-2">{tipo.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Vehículo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehículo disponible
            </label>
            <select
              value={formData.vehiculo}
              onChange={(e) => setFormData({...formData, vehiculo: e.target.value})}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">No dispongo de vehículo</option>
              <option value="coche">Coche</option>
              <option value="todoterreno">Todoterreno/4x4</option>
              <option value="furgoneta">Furgoneta</option>
              <option value="barca">Barca</option>
            </select>
          </div>

          {/* Disponibilidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Disponibilidad
            </label>
            <div className="flex flex-wrap gap-2">
              {diasSemana.map((dia) => (
                <label 
                  key={dia}
                  className={`flex items-center p-2 rounded cursor-pointer ${
                    formData.disponibilidad.includes(dia)
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.disponibilidad.includes(dia)}
                    onChange={() => handleDisponibilidadChange(dia)}
                    className="sr-only"
                  />
                  <span>{dia}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Radio de acción (km)
            </label>
            <input
              type="number"
              value={formData.radio}
              onChange={(e) => setFormData({...formData, radio: e.target.value})}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
              min="1"
              placeholder="¿Cuántos kilómetros puedes desplazarte?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experiencia relevante
            </label>
            <textarea
              value={formData.experiencia}
              onChange={(e) => setFormData({...formData, experiencia: e.target.value})}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
              rows="3"
              placeholder="Describe tu experiencia en situaciones similares, formación, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comentarios adicionales
            </label>
            <textarea
              value={formData.comentarios}
              onChange={(e) => setFormData({...formData, comentarios: e.target.value})}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
              rows="3"
              placeholder="Información adicional que quieras compartir"
            />
          </div>

          {/* Aceptación de protocolo */}
          <div className="flex items-start">
            <input
              type="checkbox"
              checked={formData.aceptaProtocolo}
              onChange={(e) => setFormData({...formData, aceptaProtocolo: e.target.checked})}
              className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Acepto seguir el protocolo de actuación y las indicaciones de las autoridades competentes.
              Entiendo que mi seguridad y la de los demás es prioritaria.
            </label>
          </div>

          <button
            type="submit"
            disabled={status.isSubmitting}
            className={`w-full ${
              status.isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600'
            } text-white py-3 px-4 rounded-lg font-semibold 
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
          >
            {status.isSubmitting ? 'Registrando oferta...' : 'Registrar Oferta de Ayuda'}
          </button>
        </form>
      </div>

      {status.success && (
        <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 p-4 rounded shadow-lg z-50">
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-2" />
            <div>
              <p className="text-green-700 font-medium">
                Tu oferta de ayuda ha sido registrada correctamente.
              </p>
              <p className="text-green-600 text-sm mt-1">
                Gracias por tu disposición para ayudar. Te contactaremos si necesitamos tu apoyo.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}