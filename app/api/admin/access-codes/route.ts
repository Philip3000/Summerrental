import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import { createAccessCode, listAccessCodes, toAccessCodeListItem } from "@/lib/accessCodeStore";
import { accessCodeCreateSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function GET() {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  const accessCodes = await listAccessCodes();
  return NextResponse.json({ accessCodes: accessCodes.map(toAccessCodeListItem) });
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  const body = await request.json().catch(() => null);
  const parsed = accessCodeCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Invalid code details." }, { status: 400 });
  }

  try {
    const accessCode = await createAccessCode(parsed.data);
    return NextResponse.json({ success: true, accessCode: toAccessCodeListItem(accessCode) });
  } catch (error) {
    if (error instanceof Error && error.message === "ACCESS_CODE_EXISTS") {
      return NextResponse.json(
        { success: false, error: "That code already exists." },
        { status: 409 },
      );
    }

    throw error;
  }
}
