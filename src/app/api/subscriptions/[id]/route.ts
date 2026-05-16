import { NextResponse } from "next/server";

import { adminDb } from "@/lib/firebase-admin";
import { requireAdminSession } from "@/lib/auth";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const docRef = adminDb.collection("subscriptions").doc(params.id);
  const doc = await docRef.get();
  
  if (!doc.exists) {
    return NextResponse.json({ error: "Subscription not found." }, { status: 404 });
  }

  await docRef.delete();
  return NextResponse.json({ success: true });
}
