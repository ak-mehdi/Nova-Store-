import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAC4vYCbIwyXYl0HNfFhS-RsuoCGy6vY8g",
  authDomain: "ecommerce-website-task.firebaseapp.com",
  projectId: "ecommerce-website-task",
  storageBucket: "ecommerce-website-task.firebasestorage.app",
  messagingSenderId: "604016742524",
  appId: "1:604016742524:web:f43a904c50741ef171f9f9",
  measurementId: "G-861CEF019Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;

