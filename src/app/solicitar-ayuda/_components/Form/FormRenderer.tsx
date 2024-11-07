'use client';
import React from 'react';
import { Check } from 'lucide-react';

import { PhoneInput } from '@/components/PhoneInput';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import { TIPOS_DE_AYUDA } from '../constants';
import { TipoDeAyudaInputRenderer } from '../TipoDeAyudaInputRenderer';
import { FormData, HelpCategory, Status } from '../types';
import TownSelector from '../TownSelector/TownSelectorDataWrapper';

type FormRendererProps = {
  status: Status;
  formData: FormData;
  selectedHelp: Map<HelpCategory['id'], boolean>;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  handlePhoneChange: (phoneNumber: string) => void;
  handleAddressSelection: (address: string) => void;
  handleSituacionEspecialChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  handleUrgencyChange: React.ChangeEventHandler<HTMLSelectElement>;
  handleDescriptionChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  handleTownChange: React.ChangeEventHandler<HTMLSelectElement>;
  handleTipoAyudaChange: React.ChangeEventHandler<HTMLInputElement>;
  handleNameChange: React.ChangeEventHandler<HTMLInputElement>;
  handleEmailChange: React.ChangeEventHandler<HTMLInputElement>;
  handleNumberPeopleChange: React.ChangeEventHandler<HTMLInputElement>;
  handleConsentChange: React.ChangeEventHandler<HTMLInputElement>;
};

export function FormRenderer({
  handleSubmit,
  status,
  formData,
  handlePhoneChange,
  handleAddressSelection,
  handleSituacionEspecialChange,
  handleUrgencyChange,
  handleDescriptionChange,
  handleTownChange,
  handleTipoAyudaChange,
  handleNameChange,
  handleEmailChange,
  handleNumberPeopleChange,
  handleConsentChange,
  selectedHelp,
}: FormRendererProps) {
  return (
    <>
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
                onChange={handleNameChange}
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
              onChange={handleEmailChange}
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
              onSelect={handleAddressSelection}
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
              {TIPOS_DE_AYUDA.map(({ id, label }) => (
                <TipoDeAyudaInputRenderer
                  key={id}
                  id={id}
                  handleTipoAyudaChange={handleTipoAyudaChange}
                  label={label}
                  isSelected={selectedHelp.get(id) || false}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número de personas afectadas</label>
            <input
              type="number"
              name="numeroPersonas"
              value={formData.numeroDePersonas}
              onChange={handleNumberPeopleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción de la situación</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleDescriptionChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500"
              rows={3}
              placeholder="Describa su situación actual y el tipo de ayuda que necesita"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de urgencia</label>
            <select
              name="urgencia"
              value={formData.urgencia}
              onChange={handleUrgencyChange}
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
              onChange={handleSituacionEspecialChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500"
              rows={2}
              placeholder="Personas mayores, niños pequeños, personas con movilidad reducida, necesidades médicas, mascotas..."
            />
          </div>
          {/* Pueblos */}
          <TownSelector handleChange={handleTownChange} selectedTown={formData.pueblo} />

          {/* Consentimiento */}
          <div className="flex items-start">
            <label className="ml-2 block text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                name="consentimiento"
                checked={formData.consentimiento}
                onChange={handleConsentChange}
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
    </>
  );
}
