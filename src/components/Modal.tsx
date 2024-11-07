import { useModal } from '@/context/EmergencyProvider';
import { MouseEvent, FC, ReactNode } from 'react';

type TailwindMaxWidth =
  | 'max-w-xs'
  | 'max-w-sm'
  | 'max-w-md'
  | 'max-w-lg'
  | 'max-w-xl'
  | 'max-w-2xl'
  | 'max-w-3xl'
  | 'max-w-4xl'
  | 'max-w-5xl'
  | 'max-w-6xl'
  | 'max-w-7xl'
  | 'max-w-full'
  | 'max-w-screen-sm'
  | 'max-w-screen-md'
  | 'max-w-screen-lg'
  | 'max-w-screen-xl'
  | 'max-w-screen-2xl';

type ModalProps = {
  id: string;
  children: ReactNode;
  maxWidth?: TailwindMaxWidth;
  allowClose?: boolean;
};

const Modal: FC<ModalProps> = ({ id, children, maxWidth = 'max-w-2xl', allowClose = true }) => {
  const { isModalOpen, toggleModal } = useModal();
  if (!isModalOpen[id]) return null;

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (allowClose && e.target === e.currentTarget) {
      toggleModal(id);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div className={`relative bg-white rounded-lg shadow-xl ${maxWidth} w-full m-4`}>
        {allowClose && (
          <button
            onClick={() => toggleModal(id)}
            className="absolute top-1 right-1 text-gray-400 hover:text-gray-500 z-10 focus:outline-none"
          >
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
