import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import cors from "cors";
import {checkEmail} from "../utils/validation";
import {sendEmailMessage} from "../utils/messaging";

const corsHandler = cors({origin: true});

/**
 * Handles HTTP requests to send an email.
 *
 * This function accepts the following parameters in the request body:
 * - `email`: The recipient email address (required).
 * - `subject`: The email subject (required).
 * - `message`: The email message body (required).
 * - `alias`: Optional email alias to use as sender.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
export const sendmail = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const {email, subject, message, alias} = req.body;

    // Validate required fields
    if (!email || !subject || !message) {
      res.status(400).send("Missing required fields: email, subject, and message are required.");
      return;
    }

    // Validate email format
    if (!checkEmail(email)) {
      res.status(400).send("Invalid email address format.");
      return;
    }

    try {
      await sendEmailMessage(email, subject, message, undefined, alias);
      res.status(200).send("Email sent successfully!");
    } catch (error) {
      logger.error("Failed to send email:", error);
      res.status(500).send("Failed to send email.");
    }
  });
});
