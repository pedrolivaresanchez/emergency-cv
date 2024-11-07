import { AlertTriangle, Calendar, MapPin, MapPinned, Megaphone, Phone, Users } from 'lucide-react';
import { useState } from 'react';
import { tiposAyudaOptions } from '@/helpers/constants';
import Link from 'next/link';
import { useSession } from '@/context/SessionProvider';
import { HelpRequestAdditionalInfo, HelpRequestData, HelpRequestAssignmentData } from '@/types/Requests';
import { Town } from '@/types/Town';
import AsignarSolicitudButton from '@/components/AsignarSolicitudButton';
import SolicitudHelpCount from '@/components/SolicitudHelpCount';
import { helpRequestService } from '@/lib/service';

import PhoneInfo from '@/components/PhoneInfo.js';

type SolicitudCardProps = {
  caso: HelpRequestData;
  towns: Town[];
  isHref?: boolean;
  button?: SolicitudCardButton;
  isEdit?: boolean;
};

type SolicitudCardButton = {
  text: string;
  link: string;
};

export default function SolicitudCard({
  caso,
  towns,
  isHref = true,
  button = { text: 'Ver solicitud', link: '/solicitud/' }
}: SolicitudCardProps) {
  const session = useSession();
  const [caseStatus, setCaseStatus] = useState(caso.status);


  const additionalInfo = caso.additional_info as HelpRequestAdditionalInfo;

  const special_situations = 'special_situations' in additionalInfo ? additionalInfo.special_situations : undefined;
  const email = 'email' in additionalInfo ? additionalInfo.email : undefined;

  const isOwner = session && session.user && session.user.email && session.user.email === email;

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
          <div>
            <SolicitudHelpCount id={caso.id} />
            <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap mr-2 bg-purple-300`}>
              Referencia: {caso.id}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                caseStatus === 'finished'
                  ? 'bg-red-100 text-red-800'
                  : caseStatus === 'progress'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
              }`}
            >
              {caseStatus === 'finished' ? 'Resuelto' : caseStatus === 'progress' ? 'En proceso' : 'Activo'}
            </span>
          </div>
        </div>
        <p className="text-gray-700 mb-4 break-words">{caso.description}</p>
        <div className="flex flex-col sm:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-2 text-sm">
            {caso.town_id && (
              <div className="flex items-start gap-2">
                <MapPinned className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
                <span className="break-words">
                  <span className="font-semibold">Pueblo:</span> {towns[caso.town_id - 1]?.name || ''}
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
                {new Date(caso.created_at!).toLocaleDateString() +
                  ' ' +
                  new Date(caso.created_at!).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
              </span>
            </div>
            {caso.contact_info && (
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
                <PhoneInfo caseInfo={caso} />
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
            {special_situations && (
              <div className="mt-2 bg-gray-50 p-3 rounded">
                <span className="font-semibold block mb-1">Situaciones especiales:</span>
                <p className="text-gray-700 break-words">{special_situations}</p>
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
          <div className="flex flex-col sm:flex-row w-full sm:w-auto justify-end gap-2">
            { caseStatus != 'finished' && (
              <>
              {isOwner && (
                <>
                  <Link
                    href={'/solicitudes/editar/' + caso.id}
                    className={`rounded-lg text-white py-2 px-4 w-full sm:w-auto text-center  ${
                      caso.urgency === 'alta' ? 'bg-red-500' : caso.urgency === 'media' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                  >
                    Editar
                  </Link>
                  <button
                  onClick={async () => {
                    const data = await helpRequestService.updateRequestStatus(caso.id, 'finished');
                    setCaseStatus(data[0].status)
                  }}
                  className={`rounded-lg text-white py-2 px-4 w-full sm:w-auto text-center bg-green-500`}
                  >
                    Resolver
                  </button>
                </>
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
              <AsignarSolicitudButton helpRequest={caso} />
            </>
            )
          }
            {isOwner && caseStatus == 'finished' && (
              <button
              onClick={async () => {
                const data = await helpRequestService.updateRequestStatus(caso.id, 'active');
                setCaseStatus(data[0].status)
              }}
              className={`rounded-lg text-white py-2 px-4 w-full sm:w-auto text-center bg-green-500`}
              >
                Volver a activar
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
