import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import { deleteAccessCode } from "@/lib/accessCodeStore";

export const runtime = "nodejs";

type Params = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, { params }: Params) {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  const { id } = await params;
  await deleteAccessCode(id);

  return NextResponse.json({ success: true });
}
