'use client';

import { ChangeEvent, MouseEvent, useCallback, useState } from 'react';
import Modal from '@/components/Modal';
import { useModal } from '@/context/ModalProvider';
import { LimitedTextarea } from '@/components/input/LimitedTextarea';
import { updateNotesRequest, addCRMLog } from '@/lib/actions';
import { useSession } from '@/context/SessionProvider';

type CRMNotesButtonProps = {
  helpRequestId: number;
  currentNotes: string | null;
};

export default function CRMNotes({ helpRequestId, currentNotes }: CRMNotesButtonProps) {
  const { user } = useSession();
  const { toggleModal } = useModal();
  const [notes, setNotes] = useState<string>(currentNotes || '');
  const [newNotes, setNewNotes] = useState<string>(currentNotes || '');
  const [error, setError] = useState({});

  const MODAL_NAME = `Actualizar-Notas-${helpRequestId}`;

  const handleSubmit = useCallback(
    async (e: MouseEvent) => {
      e.preventDefault();
      const { data, error } = await updateNotesRequest(newNotes, String(helpRequestId));
      if (error) {
        setError(error);
        return;
      }
      if (user) {
        await addCRMLog(
          '---ANTES---\n' + notes + '\n---DESPUES---\n' + newNotes,
          helpRequestId,
          user.id,
          (user.user_metadata.full_name || user.user_metadata.nombre) + ' ' + user.email,
        );
      }
      toggleModal(MODAL_NAME, false);
      setNotes(newNotes);
    },
    [newNotes, setNotes, toggleModal, user],
  );

  async function handleOpenModal(e: MouseEvent) {
    e.preventDefault();
    toggleModal(MODAL_NAME, true);
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { value } = e.target;
    setNewNotes(value);
  };

  if (error === undefined) return <></>;

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="w-full text-center rounded-xl px-4 py-2 font-semibold text-white sm:w-auto transition-all bg-lime-500 hover:bg-lime-600"
      >
        Notas
      </button>
      <Modal id={MODAL_NAME} allowClose={false}>
        <div className="bg-white p-4 rounded">
          <LimitedTextarea
            name="notas"
            value={newNotes}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500"
            rows={4}
            placeholder="Puedes añadir las notas necesarias para hacer seguimiento"
            maxLength={5000}
          />
          <div className="mt-4 flex justify-end space-x-4">
            <button
              onClick={() => {
                toggleModal(MODAL_NAME, false);
                setNewNotes(notes);
              }}
              className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg font-semibold"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg font-semibold"
            >
              Guardar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
