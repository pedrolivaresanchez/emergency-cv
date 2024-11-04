export const isValidPhone = (phone) => {
  return phone.length === 9 && [...phone].every((char) => /\d/.test(char));
};
