'use client';

import { supabase } from '@/lib/supabase/client';
import { useSession } from '@/context/SessionProvider';
import { MouseEvent, useState } from 'react';
import { Spinner } from '@/components/Spinner';
import Modal from '@/components/Modal';
import { useModal } from '@/context/ModalProvider';

type ChangeStatusButtonProps = {
  helpRequestId: number;
  onUpdate: (status: string) => void;
  currentStatus: string;
};
export default function ChangeStatusButton({ helpRequestId, onUpdate, currentStatus }: ChangeStatusButtonProps) {
  const { toggleModal } = useModal();
  const [error, setError] = useState({});
  const [status, setStatus] = useState<string>(currentStatus);
  const MODAL_NAME = `Actualizar-Estado-Solicitud-${helpRequestId}`;

  const updateHelpRequest = async () => {
    const { data, error } = await supabase
      .from('help_requests')
      .update({ status: status })
      .eq('id', helpRequestId)
      .select();

    return { data, error };
  };

  async function handleAcceptanceSubmit(e: MouseEvent) {
    e.preventDefault();
    const { data, error } = await updateHelpRequest();
    if (error) {
      setError(error);
      return;
    }
    if (data) {
      onUpdate(status);
    }
    toggleModal(MODAL_NAME, false);
  }
  async function handleSubmit(e: MouseEvent) {
    e.preventDefault();
    toggleModal(MODAL_NAME, true);
  }
  if (error === undefined) return <></>;
  return (
    <>
      <button
        onClick={handleSubmit}
        className="w-full text-center rounded-xl px-4 py-2 font-semibold text-white sm:w-auto transition-all bg-yellow-500 hover:bg-yellow-600"
      >
        Cambiar estado
      </button>
      <Modal id={MODAL_NAME} allowClose={false}>
        <div className="bg-white p-4 rounded">
          <h2 className="text-black font-semibold mb-4">Cambiar el estado de mi solicitud</h2>
          <div className="w-full">
            <label htmlFor="status">Estado de mi solicitud</label>
            <div className="relative mt-1">
              <select
                onChange={(e) => setStatus(e.target.value)}
                defaultValue={currentStatus}
                name="status"
                id="status"
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
              >
                <option value="active">Activo</option>
                <option value="progress">En progreso</option>
                <option value="finished">Finalizado</option>
              </select>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.2"
                stroke="currentColor"
                className="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                />
              </svg>
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-4">
            <button
              onClick={() => {
                toggleModal(MODAL_NAME, false);
                setStatus(currentStatus);
              }}
              className="flex-1 bg-red-500 text-white py-3 px-4 rounded-lg font-semibold"
            >
              Rechazar
            </button>
            <button
              onClick={handleAcceptanceSubmit}
              className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg font-semibold"
            >
              Actualizar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
