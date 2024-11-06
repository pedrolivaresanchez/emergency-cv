'use client';

import { useState, useEffect, useCallback } from 'react';
import { HeartHandshake, Check, Mail } from 'lucide-react';
import { helpRequestService } from '@/lib/service';
import { supabase } from '@/lib/supabase/client';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import { mapToIdAndLabel, tiposAyudaOptions as _tiposAyudaOptions } from '@/helpers/constants';
import { isValidPhone } from '@/helpers/utils';

import { PhoneInput } from '@/components/PhoneInput';
import { formatPhoneNumber } from '@/helpers/format';
import { useTowns } from '../context/TownProvider';
import { useRouter } from 'next/navigation';

export default function OfferHelp({
  town,
  onClose,
  isModal,
  data = {},
  title = '',
  button = ['Registrar oferta de ayuda', 'Enviando oferta...'],
  id,
  redirect = '/casos-activos/ofertas',
  submitType = 'create',
}) {
  const towns = useTowns();

  const router = useRouter();

  const [formData, setFormData] = useState({
    nombre: data.name || '',
    telefono: data.contact_info || '',
    email: data.additional_info.email || '',
    ubicacion: data.location || '',
    tiposAyuda: data.help_type || [],
    vehiculo: data.resources.vehicle || '',
    disponibilidad: data.resources.availability || [],
    radio: data.resources.radius || 1,
    experiencia: data.additional_info.experience || '',
    comentarios: data.description || '',
    aceptaProtocolo: submitType ? true : false,
    pueblo: submitType ? data.town_id : town ? town.id : '',
    status: data.status,
  });

  const [status, setStatus] = useState({
    isSubmitting: false,
    error: null,
    success: false,
  });

  const tiposAyudaOptions = mapToIdAndLabel(_tiposAyudaOptions);

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const handleTipoAyudaChange = (tipo) => {
    setFormData((prev) => ({
      ...prev,
      tiposAyuda: prev.tiposAyuda.includes(tipo)
        ? prev.tiposAyuda.filter((t) => t !== tipo)
        : [...prev.tiposAyuda, tipo],
    }));
  };

  const handleDisponibilidadChange = (dia) => {
    setFormData((prev) => ({
      ...prev,
      disponibilidad: prev.disponibilidad.includes(dia)
        ? prev.disponibilidad.filter((d) => d !== dia)
        : [...prev.disponibilidad, dia],
    }));
  };

  const handlePhoneChange = useCallback((phoneNumber) => {
    setFormData((formData) => ({ ...formData, telefono: phoneNumber }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!formData.ubicacion) {
      alert('La ubicación es obligatoria');
      return;
    }

    if (!formData.aceptaProtocolo) {
      alert('Debes aceptar el protocolo de actuación');
      return;
    }

    if (!isValidPhone(formData.telefono)) {
      alert('El teléfono de contacto no es válido.');
      return;
    }

    setStatus({ isSubmitting: true, error: null, success: false });

    try {
      const helpOfferData = {
        type: 'ofrece',
        name: formData.nombre,
        location: formData.ubicacion,
        description: formData.comentarios,
        contact_info: formatPhoneNumber(formData.telefono),
        additional_info: {
          email: formData.email,
          experience: formData.experiencia,
        },
        status: 'active',
        resources: {
          vehicle: formData.vehiculo,
          availability: formData.disponibilidad,
          radius: formData.radio,
        },
        latitude: formData.coordinates ? parseFloat(formData.coordinates.lat) : null,
        longitude: formData.coordinates ? parseFloat(formData.coordinates.lng) : null,
        help_type: formData.tiposAyuda,
        town_id: formData.pueblo,
        status: formData.status,
      };

      if (submitType === 'create') {
        const { error } = await helpRequestService.createRequest(helpOfferData);
        if (error) {
          throw new Error(error.message);
        }
      }
      if (submitType === 'edit') {
        console.log('EDITAR');
        const { error } = await helpRequestService.editRequest(helpOfferData, id);
        if (error) {
          throw new Error(error.message);
        }
      }

      setFormData({
        nombre: '',
        telefono: '',
        email: '',
        ubicacion: '',
        tiposAyuda: [],
        vehiculo: '',
        disponibilidad: [],
        radio: 1,
        experiencia: '',
        comentarios: '',
        aceptaProtocolo: false,
        pueblo: '',
        status: 'active',
      });
      setStatus({ isSubmitting: false, error: null, success: true });
      setStatus((prev) => ({ ...prev, success: false }));
      router.push(redirect);
    } catch (error) {
      console.error('Error al registrar oferta de ayuda:', error);
      setStatus({
        isSubmitting: false,
        error: `Error al registrar tu oferta de ayuda: ${error.message || 'Error desconocido'}`,
        success: false,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white rounded-lg p-6 w-full relative flex flex-col gap-6 ${town ? 'max-w-2xl' : ''}`}
    >
      {/* Banner informativo */}
      {submitType === 'create' ? (
        <div className="bg-green-50 border-green-500 p-4 rounded">
          <div className="flex items-start">
            <HeartHandshake className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
            <div>
              <h2 className="text-green-800 font-semibold">
                Me apunto como voluntario {town ? 'en ' + town.name : ''}
              </h2>
              <p className="text-green-700 text-sm mt-1">
                Al registrarte como voluntario, te comprometes a seguir las indicaciones de las autoridades y los
                protocolos establecidos.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <h1 className="text-2xl font-bold">{title}</h1>
      )}
      {status.error && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{status.error}</p>
        </div>
      )}

      {/* Formulario */}

      <div className="space-y-6 max-h-[65vh] overflow-y-auto p-2">
        {/* Datos personales */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <PhoneInput phoneNumber={formData.telefono} onChange={handlePhoneChange} required />
        </div>

        {submitType === 'create' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        )}
        {submitType === 'edit' && (
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Progreso de tu solicitud
            </label>
            <select
              name="status"
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500"
            >
              <option value="active">Activa - Aún no ayudo</option>
              <option value="progress">En progreso - Estoy en ello</option>
              <option value="finished">Terminada - Ya he ayudado</option>
            </select>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ubicación exacta <span className="text-red-500">*</span>
          </label>
          <AddressAutocomplete
            initialValue={data.location}
            onSelect={(address) => {
              setFormData({
                ...formData,
                ubicacion: address.fullAddress,
                coordinates: address.coordinates
                  ? {
                      lat: address.coordinates.lat,
                      lng: address.coordinates.lon,
                    }
                  : null,
              });
            }}
            placeholder="Calle, número, piso, ciudad..."
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Incluya todos los detalles posibles para poder localizarle (campo obligatorio)
          </p>
        </div>

        {/* Tipos de ayuda */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de ayuda que puedes ofrecer</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Vehículo disponible</label>
          <select
            value={formData.vehiculo}
            onChange={(e) => setFormData({ ...formData, vehiculo: e.target.value })}
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Disponibilidad</label>
          <div className="flex flex-wrap gap-2">
            {diasSemana.map((dia) => (
              <label
                key={dia}
                className={`flex items-center p-2 rounded cursor-pointer ${
                  formData.disponibilidad.includes(dia) ? 'bg-green-100 text-green-800' : 'bg-gray-50 hover:bg-gray-100'
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Radio de acción (km)</label>
          <input
            type="number"
            value={formData.radio}
            onChange={(e) => setFormData({ ...formData, radio: Number(e.target.value) })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
            min="1"
            placeholder="¿Cuántos kilómetros puedes desplazarte?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Experiencia relevante</label>
          <textarea
            value={formData.experiencia}
            onChange={(e) => setFormData({ ...formData, experiencia: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
            rows="3"
            placeholder="Describe tu experiencia en situaciones similares, formación, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Comentarios adicionales</label>
          <textarea
            value={formData.comentarios}
            onChange={(e) => setFormData({ ...formData, comentarios: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
            rows="3"
            placeholder="Información adicional que quieras compartir"
          />
        </div>

        {/* Pueblos */}
        <div>
          <div className="flex flex-row justify-between mb-2 items-end">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pueblo <span className="text-red-500">*</span>
            </label>
          </div>
          <select
            name="pueblo"
            value={formData.pueblo}
            onChange={(e) => setFormData({ ...formData, pueblo: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500"
            required
          >
            <option value="">Selecciona un pueblo</option>
            {towns.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        {/* Aceptación de protocolo */}
        <div className="flex items-start">
          <label className="ml-2 text-sm text-gray-700 flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.aceptaProtocolo}
              onChange={(e) => setFormData({ ...formData, aceptaProtocolo: e.target.checked })}
              className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            Acepto seguir el protocolo de actuación y las indicaciones de las autoridades competentes. Entiendo que mi
            seguridad y la de los demás es prioritaria.
          </label>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        {isModal && (
          <button
            type="submit"
            className={`w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-semibold 
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
            onClick={onClose}
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={status.isSubmitting}
          className={`w-full ${
            status.isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
          } text-white py-3 px-4 rounded-lg font-semibold 
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
        >
          {status.isSubmitting ? button[1] : button[0]}
        </button>
      </div>
      {status.success && (
        <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 p-4 rounded shadow-lg z-50">
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-2" />
            <div>
              <p className="text-green-700 font-medium">Tu oferta de ayuda ha sido registrada correctamente.</p>
              <p className="text-green-600 text-sm mt-1">
                Gracias por tu disposición para ayudar. Te contactaremos si necesitamos tu apoyo.
              </p>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
