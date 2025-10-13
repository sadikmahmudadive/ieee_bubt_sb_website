import { NextResponse } from "next/server";
import { createAdminSession, validateAdminCredentials } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (typeof username !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 400 });
    }

    if (!validateAdminCredentials(username, password)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await createAdminSession(username);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin login failed", error);
    return NextResponse.json({ error: "Unable to process login." }, { status: 500 });
  }
}
