import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { EventModel } from "@/models/Event";
import { eventSchema } from "@/utils/validators";
import { requireAdminSession } from "@/lib/auth";
import { slugify } from "@/utils/slugify";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  const event = await EventModel.findById(params.id).lean();
  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }
  return NextResponse.json(event);
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

    await connectToDatabase();
    const payload = await request.json();
    const data = eventSchema.partial().parse(payload);

    if (data.slug) {
      const sanitized = slugify(data.slug);
      if (!sanitized) {
        return NextResponse.json({ error: "Provide a valid slug for the event." }, { status: 400 });
      }
      data.slug = sanitized;

      const existing = await EventModel.findOne({ slug: sanitized, _id: { $ne: params.id } });
      if (existing) {
        return NextResponse.json({ error: "Another event already uses this slug." }, { status: 409 });
      }
    }

    const updated = await EventModel.findByIdAndUpdate(params.id, data, {
      new: true
    }).lean();

    if (!updated) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
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

  await connectToDatabase();
  const deleted = await EventModel.findByIdAndDelete(params.id).lean();
  if (!deleted) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
