import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { GalleryItemModel } from "@/models/GalleryItem";
import { galleryItemSchema } from "@/utils/validators";
import { requireAdminSession } from "@/lib/auth";

export async function GET() {
  await connectToDatabase();
  const items = await GalleryItemModel.find().sort({ uploadedAt: -1 }).lean();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    const session = await requireAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const payload = await request.json();
    const data = galleryItemSchema.parse(payload);

    const item = await GalleryItemModel.create(data);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to create gallery item." }, { status: 400 });
  }
}
