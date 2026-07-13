import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { eventSchema } from "@/utils/validators";
import { requireAdminSession } from "@/lib/auth";
import { slugify } from "@/utils/slugify";
import { notificationService } from "@/lib/notification-service";

export async function GET() {
  try {
    const snapshot = await adminDb.collection("events").orderBy("eventDate", "desc").get();
    const events = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: "Unable to fetch events." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();
    const parsed = eventSchema.parse(payload);
    const sanitizedSlug = slugify(parsed.slug);
    
    if (!sanitizedSlug) {
      return NextResponse.json({ error: "Provide a valid slug for the event." }, { status: 400 });
    }

    const data = { ...parsed, slug: sanitizedSlug };

    const existing = await adminDb.collection("events").where("slug", "==", data.slug).limit(1).get();
    if (!existing.empty) {
      return NextResponse.json({ error: "Event with this slug already exists." }, { status: 409 });
    }

    const docData = {
      ...data,
      eventDate: new Date(data.eventDate).toISOString(),
      eventEndDate: data.eventEndDate ? new Date(data.eventEndDate).toISOString() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await adminDb.collection("events").add(docData);

    try {
      await notificationService.sendEventNotification({
        title: data.title,
        description: data.description,
        slug: data.slug,
        imageUrl: data.coverImage,
        eventDate: new Date(data.eventDate),
        eventEndDate: data.eventEndDate ? new Date(data.eventEndDate) : undefined,
        location: data.location,
        category: data.tags?.[0] || 'Event'
      });
    } catch (notificationError) {}

    return NextResponse.json({ _id: docRef.id, ...docData }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to create event." }, { status: 400 });
  }
}
