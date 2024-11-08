'use client';

import { useCallback, useState } from 'react';
import { Check, Mail } from 'lucide-react';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import { mapToIdAndLabel, tiposAyudaOptions } from '@/helpers/constants';
import { formatPhoneNumber, isValidPhone } from '@/helpers/utils';
import { helpRequestService, locationService, townService } from '@/lib/service';

import { PhoneInput } from '@/components/PhoneInput';
import { useRouter } from 'next/navigation';
import { CallCenterLink } from '@/components/CallCenterLink';
import AddressMap from './AddressMap';
import { useTowns } from '@/context/TownProvider';
import { useSession } from '@/context/SessionProvider';

export default function RequestHelp({
  data = {},
  title = 'Solicitar Ayuda',
  button = ['Enviar solicitud de ayuda', 'Enviando solicitud...'],
  submitType = 'create',
  id,
  redirect = '/casos-activos/solicitudes',
}) {
  const { towns } = useTowns();
  const router = useRouter();
  const session = useSession();
  const userId = session.user?.id;
  const [formData, setFormData] = useState({
    nombre: data.name || '',
    ubicacion: data.location || '',
    coordinates: { lat: data.latitude || 3, lng: data.longitude || 3 },
    tiposAyuda: data.help_type || [],
    numeroPersonas: data.number_of_people || '',
    descripcion: data.description || '',
    urgencia: data.urgency || 'alta',
    situacionEspecial: data.additional_info?.special_situations || '',
    contacto: data.contact_info || '',
    consentimiento: data.additional_info?.consent || false,
    pueblo: '',
    town_id: data.town_id || '',
    email: data.additional_info?.email || '',
    status: data.status || 'active',
  });

  const [status, setStatus] = useState({
    isSubmitting: false,
    error: null,
    success: false,
  });

  const handleTipoAyudaChange = (tipo) => {
    setFormData((prev) => ({
      ...prev,
      tiposAyuda: prev.tiposAyuda.includes(tipo)
        ? prev.tiposAyuda.filter((t) => t !== tipo)
        : [...prev.tiposAyuda, tipo],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* Form validation */
    if (!formData.coordinates) {
      alert('Elige una ubicacion valida');
      return;
    }

    if (!formData.consentimiento) {
      alert('Debe aceptar el consentimiento para enviar la solicitud');
      return;
    }

    if (!isValidPhone(formData.contacto)) {
      alert('El teléfono de contacto no es válido. Si has usado espacios, elimínalos.');
      return;
    }

    setStatus({ isSubmitting: true, error: null, success: false });

    try {
      const latitude = String(formData.coordinates.lat);
      const longitude = String(formData.coordinates.lng);
      let town_id = formData.town_id;

      if (formData.pueblo !== '') {
        const { data: townResponse, error: townError } = await townService.createIfNotExists(formData.pueblo);
        if (townError) throw townError;
        town_id = townResponse[0].id;
      }

      const helpRequestData = {
        type: 'necesita',
        name: formData.nombre,
        location: formData.ubicacion,
        latitude,
        longitude,
        help_type: formData.tiposAyuda,
        description: formData.descripcion,
        urgency: formData.urgencia,
        number_of_people: parseInt(formData.numeroPersonas) || 1,
        contact_info: formatPhoneNumber(formData.contacto),
        additional_info: {
          special_situations: formData.situacionEspecial || null,
          consent: true,
          email: formData.email,
        },
        town_id,
        status: formData.status,
        user_id: userId,
      };
      if (submitType === 'create') {
        const { error } = await helpRequestService.createRequest(helpRequestData);
        if (error) {
          throw new Error(error.message);
        }
      }
      if (submitType === 'edit') {
        const { error } = await helpRequestService.editRequest(helpRequestData, id);
        if (error) {
          throw new Error(error.message);
        }
      }

      setFormData({
        nombre: '',
        ubicacion: '',
        coordinates: { lat: null, lng: null },
        tiposAyuda: [],
        numeroPersonas: '',
        descripcion: '',
        urgencia: 'alta',
        situacionEspecial: '',
        contacto: '',
        pueblo: '',
        email: '',
        consentimiento: false,
        status: 'active',
      });

      setStatus({ isSubmitting: false, error: null, success: true });
      setStatus((prev) => ({ ...prev, success: false }));
      router.push(redirect);
    } catch (error) {
      console.error('Error al enviar solicitud:', error.message);
      setStatus({
        isSubmitting: false,
        error: `Error al enviar la solicitud: ${error.message}`,
        success: false,
      });
    }
  };

  const handleOnNewAddressDescriptor = (addressDescriptor) => {
    setFormData((prev) => ({
      ...prev,
      coordinates: addressDescriptor.coordinates,
      pueblo: addressDescriptor.town,
      ubicacion: addressDescriptor.address,
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value || '',
    }));
  };

  const handlePhoneChange = useCallback((e) => {
    setFormData((formData) => ({ ...formData, contacto: e.target.value }));
  }, []);

  return (
    <div className="space-y-6">
      {status.error && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{status.error}</p>
        </div>
      )}

      {/* Formulario principal */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">{title}</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <PhoneInput phoneNumber={formData.contacto} onChange={handlePhoneChange} required />
          </div>
          {submitType === 'create' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Se utilizara para que puedas eliminar o editar la información de tu solicitud
              </p>
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
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500"
              >
                <option value="active">Activa - Aún no recibo ayuda</option>
                <option value="progress">En progreso - Están viniendo a ayudarme</option>
                <option value="finished">Terminada - Ya me han ayudado</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de ayuda necesaria</label>
            <div className="grid md:grid-cols-2 gap-2">
              {mapToIdAndLabel(tiposAyudaOptions).map((tipo) => (
                <label
                  key={tipo.id}
                  className={`flex items-center p-3 rounded cursor-pointer ${
                    formData.tiposAyuda.includes(tipo.id) ? 'bg-red-50 text-red-800' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.tiposAyuda.includes(tipo.id)}
                    onChange={() => handleTipoAyudaChange(tipo.id)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <span className="ml-2">{tipo.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número de personas afectadas</label>
            <input
              type="number"
              name="numeroPersonas"
              value={formData.numeroPersonas}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción de la situación</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de urgencia</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Situaciones especiales</label>
            <textarea
              name="situacionEspecial"
              value={formData.situacionEspecial}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500"
              rows="2"
              placeholder="Personas mayores, niños pequeños, personas con movilidad reducida, necesidades médicas, mascotas..."
            />
          </div>
          {/* Mapa */}
          <div>
            <AddressMap
              titulo="Ubicación exacta"
              onNewAddressDescriptor={handleOnNewAddressDescriptor}
              initialAddressDescriptor={{
                address: formData.ubicacion,
                coordinates: formData.coordinates,
                town: formData.pueblo,
              }}
            />
          </div>

          {/* Consentimiento */}
          <div className="flex items-start">
            <label className="ml-2 block text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                name="consentimiento"
                checked={formData.consentimiento}
                onChange={handleChange}
                className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mr-2"
              />
              Doy mi consentimiento para el tratamiento de los datos proporcionados y confirmo que la información
              proporcionada es verídica.
            </label>
          </div>

          <button
            type="submit"
            disabled={status.isSubmitting}
            className={`w-full ${
              status.isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
            } text-white py-3 px-4 rounded-lg font-semibold`}
          >
            {status.isSubmitting ? button[1] : button[0]}
          </button>
        </form>
      </div>

      {status.success && (
        <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 p-4 rounded shadow-lg z-50">
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-2" />
            <div>
              <p className="text-green-700 font-medium">Su solicitud de ayuda ha sido registrada correctamente.</p>
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
