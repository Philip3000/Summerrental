import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, User } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "@/lib/firebaseClient";

const SERVER_APP_NAME = "casa-mimosa-server";

let serverSignInPromise: Promise<User> | null = null;

export function isFirebaseServerConfigured() {
  return Boolean(process.env.FIREBASE_SERVER_EMAIL && process.env.FIREBASE_SERVER_PASSWORD);
}

function getFirebaseServerApp(): FirebaseApp {
  return getApps().some((app) => app.name === SERVER_APP_NAME)
    ? getApp(SERVER_APP_NAME)
    : initializeApp(firebaseConfig, SERVER_APP_NAME);
}

async function ensureServerUser() {
  if (!isFirebaseServerConfigured()) {
    return null;
  }

  const auth = getAuth(getFirebaseServerApp());

  if (auth.currentUser) {
    return auth.currentUser;
  }

  serverSignInPromise ??= signInWithEmailAndPassword(
    auth,
    process.env.FIREBASE_SERVER_EMAIL ?? "",
    process.env.FIREBASE_SERVER_PASSWORD ?? "",
  ).then((credential) => credential.user);

  return serverSignInPromise;
}

export async function getFirebaseServerDb() {
  if (!isFirebaseServerConfigured()) {
    return null;
  }

  await ensureServerUser();
  return getFirestore(getFirebaseServerApp());
}

export async function getFirebaseServerStorage() {
  if (!isFirebaseServerConfigured()) {
    return null;
  }

  await ensureServerUser();
  return getStorage(getFirebaseServerApp());
}
