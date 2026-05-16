import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCZyvDWQGOD810e49zwNoWT6vHngfVYbIk",
  authDomain: "zrom-store.firebaseapp.com",
  projectId: "zrom-store",
  storageBucket: "zrom-store.firebasestorage.app",
  messagingSenderId: "549196640370",
  appId: "1:549196640370:web:f7fe04e791d20f4a5152eb",
  measurementId: "G-VLT8QKRGG7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;