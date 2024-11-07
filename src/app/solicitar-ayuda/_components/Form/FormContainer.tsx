'use client';

import React, { useCallback, useMemo, useState } from 'react';

import { FormRenderer } from './FormRenderer';
import { FormData, Status } from '../types';
import { formatPhoneNumber, isValidPhone } from '@/helpers/utils';
import { helpRequestService, locationService, townService } from '@/lib/service';
import { Database } from '@/types/database';
import { Enums } from '@/types/common';
import { useRouter } from 'next/navigation';

import { TIPOS_DE_AYUDA, TIPOS_DE_AYUDA_MAP } from '../constants';
import { useSession } from '@/context/SessionProvider';
import { LngLat } from '@/components/map/GeolocationMap';

const mapHelpToEnum = (helpTypeMap: FormData['tiposDeAyuda']): Enums['help_type_enum'][] =>
  Array.from(helpTypeMap).reduce(
    (acc, [id, isSelected]) => {
      if (isSelected) {
        const value = TIPOS_DE_AYUDA_MAP.get(id);
        if (!value) {
          return acc;
        }
        return acc.concat(value.enum);
      }
      return acc;
    },
    [] as Enums['help_type_enum'][],
  );

export function FormContainer() {
  const router = useRouter();
  const session = useSession();

  const [formData, setFormData] = useState<FormData>({
    nombre: session?.user?.user_metadata?.full_name || session?.user?.user_metadata?.nombre || ''.split(' ')[0],
    coordinates: null,
    tiposDeAyuda: new Map(TIPOS_DE_AYUDA.map(({ id }) => [id, false])),
    numeroDePersonas: undefined,
    descripcion: '',
    urgencia: 'alta',
    situacionEspecial: '',
    contacto: session?.user?.user_metadata?.telefono || '',
    consentimiento: false,
    email: session?.user?.user_metadata?.email || '',
  });

  const [status, setStatus] = useState<Status>({
    isSubmitting: false,
    error: null,
    success: false,
  });

  const handleSubmit = useCallback(
    async (e: any) => {
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
        alert('El teléfono de contacto no es válido.');
        return;
      }

      if (!isValidPhone(formData.contacto)) {
        alert('El teléfono de contacto no es válido.');
        return;
      }

      setStatus({ isSubmitting: true, error: null, success: false });

      try {
        const latitude = String(formData.coordinates.lat);
        const longitude = String(formData.coordinates.lng);

        const { address, town, error } = await locationService.getFormattedAddress(longitude, latitude);
        if (!address || !town || error) {
          throw { message: `Error inesperado con la api de google: ${error}` };
        }

        const { data: townResponse, error: townError } = await townService.createIfNotExists(town);
        if (townError) throw townError;

        const helpRequestData: Database['public']['Tables']['help_requests']['Insert'] = {
          type: 'necesita',
          name: formData.nombre.split(' ')[0],
          location: address,
          latitude: formData.coordinates ? parseFloat(latitude) : null,
          longitude: formData.coordinates ? parseFloat(longitude) : null,
          help_type: mapHelpToEnum(formData.tiposDeAyuda),
          description: formData.descripcion,
          urgency: formData.urgencia,
          number_of_people: formData.numeroDePersonas || 1,
          contact_info: formatPhoneNumber(formData.contacto),
          additional_info: {
            special_situations: formData.situacionEspecial || null,
            consent: true,
            email: formData.email,
          },
          town_id: townResponse[0].id,
          status: 'active',
        };

        await helpRequestService.createRequest(helpRequestData);

        // Limpiar formulario
        setFormData({
          nombre: '',
          coordinates: null,
          tiposDeAyuda: new Map(),
          numeroDePersonas: undefined,
          descripcion: '',
          urgencia: 'alta',
          situacionEspecial: '',
          contacto: '',
          consentimiento: false,
          email: '',
        });

        setStatus({ isSubmitting: false, error: null, success: true });
        setStatus((prev) => ({ ...prev, success: false }));
        router.push('/casos-activos/solicitudes');
      } catch (error: any) {
        console.error('Error al enviar solicitud:', error.message);
        setStatus({
          isSubmitting: false,
          error: `Error al enviar la solicitud: ${error.message}`,
          success: false,
        });
      }
    },
    [formData, router],
  );

  const handleInputElementChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const handleTextAreaElementChange: React.ChangeEventHandler<HTMLTextAreaElement> = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  }, []);

  const handleSelectElementChange: React.ChangeEventHandler<HTMLSelectElement> = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleCoordinatesChange = useCallback((lngLat: LngLat) => {
    setFormData((formData) => ({
      ...formData,
      coordinates: lngLat ?? null,
    }));
  }, []);

  const handlePhoneChange = useCallback((phoneNumber: string) => {
    setFormData((formData) => ({
      ...formData,
      contacto: phoneNumber,
    }));
  }, []);

  const handleHelpTypeChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    const { id, name, value, checked } = event.target;
    console.log('id: ', id);
    console.log('name: ', name);
    console.log('value: ', value);
    console.log('checked: ', checked);

    setFormData((formData) => {
      const prevHelp = formData.tiposDeAyuda;
      const newHelp = new Map([...prevHelp]);
      newHelp.set(parseInt(id), checked);
      return { ...formData, tiposDeAyuda: newHelp };
    });
  }, []);

  const selectedHelp = useMemo(() => formData.tiposDeAyuda, [formData]);

  return (
    <FormRenderer
      formData={formData}
      isUserLoggedIn={Boolean(session?.user)}
      handleConsentChange={handleInputElementChange}
      handleEmailChange={handleInputElementChange}
      handleCoordinatesChange={handleCoordinatesChange}
      handleDescriptionChange={handleTextAreaElementChange}
      handleNameChange={handleInputElementChange}
      handleNumberPeopleChange={handleInputElementChange}
      handlePhoneChange={handlePhoneChange}
      handleSituacionEspecialChange={handleTextAreaElementChange}
      handleTipoAyudaChange={handleHelpTypeChange}
      handleUrgencyChange={handleSelectElementChange}
      handleSubmit={handleSubmit}
      status={status}
      selectedHelp={selectedHelp}
    />
  );
}
