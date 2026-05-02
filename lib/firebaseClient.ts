import { getApp, getApps, initializeApp } from "firebase/app";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyAWAQ4Io_Vay8WI1h2swkZD3DrY4vjVEjY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "casamimosa-a5aa6.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "casamimosa-a5aa6",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "casamimosa-a5aa6.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "137963519885",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:137963519885:web:d39fc0fd1ae3662ff707c4",
};

export function getFirebaseClientApp() {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}
