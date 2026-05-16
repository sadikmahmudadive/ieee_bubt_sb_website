import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { teamMemberSchema } from "@/utils/validators";
import { requireAdminSession } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();
    const data = teamMemberSchema.partial().parse(payload);

    const docRef = adminDb.collection("teamMembers").doc(params.id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return NextResponse.json({ error: "Team member not found." }, { status: 404 });
    }

    await docRef.update({ ...data, updatedAt: new Date().toISOString() });
    return NextResponse.json({ _id: params.id, ...doc.data(), ...data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to update team member." }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const docRef = adminDb.collection("teamMembers").doc(params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Team member not found." }, { status: 404 });
    }

    await docRef.delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to delete team member." }, { status: 500 });
  }
}
