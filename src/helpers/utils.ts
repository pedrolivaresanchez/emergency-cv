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

export const removeUrls = (text: string) => {
  const urlPattern = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/g;
  return text.replace(urlPattern, '');
};

export const textWithEllipsis = (text: string | null, maxLength: number) => {
  if (!text) {
    return text;
  }
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};
