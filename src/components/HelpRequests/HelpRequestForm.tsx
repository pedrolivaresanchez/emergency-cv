'use client';

import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import { Mail } from 'lucide-react';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import { tiposAyudaArray } from '@/helpers/constants';
import { isValidPhone } from '@/helpers/utils';
import { PhoneInput } from '@/components/input/PhoneInput';
import { useTowns } from '@/context/TownProvider';
import { HelpRequestData, HelpRequestHelpType, HelpRequestUrgencyType } from '@/types/Requests';
import { Coordinates } from '@/components/HelpOffers/HelpOfferForm';
import { Town } from '@/types/Town';
import { toast } from 'sonner';
import { LimitedTextarea } from '@/components/input/LimitedTextarea';
import { useSession } from '@/context/SessionProvider';

export type HelpRequestFormData = {
  nombre: string;
  telefono: string;
  email: string;
  ubicacion: string;
  tiposAyuda: HelpRequestHelpType[];
  pueblo: number;
  status: string;
  coordinates?: Coordinates;
  numeroPersonas: number;
  descripcion: string;
  urgencia: HelpRequestUrgencyType;
  situacionEspecial: string;
  consentimiento: boolean;
};

export interface HelpRequestProps {
  town?: Town;
  data?: HelpRequestData;
  buttonText: [string, string];
  isSubmitting: boolean;
  submitMutation: (data: HelpRequestFormData) => Promise<any>;
}

export default function HelpRequestForm({
  town,
  data,
  buttonText = ['Enviar solicitud de ayuda', 'Enviando solicitud...'],
  isSubmitting,
  submitMutation,
}: HelpRequestProps) {
  const { towns } = useTowns();
  const { user } = useSession();

  const [formData, setFormData] = useState<HelpRequestFormData>({
    nombre: data?.name || '',
    ubicacion: data?.location || '',
    coordinates: { lat: 0, lng: 0 },
    tiposAyuda: data?.help_type || [],
    numeroPersonas: data?.number_of_people || 1,
    descripcion: data?.description || '',
    urgencia: data?.urgency === 'alta' ? 'alta' : data?.urgency === 'media' ? 'media' : 'baja',
    situacionEspecial: data?.additional_info?.special_situations || '',
    telefono: data?.contact_info || '',
    consentimiento: data?.additional_info?.consent || false,
    pueblo: data?.town_id || town?.id || 0,
    email: data?.additional_info?.email || '',
    status: data?.status || 'active',
  });

  const handleTipoAyudaChange = (tipo: HelpRequestHelpType) => {
    setFormData((prev) => ({
      ...prev,
      tiposAyuda: prev.tiposAyuda.includes(tipo)
        ? prev.tiposAyuda.filter((t) => t !== tipo)
        : [...prev.tiposAyuda, tipo],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.ubicacion) {
      toast.error('La ubicación es un campo obligatorio');
      return;
    }

    if (!formData.consentimiento) {
      toast.error('Debe aceptar el consentimiento para enviar la solicitud');
      return;
    }

    if (!isValidPhone(formData.telefono)) {
      toast.error('El teléfono de contacto no es válido. Si has usado espacios, elimínalos.');
      return;
    }

    await submitMutation(formData);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = 'checked' in e.target ? e.target.checked : false;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value || '',
    }));
  };

  const handlePhoneChange = useCallback((newPhone: string) => {
    setFormData((formData) => ({ ...formData, contacto: newPhone }));
  }, []);

  return (
    <div className="space-y-6">
      {/* Formulario principal */}
      <div className="bg-white rounded-lg shadow-lg p-6">
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
            <PhoneInput phoneNumber={formData.telefono} onChange={handlePhoneChange} required />
          </div>
          {!data && !user && (
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
          {!!data && (
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación exacta <span className="text-red-500">*</span>
            </label>
            <AddressAutocomplete
              initialValue={data?.location || ''}
              onSelect={(address) => {
                setFormData({
                  ...formData,
                  ubicacion: address.fullAddress,
                  coordinates: address.coordinates
                    ? {
                        lat: Number(address.coordinates.lat),
                        lng: Number(address.coordinates.lon),
                      }
                    : undefined,
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
              {tiposAyudaArray.map((tipo) => (
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
            <LimitedTextarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500"
              rows={3}
              placeholder="Describa su situación actual y el tipo de ayuda que necesita"
              maxLength={350}
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
              rows={2}
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
            disabled={isSubmitting}
            className={`w-full ${
              isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
            } text-white py-3 px-4 rounded-lg font-semibold`}
          >
            {isSubmitting ? buttonText[1] : buttonText[0]}
          </button>
        </form>
      </div>
    </div>
  );
}
