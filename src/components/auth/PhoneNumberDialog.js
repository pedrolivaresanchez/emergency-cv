'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { Modal } from '@/components/Modal';
import { authService } from '@/lib/service';

function PhoneForm({ onSubmit, onCancel }) {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onSubmit(phoneNumber);
      setPhoneNumber('');
    },
    [onSubmit, phoneNumber],
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6 text-gray-600">
        <p className="text-sm leading-relaxed">
          Necesitamos tu número de teléfono para poder asociar cualquier ofertas o solicitudes de ayuda que hayas creado
          previamente con tu número.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Tu número de teléfono no será usado con ningún otro propósito ni compartido con terceras personas.
        </p>
      </div>
      <div className="mb-4">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Número de teléfono
        </label>
        <input
          type="tel"
          id="phone"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="612345678"
          required
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit
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
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="¿Cuál es tu número de teléfono?">
      <PhoneForm onSubmit={handleSubmit} onCancel={() => setIsOpen(false)} />
    </Modal>
  );
}
