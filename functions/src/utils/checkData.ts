/**
 * Validates the provided form data to ensure required fields are not empty
 * and that email and phone fields meet their respective validation criteria.
 *
 * @param {Object} formData - An object containing the form data to validate.
 * @param {string} formData.name - The name of the user (must not be empty).
 * @param {string} formData.dob - The date of birth of the user (must not be empty).
 * @param {string} formData.email - The email address of the user (optional, but must be valid if provided).
 * @param {string} formData.phone - The phone number of the user (optional, but must be valid if provided).
 * @return {boolean} A boolean indicating whether the form data is valid.
 */
import {checkEmail} from "./checkEmail";
import {checkPhone} from "./checkPhone";

/**
 * Validates the provided form data to ensure required fields are not empty
 * and that email and phone fields meet their respective validation criteria.
 *
 * @param {Object} formData - An object containing the form data to validate.
 * @param {string} formData.name - The name of the user (must not be empty).
 * @param {string} formData.dob - The date of birth of the user (must not be empty).
 * @param {string} formData.email - The email address of the user (optional, but must be valid if provided).
 * @param {string} formData.phone - The phone number of the user (optional, but must be valid if provided).
 * @return {boolean} A boolean indicating whether the form data is valid.
 */
export function checkData(formData: any): boolean {
  const {name, dob, email, phone, message} = formData;
  // At least one of name, dob, email, or phone must be provided and valid if present
  const hasAny =
    (name && name.trim() !== "") ||
    (dob && dob.trim() !== "") ||
    (email && email.trim() !== "") ||
    (phone && phone.trim() !== "") ||
    (message && message.trim() !== "");
  const emailValid = !email || email.trim() === "" || checkEmail(email);
  const phoneValid = !phone || phone.trim() === "" || checkPhone(phone);
  return hasAny && emailValid && phoneValid;
}
