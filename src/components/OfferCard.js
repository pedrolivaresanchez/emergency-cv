import { Calendar, Heart, HeartHandshake, MapPin, MapPinned, Megaphone, Phone, Truck, User, Users } from 'lucide-react';
import { useSession } from '../context/SessionProvider';
import { tiposAyudaOptions } from '@/helpers/constants';
import Link from 'next/link';
import PhoneInfo from './PhoneInfo';

export default function OfferCard({
  caso,
  isHref,
  towns,
  button = { text: 'Ver oferta', link: '/oferta/' },
  isEdit = false,
}) {
  const session = useSession();
  return (
    <div key={caso.id + 'a'} className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5">
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:items-center justify-between border-b border-gray-900/10 px-6 py-4">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-4 items-center">
            <HeartHandshake
              className={`h-10 w-10 flex-shrink-0 ${
                caso.urgency === 'alta'
                  ? 'text-red-500'
                  : caso.urgency === 'media'
                    ? 'text-yellow-600'
                    : 'text-green-600'
              }`}
            />
            <div className="flex flex-col">
              <span className={`text-lg font-bold text-green-600`}>{caso.name}</span>
              <span className="text-sm text-gray-600">#{caso.id}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center gap-2">
          <div
            className={`flex items-center justify-center rounded-full px-4 py-2 ${
              caso.status === 'finished'
                ? 'bg-red-100 text-red-800'
                : caso.status === 'progress'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
            }`}
          >
            <span className={`text-sm font-bold`}>
              {caso.status === 'finished' ? 'FINALIZADO' : caso.status === 'progress' ? 'EN PROCESO' : 'ACTIVO'}
            </span>
          </div>
        </div>
      </div>
      <div className="px-6 py-4">
        <p className="text-gray-700 first-letter:capitalize" style={{ wordBreak: 'break-word' }}>
          {caso.description}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start md:items-end gap-4 px-6 pb-4">
        <div className="space-y-2 text-sm w-full">
          {caso.town_id && (
            <div className="flex items-start gap-2">
              <MapPinned className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
              <span className="break-words">
                <span className="font-semibold">Pueblo:</span>{' '}
                {towns.find((town) => town.id === caso.town_id)?.name || ''}
              </span>
            </div>
          )}
          {caso.contact_info && (
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
              <span className="break-words">
                <span className="font-semibold">Contacto:</span>{' '}
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
          {caso.help_type && (
            <div className="flex items-start gap-2">
              <Megaphone className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
              <span className="break-words">
                <span className="font-semibold">Ofrece:</span>{' '}
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
        </div>
      </div>
      <div className="flex flex-col items-start justify-between border-t border-gray-900/10 sm:flex-row sm:items-center px-6 py-4">
        <div className="flex flex-wrap items-center gap-x-4 sm:flex-nowrap">
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600">
            <svg
              className="absolute -left-1 h-12 w-12 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <div className="flex-auto">
            <div className="text-lg font-medium">{caso.name || 'Necesita Ayuda'}</div>
            <span className="text-gray-500">
              {new Date(caso.created_at).toLocaleDateString() +
                ' ' +
                new Date(caso.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
        <div className="flex flex-col pt-4 sm:pt-0 sm:flex-row w-full sm:w-auto justify-end gap-2">
          {isHref && (
            <Link
              href={button.link + caso.id}
              className={`w-full rounded-xl text-center px-4 py-2 font-semibold text-white sm:w-auto bg-gray-700 hover:bg-gray-800 transition-all`}
            >
              {button.text}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
