import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { adminDb } from "@/lib/firebase-admin";
import { slugify } from "@/utils/slugify";
import { notificationService } from "@/lib/notification-service";

export async function GET() {
  try {
    const snapshot = await adminDb.collection("news").orderBy("date", "desc").get();
    const news = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    return NextResponse.json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, excerpt, content, date, category, slug, imageUrl, published } = body;

    if (!title || !excerpt || !date || !category || !slug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const normalizedSlug = slugify(String(slug || ""));
    if (!normalizedSlug) {
      return NextResponse.json({ error: "Provide a valid slug for the news item." }, { status: 400 });
    }

    const existing = await adminDb.collection("news").where("slug", "==", normalizedSlug).limit(1).get();
    if (!existing.empty) {
      return NextResponse.json({ error: "Another news item already uses this slug." }, { status: 409 });
    }

    const newDoc = {
      title,
      excerpt,
      content,
      date: new Date(date).toISOString(),
      category,
      slug: normalizedSlug,
      imageUrl: imageUrl || null,
      published: Boolean(published),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await adminDb.collection("news").add(newDoc);

    if (published) {
      try {
        await notificationService.sendNewsNotification({
          title,
          excerpt,
          slug: normalizedSlug,
          imageUrl,
          category,
          date: new Date(date)
        });
      } catch (notificationError) {}
    }

    return NextResponse.json({ _id: docRef.id, ...newDoc }, { status: 201 });
  } catch (error) {
    console.error("Error creating news:", error);
    return NextResponse.json({ error: "Failed to create news" }, { status: 500 });
  }
}
