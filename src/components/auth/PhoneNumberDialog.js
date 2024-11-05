'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { Modal } from '@/components/Modal';
import { authService } from '@/lib/service';
import { PhoneInput } from '@/components/PhoneInput';
import { formatPhoneNumber } from '@/helpers/format';

function PhoneForm({ onSubmit, onCancel }) {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const formatedPhoneNumber = formatPhoneNumber(phoneNumber);
      onSubmit(formatedPhoneNumber);
      setPhoneNumber('');
    },
    [onSubmit, phoneNumber],
  );

  const handleChange = useCallback((e) => {
    setPhoneNumber(e.target.value);
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6 text-gray-600">
        <p className="text-sm leading-relaxed">
          Necesitamos tu número de teléfono para poder asociar cualquier oferta o solicitud de ayuda que hayas creado
          previamente con tu número.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Tu número de teléfono no será usado con ningún otro propósito ni compartido con terceras personas.
        </p>
      </div>
      <PhoneInput onChange={handleChange} phoneNumber={phoneNumber} />

      <div className="flex justify-end space-x-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}

export function PhoneNumberDialog() {
  // Por defecto cerrado
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchNumber = async () => {
      const { data: session, error: errorGettingUser } = await authService.getSessionUser();
      if (!session.user || errorGettingUser) {
        // Si el usuario no esta logeado, no hacer nada
        return;
      }

      const metadata = session.user.user_metadata;
      if (metadata.telefono) {
        // Si ya hay telefono, no hacer nada
        return;
      }

      setIsOpen(true);
    };

    fetchNumber();
  }, []);

  const handleSubmit = useCallback(async (phoneNumber) => {
    const { data: session, error: errorGettingUser } = await authService.getSessionUser();

    if (!session.user || errorGettingUser) {
      throw new Error('Error a la hora de obtener el usuario');
    }

    const metadata = session.user.user_metadata;
    const metadataWithPhone = { ...metadata, telefono: phoneNumber };

    const { error: updateUserError } = await authService.updateUser({
      data: metadataWithPhone,
    });

    if (updateUserError) {
      throw new Error('Error a la hora de actualizar el usuario con un numero de telefono');
    }

    setIsOpen(false);
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="¿Cuál es tu número de teléfono?" allowClose={false}>
      <PhoneForm onSubmit={handleSubmit} onCancel={() => setIsOpen(false)} />
    </Modal>
  );
}
