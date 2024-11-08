'use client';

import React, { FormEvent, useCallback, useEffect, useState } from 'react';

import Modal from '@/components/Modal';
import { authService } from '@/lib/service';
import { useModal } from '@/context/ModalProvider';
import { PhoneInput } from '@/components/PhoneInput';
import { formatPhoneNumber } from '@/helpers/utils';
import { isValidPhone } from '@/helpers/utils';

const MODAL_NAME = 'phone-number';

type PhoneFormProps = {
  onSubmit: (phoneNumber: string, privacyPolicy: string) => void;
};

const PhoneForm = ({ onSubmit }: PhoneFormProps) => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    privacyPolicy: '',
  });

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      /* PHONE VALIDATION */
      if (!isValidPhone(formData.phoneNumber)) {
        alert('El teléfono de contacto no es válido.');
        return;
      }

      /* POLICY PRIVACY VALIDATION */
      if (!formData.privacyPolicy) {
        alert('Para continuar, debes aceptar la Política de Privacidad.');
        return;
      }

      const formatedPhoneNumber = formatPhoneNumber(formData.phoneNumber);

      onSubmit(formatedPhoneNumber, formData.privacyPolicy);

      setFormData({
        phoneNumber: '',
        privacyPolicy: '',
      });
    },
    [onSubmit, formData],
  );

  const handleChange = useCallback((phoneNumber: string) => {
    setFormData((formData) => ({ ...formData, phoneNumber }));
  }, []);

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

          {/* PHONE NUMBER */}
          <PhoneInput onChange={handleChange} phoneNumber={formData.phoneNumber} />

          {/* PRIVACY POLICY */}
          <div className="flex gap-2 items-start lg:items-center">
            <input
              type="checkbox"
              value={formData.privacyPolicy}
              onChange={(e) => setFormData({ ...formData, privacyPolicy: e.target.checked.toString() })}
              className="min-w-4 min-h-4 cursor-pointer"
              id="privacyPolicy"
              required
            />
            <label htmlFor="privacyPolicy" className="text-sm font-medium text-gray-700">
              He leído y aceptado la{' '}
              <a href="/politica-privacidad/" className="text-blue-400">
                política de privacidad
              </a>{' '}
              y acepto que «ajudadana.es» recoja y guarde los datos enviados a través de este formulario.
            </label>
          </div>

          {/* ACCEPT AND SAVE */}
          <div className="flex justify-end space-x-2 mt-2">
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
        return;
      }

      const metadata = session.user.user_metadata;
      if (metadata.telefono) {
        return;
      }
      toggleModal(MODAL_NAME);
    };

    fetchNumber();
  }, [toggleModal]);

  const handleSubmit = useCallback(
    async (phoneNumber: string, privacyPolicy: string) => {
      const { data: session, error: errorGettingUser } = await authService.getSessionUser();

      if (!session.user || errorGettingUser) {
        throw new Error('Error a la hora de obtener el usuario');
      }

      const metadata = session.user.user_metadata;
      const metadataWithPhone = { ...metadata, telefono: phoneNumber, privacyPolicy };

      const { error: updateUserError } = await authService.updateUser({
        data: metadataWithPhone,
      });

      if (updateUserError) {
        throw new Error('Error a la hora de actualizar el usuario con un numero de telefono');
      }

      toggleModal(MODAL_NAME);
    },
    [toggleModal],
  );

  return (
    <Modal id={MODAL_NAME} maxWidth={'max-w-md'} allowClose={false}>
      <PhoneForm onSubmit={handleSubmit} />
    </Modal>
  );
};

export default PhoneNumberDialog;
