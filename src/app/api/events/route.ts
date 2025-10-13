import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { EventModel } from "@/models/Event";
import { eventSchema } from "@/utils/validators";
import { requireAdminSession } from "@/lib/auth";

export async function GET() {
  await connectToDatabase();
  const events = await EventModel.find().sort({ eventDate: -1 }).lean();
  return NextResponse.json(events);
}

export async function POST(request: Request) {
  try {
    const session = await requireAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const payload = await request.json();
    const data = eventSchema.parse(payload);

    const existing = await EventModel.findOne({ slug: data.slug });
    if (existing) {
      return NextResponse.json({ error: "Event with this slug already exists." }, { status: 409 });
    }

    const event = await EventModel.create(data);
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to create event." }, { status: 400 });
  }
}
