'use client';

import { supabase } from '@/lib/supabase/client';
import { ChangeEvent, MouseEvent, useState } from 'react';
import { Spinner } from '@/components/Spinner';
import Modal from '@/components/Modal';
import { useModal } from '@/context/ModalProvider';

type ChangeStatusRequestButtonProps = {
  helpRequestId: number;
  onUpdate: (urgency: string) => void;
  currentUrgency: string;
};

export default function ChangeUrgencyHelpRequest({
  helpRequestId,
  onUpdate,
  currentUrgency,
}: ChangeStatusRequestButtonProps) {
  const { toggleModal } = useModal();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [data, setData] = useState({});
  const [status, setStatus] = useState<string>(currentUrgency);

  const MODAL_NAME = `Actualizar-Solicitud-${helpRequestId}`;

  const updateHelpRequest = async () => {
    const { data, error } = await supabase
      .from('help_requests')
      .update({ urgency: status })
      .eq('id', helpRequestId)
      .select();

    return { data, error };
  };

  async function handleUpdateSubmit(e: MouseEvent) {
    e.preventDefault();
    const { data, error } = await updateHelpRequest();
    if (error) {
      setError(error);
      return;
    }
    if (data) {
      setData(data);
      onUpdate(status);
    }
    toggleModal(MODAL_NAME, false);
  }
  async function handleSubmit(e: ChangeEvent) {
    e.preventDefault();
    toggleModal(MODAL_NAME, true);
  }

  if (isLoading) return <Spinner />;
  if (error === undefined) return <></>;

  return (
    <>
      <select
        name="urgencia"
        id="urgencia"
        value={status}
        onChange={(e) => {
          setStatus(e.target.value);
          handleSubmit(e);
        }}
        className="w-full text-center rounded-xl px-4 py-2 font-semibold text-white sm:w-auto transition-all bg-blue-500"
      >
        <option value="alta">Alta</option>
        <option value="media">Media</option>
        <option value="baja">Baja</option>
      </select>

      <Modal id={MODAL_NAME} allowClose={false}>
        <div className="bg-yellow-50 p-4 rounded">
          <h2 className="text-yellow-800 font-semibold mb-4">Cambiar estado</h2>
          <p className="text-yellow-800">¿Estas seguro que deseas cambiar el estado de solicitud a {status}?</p>
          <div className="mt-4 flex justify-end space-x-4">
            <button
              onClick={() => {
                toggleModal(MODAL_NAME, false);
                setStatus(currentUrgency);
              }}
              className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg font-semibold"
            >
              Cancelar
            </button>
            <button
              onClick={handleUpdateSubmit}
              className="flex-1 bg-red-500 text-white py-3 px-4 rounded-lg font-semibold"
            >
              Actualizar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
