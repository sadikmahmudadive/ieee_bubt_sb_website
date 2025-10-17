import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { News } from "@/models/News";
import { slugify } from "@/utils/slugify";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const update: Record<string, unknown> = {};
    if (title !== undefined) update.title = title;
    if (excerpt !== undefined) update.excerpt = excerpt;
    if (content !== undefined) update.content = content;
    if (date !== undefined) update.date = date ? new Date(date) : undefined;
    if (category !== undefined) update.category = category;
    if (slug !== undefined) {
      const normalized = slugify(String(slug));
      if (!normalized) {
        return NextResponse.json({ error: "Provide a valid slug for the news item." }, { status: 400 });
      }
      const exists = await News.findOne({ slug: normalized, _id: { $ne: params.id } }).lean();
      if (exists) {
        return NextResponse.json({ error: "Another news item already uses this slug." }, { status: 409 });
      }
      update.slug = normalized;
    }
    if (imageUrl !== undefined) update.imageUrl = imageUrl;
    if (published !== undefined) update.published = Boolean(published);

    const updatedNews = await News.findByIdAndUpdate(
      params.id,
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!updatedNews) {
      return NextResponse.json(
        { error: "News not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedNews);
  } catch (error) {
    console.error("Error updating news:", error);
    return NextResponse.json(
      { error: "Failed to update news" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const deletedNews = await News.findByIdAndDelete(params.id);

    if (!deletedNews) {
      return NextResponse.json(
        { error: "News not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "News deleted successfully" });
  } catch (error) {
    console.error("Error deleting news:", error);
    return NextResponse.json(
      { error: "Failed to delete news" },
      { status: 500 }
    );
  }
}
