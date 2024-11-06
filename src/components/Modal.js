import { useModal } from '@/context/EmergencyProvider';

export const Modal = ({ children, maxWidth = 'max-w-2xl', allowClose = true }) => {
  const { showModal, toggleModal } = useModal();

  if (!showModal) return null;

  const handleBackdropClick = (e) => {
    if (allowClose && e.target === e.currentTarget) {
      toggleModal();
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
            onClick={() => toggleModal()}
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
