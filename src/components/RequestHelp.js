'use client';

import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, Check, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import { mapToIdAndLabel, tiposAyudaOptions } from '@/helpers/constants';
import { isValidPhone } from '@/helpers/utils';
import { helpRequestService } from '@/lib/service';

import { PhoneInput } from '@/components/PhoneInput';
import { formatPhoneNumber } from '@/helpers/format';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function RequestHelp({ data = {} }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: data.name || '',
    ubicacion: data.location || '',
    coordinates: data.coordinates || null,
    tiposAyuda: data.help_type || [],
    numeroPersonas: data.number_of_people || '',
    descripcion: data.description || '',
    urgencia: data.urgency || 'alta',
    situacionEspecial: data.additional_info?.special_situations || '',
    contacto: data.contact_info || '',
    consentimiento: data.additional_info?.consent || false,
    pueblo: data.town_id || '',
    email: data.additional_info?.email || '',
  });
  const [status, setStatus] = useState({
    isSubmitting: false,
    error: null,
    success: false,
  });

  const [towns, setTowns] = useState([]);

  async function fetchTowns() {
    const { data, error } = await supabase.from('towns').select('id, name');

    if (error) {
      console.log('Error fetching towns:', error);
      return;
    }

    setTowns(data);
  }

  useEffect(() => {
    fetchTowns();
  }, []);

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

    if (!formData.ubicacion) {
      alert('La ubicación es un campo obligatorio');
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
      const helpRequestData = {
        type: 'necesita',
        name: formData.nombre,
        location: formData.ubicacion,
        latitude: formData.coordinates ? parseFloat(formData.coordinates.lat) : null,
        longitude: formData.coordinates ? parseFloat(formData.coordinates.lng) : null,
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
        town_id: formData.pueblo,
        status: 'active',
      };

      const { error } = await helpRequestService.createRequest(helpRequestData);

      if (error) {
        throw new Error(error.message);
      }

      // Limpiar formulario
      setFormData({
        nombre: '',
        ubicacion: '',
        coordinates: null,
        tiposAyuda: [],
        numeroPersonas: '',
        descripcion: '',
        urgencia: 'alta',
        situacionEspecial: '',
        contacto: '',
        pueblo: '',
        consentimiento: false,
      });

      setStatus({ isSubmitting: false, error: null, success: true });
      setTimeout(() => {
        setStatus((prev) => ({ ...prev, success: false }));
        router.push('/casos-activos/solicitudes');
      }, 5000);
    } catch (error) {
      console.log('Error al enviar solicitud:', error.message);
      setStatus({
        isSubmitting: false,
        error: `Error al enviar la solicitud: ${error.message}`,
        success: false,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePhoneChange = useCallback((e) => {
    setFormData((formData) => ({ ...formData, contacto: e.target.value }));
  }, []);

  return (
    <div className="space-y-6">
      {/* Banner de emergencia */}
      <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
          <div>
            <h2 className="text-red-800 font-bold">EMERGENCIA ACTIVA - Inundaciones CV</h2>
            <p className="text-red-700 text-sm mt-1">
              Para emergencias médicas inmediatas, llame al 112. Este formulario es para coordinar ayuda y asistencia.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
          <div className="space-y-4">
            <h2 className="text-red-800 font-bold">PARA PERSONAS CON DIFICULTADES TECNICAS</h2>
            <div className="flex flex-col text-red-700 space-y-2">
              <p className="font-bold">
                AVISO IMPORTANTE: Esta información es sólo para personas que tengan dificultades técnicas a la hora de
                pedir ayuda.
              </p>
              <p className="mb-2">
                Hemos habilitado el número{' '}
                <a className="font-bold text-blue-600 hover:text-blue-800" href="tel:+34626675591">
                  626 675 591
                </a>{' '}
                para facilitar la petición de ayuda a aquellas personas que encuentren complicado usar la página web.{' '}
              </p>
              <p className="font-bold">
                ¡Importante! No saturéis el teléfono si podéis usar la página web, por favor. Si tenéis alguna duda
                sobre la página web o deseas aportar nuevas ideas, por favor escríbenos a{' '}
                <a className="text-blue-600 hover:text-blue-800" href="mailto:info@ajudadana.es">
                  info@ajudadana.es
                </a>
              </p>
              <p>También puedes contactar con nosotros a través de:</p>
              <a className="text-blue-600 hover:text-blue-800 flex space-x-2" href="https://wa.me/34626675591">
                <Image
                  src={
                    'https://upload.wikimedia.org/wikipedia/commons/a/a7/2062095_application_chat_communication_logo_whatsapp_icon.svg'
                  }
                  alt="Whatsapp icon"
                  height={20}
                  width={20}
                />
                <span className="font-semibold">WhatsApp</span>
              </a>
            </div>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación exacta <span className="text-red-500">*</span>
            </label>
            <AddressAutocomplete
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Número de personas</label>
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
          {/* Pueblos */}
          <div>
            <div className="flex flex-row justify-between mb-2 items-end">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pueblo <span className="text-red-500">*</span>
              </label>
              <a
                href="mailto:info@ajudadana.es?subject=Solicitud%20de%20nuevo%20pueblo%20para%20Voluntómetro"
                className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap"
              >
                <Mail className="h-5 w-5" />
                Solicitar nuevo pueblo
              </a>
            </div>
            <select
              name="pueblo"
              value={formData.pueblo}
              onChange={handleChange}
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
            {status.isSubmitting ? 'Enviando solicitud...' : 'Enviar Solicitud de Ayuda'}
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
