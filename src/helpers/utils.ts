import { callCenterPhoneTrimmed } from '@/constants/phoneNumber';

const isPhoneEqualToCallCenter = (phoneNumber: string) => {
  return phoneNumber === callCenterPhoneTrimmed;
};

export const isValidPhone = (phoneNumber: string) => {
  const phoneNumberWithoutSpaces = phoneNumber.replace(/\D/g, '');

  return (
    phoneNumberWithoutSpaces.length === 9 &&
    /^\d[ \d]*$/.test(phoneNumberWithoutSpaces) &&
    !isPhoneEqualToCallCenter(phoneNumberWithoutSpaces)
  );
};

export const formatPhoneNumber = (value: string) => {
  // Remove white spaces and non-digit characters
  return value.replace(/\s/g, '').replace(/\D/g, '');
};
