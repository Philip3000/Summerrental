import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "@/lib/firebaseClient";

const SERVER_APP_NAME = "casa-mimosa-public-server";

function getFirebaseServerApp(): FirebaseApp {
  return getApps().some((app) => app.name === SERVER_APP_NAME)
    ? getApp(SERVER_APP_NAME)
    : initializeApp(firebaseConfig, SERVER_APP_NAME);
}

export async function getFirebaseServerDb() {
  return getFirestore(getFirebaseServerApp());
}
