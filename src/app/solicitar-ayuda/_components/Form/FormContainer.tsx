'use client';

import React, { useState, useEffect, useCallback } from 'react';

import { FormRenderer } from './FormRenderer';
import { FormData, Status } from '../types';
// @ts-expect-error
import { isValidPhone } from '@/helpers/utils';
// @ts-expect-error
import { formatPhoneNumber } from '@/helpers/utils';
import { helpRequestService } from '@/lib/service';
import { Database } from '@/types/database';
import { useRouter } from 'next/navigation';

export function FormContainer() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    ubicacion: '',
    coordinates: null,
    tiposDeAyuda: [],
    numeroDePersonas: undefined,
    descripcion: '',
    urgencia: 'alta',
    situacionEspecial: '',
    contacto: '',
    consentimiento: false,
    pueblo: '',
    email: '',
  });

  useEffect(() => {
    console.log('Component mounted');
  }, []);

  useEffect(() => {
    console.log('formData changed: ', formData);
  }, [formData]);

  const [status, setStatus] = useState<Status>({
    isSubmitting: false,
    error: null,
    success: false,
  });

  const handleSubmit = useCallback(
    async (e: any) => {
      e.preventDefault();

      /* Form validation */
      if (!formData.ubicacion) {
        alert('La ubicación es un campo obligatorio');
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

      setStatus({ isSubmitting: true, error: null, success: false });

      try {
        const helpRequestData: Database['public']['Tables']['help_requests']['Insert'] = {
          type: 'necesita',
          name: formData.nombre,
          location: formData.ubicacion,
          latitude: formData.coordinates ? parseFloat(formData.coordinates.lat) : null,
          longitude: formData.coordinates ? parseFloat(formData.coordinates.lng) : null,
          help_type: formData.tiposDeAyuda.map(({ label }) => label),
          description: formData.descripcion,
          urgency: formData.urgencia,
          number_of_people: formData.numeroDePersonas || 1,
          contact_info: formatPhoneNumber(formData.contacto),
          additional_info: {
            special_situations: formData.situacionEspecial || null,
            consent: true,
            email: formData.email,
          },
          town_id: formData.pueblo,
          status: 'active',
        };

        await helpRequestService.createRequest(helpRequestData);

        // Limpiar formulario
        setFormData({
          nombre: '',
          ubicacion: '',
          coordinates: null,
          tiposDeAyuda: [],
          numeroDePersonas: undefined,
          descripcion: '',
          urgencia: 'alta',
          situacionEspecial: '',
          contacto: '',
          pueblo: '',
          consentimiento: false,
          email: '',
        });

        setStatus({ isSubmitting: false, error: null, success: true });
        setStatus((prev) => ({ ...prev, success: false }));
        router.push('/casos-activos/solicitudes');
      } catch (error) {
        console.log('Error al enviar solicitud:', error.message);
        setStatus({
          isSubmitting: false,
          error: `Error al enviar la solicitud: ${error.message}`,
          success: false,
        });
      }
    },
    [formData],
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

  const handleAddressSelection = useCallback((address: any) => {
    setFormData((formData) => ({
      ...formData,
      ubicacion: address.fullAddress,
      coordinates: address.coordinates
        ? {
            lat: address.coordinates.lat,
            lng: address.coordinates.lon,
          }
        : null,
    }));
    console.log('address: ', address);
  }, []);

  const handlePhoneChange = useCallback((phoneNumber: string) => {
    setFormData((formData) => ({
      ...formData,
      contacto: phoneNumber,
    }));
  }, []);

  return (
    <FormRenderer
      formData={formData}
      handleConsentChange={handleInputElementChange}
      handleEmailChange={handleInputElementChange}
      handleAddressSelection={handleAddressSelection}
      handleDescriptionChange={handleTextAreaElementChange}
      handleNameChange={handleInputElementChange}
      handleNumberPeopleChange={handleInputElementChange}
      handlePhoneChange={handlePhoneChange}
      handleSituacionEspecialChange={handleTextAreaElementChange}
      handleTipoAyudaChange={handleInputElementChange}
      handleTownChange={handleSelectElementChange}
      handleUrgencyChange={handleSelectElementChange}
      handleSubmit={handleSubmit}
      status={status}
      selectedRequestedHelpIDs={[]}
    />
  );
}
