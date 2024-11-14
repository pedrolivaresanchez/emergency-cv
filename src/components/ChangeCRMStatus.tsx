'use client';

import { useCallback, useState } from 'react';
import { CRMStatus, CrmStatusActive, CrmStatusFinished } from '@/helpers/constants';
import { addCRMLog, updateHelpRequestCRMStatus } from '@/lib/actions';
import { useSession } from '@/context/SessionProvider';

type ChangeCRMStatusRequestButtonProps = {
  helpRequestId: number;
  onStatusUpdate: (status: string) => void;
  currentStatus: string | null;
  currentCrmStatus: string | null;
};

export default function ChangeCRMStatus({
  helpRequestId,
  onStatusUpdate,
  currentStatus,
  currentCrmStatus,
}: ChangeCRMStatusRequestButtonProps) {
  const { user } = useSession();
  const [crmStatus, setCrmStatus] = useState<string>(currentCrmStatus || CrmStatusActive);
  const [error, setError] = useState({});

  const updateStatusRequest = useCallback(
    async (newCrmStatus: string) => {
      var status = currentStatus || 'active';
      if (newCrmStatus === CrmStatusFinished) {
        status = 'finished';
      } else if (newCrmStatus !== CrmStatusFinished && status == 'finished') {
        status = 'active';
      }
      const { data, error } = await updateHelpRequestCRMStatus(String(helpRequestId), status, newCrmStatus);
      if (user !== null) {
        await addCRMLog(
          'Estado cambiado de ' + crmStatus + ' a ' + newCrmStatus,
          helpRequestId,
          user.id,
          (user.user_metadata.full_name || user.user_metadata.nombre) + ' ' + user.email,
        );
      }
      onStatusUpdate(status);

      return { data, error };
    },
    [crmStatus, helpRequestId, user],
  );

  async function handleUpdateSubmit(newStatus: string) {
    const { data, error } = await updateStatusRequest(newStatus);
    if (error) {
      setError(error);
      return;
    }
  }

  if (error === undefined) return <></>;

  return (
    <>
      <select
        name="urgencia"
        id="urgencia"
        value={crmStatus}
        onChange={(e) => {
          setCrmStatus(e.target.value);
          handleUpdateSubmit(e.target.value);
        }}
        className="w-full text-center rounded-xl px-4 py-2 font-semibold text-white sm:w-auto transition-all bg-purple-500"
      >
        {Object.entries(CRMStatus).map(([key, value]) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))}
      </select>
    </>
  );
}
