import { createHash } from "crypto";
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { getFirebaseServerDb } from "@/lib/firebaseServer";
import type { PrivateAccessKind } from "@/lib/privateAccess";
import type { AccessCodeKind, AccessCodeListItem, AccessCodeRecord } from "@/types/access";

const ACCESS_CODES_COLLECTION = "accessCodes";

const globalStore = globalThis as typeof globalThis & {
  __casaMimosaAccessCodes?: AccessCodeRecord[];
};

function hashAccessCode(code: string) {
  return createHash("sha256").update(code.trim()).digest("hex");
}

function getCodePreview(code: string) {
  const trimmed = code.trim();

  if (trimmed.length <= 4) {
    return "****";
  }

  return `**** ${trimmed.slice(-4)}`;
}

function buildAccessCodeRecord({
  code,
  kind,
  label,
  now,
}: {
  code: string;
  kind: AccessCodeKind;
  label: string;
  now: string;
}): AccessCodeRecord {
  const codeHash = hashAccessCode(code);

  return {
    id: codeHash,
    label,
    kind,
    codeHash,
    codePreview: getCodePreview(code),
    active: true,
    createdAt: now,
    updatedAt: now,
  };
}

function getMemoryAccessCodes() {
  if (!globalStore.__casaMimosaAccessCodes) {
    const now = new Date().toISOString();
    globalStore.__casaMimosaAccessCodes = [
      process.env.FAMILY_ACCESS_CODE
        ? buildAccessCodeRecord({
            label: "Local family code",
            kind: "family",
            code: process.env.FAMILY_ACCESS_CODE,
            now,
          })
        : null,
      process.env.FRIEND_ACCESS_CODE
        ? buildAccessCodeRecord({
            label: "Local friend code",
            kind: "friend",
            code: process.env.FRIEND_ACCESS_CODE,
            now,
          })
        : null,
    ].filter(Boolean) as AccessCodeRecord[];
  }

  return globalStore.__casaMimosaAccessCodes;
}

function normalizeAccessCode(id: string, data: DocumentData): AccessCodeRecord {
  return {
    id,
    label: data.label,
    kind: data.kind,
    codeHash: data.codeHash ?? id,
    codePreview: data.codePreview,
    active: Boolean(data.active),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export async function listAccessCodes() {
  const db = await getFirebaseServerDb();

  if (!db) {
    return [...getMemoryAccessCodes()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const snapshot = await getDocs(query(collection(db, ACCESS_CODES_COLLECTION), orderBy("createdAt", "desc")));
  return snapshot.docs.map((accessCodeDoc) =>
    normalizeAccessCode(accessCodeDoc.id, accessCodeDoc.data()),
  );
}

export async function resolveAccessCodeKind(code?: string | null): Promise<PrivateAccessKind> {
  const trimmedCode = code?.trim();

  if (!trimmedCode) {
    return "none";
  }

  const codeHash = hashAccessCode(trimmedCode);
  const db = await getFirebaseServerDb();

  if (!db) {
    const match = getMemoryAccessCodes().find(
      (accessCode) => accessCode.active && accessCode.codeHash === codeHash,
    );
    return match?.kind ?? "none";
  }

  const snapshot = await getDoc(doc(db, ACCESS_CODES_COLLECTION, codeHash));

  if (!snapshot.exists()) {
    return "none";
  }

  const accessCode = normalizeAccessCode(snapshot.id, snapshot.data());

  return accessCode.active ? accessCode.kind : "none";
}

export async function createAccessCode({
  code,
  kind,
  label,
}: {
  code: string;
  kind: AccessCodeKind;
  label: string;
}) {
  const now = new Date().toISOString();
  const db = await getFirebaseServerDb();
  const record = buildAccessCodeRecord({
    code,
    kind,
    label,
    now,
  });

  if (!db) {
    const existing = getMemoryAccessCodes().find(
      (accessCode) => accessCode.codeHash === record.codeHash,
    );

    if (existing) {
      throw new Error("ACCESS_CODE_EXISTS");
    }

    getMemoryAccessCodes().push(record);
    return record;
  }

  const ref = doc(db, ACCESS_CODES_COLLECTION, record.codeHash);
  const existing = await getDoc(ref);

  if (existing.exists()) {
    throw new Error("ACCESS_CODE_EXISTS");
  }

  await setDoc(ref, {
    ...record,
    serverCreatedAt: serverTimestamp(),
    serverUpdatedAt: serverTimestamp(),
  });

  return record;
}

export async function deleteAccessCode(id: string) {
  const db = await getFirebaseServerDb();

  if (!db) {
    globalStore.__casaMimosaAccessCodes = getMemoryAccessCodes().filter((code) => code.id !== id);
    return;
  }

  await deleteDoc(doc(db, ACCESS_CODES_COLLECTION, id));
}

export function toAccessCodeListItem(accessCode: AccessCodeRecord): AccessCodeListItem {
  return {
    id: accessCode.id,
    label: accessCode.label,
    kind: accessCode.kind,
    codePreview: accessCode.codePreview,
    active: accessCode.active,
    createdAt: accessCode.createdAt,
    updatedAt: accessCode.updatedAt,
  };
}
