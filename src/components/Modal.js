export function Modal({ isOpen, onClose, title, children, allowClose = true }) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    // Cerrar solo si se clicka en el backdrop (y no en el contenido del modal)
    if (allowClose && e.target === e.currentTarget) {
      onClose();
    }
  };

  // El contenido del modal en sí no debería causar un backdrop click
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div
        className="relative bg-white rounded-lg shadow-xl max-w-md w-full m-4"
        onClick={handleModalClick} // Previene que los clicks hagan bubble up
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {allowClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
