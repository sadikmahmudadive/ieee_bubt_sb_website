import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { eventSchema } from "@/utils/validators";
import { requireAdminSession } from "@/lib/auth";
import { slugify } from "@/utils/slugify";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const doc = await adminDb.collection("events").doc(params.id).get();
  if (!doc.exists) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }
  return NextResponse.json({ _id: doc.id, ...doc.data() });
}

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
    const data: any = eventSchema.partial().parse(payload);

    if (data.slug) {
      const sanitized = slugify(data.slug);
      if (!sanitized) {
        return NextResponse.json({ error: "Provide a valid slug for the event." }, { status: 400 });
      }
      data.slug = sanitized;

      const existing = await adminDb.collection("events").where("slug", "==", sanitized).get();
      if (!existing.empty && existing.docs[0].id !== params.id) {
        return NextResponse.json({ error: "Another event already uses this slug." }, { status: 409 });
      }
    }

    if (data.eventDate) {
      data.eventDate = new Date(data.eventDate).toISOString();
    }

    const docRef = adminDb.collection("events").doc(params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    await docRef.update({ ...data, updatedAt: new Date().toISOString() });
    return NextResponse.json({ _id: params.id, ...doc.data(), ...data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to update event." }, { status: 400 });
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

  const docRef = adminDb.collection("events").doc(params.id);
  const doc = await docRef.get();
  
  if (!doc.exists) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }
  
  await docRef.delete();
  return NextResponse.json({ success: true });
}
