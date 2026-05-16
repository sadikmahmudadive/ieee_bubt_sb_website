import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { adminDb } from "@/lib/firebase-admin";
import { requireAdminSession } from "@/lib/auth";
import { newsletterSubscriptionSchema } from "@/utils/validators";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const snapshot = await adminDb.collection("subscriptions").orderBy("createdAt", "desc").get();
  
  const payload = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      _id: doc.id,
      email: data.email,
      source: data.source ?? null,
      createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt).toISOString() : new Date().toISOString()
    };
  });

  return NextResponse.json(payload);
}

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => null);
    if (!json) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const parsed = newsletterSubscriptionSchema.parse(json);
    const email = parsed.email.trim().toLowerCase();
    const source = parsed.source?.trim() ?? undefined;

    const existing = await adminDb.collection("subscriptions").where("email", "==", email).get();
    if (!existing.empty) {
      return NextResponse.json({ message: "You're already subscribed." }, { status: 200 });
    }

    await adminDb.collection("subscriptions").add({
      email,
      source,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return NextResponse.json({ message: "Thanks for subscribing!" }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      const firstIssue = error.issues[0];
      return NextResponse.json({ error: firstIssue?.message ?? "Invalid email address." }, { status: 400 });
    }

    console.error(error);
    return NextResponse.json({ error: "Unable to save subscription." }, { status: 500 });
  }
}
