import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { galleryItemSchema } from "@/utils/validators";
import { requireAdminSession } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();
    const data = galleryItemSchema.partial().parse(payload);

    const docRef = adminDb.collection("galleryItems").doc(params.id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return NextResponse.json({ error: "Gallery item not found." }, { status: 404 });
    }

    await docRef.update({ ...data, updatedAt: new Date().toISOString() });
    return NextResponse.json({ _id: params.id, ...doc.data(), ...data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to update gallery item." }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const docRef = adminDb.collection("galleryItems").doc(params.id);
  const doc = await docRef.get();
  
  if (!doc.exists) {
    return NextResponse.json({ error: "Gallery item not found." }, { status: 404 });
  }
  
  await docRef.delete();
  return NextResponse.json({ success: true });
}
