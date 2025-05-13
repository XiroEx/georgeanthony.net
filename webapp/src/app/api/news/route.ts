// filepath: /workspaces/georgeanthony.net/webapp/src/pages/api/news-summary.ts
import { initializeApp } from "firebase/app";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { NextResponse } from "next/server";
import firebaseconfig from "../../../../public/firebaseconfig";

export async function GET() {
  const today = new Date().toDateString()
  let newsSummary = "";
  console.log("Fetching news summary for:", today);

  try {
    initializeApp(firebaseconfig);
    const db = getFirestore();

    const docRef = doc(collection(db, "news"), today);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const latestHour = Object.keys(data)
        .map(Number)
        .filter((hour) => hour >= 0 && hour <= 23)
        .sort((a, b) => b - a)[0];

      newsSummary = latestHour !== undefined ? data[latestHour] : "";
    }
  } catch (error) {
    console.error("Error fetching news summary:", error);
    return NextResponse.json({ error: "Failed to fetch news summary" });
  }

  return NextResponse.json({ newsSummary });
}