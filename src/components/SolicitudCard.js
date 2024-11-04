import { AlertTriangle, Calendar, MapPin, MapPinned, Megaphone, Phone, Users } from 'lucide-react';
import {tiposAyudaOptions} from "@/helpers/constants";

export default function SolicitudCard({ caso, towns }) {
  return (
    <>
      <div
        key={caso.id}
        className={`bg-white p-4 rounded-lg shadow-lg border-l-4 ${
          caso.urgency === 'alta'
            ? 'border-red-500'
            : caso.urgency === 'media'
              ? 'border-yellow-500'
              : 'border-green-500'
        } overflow-hidden`}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
          <h3
            className={`text-lg font-bold break-words ${
              caso.urgency === 'alta' ? 'text-red-600' : caso.urgency === 'media' ? 'text-yellow-600' : 'text-green-500'
            }`}
          >
            {caso.name || 'Necesita Ayuda'}
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
              caso.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : caso.status === 'in_progress'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-green-100 text-green-800'
            }`}
          >
            {caso.status === 'pending' ? 'Pendiente' : caso.status === 'in_progress' ? 'En proceso' : 'Activo'}
          </span>
        </div>
        <p className="text-gray-700 mb-4 break-words">{caso.description}</p>
        <div className="space-y-2 text-sm">
          {caso.town_id && (
            <div className="flex items-start gap-2">
              <MapPinned className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
              <span className="break-words">
                <span className="font-semibold">Pueblo:</span> {towns[caso.town_id].name}
              </span>
            </div>
          )}
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
            <span className="break-words">
              <span className="font-semibold">Ubicación:</span> {caso.location}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
            <span className="break-words">
              <span className="font-semibold">Fecha:</span>{' '}
              {new Date(caso.created_at).toLocaleDateString() +
                ' ' +
                new Date(caso.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
            </span>
          </div>
          {caso.contact_info && (
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
              <span className="break-words">
                <span className="font-semibold">Contacto:</span> {caso.contact_info}
              </span>
            </div>
          )}
          {caso.urgency && (
            <div className="flex items-start gap-2">
              <AlertTriangle
                className={`h-4 w-4 flex-shrink-0 mt-1 ${
                  caso.urgency === 'alta'
                    ? 'text-red-500'
                    : caso.urgency === 'media'
                      ? 'text-yellow-500'
                      : 'text-green-500'
                }`}
              />
              <span className="break-words">
                <span className="font-semibold">Urgencia:</span>
                <span
                  className={`ml-1 ${
                    caso.urgency === 'alta'
                      ? 'text-red-600 font-semibold'
                      : caso.urgency === 'media'
                        ? 'text-yellow-600'
                        : 'text-green-600'
                  }`}
                >
                  {caso.urgency === 'alta' ? 'Alta' : caso.urgency === 'media' ? 'Media' : 'Baja'}
                </span>
              </span>
            </div>
          )}
          {caso.help_type && (
            <div className="flex items-start gap-2">
              <Megaphone className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
              <span className="break-words">
                <span className="font-semibold">Necesita:</span>{' '}
                {Array.isArray(caso.help_type)
                  ? caso.help_type
                      .map((tipo) => {
                        return tiposAyudaOptions[tipo] || tipo;
                      })
                      .join(', ')
                  : 'Ayuda general'}
              </span>
            </div>
          )}
          {caso.additional_info?.special_situations && (
            <div className="mt-2 bg-gray-50 p-3 rounded">
              <span className="font-semibold block mb-1">Situaciones especiales:</span>
              <p className="text-gray-700 break-words">{caso.additional_info.special_situations}</p>
            </div>
          )}
          {caso.number_of_people && (
            <div className="flex items-start gap-2">
              <Users className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
              <span className="break-words">
                <span className="font-semibold">Personas afectadas:</span> {caso.number_of_people}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
