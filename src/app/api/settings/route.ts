import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { requireAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const docRef = adminDb.collection("settings").doc("site_settings");
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return NextResponse.json({ currentYear: new Date().getFullYear().toString() });
    }
    
    return NextResponse.json(doc.data());
  } catch (error) {
    console.error("Failed to load settings:", error);
    return NextResponse.json({ error: "Unable to load settings." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();
    const { currentYear } = payload;
    
    if (currentYear === undefined) {
      return NextResponse.json({ error: "Missing currentYear" }, { status: 400 });
    }

    const docRef = adminDb.collection("settings").doc("site_settings");
    await docRef.set({
      currentYear,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return NextResponse.json({ success: true, currentYear });
  } catch (error) {
    console.error("Failed to update settings:", error);
    return NextResponse.json({ error: "Unable to update settings." }, { status: 500 });
  }
}
