import { Calendar, HeartHandshake, MapPin, Phone, User } from 'lucide-react';
import { useSession } from '../context/SessionProvider';
import { tiposAyudaOptions } from '@/helpers/constants';
import Link from 'next/link';

export default function OfferCard({ caso, isHref, button = { text: 'Ver oferta', link: '/oferta/' }, isEdit = false }) {
  const session = useSession();
  return (
    <div key={caso.id} className="bg-white p-4 rounded-lg shadow-lg border-l-4 border-green-500 overflow-hidden">
      <div className="flex justify-between mb-2">
        <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap mr-2 bg-purple-300`}>
          Referencia: {caso.id}
        </span>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
            caso.status === 'finished'
              ? 'bg-red-100 text-red-800'
              : caso.status === 'progress'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
          }`}
        >
          {caso.status === 'finished' ? 'Terminada' : caso.status === 'progress' ? 'En proceso' : 'Activo'}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <h3 className="text-lg font-bold text-green-600">
          <div className="flex items-start gap-2">
            <HeartHandshake className="h-5 w-5 flex-shrink-0 mt-1" />
            <div className="break-words">
              Ofrece:{' '}
              {Array.isArray(caso.help_type)
                ? caso.help_type
                    .map((tipo) => {
                      return tiposAyudaOptions[tipo] || tipo;
                    })
                    .join(', ')
                : 'Ayuda general'}
            </div>
          </div>
        </h3>
        {caso.name && (
          <div className="flex items-start gap-2">
            <User className="h-4 w-4 flex-shrink-0 mt-1" />
            <span className="break-words">
              <span className="font-semibold">Nombre:</span> {caso.name}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2 text-sm">
        {caso.contact_info && (
          <div className="flex items-start gap-2">
            <Phone className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
            <span className="break-words">
              <span className="font-semibold">Teléfono:</span>{' '}
              {typeof caso.contact_info === 'string' ? caso.contact_info : JSON.parse(caso.contact_info).phone}
            </span>
          </div>
        )}

        {caso.resources && (
          <>
            {(() => {
              let resources;
              try {
                resources = typeof caso.resources === 'string' ? JSON.parse(caso.resources) : caso.resources;

                return resources.vehicle ? (
                  <div className="flex items-start gap-2">
                    <Truck className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
                    <span className="break-words">
                      <span className="font-semibold">Vehículo:</span> {resources.vehicle}
                    </span>
                  </div>
                ) : null;
              } catch (e) {
                return null;
              }
            })()}
          </>
        )}

        {caso.location && (
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
            <span className="break-words">
              <span className="font-semibold">Ubicación:</span> {caso.location}
            </span>
          </div>
        )}

        <div className="flex items-start gap-2">
          <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
          <span className="break-words">
            <span className="font-semibold">Fecha:</span>{' '}
            {new Date(caso.created_at).toLocaleDateString() +
              ' ' +
              new Date(caso.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {caso.description && (
        <div className="mt-4 bg-gray-50 p-3 rounded">
          <span className="font-semibold block mb-1">Comentarios:</span>
          <p className="text-gray-700 break-words">{caso.description}</p>
        </div>
      )}
      <div className="flex flex-col sm:flex-row w-full sm:w-auto justify-end gap-2">
        {session &&
          session.user &&
          session.user.email &&
          session.user.email === caso.additional_info.email &&
          !isEdit && (
            <Link
              href={'/ofertas/editar/' + caso.id}
              className={`rounded-lg text-white py-2 px-4 w-full sm:w-auto text-center  ${
                caso.urgency === 'alta' ? 'bg-red-500' : caso.urgency === 'media' ? 'bg-yellow-500' : 'bg-green-500'
              }`}
            >
              Editar
            </Link>
          )}
        {isHref && (
          <Link
            href={button.link + caso.id}
            className={`rounded-lg text-white py-2 px-4 w-full sm:w-auto text-center  ${
              caso.urgency === 'alta' ? 'bg-red-500' : caso.urgency === 'media' ? 'bg-yellow-500' : 'bg-green-500'
            }`}
          >
            {button.text}
          </Link>
        )}
      </div>
    </div>
  );
}
