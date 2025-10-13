import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { TeamMemberModel } from "@/models/TeamMember";
import { teamMemberSchema } from "@/utils/validators";
import { requireAdminSession } from "@/lib/auth";

export async function GET() {
  await connectToDatabase();
  const members = await TeamMemberModel.find().sort({ priority: -1 }).lean();
  return NextResponse.json(members);
}

export async function POST(request: Request) {
  try {
    const session = await requireAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const payload = await request.json();
    const data = teamMemberSchema.parse(payload);

    const member = await TeamMemberModel.create(data);
    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to create team member." }, { status: 400 });
  }
}
