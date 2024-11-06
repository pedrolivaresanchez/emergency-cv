import { callCenterPhone } from '@/constants/phoneNumber';

export const CallCenterLink = () => {
  const formattedPhone = callCenterPhone.replace(/\s/g, '');
  
  return (
    <a className="font-bold text-blue-600 hover:text-blue-800" href={`tel:+34${formattedPhone}`}>
      {callCenterPhone}
    </a>
  );
};
