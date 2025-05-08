
import {onRequest} from "firebase-functions/v2/https";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
import next from "next";

const dev = false;
const app = next({dev, conf: {distDir: ".next"}});

const handle = app.getRequestHandler();

export const nextApp = onRequest(async (req, res) => {
  await app.prepare();
  return await handle(req, res);
}
);
