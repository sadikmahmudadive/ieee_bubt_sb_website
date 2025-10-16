import { Types } from "mongoose";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { connectToDatabase } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { SubscriptionModel } from "@/models/Subscription";
import { newsletterSubscriptionSchema } from "@/utils/validators";

type LeanDateLike = Date | string | number | null | undefined;

type SubscriptionLean = {
  _id: Types.ObjectId;
  email: string;
  source?: string;
  createdAt: LeanDateLike;
  updatedAt: LeanDateLike;
};

const normalizeDate = (value: LeanDateLike): string => {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  return new Date().toISOString();
};

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const subscriptions = await SubscriptionModel.find().sort({ createdAt: -1 }).lean<SubscriptionLean[]>();

  const payload = subscriptions.map((subscription) => ({
    _id: subscription._id.toString(),
    email: subscription.email,
    source: subscription.source ?? null,
    createdAt: normalizeDate(subscription.createdAt),
    updatedAt: normalizeDate(subscription.updatedAt)
  }));

  return NextResponse.json(payload);
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const json = await request.json().catch(() => null);
    if (!json) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const parsed = newsletterSubscriptionSchema.parse(json);
    const email = parsed.email.trim().toLowerCase();
    const source = parsed.source?.trim() ?? undefined;

    const existing = await SubscriptionModel.findOne({ email }).lean();
    if (existing) {
      return NextResponse.json({ message: "You're already subscribed." }, { status: 200 });
    }

    await SubscriptionModel.create({ email, source });
    return NextResponse.json({ message: "Thanks for subscribing!" }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      const firstIssue = error.issues[0];
      return NextResponse.json({ error: firstIssue?.message ?? "Invalid email address." }, { status: 400 });
    }

    if (error && typeof error === "object" && "code" in error && (error as { code?: number }).code === 11000) {
      return NextResponse.json({ message: "You're already subscribed." }, { status: 200 });
    }

    console.error(error);
    return NextResponse.json({ error: "Unable to save subscription." }, { status: 500 });
  }
}
