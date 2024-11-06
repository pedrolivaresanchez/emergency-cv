import { callCenterPhoneTrimmed } from '@/constants/phoneNumber';

const isPhoneEqualToCallCenter = (phoneNumber) => {
  return phoneNumber === callCenterPhoneTrimmed;
};

export const isValidPhone = (phoneNumber) => {
  const phoneNumberWithoutSpaces = phoneNumber.replace(/\D/g, '');

  return (
    phoneNumberWithoutSpaces.length === 9 &&
    /^\d[ \d]*$/.test(phoneNumberWithoutSpaces) &&
    !isPhoneEqualToCallCenter(phoneNumberWithoutSpaces)
  );
};

export const formatPhoneNumber = (value) => {
  // Remove white spaces and non-digit characters
  return value.replace(/\s/g, '').replace(/\D/g, '');
};
