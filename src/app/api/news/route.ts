import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { News } from "@/models/News";
import { slugify } from "@/utils/slugify";

export async function GET() {
  try {
    await connectToDatabase();

    const news = await News.find({})
      .sort({ date: -1, createdAt: -1 })
      .lean();

    return NextResponse.json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const body = await request.json();
  const { title, excerpt, content, date, category, slug, imageUrl, published } = body;

    if (!title || !excerpt || !date || !category || !slug) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const normalizedSlug = slugify(String(slug || ""));
    if (!normalizedSlug) {
      return NextResponse.json(
        { error: "Provide a valid slug for the news item." },
        { status: 400 }
      );
    }

    // Prevent duplicate slugs with a friendlier error
    const existing = await News.findOne({ slug: normalizedSlug }).lean();
    if (existing) {
      return NextResponse.json(
        { error: "Another news item already uses this slug." },
        { status: 409 }
      );
    }

    const news = new News({
      title,
      excerpt,
      content,
      date: new Date(date),
      category,
      slug: normalizedSlug,
      imageUrl,
      published: Boolean(published)
    });

    await news.save();

    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    console.error("Error creating news:", error);
    return NextResponse.json(
      { error: "Failed to create news" },
      { status: 500 }
    );
  }
}
