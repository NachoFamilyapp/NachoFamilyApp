import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBR-OZCrd7F7CBnWw_9nJPm0nkFGJAyVG4",
  authDomain: "nachofamilyapp.firebaseapp.com",
  projectId: "nachofamilyapp",
  storageBucket: "nachofamilyapp.firebasestorage.app",
  messagingSenderId: "486079153281",
  appId: "1:486079153281:web:792f0e1d32ac15e4b7b980",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);