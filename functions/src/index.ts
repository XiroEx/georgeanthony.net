import {getFirestore} from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import {onSchedule} from "firebase-functions/v2/scheduler";
import {getTopFinancialNews} from "./modules/ai";
import {onRequest} from "firebase-functions/https";
import {Client} from "discord.js-light";
import cors from "cors";
import {initializeApp} from "firebase-admin/app";
import nodemailer from "nodemailer";

const corsHandler = cors({origin: true});
initializeApp();

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
    timeZone: "EST", // Adjust the time zone if needed
  },
  async () => {
    const googleApiKey = process.env.GOOGLE_API_KEY; // Ensure this environment variable is set
    if (!googleApiKey) {
      logger.error("Google API key is not set. Please set the GOOGLE_API_KEY environment variable.");
      return;
    }
    const cx = process.env.GOOGLE_CX; // Ensure this environment variable is set
    if (!cx) {
      logger.error("Custom Search Engine ID (CX) is not set. Please set the CX environment variable.");
      return;
    }
    const openAiApiKey = process.env.OPENAI_API_KEY; // Ensure this environment variable is set
    if (!openAiApiKey) {
      logger.error("OpenAI API key is not set. Please set the OPENAI_API_KEY environment variable.");
      return;
    }
    try {
      const headlines = await getTopFinancialNews(
        googleApiKey, cx, openAiApiKey
      );
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
export const quote = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const {name, dob, email, phone} = req.body;
    const formData = {name, dob, email, phone};
    const apiKey = process.env.DISCORD_API_KEY; // Ensure this environment variable is set
    if (!apiKey) {
      res.status(500).send("API key is not set. Please set the environment variable.");
      return;
    }
    if (checkData(formData)) {
      const userId = process.env.DISCORD_USER_ID;
      if (!userId) {
        res.status(500).send("User ID is not set. Please set the DISCORD_USER_ID environment variable.");
        return;
      }
      const age = new Date().getFullYear() - new Date(dob).getFullYear();
      const dobDate = new Date(dob).toLocaleDateString("en-US", {timeZone: "UTC"});
      const message = `Quote request from ${name} \nAge: ${age} (${dobDate})\nEmail: ${email}\nPhone: ${phone}\nMessage: ${req.body.message}`;
      try {
        await sendDiscordMessage(apiKey, userId, message);
        res.status(200).send("Quote request sent successfully!");
      } catch (error) {
        logger.error("Failed to send Discord message:", error); // Log detailed error
        res.status(500).send("Failed to send Discord message."); // Generic message to client
      }
    } else {
      res.status(400).send("Please fill in all required fields and provide a valid email or phone number.");
    }
  });
});

/**
 * General contact form handler. No data validation is performed.
 * A Discord message is sent.
 * For each property in the request body, add a line to the message of "[key]: [value]".
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
export const contact = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const {send, message, source, cc} = req.body;
    if (send && checkEmail(send)) {
      // If "send" property is present and valid, send an email
      const subject = (source ? source + " " : "") + "Inquiry";
      try {
        await sendEmailMessage(send, subject, message || "", cc);
        res.status(200).send("Email sent successfully!");
      } catch (error) {
        logger.error("Failed to send email:", error);
        res.status(500).send("Failed to send email.");
      }
      return;
    }
    // Otherwise, send a Discord message as before
    const apiKey = process.env.DISCORD_API_KEY;
    if (!apiKey) {
      res.status(500).send("API key is not set. Please set the environment variable.");
      return;
    }
    const userId = process.env.DISCORD_USER_ID;
    if (!userId) {
      res.status(500).send("User ID is not set. Please set the DISCORD_USER_ID environment variable.");
      return;
    }
    const discordMessage = Object.entries(req.body)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    try {
      await sendDiscordMessage(apiKey, userId, discordMessage);
      res.status(200).send("Contact request sent successfully!");
    } catch (error) {
      logger.error("Failed to send Discord message:", error);
      res.status(500).send("Failed to send Discord message.");
    }
  });
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
function checkData(formData: any): boolean {
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


/**
 * Sends a message to a Discord user using the provided API key and user ID.
 *
 * @param {string} apiKey - Discord bot API key.
 * @param {string} userId - Discord user ID to send the message to.
 * @param {string} message - The message content to send.
 * @throws Will throw an error if sending fails.
 * @return {Promise<void>}
 */
async function sendDiscordMessage(
  apiKey: string,
  userId: string,
  message: string
): Promise<void> {
  const client = new Client({intents: []});
  await client.login(apiKey);
  const user = await client.users.fetch(userId);
  if (!user) {
    client.destroy();
    throw new Error("User not found.");
  }
  await user.send(message);
  client.destroy();
}

/**
 * Sends an email using SMTP credentials from environment variables.
 *
 * @param {string} to - Recipient email address.
 * @param {string} subject - Email subject.
 * @param {string} text - Email body (plain text).
 * @param {string} [cc] - Optional CC email address.
 * @throws Will throw an error if sending fails.
 * @return {Promise<void>}
 */
async function sendEmailMessage(
  to: string,
  subject: string,
  text: string,
  cc?: string
): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions: any = {
    from: process.env.EMAIL_ALIAS || process.env.EMAIL_USER,
    to,
    subject,
    text,
  };
  if (cc && checkEmail(cc)) {
    mailOptions.cc = cc;
  }
  const info = await transporter.sendMail(mailOptions);
  if (info.rejected.length > 0) {
    throw new Error("Email not sent.");
  }
  logger.info("Email sent:", info.response);
  transporter.close();
}

