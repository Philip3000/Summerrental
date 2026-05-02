import type { PrivateAccessKind } from "@/lib/privateAccess";

export type AccessCodeKind = Exclude<PrivateAccessKind, "none">;

export type AccessCodeRecord = {
  id: string;
  label: string;
  kind: AccessCodeKind;
  codeHash: string;
  codePreview: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AccessCodeListItem = Omit<AccessCodeRecord, "codeHash">;
