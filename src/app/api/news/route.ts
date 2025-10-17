import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { News } from "@/models/News";

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

    const news = new News({
      title,
      excerpt,
      content,
      date: new Date(date),
      category,
      slug,
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
