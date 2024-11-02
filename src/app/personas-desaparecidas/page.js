'use client';

import { useState } from 'react';
import { UserSearch, AlertCircle, Phone, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function PersonaDesaparecida() {
  const [formData, setFormData] = useState({
    // Datos personales
    nombreCompleto: '',
    edad: '',
    genero: '',
    altura: '',
    complexion: '',

    // Descripción física
    descripcionFisica: '',
    ropa: '',

    // Último avistamiento
    lugarUltimaVez: '',
    fechaUltimaVez: '',
    horaUltimaVez: '',
    circunstancias: '',

    // Información médica
    condicionesMedicas: '',

    // Datos del reportante
    nombreReportante: '',
    parentesco: '',
    telefonoContacto: '',
    telefonoAlternativo: '',

    consentimiento: false,
  });

  const [status, setStatus] = useState({
    isSubmitting: false,
    error: null,
    success: false,
  });

  // En el handleSubmit, reemplazar con:

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.consentimiento) {
      alert('Debe aceptar el consentimiento para enviar el reporte');
      return;
    }

    setStatus({ isSubmitting: true, error: null, success: false });

    try {
      // Preparar datos para Supabase
      const missingPersonData = {
        name: formData.nombreCompleto,
        age: parseInt(formData.edad),
        gender: formData.genero,
        height: formData.altura ? parseInt(formData.altura) : null,
        description: formData.descripcionFisica,
        last_seen_location: formData.lugarUltimaVez,
        last_seen_date: new Date(`${formData.fechaUltimaVez}T${formData.horaUltimaVez}`).toISOString(),
        reporter_name: formData.nombreReportante,
        reporter_contact: formData.telefonoContacto,
        status: 'active',
        medical_conditions: formData.condicionesMedicas || null,
        clothing_description: formData.ropa,
        additional_info: {
          circumstances: formData.circunstancias,
          secondary_contact: formData.telefonoAlternativo,
          relationship: formData.parentesco,
        },
      };

      // Insertar directamente usando supabase
      const { error } = await supabase.from('missing_persons').insert([missingPersonData]);

      if (error) throw error;

      // Limpiar formulario
      setFormData({
        nombreCompleto: '',
        edad: '',
        genero: '',
        altura: '',
        complexion: '',
        descripcionFisica: '',
        ropa: '',
        lugarUltimaVez: '',
        fechaUltimaVez: '',
        horaUltimaVez: '',
        circunstancias: '',
        condicionesMedicas: '',
        nombreReportante: '',
        parentesco: '',
        telefonoContacto: '',
        telefonoAlternativo: '',
        consentimiento: false,
      });

      setStatus({ isSubmitting: false, error: null, success: true });
      setTimeout(() => setStatus((prev) => ({ ...prev, success: false })), 5000);
    } catch (error) {
      console.error('Error al enviar el reporte:', error);
      setStatus({
        isSubmitting: false,
        error: 'Error al enviar el reporte. Por favor, inténtalo de nuevo.',
        success: false,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner de emergencia 112 */}
      <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
          <div>
            <h2 className="text-red-800 font-bold flex items-center">
              <Phone className="h-4 w-4 mr-1" />
              LLAME PRIMERO AL 112
            </h2>
            <p className="text-red-700 text-sm mt-1">
              Si la desaparición es reciente o sospecha que la persona está en peligro inmediato, contacte primero con
              el 112.
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
        <div className="flex items-center mb-6">
          <UserSearch className="h-6 w-6 text-purple-500 mr-2" />
          <h1 className="text-2xl font-bold">Reportar Persona Desaparecida</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Datos personales */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h2 className="font-semibold text-lg text-purple-800 mb-4">Datos de la Persona Desaparecida</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                <input
                  type="text"
                  value={formData.nombreCompleto}
                  onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Edad</label>
                <input
                  type="number"
                  value={formData.edad}
                  onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
                <select
                  value={formData.genero}
                  onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Seleccionar</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Altura aprox. (cm)</label>
                <input
                  type="number"
                  value={formData.altura}
                  onChange={(e) => setFormData({ ...formData, altura: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Descripción física y ropa */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="font-semibold text-lg mb-4">Descripción</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción física detallada</label>
              <textarea
                value={formData.descripcionFisica}
                onChange={(e) => setFormData({ ...formData, descripcionFisica: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500"
                rows="3"
                placeholder="Color de pelo, ojos, marcas distintivas, etc."
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ropa que vestía</label>
              <textarea
                value={formData.ropa}
                onChange={(e) => setFormData({ ...formData, ropa: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500"
                rows="2"
              />
            </div>
          </div>

          {/* Último avistamiento */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h2 className="font-semibold text-lg text-purple-800 mb-4">Último Avistamiento</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input
                  type="date"
                  value={formData.fechaUltimaVez}
                  onChange={(e) => setFormData({ ...formData, fechaUltimaVez: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hora aproximada</label>
                <input
                  type="time"
                  value={formData.horaUltimaVez}
                  onChange={(e) => setFormData({ ...formData, horaUltimaVez: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Lugar exacto o aproximado</label>
              <input
                type="text"
                value={formData.lugarUltimaVez}
                onChange={(e) => setFormData({ ...formData, lugarUltimaVez: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500"
                placeholder="Dirección o punto de referencia"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Circunstancias</label>
              <textarea
                value={formData.circunstancias}
                onChange={(e) => setFormData({ ...formData, circunstancias: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500"
                rows="3"
              />
            </div>
          </div>

          {/* Contacto */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="font-semibold text-lg mb-4">Datos de Contacto</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del reportante</label>
                <input
                  type="text"
                  value={formData.nombreReportante}
                  onChange={(e) => setFormData({ ...formData, nombreReportante: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono principal</label>
                <input
                  type="tel"
                  value={formData.telefonoContacto}
                  onChange={(e) => setFormData({ ...formData, telefonoContacto: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Consentimiento */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start">
              <input
                type="checkbox"
                checked={formData.consentimiento}
                onChange={(e) => setFormData({ ...formData, consentimiento: e.target.checked })}
                className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Doy mi consentimiento para el tratamiento de los datos proporcionados y confirmo que la información
                proporcionada es verídica. Entiendo que proporcionar información falsa puede ser constitutivo de delito.
              </label>
            </div>
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={status.isSubmitting}
            className={`w-full ${
              status.isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-600'
            } text-white py-3 px-4 rounded-lg font-semibold 
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
          >
            {status.isSubmitting ? 'Enviando reporte...' : 'Enviar Reporte'}
          </button>
        </form>
      </div>

      {status.success && (
        <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 p-4 rounded shadow-lg z-50">
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-2" />
            <div>
              <p className="text-green-700 font-medium">El reporte ha sido enviado correctamente.</p>
              <p className="text-green-600 text-sm mt-1">
                Gracias por proporcionar esta información. Las autoridades han sido notificadas.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
