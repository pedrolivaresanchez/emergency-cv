export const isValidPhone = (phone: string) => {
  return phone.length === 9 && [...phone].every((char) => /\d/.test(char));
};

export const isNumericOrSpaces = (value: string) => /^\d*\s*$/.test(value);
