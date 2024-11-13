'use client';

import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';
import { isValidPhone } from '@/helpers/utils';
import { tiposAyudaArray } from '@/helpers/constants';
import { PhoneInput } from '@/components/input/PhoneInput';
import { HelpRequestData, HelpRequestHelpType, HelpRequestUrgencyType } from '@/types/Requests';
import { toast } from 'sonner';
import { LimitedTextarea } from '@/components/input/LimitedTextarea';
import AddressMap, { AddressDescriptor } from '@/components/AddressMap';
import { LngLat } from '@/components/map/GeolocationMap';
import { useSession } from '@/context/SessionProvider';
import Unauthorized from '@/components/Unauthorized';
import { CheckboxLegalText } from '../CheckboxLegalText';

export type HelpRequestFormData = {
  nombre: string;
  telefono: string;
  ubicacion: string;
  tiposAyuda: HelpRequestHelpType[];
  pueblo: string;
  status: string;
  coordinates: LngLat | null;
  numeroPersonas: number;
  descripcion: string;
  urgencia: HelpRequestUrgencyType;
  situacionEspecial: string;
  consentimiento: boolean;
  town_id: number;
};

export interface HelpRequestProps {
  request?: HelpRequestData;
  buttonText: [string, string];
  isSubmitting: boolean;
  submitMutation: (data: HelpRequestFormData) => Promise<any>;
}

export default function HelpRequestForm({
  request,
  buttonText = ['Enviar solicitud de ayuda', 'Enviando solicitud...'],
  isSubmitting,
  submitMutation,
}: HelpRequestProps) {
  const { user } = useSession();

  const [formData, setFormData] = useState<HelpRequestFormData>({
    nombre: request?.name || user?.user_metadata?.full_name || user?.user_metadata?.nombre || '',
    telefono: request?.contact_info || user?.user_metadata?.telefono || '',
    ubicacion: '',
    coordinates: { lat: 0, lng: 0 },
    tiposAyuda: request?.help_type || [],
    numeroPersonas: request?.number_of_people || 1,
    descripcion: request?.description || '',
    urgencia: request?.urgency === 'alta' ? 'alta' : request?.urgency === 'media' ? 'media' : 'baja',
    situacionEspecial: request?.additional_info?.special_situations || '',
    consentimiento: request?.additional_info?.consent || false,
    pueblo: '',
    status: request?.status || 'active',
    town_id: request?.town_id || 0,
  });

  useEffect(() => {
    setFormData({
      nombre: request?.name || user?.user_metadata?.full_name || user?.user_metadata?.nombre || '',
      telefono: request?.contact_info || user?.user_metadata?.telefono || '',
      ubicacion: '',
      coordinates: { lat: 0, lng: 0 },
      tiposAyuda: request?.help_type || [],
      numeroPersonas: request?.number_of_people || 1,
      descripcion: request?.description || '',
      urgencia: request?.urgency === 'alta' ? 'alta' : request?.urgency === 'media' ? 'media' : 'baja',
      situacionEspecial: request?.additional_info?.special_situations || '',
      consentimiento: request?.additional_info?.consent || false,
      pueblo: '',
      status: request?.status || 'active',
      town_id: request?.town_id || 0,
    });
  }, [user, request]);

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

    /* Form validation */
    if (!formData.coordinates) {
      alert('Elige una ubicacion valida');
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

  const handleOnNewAddressDescriptor = (addressDescriptor: AddressDescriptor) => {
    setFormData((prev) => ({
      ...prev,
      coordinates: addressDescriptor.coordinates,
      pueblo: addressDescriptor.town,
      ubicacion: addressDescriptor.address,
    }));
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

  if (!user) return <Unauthorized />;

  return (
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
      {!!request && (
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
      <div className="flex items-start flex-col gap-y-2">
        <label className="block text-sm text-gray-700 cursor-pointer">
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
        <CheckboxLegalText />
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
  );
}
