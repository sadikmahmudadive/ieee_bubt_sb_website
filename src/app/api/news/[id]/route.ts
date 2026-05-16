import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { adminDb } from "@/lib/firebase-admin";
import { slugify } from "@/utils/slugify";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, excerpt, content, date, category, slug, imageUrl, published } = body;

    const update: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    if (title !== undefined) update.title = title;
    if (excerpt !== undefined) update.excerpt = excerpt;
    if (content !== undefined) update.content = content;
    if (date !== undefined) update.date = date ? new Date(date).toISOString() : null;
    if (category !== undefined) update.category = category;
    
    if (slug !== undefined) {
      const normalized = slugify(String(slug));
      if (!normalized) {
        return NextResponse.json({ error: "Provide a valid slug for the news item." }, { status: 400 });
      }
      const exists = await adminDb.collection("news").where("slug", "==", normalized).get();
      if (!exists.empty && exists.docs[0].id !== params.id) {
        return NextResponse.json({ error: "Another news item already uses this slug." }, { status: 409 });
      }
      update.slug = normalized;
    }
    
    if (imageUrl !== undefined) update.imageUrl = imageUrl;
    if (published !== undefined) update.published = Boolean(published);

    const docRef = adminDb.collection("news").doc(params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    await docRef.update(update);
    return NextResponse.json({ _id: params.id, ...doc.data(), ...update });
  } catch (error) {
    console.error("Error updating news:", error);
    return NextResponse.json({ error: "Failed to update news" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const docRef = adminDb.collection("news").doc(params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    await docRef.delete();
    return NextResponse.json({ message: "News deleted successfully" });
  } catch (error) {
    console.error("Error deleting news:", error);
    return NextResponse.json({ error: "Failed to delete news" }, { status: 500 });
  }
}
