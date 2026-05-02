import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";

export async function requireAdmin() {
  if (await isAdminAuthenticated()) {
    return null;
  }

  return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
}
