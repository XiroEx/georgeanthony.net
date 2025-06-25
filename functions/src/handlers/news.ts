import {getFirestore} from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import {onSchedule} from "firebase-functions/v2/scheduler";
import {getTopFinancialNews} from "../modules/ai";

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
export const getNewsSummary = onSchedule(
  {
    schedule: "0 */4 * * *", // Every 4 hours
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
