'use client';

import { Search } from 'lucide-react';
import SolicitudCard from '@/components/SolicitudCard';
import { useSession } from '@/context/SessionProvider';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { HelpRequestData } from '@/types/Requests';
import { helpRequestService } from '@/lib/service';

export const dynamic = 'force-dynamic';

export default function ListaSolicitudes() {
  const session = useSession();
  const userId = session.user?.id;

  const {
    data: requests,
    isLoading,
    error,
  } = useQuery<HelpRequestData[]>({
    queryKey: ['help_requests', { user_id: userId, type: 'necesita' }],
    queryFn: () => helpRequestService.getRequestsByUser(userId),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || requests === undefined) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
        <p className="text-red-700">{error?.message}</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 mx-auto max-w-7xl px-4 sm:px-6 mt-10">
        <div className="grid gap-4">
          {requests.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg border border-gray-300 text-center flex justify-center items-center p-10 flex-col gap-5">
              <p className="text-gray-700 text-lg font-medium">
                No se encontraron solicitudes de ayuda correspondientes a tu cuenta.
              </p>

              <Link
                href="/solicitar-ayuda"
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-2 whitespace-nowrap"
              >
                <Search className="w-5 h-5" />
                Solicitar ayuda
              </Link>
            </div>
          ) : (
            requests.map((caso) => <SolicitudCard showLink={true} showEdit={true} key={caso.id} caso={caso} />)
          )}
        </div>
      </div>
    </>
  );
}
