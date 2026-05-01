import { NextResponse } from "next/server";
import {
  FAMILY_ACCESS_COOKIE,
  createFamilyAccessToken,
  getConfiguredFamilyCode,
  isFamilyCodeValid,
} from "@/lib/familyAccess";
import { familyCodeSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = familyCodeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  const configuredCode = getConfiguredFamilyCode();

  if (!configuredCode) {
    return NextResponse.json(
      { valid: false, error: "Family access is not configured." },
      { status: 500 },
    );
  }

  const valid = isFamilyCodeValid(parsed.data.code, configuredCode);
  const response = NextResponse.json({ valid });

  if (valid) {
    const token = createFamilyAccessToken(configuredCode);

    response.cookies.set(FAMILY_ACCESS_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
  } else {
    response.cookies.delete(FAMILY_ACCESS_COOKIE);
  }

  return response;
}
