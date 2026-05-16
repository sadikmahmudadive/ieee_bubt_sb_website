import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { galleryItemSchema } from "@/utils/validators";
import { requireAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const snapshot = await adminDb.collection("galleryItems").orderBy("uploadedAt", "desc").get();
    const items = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Unable to fetch gallery items." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();
    const data = galleryItemSchema.parse(payload);

    const docData = {
      ...data,
      uploadedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await adminDb.collection("galleryItems").add(docData);
    return NextResponse.json({ _id: docRef.id, ...docData }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to create gallery item." }, { status: 400 });
  }
}
