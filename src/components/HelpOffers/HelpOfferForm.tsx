import React, { useState, useCallback, useEffect } from 'react';
import { PhoneInput } from '@/components/input/PhoneInput';
import { isValidPhone } from '@/helpers/utils';
import { HelpRequestData, HelpRequestHelpType } from '@/types/Requests';
import { useSession } from '@/context/SessionProvider';
import { tiposAyudaArray } from '@/helpers/constants';
import { Town } from '@/types/Town';
import Unauthorized from '@/components/Unauthorized';
import { useTowns } from '@/context/TownProvider';
import { toast } from 'sonner';
import { InfoIcon } from 'lucide-react';

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

export default function HelpOfferForm({ data, buttonText, submitMutation }: HelpOfferProps) {
  const { user } = useSession();
  const { towns } = useTowns();

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

  useEffect(() => {
    setFormData({
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
  }, [user, data]);

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
      toast.warning('La ubicación es obligatoria');
      return;
    }
    if (!formData.aceptaProtocolo) {
      toast.warning('Debes aceptar el protocolo de actuación');
      return;
    }
    if (!isValidPhone(formData.telefono)) {
      toast.warning('El teléfono de contacto no es válido.');
      return;
    }
    await submitMutation(formData);
  };

  if (!user) return <Unauthorized />;

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 w-full">
      {/* Datos personales */}
      <div className="space-y-6 overflow-y-auto p-2">
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ¿De dónde eres? <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.ubicacion}
            onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
            placeholder="Ciudad o pueblo"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pueblo al que vas a ayudar <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.pueblo?.toString()}
            onChange={(e) => setFormData({ ...formData, pueblo: Number(e.target.value) })}
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
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold"
        >
          {buttonText[0]}
        </button>
      </div>

      <div className="mt-6 flex items-start gap-4">
        <InfoIcon className="h-6 w-6 text-blue-400 flex-shrink-0" />
        <div>
          <p className="text-sm text-gray-700">
            Las ofertas de ayuda se borrarán automáticamente a los 7 días. Si lo deseas, tras este plazo puedes crear
            una nueva oferta con datos actualizados.
          </p>
        </div>
      </div>
    </form>
  );
}
