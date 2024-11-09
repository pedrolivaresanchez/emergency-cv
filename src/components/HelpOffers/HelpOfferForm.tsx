import React, { useState, useCallback } from 'react';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import { PhoneInput } from '@/components/input/PhoneInput';
import { isValidPhone } from '@/helpers/utils';
import { HelpRequestData, HelpRequestHelpType } from '@/types/Requests';
import { useSession } from '@/context/SessionProvider';
import { tiposAyudaArray } from '@/helpers/constants';
import { Town } from '@/types/Town';
import Unauthorized from '@/components/Unauthorized';

export type HelpOfferFormData = {
  aceptaProtocolo: boolean;
  nombre: string;
  telefono: string;
  ubicacion: string;
  tiposAyuda: HelpRequestHelpType[];
  otraAyuda: string;
  vehiculo: string;
  disponibilidad: string[];
  radio: number;
  experiencia: string;
  comentarios: string;
  pueblo: number;
  status: string;
};

export interface HelpOfferProps {
  town?: Town;
  data?: HelpRequestData;
  buttonText: [string, string];
  submitMutation: (data: HelpOfferFormData) => Promise<any>;
}

export default function HelpOfferForm({ town, data, buttonText, submitMutation }: HelpOfferProps) {
  const { user } = useSession();

  const [formData, setFormData] = useState<HelpOfferFormData>({
    nombre: data?.name || user?.user_metadata?.full_name || user?.user_metadata?.nombre || '',
    telefono: data?.contact_info || user?.user_metadata?.telefono || '',
    ubicacion: data?.location || '',
    tiposAyuda: data?.help_type || [],
    otraAyuda: data?.other_help || '',
    vehiculo: data?.resources?.vehicle || '',
    disponibilidad: data?.resources?.availability || [],
    radio: data?.resources?.radius || 1,
    experiencia: data?.additional_info?.experience || '',
    comentarios: data?.description || '',
    aceptaProtocolo: !!data,
    pueblo: data?.town_id || 0,
    status: data?.status || '',
  });

  const handleTipoAyudaChange = (tipo: HelpRequestHelpType) => {
    setFormData((prev) => ({
      ...prev,
      tiposAyuda: prev.tiposAyuda.includes(tipo)
        ? prev.tiposAyuda.filter((t) => t !== tipo)
        : [...prev.tiposAyuda, tipo],
    }));
  };

  const handlePhoneChange = useCallback((phoneNumber: string) => {
    setFormData((prev) => ({ ...prev, telefono: phoneNumber }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    await submitMutation(formData);
  };

  if (!user) return <Unauthorized />;

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 w-full">
      {/* Datos personales */}
      <div className="space-y-6 max-h-[65vh] overflow-y-auto p-2">
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

        {/* Ubicación exacta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación exacta *</label>
          <AddressAutocomplete
            initialValue={data?.location ?? ''}
            onSelect={(address) => {
              setFormData({
                ...formData,
                ubicacion: address.fullAddress,
              });
            }}
            placeholder="Calle, número, piso, ciudad..."
            required
          />
        </div>

        {/* Tipo de ayuda */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de ayuda que puedes ofrecer</label>
          <div className="grid md:grid-cols-2 gap-2">
            {tiposAyudaArray.map((tipo) => (
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

        {/* Otra ayuda específica */}
        {formData.tiposAyuda.includes('otros') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">¿Qué tipo de ayuda?</label>
            <textarea
              value={formData.otraAyuda}
              onChange={(e) => setFormData({ ...formData, otraAyuda: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500"
              rows={3}
              placeholder="Especifica qué tipo de ayuda..."
            />
          </div>
        )}

        {/* Vehículo disponible */}
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

        {/* Radio de acción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Radio de acción (km)</label>
          <input
            type="number"
            value={formData.radio}
            onChange={(e) =>
              setFormData({
                ...formData,
                radio: Number(e.target.value),
              })
            }
            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
            min={1}
            placeholder="¿Cuántos kilómetros puedes desplazarte?"
          />
        </div>

        {/* Experiencia relevante */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Experiencia relevante</label>
          <textarea
            value={formData.experiencia}
            onChange={(e) => setFormData({ ...formData, experiencia: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
            rows={3}
            placeholder="Describe tu experiencia en situaciones similares, formación, etc."
          />
        </div>

        {/* Comentarios adicionales */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Comentarios adicionales</label>
          <textarea
            value={formData.comentarios}
            onChange={(e) => setFormData({ ...formData, comentarios: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
            rows={3}
            placeholder="Información adicional que quieras compartir"
          />
        </div>

        {/* Pueblo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pueblo *</label>
          <select
            value={formData.pueblo?.toString()}
            onChange={(e) => setFormData({ ...formData, pueblo: Number(e.target.value) })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500"
            required
          >
            <option value="">Selecciona un pueblo</option>
            {town && (
              <option key={town.id} value={town.id}>
                {town.name}
              </option>
            )}
          </select>
        </div>

        {/* Aceptación del protocolo */}
        <div className="flex items-start">
          <label className="ml-2 text-sm text-gray-700 flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.aceptaProtocolo}
              onChange={(e) => setFormData({ ...formData, aceptaProtocolo: e.target.checked })}
              className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            Acepto seguir el protocolo de actuación y las indicaciones de las autoridades competentes.
          </label>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold"
        >
          {buttonText[0]}
        </button>
      </div>
    </form>
  );
}
