import {onSchedule} from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import {getTopFinancialNews} from "./modules/ai";
import {getFirestore} from "firebase-admin/firestore";
import {initializeApp} from "firebase-admin";
import { getApps } from "firebase-admin/app";


// Cloud Function triggered by a scheduled event
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

      // Initialize Firebase Admin SDK
      if (!getApps().length) {
        initializeApp();
      }
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
