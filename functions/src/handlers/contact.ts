import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import cors from "cors";
import {checkEmail} from "../utils/validation";
import {sendDiscordMessage, sendEmailMessage} from "../utils/messaging";

const corsHandler = cors({origin: true});

/**
 * General contact form handler. No data validation is performed.
 * If "send" property is present and valid, sends an email. Otherwise, sends a Discord message.
 * Supports email aliases - if "alias" property is present, uses corresponding credentials.
 * For each property in the request body, add a line to the message of "[key]: [value]".
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
export const contact = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const {send, message, source, cc, email, name, alias} = req.body;
    if (send && checkEmail(send)) {
      // If "send" property is present and valid, send an email
      const subject =
      (source ? `${source} inquiry` : "Inquiry") +
      (name || email ? ` from${name ? ` ${name}` : ""}${email ? ` (${email})` : ""}` : "");
      try {
        await sendEmailMessage(send, subject, message || "", cc, alias);
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
