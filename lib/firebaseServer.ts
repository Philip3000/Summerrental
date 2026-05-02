import { type FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore/lite";
import { firebaseConfig } from "@/lib/firebaseConfig";

const SERVER_APP_NAME = "casa-mimosa-public-server";

let serverDb: Firestore | null = null;

function getFirebaseServerApp(): FirebaseApp {
  return getApps().some((app) => app.name === SERVER_APP_NAME)
    ? getApp(SERVER_APP_NAME)
    : initializeApp(firebaseConfig, SERVER_APP_NAME);
}

export async function getFirebaseServerDb() {
  if (serverDb) {
    return serverDb;
  }

  serverDb = getFirestore(getFirebaseServerApp());
  return serverDb;
}