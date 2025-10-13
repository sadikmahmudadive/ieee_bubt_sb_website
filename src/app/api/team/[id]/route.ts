import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { TeamMemberModel } from "@/models/TeamMember";
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

    await connectToDatabase();
    const payload = await request.json();
    const data = teamMemberSchema.partial().parse(payload);

    const updated = await TeamMemberModel.findByIdAndUpdate(params.id, data, {
      new: true
    }).lean();

    if (!updated) {
      return NextResponse.json({ error: "Team member not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to update team member." }, { status: 400 });
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
  const deleted = await TeamMemberModel.findByIdAndDelete(params.id).lean();
  if (!deleted) {
    return NextResponse.json({ error: "Team member not found." }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
