'use client';

import { supabase } from '@/lib/supabase/client';
import { MouseEvent, useState } from 'react';
import { Spinner } from '@/components/Spinner';
import Modal from '@/components/Modal';
import { useModal } from '@/context/ModalProvider';

type DeleteRequestButtonProps = {
  helpRequestId: number;
};

export default function DeleteHelpRequest({ helpRequestId }: DeleteRequestButtonProps) {
  const { toggleModal } = useModal();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [data, setData] = useState({});

  const MODAL_NAME = `Eliminar-Solicitud-${helpRequestId}`;
 

  const deleteHelpRequest = async () => {
    const { data, error } = await supabase.from('help_requests').delete().eq('id', helpRequestId).select();
    return { data, error };
  };

  async function handleDeleteSubmit(e: MouseEvent) {
    e.preventDefault();
    const { data, error } = await deleteHelpRequest();
    if (error) {
      setError(error);
      return;
    }
    if (data) setData(data);
    toggleModal(MODAL_NAME, false);
  }
  async function handleSubmit(e: MouseEvent) {
    e.preventDefault();
    toggleModal(MODAL_NAME, true);
  }

  if (isLoading) return <Spinner />;
  if (error === undefined) return <></>;

  return (
    <>
      <button
        onClick={handleSubmit}
        className="w-full text-center rounded-xl px-4 py-2 font-semibold text-white sm:w-auto transition-all bg-red-500 hover:bg-red-600"
      >
        Eliminar
      </button>

      <Modal id={MODAL_NAME} allowClose={false}>
        <div className="bg-yellow-50 p-4 rounded">
          <h2 className="text-yellow-800 font-semibold mb-4">Eliminar Solicitud</h2>
          <p className="text-yellow-800">¿Estas seguro que deseas borrar esta solicitud?</p>
          <div className="mt-4 flex justify-end space-x-4">
            <button
              onClick={() => toggleModal(MODAL_NAME, false)}
              className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg font-semibold"
            >
              Cancelar
            </button>
            <button
              onClick={handleDeleteSubmit}
              className="flex-1 bg-red-500 text-white py-3 px-4 rounded-lg font-semibold"
            >
              Borrar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
