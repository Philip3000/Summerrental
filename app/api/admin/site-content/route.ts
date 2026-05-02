import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import { getSiteContent, updateSiteContent } from "@/lib/bookingStore";
import { siteContentSchema } from "@/lib/validation";
import type { SiteContent } from "@/types/site";

export const runtime = "nodejs";

export async function GET() {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  return NextResponse.json(await getSiteContent());
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  const body = await request.json().catch(() => null);
  const parsed = siteContentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid site content.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  return NextResponse.json(await updateSiteContent(parsed.data as Partial<SiteContent>));
}
