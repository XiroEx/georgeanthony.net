/**
 * Validates if the given phone number matches the expected format.
 *
 * The function checks if the input string is a 10-digit number.
 * Adjust the regular expression as needed to accommodate different phone number formats.
 *
 * @param {string} phone - The phone number string to validate.
 * @return {boolean} `true` if the phone number matches the format, otherwise `false`.
 */
export function checkPhone(phone: string): boolean {
  const re = /^\d{10}$/; // Adjust the regex as per your phone number format
  return re.test(phone);
}
