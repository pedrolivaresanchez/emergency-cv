import { callCenterPhone, callCenterPhoneTrimmed } from '@/constants/phoneNumber';

export const CallCenterLink = () => (
  <a className="font-bold text-blue-600 hover:text-blue-800" href={`tel:+34${callCenterPhoneTrimmed}`}>
    {callCenterPhone}
  </a>
);
