'use client';

import React, { FC, FormEvent, useCallback, useEffect, useState } from 'react';

import Modal from '@/components/Modal';
import { authService } from '@/lib/service';
import { useModal } from '@/context/EmergencyProvider';

type PhoneFormProps = {
  onSubmit: (phoneNumber: string) => void;
};

const PhoneForm: FC<PhoneFormProps> = ({ onSubmit }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onSubmit(phoneNumber);
      setPhoneNumber('');
    },
    [onSubmit, phoneNumber],
  );

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">¿Cuál es tu número de teléfono?</h3>
      </div>
      <div className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-6 text-gray-600">
            <p className="text-sm leading-relaxed">
              Necesitamos tu número de teléfono para poder asociar cualquier oferta o solicitud de ayuda que hayas
              creado previamente con tu número.
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
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

const PhoneNumberDialog = () => {
  const { toggleModal } = useModal();

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

      toggleModal();
    };

    fetchNumber();
  }, []);

  const handleSubmit = useCallback(async (phoneNumber: string) => {
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

    toggleModal();
  }, []);

  return (
    <Modal maxWidth={'md'} allowClose={false}>
      <PhoneForm onSubmit={handleSubmit} />
    </Modal>
  );
};

export default PhoneNumberDialog;
