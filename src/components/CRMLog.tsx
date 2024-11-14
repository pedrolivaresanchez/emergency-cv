'use client';

import { MouseEvent, useCallback, useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import { useModal } from '@/context/ModalProvider';
import { ScrollText } from 'lucide-react';
import { getCRMLogEntries } from '@/lib/actions';

type CRMLogButtonProps = {
  helpRequestId: number;
};

type LogEntry = {
  date: Date | null;
  email: string;
  diff: string | null;
};

export default function CRMLog({ helpRequestId }: CRMLogButtonProps) {
  const { toggleModal } = useModal();
  const [opened, setOpened] = useState(false);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  useEffect(() => {
    if (opened) {
      const fetchLogEntries = async () => {
        const data = await getCRMLogEntries(helpRequestId);
        setLogEntries(
          data?.map((entry) => ({
            date: entry.created_at ? new Date(entry.created_at) : null,
            email: entry.email,
            diff: entry.diff,
          })),
        );
      };
      fetchLogEntries();
    }
  }, [opened]);
  const MODAL_NAME = `Ver-LogBook-${helpRequestId}`;

  const handleCloseModal = useCallback(
    async (e: MouseEvent) => {
      e.preventDefault();
      toggleModal(MODAL_NAME, false);
      setOpened(false);
    },
    [toggleModal, setOpened],
  );

  const handleOpenModal = useCallback(
    async (e: MouseEvent) => {
      e.preventDefault();
      toggleModal(MODAL_NAME, true);
      setOpened(true);
    },
    [toggleModal, setOpened],
  );

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="w-full inline-flex text-center rounded-xl px-4 py-2 font-semibold text-white sm:w-auto transition-all bg-pink-500 hover:bg-pink-600"
      >
        <ScrollText />
        &nbsp;Logs
      </button>
      <Modal id={MODAL_NAME} allowClose={false}>
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Log de Cambios</h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <div className="p-4 h-96 overflow-y-auto">
              {logEntries.length > 0 ? (
                logEntries.map((entry, index) => (
                  <div key={index} className="mb-4 p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex justify-between text-gray-600 text-sm mb-1">
                      <span>
                        {entry.date
                          ? entry.date.toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric',
                              second: 'numeric',
                            })
                          : ''}
                      </span>
                      <span>{entry.email}</span>
                    </div>
                    <pre className="text-gray-700 text-sm">{entry.diff}</pre>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No hay cambios registrados.</p>
              )}
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
