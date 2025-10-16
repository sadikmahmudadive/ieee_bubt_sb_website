import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { SubscriptionModel } from "@/models/Subscription";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const deleted = await SubscriptionModel.findByIdAndDelete(params.id).lean();
  if (!deleted) {
    return NextResponse.json({ error: "Subscription not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
