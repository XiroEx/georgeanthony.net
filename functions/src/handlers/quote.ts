import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import cors from "cors";
import {checkData} from "../utils/validation";
import {sendDiscordMessage} from "../utils/messaging";

const corsHandler = cors({origin: true});

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
