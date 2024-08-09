import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ai-customer-support-1cda0.firebaseapp.com",
  projectId: "ai-customer-support-1cda0",
  storageBucket: "ai-customer-support-1cda0.appspot.com",
  messagingSenderId: "589910651702",
  appId: "1:589910651702:web:fafafbc9c0d442aea6f997",
  measurementId: "G-653ZJJRB0F"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { db, analytics };