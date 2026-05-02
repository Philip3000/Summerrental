import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import { getFirebaseServerStorage } from "@/lib/firebaseServer";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const runtime = "nodejs";

function safeFilename(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  const storage = await getFirebaseServerStorage();

  if (!storage) {
    return NextResponse.json(
      { success: false, error: "Firebase server user is not configured." },
      { status: 503 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const slot = String(formData.get("slot") ?? "site-image");

  if (!(file instanceof File) || !file.type.startsWith("image/")) {
    return NextResponse.json({ success: false, error: "Upload an image file." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const objectName = `site-images/${slot}-${Date.now()}-${safeFilename(file.name)}`;
  const storageRef = ref(storage, objectName);

  await uploadBytes(storageRef, buffer, {
    contentType: file.type,
    cacheControl: "public, max-age=31536000",
  });
  const url = await getDownloadURL(storageRef);

  return NextResponse.json({ success: true, url });
}
