/**
 * Validates whether a given string is in the format of a valid email address.
 *
 * @param {string} email - The email address to validate.
 * @return {boolean} `true` if the email is valid, otherwise `false`.
 */
export function checkEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
