import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { teamMemberSchema } from "@/utils/validators";
import { requireAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const snapshot = await adminDb.collection("teamMembers").orderBy("priority", "desc").get();
    const members = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    return NextResponse.json(members);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to fetch team members." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();
    const data = teamMemberSchema.parse(payload);

    const docRef = await adminDb.collection("teamMembers").add({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return NextResponse.json({ _id: docRef.id, ...data }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to create team member." }, { status: 400 });
  }
}
