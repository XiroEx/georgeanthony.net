import {getFirestore} from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import {onSchedule} from "firebase-functions/v2/scheduler";
import {getTopFinancialNews} from "./modules/ai";
import {onRequest} from "firebase-functions/https";

/**
 * A scheduled Cloud Function that runs at specific times to fetch top financial news
 * and store it in a Firestore database.
 *
 * The function is triggered based on the specified cron schedule:
 * - Runs at 12am, 2am, 4am, and every hour from 6am to 10pm (UTC).
 *
 * Environment Variables:
 * - `OPENAI_API_KEY`: The API key required to fetch financial news from the external API.
 *
 * Firestore:
 * - Stores the fetched news headlines in a Firestore collection named `news`.
 * - Each document is named after the current date (e.g., "Mon Oct 02 2023").
 * - The document contains an hourly mapping of news headlines.
 *
 * @throws Will log an error if the `OPENAI_API_KEY` environment variable is not set.
 * @throws Will log an error if there is an issue fetching news or storing it in Firestore.
 */
export const scheduledFunction = onSchedule(
  {
    schedule: "0 0,2,4,6-22 * * *", // Cron schedule: 12am, 2am, 4am, and every hour from 6am to 10pm
    timeZone: "UTC", // Adjust the time zone if needed
  },
  async () => {
    const apiKey = process.env.OPENAI_API_KEY; // Ensure this environment variable is set
    if (!apiKey) {
      logger.error("API key is not set. Please set the OPENAI_API_KEY environment variable.");
      return;
    }
    try {
      const headlines = await getTopFinancialNews(apiKey);
      if (!headlines) {
        logger.error("No headlines received from the API.");
        return;
      }
      const date = new Date().toDateString();
      const hour = new Date().getHours();

      const firestore = getFirestore();
      const docRef = firestore.collection("news").doc(date);

      await docRef.set(
        {
          [hour]: headlines,
        },
        {merge: true}
      );
      logger.info("Top financial news headlines:", headlines);
    } catch (error) {
      logger.error("Error fetching financial news:", error);
    }
  }
);

/**
 * Handles HTTP requests to process a quote request.
 *
 * This function is triggered by an HTTP request and expects the request body
 * to contain the following fields:
 * - `name`: The name of the person requesting the quote.
 * - `dob`: The date of birth of the person requesting the quote.
 * - `email`: The email address of the person requesting the quote.
 * - `phone`: The phone number of the person requesting the quote.
 *
 * The function validates the provided data and checks for the presence of
 * an API key in the `OPENAI_API_KEY` environment variable. If the API key
 * is not set, it responds with a 500 status code. If the data is invalid,
 * it responds with a 400 status code. Otherwise, it responds with a 200
 * status code indicating that the quote request was sent successfully.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
export const quote = onRequest((req, res) => {
  const {name, dob, email, phone} = req.body;
  const formData = {name, dob, email, phone};
  const apiKey = process.env.OPENAI_API_KEY; // Ensure this environment variable is set
  if (!apiKey) {
    res.status(500).send("API key is not set. Please set the OPENAI_API_KEY environment variable.");
    return;
  }
  if (checkData(formData)) {
    res.status(200).send("Quote request sent successfully!");
  } else {
    res.status(400).send("Please fill in all required fields and provide a valid email or phone number.");
  }
});

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
function checkData(formData: {
  name: string; dob: string; email: string; phone: string
}): boolean {
  const {name, dob, email, phone} = formData;
  return (
    name.trim() !== "" &&
    dob.trim() !== "" &&
    (email.trim() !== "" || phone.trim() !== "") &&
    (email.trim() === "" || checkEmail(email)) &&
    (phone.trim() === "" || checkPhone(phone))
  );
}

/**
 * Validates whether a given string is in the format of a valid email address.
 *
 * @param {string} email - The email address to validate.
 * @return {boolean} `true` if the email is valid, otherwise `false`.
 */
function checkEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Validates if the given phone number matches the expected format.
 *
 * The function checks if the input string is a 10-digit number.
 * Adjust the regular expression as needed to accommodate different phone number formats.
 *
 * @param {string} phone - The phone number string to validate.
 * @return {boolean} `true` if the phone number matches the format, otherwise `false`.
 */
function checkPhone(phone: string): boolean {
  const re = /^\d{10}$/; // Adjust the regex as per your phone number format
  return re.test(phone);
}
