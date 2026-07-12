import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBR-0ZCRd7F7CBnWw_9nJPm0nkFGJAyVG4",
  authDomain: "nachofamilyapp.firebaseapp.com",
  projectId: "nachofamilyapp",
  storageBucket: "nachofamilyapp.firebasestorage.app",
  messagingSenderId: "486079153281",
  appId: "1:486079153281:web:792f0e1d32ac15e4b7b980",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

if (typeof window !== "undefined") {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      try {
        await signInAnonymously(auth);
        console.log("✅ Anonymous login successful");
      } catch (error) {
        console.error("❌ Anonymous login failed", error);
      }
    } else {
      console.log("✅ Logged in as", user.uid);
    }
  });
}