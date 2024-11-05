export const isValidPhone = (phoneNumber) => {
  const phoneNumberWithoutSpaces = phoneNumber.replace(/\D/g, '');
  return phoneNumberWithoutSpaces.length === 9 && /^\d[ \d]*$/.test(phoneNumberWithoutSpaces);
};

export const isNumericOrSpaces = (value) => /^\d*\s*$/.test(value);
