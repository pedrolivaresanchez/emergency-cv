'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { HeartHandshake, Check, Mail, Thermometer } from 'lucide-react';
import { helpRequestService } from '@/lib/service';

export default function Voluntometro() {
  const [selectedPueblo, setSelectedPueblo] = useState(null);
  const [pueblos, setPueblos] = useState([]);
  const [helpCards, setHelpCards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState({
    isSubmitting: false,
    error: null,
    success: false
  });

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
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo'
  ];

  const [showNewTownModal, setShowNewTownModal] = useState(false);
  const [newTownName, setNewTownName] = useState('');

  useEffect(() => {
    fetchPueblos();
  }, []);

  useEffect(() => {
    fetchHelpRequests();
  }, [pueblos]);

  const fetchPueblos = async () => {
    const { data, error } = await supabase.from('towns').select('*');
    setPueblos(data);
  };

  const fetchHelpRequests = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('help_requests')
      .select('*')
      .gte('created_at', today)
      .lte('created_at', today + 'T23:59:59.999Z');

    // log data of Torrent location
    console.log(
      'Torrent',
      data
        .filter((v) => v.location?.includes('Torrent'))
        .map((v) => ({ type: v.type, name: v.name }))
    );

    if (pueblos.length > 0) {
      const helpCards = pueblos.map((pueblo) => {
        const helpNeeded = data.filter(
          (v) => v.location?.includes(pueblo.name) && v.type === 'necesita'
        ).length;
        const helpOffered = data.filter(
          (v) => v.location?.includes(pueblo.name) && v.type === 'ofrece'
        ).length;

        return {
          ...pueblo,
          help_needed: helpNeeded,
          help_offered: helpOffered
        };
      });

      setHelpCards(helpCards);
    }
  };

  const handleTipoAyudaChange = (tipo) => {
    setFormData((prev) => ({
      ...prev,
      tiposAyuda: prev.tiposAyuda.includes(tipo)
        ? prev.tiposAyuda.filter((t) => t !== tipo)
        : [...prev.tiposAyuda, tipo]
    }));
  };

  const handleDisponibilidadChange = (dia) => {
    setFormData((prev) => ({
      ...prev,
      disponibilidad: prev.disponibilidad.includes(dia)
        ? prev.disponibilidad.filter((d) => d !== dia)
        : [...prev.disponibilidad, dia]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        location: selectedPueblo || null,
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
      setShowModal(false);
      // fetchVolunteers(); // Refresh the counts
      fetchPueblos();
      fetchHelpRequests();

      setTimeout(
        () => setStatus((prev) => ({ ...prev, success: false })),
        5000
      );
    } catch (error) {
      console.error('Error al registrar oferta de ayuda:', error);
      setStatus({
        isSubmitting: false,
        error: `Error al registrar tu oferta de ayuda: ${error.message || 'Error desconocido'}`,
        success: false
      });
    }
  };

  const getFechaHoy = () => {
    const fecha = new Date();
    return fecha.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleNewTownSubmit = (e) => {
    e.preventDefault();
    window.location.href = `mailto:info@ajudadana.es?subject=${encodeURIComponent('Solicitud de nuevo pueblo para Voluntómetro')}&body=${encodeURIComponent(`Solicito añadir el siguiente pueblo al Voluntómetro:\n\nNombre del pueblo: ${newTownName}`)}`;
    setShowNewTownModal(false);
    setNewTownName('');
  };

  const getTopAndBottomPueblos = () => {
    const pueblosConVoluntarios = pueblos.filter(
      (pueblo) => pueblo.help_offered > 0
    );
    const pueblosSinVoluntarios = pueblos.filter(
      (pueblo) => pueblo.help_offered === 0
    );

    const sortedPueblos = [...pueblosConVoluntarios].sort(
      (a, b) => b.help_offered - a.help_offered
    );

    return {
      top: sortedPueblos.slice(0, 2),
      bottom: pueblosSinVoluntarios.slice(0, 2)
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
        <h2 className="text-lg font-semibold mb-4 text-orange-500">
          Resumen de Voluntarios del {getFechaHoy()}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-green-600 font-medium">
              Mayor participación hoy
            </h3>
            {getTopAndBottomPueblos().top.length > 0 ? (
              getTopAndBottomPueblos().top.map((pueblo) => (
                <div
                  key={pueblo.name}
                  className="flex items-center justify-between bg-green-50 p-3 rounded-lg"
                >
                  <span className="font-medium">{pueblo.name}</span>
                  <div className="flex items-center">
                    <span className="text-green-600 font-bold">
                      {pueblo.help_offered}
                    </span>
                    <span className="text-gray-500 ml-1">voluntarios</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 italic">
                No hay voluntarios registrados hoy
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-red-600 font-medium">Necesitan más apoyo</h3>
            {getTopAndBottomPueblos().bottom.map((pueblo) => (
              <div
                key={pueblo.name}
                className="flex items-center justify-between bg-red-50 p-3 rounded-lg"
              >
                <span className="font-medium">{pueblo.name}</span>
                <div className="flex items-center">
                  <span className="text-red-600 font-bold">
                    {pueblo.help_offered}
                  </span>
                  <span className="text-gray-500 ml-1">voluntarios</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {helpCards &&
          helpCards.map((helpCard) => (
            <div
              key={helpCard.name}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-bold mb-2">{helpCard.name}</h2>
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col gap-2">
                  <div className="text-lg">
                    <span className="font-semibold">
                      {helpCard.help_offered}
                    </span>{' '}
                    voluntarios
                  </div>
                  <div className="text-lg">
                    <span className="font-semibold">
                      {helpCard.help_needed}
                    </span>{' '}
                    necesitan ayuda
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedPueblo(helpCard.name);
                    setFormData((prev) => ({
                      ...prev,
                      location: helpCard.name
                    }));
                    setShowModal(true);
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full my-8 relative top-8">
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded mb-6">
              <div className="flex items-start">
                <HeartHandshake className="h-5 w-5 text-orange-500 mt-0.5 mr-2" />
                <div>
                  <h2 className="text-orange-800 font-semibold">
                    Me apunto como voluntario en {selectedPueblo}
                  </h2>
                  <p className="text-orange-700 text-sm mt-1">
                    Al registrarte como voluntario, te comprometes a seguir las
                    indicaciones de las autoridades y los protocolos
                    establecidos.
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 max-h-[70vh] overflow-y-auto p-2"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) =>
                      setFormData({ ...formData, telefono: e.target.value })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
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
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehículo disponible
                </label>
                <select
                  value={formData.vehiculo}
                  onChange={(e) =>
                    setFormData({ ...formData, vehiculo: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">No dispongo de vehículo</option>
                  <option value="coche">Coche</option>
                  <option value="todoterreno">Todoterreno/4x4</option>
                  <option value="furgoneta">Furgoneta</option>
                  <option value="barca">Barca</option>
                </select>
              </div>

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
                  onChange={(e) =>
                    setFormData({ ...formData, radio: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, experiencia: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, comentarios: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  rows="3"
                  placeholder="Información adicional que quieras compartir"
                />
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData.aceptaProtocolo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      aceptaProtocolo: e.target.checked
                    })
                  }
                  className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Acepto seguir el protocolo de actuación y las indicaciones de
                  las autoridades competentes. Entiendo que mi seguridad y la de
                  los demás es prioritaria.
                </label>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
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
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={status.isSubmitting}
                  className={`${
                    status.isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600'
                  } text-white py-2 px-4 rounded font-semibold 
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
                >
                  {status.isSubmitting ? 'Registrando...' : 'Confirmar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {status.error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 p-4 rounded shadow-lg z-50">
          <div className="flex items-center">
            <div className="text-red-700">{status.error}</div>
          </div>
        </div>
      )}

      {status.success && (
        <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 p-4 rounded shadow-lg z-50">
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-2" />
            <div>
              <p className="text-green-700 font-medium">
                Tu oferta de ayuda ha sido registrada correctamente.
              </p>
              <p className="text-green-600 text-sm mt-1">
                Gracias por tu disposición para ayudar. Te contactaremos si
                necesitamos tu apoyo.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
