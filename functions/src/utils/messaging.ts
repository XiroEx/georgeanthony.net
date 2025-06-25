import {Client} from "discord.js-light";
import nodemailer from "nodemailer";
import * as logger from "firebase-functions/logger";
import {checkEmail} from "./validation";

/**
 * Maps email aliases to their corresponding user and password environment variable names.
 */
export const EMAIL_ALIAS_MAP: Record<string, {user: string; pass: string}> = {
  "info@prosolutionlogistics.com": {
    user: "PRO_SOLUTIONS_USER",
    pass: "PRO_SOLUTIONS_PASS",
  },
  // Add more aliases as needed
};

/**
 * Sends a message to a Discord user using the provided API key and user ID.
 *
 * @param {string} apiKey - Discord bot API key.
 * @param {string} userId - Discord user ID to send the message to.
 * @param {string} message - The message content to send.
 * @throws Will throw an error if sending fails.
 * @return {Promise<void>}
 */
export async function sendDiscordMessage(
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
 * @param {string} [alias] - Optional email alias to use as sender.
 * @throws Will throw an error if sending fails.
 * @return {Promise<void>}
 */
export async function sendEmailMessage(
  to: string,
  subject: string,
  text: string,
  cc?: string,
  alias?: string
): Promise<void> {
  // Determine email credentials based on alias
  let emailUser = process.env.EMAIL_USER;
  let emailPass = process.env.EMAIL_PASS;
  let fromAddress = process.env.EMAIL_ALIAS || process.env.EMAIL_USER;

  if (alias && EMAIL_ALIAS_MAP[alias]) {
    const {user: userEnvVar, pass: passwordEnvVar} = EMAIL_ALIAS_MAP[alias];
    const aliasUser = process.env[userEnvVar];
    const aliasPassword = process.env[passwordEnvVar];

    if (aliasUser && aliasPassword) {
      emailUser = aliasUser;
      emailPass = aliasPassword;
      fromAddress = alias;
      logger.info(`Using alias credentials for: ${alias}`);
    } else {
      logger.warn(`Credentials not found for alias ${alias}, using default credentials`);
    }
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  const mailOptions: any = {
    from: fromAddress,
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
