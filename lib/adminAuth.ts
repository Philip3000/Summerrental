import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { firebaseConfig } from "@/lib/firebaseClient";

export const ADMIN_SESSION_COOKIE = "casa_mimosa_admin";

type FirebaseLookupUser = {
  localId: string;
  email?: string;
};

function getAdminSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.FAMILY_ACCESS_CODE || "local-dev-secret";
}

function getSecretKey() {
  return new TextEncoder().encode(getAdminSecret());
}

function getAllowedAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

async function lookupFirebaseUser(idToken: string) {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    },
  );

  if (!response.ok) {
    throw new Error("INVALID_FIREBASE_TOKEN");
  }

  const data = (await response.json()) as { users?: FirebaseLookupUser[] };
  const user = data.users?.[0];

  if (!user?.localId) {
    throw new Error("INVALID_FIREBASE_TOKEN");
  }

  return {
    uid: user.localId,
    email: user.email?.toLowerCase(),
  };
}

async function hasAdminDocument(idToken: string, uid: string) {
  const projectId = firebaseConfig.projectId;
  const response = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/admins/${uid}`,
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    },
  );

  return response.ok;
}

export async function createAdminSessionToken(payload: { uid: string; email?: string }) {
  return new SignJWT({ role: "admin", uid: payload.uid, email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(getSecretKey());
}

export async function verifyFirebaseAdminIdToken(idToken: string) {
  const user = await lookupFirebaseUser(idToken);
  const allowedEmails = getAllowedAdminEmails();

  if (user.email && allowedEmails.includes(user.email)) {
    return user;
  }

  if (await hasAdminDocument(idToken, user.uid)) {
    return user;
  }

  throw new Error("ADMIN_NOT_ALLOWED");
}

export async function verifyAdminSessionToken(token?: string) {
  if (!token) {
    return false;
  }

  try {
    const result = await jwtVerify(token, getSecretKey());
    return result.payload.role === "admin";
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}
