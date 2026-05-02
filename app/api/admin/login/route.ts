import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  verifyFirebaseAdminIdToken,
} from "@/lib/adminAuth";
import { adminLoginSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = adminLoginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Invalid login." }, { status: 400 });
  }

  let admin;

  try {
    admin = await verifyFirebaseAdminIdToken(parsed.data.idToken);
  } catch {
    return NextResponse.json({ success: false, error: "Admin access was not allowed." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, await createAdminSessionToken(admin), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return response;
}
