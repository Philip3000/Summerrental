import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getFirestore,
  initializeFirestore,
  type Firestore,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "@/lib/firebaseConfig";

let firestoreInstance: Firestore | null = null;

export function getFirebaseClientApp() {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseClientDb() {
  const app = getFirebaseClientApp();

  if (firestoreInstance) {
    return firestoreInstance;
  }

  try {
    firestoreInstance = initializeFirestore(app, {
      ignoreUndefinedProperties: true,
    });
  } catch {
    firestoreInstance = getFirestore(app);
  }

  return firestoreInstance;
}

export function getFirebaseClientStorage() {
  return getStorage(getFirebaseClientApp());
}