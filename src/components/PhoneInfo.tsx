import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/context/SessionProvider';
import { getSolicitudesWAssignemntsByUser } from '@/lib/actions';
import { SelectedHelpDataWAssignment } from '@/types/Requests';

type PhoneInfoProps = {
  caseInfo: SelectedHelpDataWAssignment;
  isAdmin: boolean;
};
export default function PhoneInfo({ caseInfo, isAdmin }: PhoneInfoProps) {
  const session = useSession();
  const userId = session?.user?.id;

  const {
    data: solicitudesUser,
    isLoading,
    error,
  } = useQuery<SelectedHelpDataWAssignment[]>({
    queryKey: ['help_requests', { user_id: userId, type: 'necesita' }],
    queryFn: () => getSolicitudesWAssignemntsByUser(userId || ''),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  if (error || isLoading || !solicitudesUser) return <></>;

  const userAssignment = solicitudesUser.find((x) => x.id === caseInfo.id);
  const userIsAssigned = !!userAssignment;

  return (
    <span className="break-words">
      <span className="font-semibold">Contacto:</span>{' '}
      {session && session.user
        ? isAdmin
          ? caseInfo.contact_info
          : !!userIsAssigned
            ? caseInfo.contact_info
            : 'Dale al botón "Quiero ayudar" para ver sus datos de contacto.'
        : 'Inicia sesion para ver este dato'}
    </span>
  );
}
