import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pageNumbers = [];
        const rangeSize = 1; // Número de páginas a mostrar alrededor de la actual

        // Mostrar las primeras páginas con '...' si estamos lejos
        if (currentPage > rangeSize + 2) {
          pageNumbers.push(1, 2, '...');
        } else {
          for (let i = 1; i < Math.min(totalPages + 1, currentPage + rangeSize + 1); i++) {
            pageNumbers.push(i);
          }
        }

        // Mostrar el rango de páginas alrededor de la página actual sin duplicar
        const start = Math.max(3, currentPage - rangeSize);
        const end = Math.min(totalPages - 2, currentPage + rangeSize);
        for (let i = start; i <= end; i++) {
          if (!pageNumbers.includes(i)) {
            pageNumbers.push(i);
          }
        }

        // Mostrar las últimas páginas con '...' si estamos lejos
        if (currentPage < totalPages - rangeSize - 1) {
          pageNumbers.push('...', totalPages - 1, totalPages);
        } else {
          for (let i = Math.max(start, totalPages - rangeSize); i <= totalPages; i++) {
            if (!pageNumbers.includes(i)) {
              pageNumbers.push(i);
            }
          }
        }

        return pageNumbers;
      };

  if (totalPages < 2) {
    return;
  }

  return (
    <div className="flex items-center space-x-2 mt-4">
      {/* Botón de retroceso */}
      <button
        className={`px-3 py-1 border rounded-md text-gray-600 hover:bg-gray-100 ${
            currentPage === 1 ? "hidden" : ""
        }`}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Anterior
      </button>

      {/* Números de página */}
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          className={`px-3 py-1 border rounded-md ${
            page === currentPage
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          disabled={page === '...'}
        >
          {page}
        </button>
      ))}

      {/* Botón de avance */}
      <button
        className={`px-3 py-1 border rounded-md text-gray-600 hover:bg-gray-100 ${
            currentPage === totalPages ? "hidden" : ""
        }`}
        onClick={() => onPageChange(currentPage + 1)}
        
      >
        Siguiente
      </button>
    </div>
  );
};

export default Pagination;