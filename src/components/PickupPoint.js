import { MapPin } from 'lucide-react';

const PickupPoint = ({ point }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border-l-4 border-blue-500">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
        <div>
          <h3 className="text-lg font-bold text-blue-600 break-words">{point.name}</h3>
          <div className="flex items-start gap-2 text-gray-600 mt-1">
            <MapPin className="h-4 w-4 flex-shrink-0 mt-1" />
            <a
              href={`https://maps.google.com/?q=${point.location}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm break-words text-blue-500 underline"
            >
              {point.location}
            </a>
          </div>
        </div>
        <div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap mr-2 bg-purple-300`}>
            Referencia: {point.id}
          </span>
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium whitespace-nowrap">
            {point.status === 'active' ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-4">
        <div className="break-words">
          <span className="font-semibold">Ciudad:</span> {point.city}
        </div>
        {point.contact_name && (
          <div className="break-words">
            <span className="font-semibold">Responsable:</span> {point.contact_name}
          </div>
        )}
        {point.contact_phone && (
          <div className="break-words">
            <span className="font-semibold">Teléfono:</span> {point.contact_phone}
          </div>
        )}
        {point.accepted_items && (
          <div className="col-span-1 sm:col-span-2 break-words">
            <span className="font-semibold">Acepta:</span>{' '}
            {Array.isArray(point.accepted_items) ? point.accepted_items.join(', ') : point.accepted_items}
          </div>
        )}
        {point.urgent_needs && (
          <div className="col-span-1 sm:col-span-2">
            <span className="font-semibold">Necesidades urgentes:</span>
            <p className="text-gray-700 mt-1 break-words">{point.urgent_needs}</p>
          </div>
        )}
        {point.schedule && (
          <div className="col-span-1 sm:col-span-2">
            <span className="font-semibold">Horario:</span>
            <p className="text-gray-700 mt-1 break-words">{point.schedule}</p>
          </div>
        )}
        {point.additional_info && (
          <div className="col-span-1 sm:col-span-2 bg-gray-50 p-3 rounded">
            <span className="font-semibold">Información adicional:</span>
            <p className="text-gray-700 mt-1 break-words">
              {typeof point.additional_info === 'string'
                ? point.additional_info
                : JSON.stringify(point.additional_info)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PickupPoint;
