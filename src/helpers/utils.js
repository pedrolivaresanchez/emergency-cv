export const isValidPhone = (phone) => {
  return phone.length === 9 && [...phone].every((char) => /\d/.test(char));
};

export const isNumericOrSpaces = (value) => /^\d*\s*$/.test(value);
