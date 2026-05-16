import { NextResponse } from "next/server";
import { createAdminSession } from "@/lib/auth";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (typeof idToken !== "string") {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 400 });
    }

    // Verify token to get user info
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    // Check or create user in Firestore
    const userRef = adminDb.collection("users").doc(uid);
    const userDoc = await userRef.get();

    let role = "user";

    if (!userDoc.exists) {
      // First time login - save user info
      await userRef.set({
        email: email || "",
        name: name || "",
        picture: picture || "",
        role: "user",
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });
    } else {
      // Update last login
      role = userDoc.data()?.role || "user";
      await userRef.update({
        lastLogin: new Date().toISOString()
      });
    }

    // Enforce admin role
    if (role !== "admin") {
      return NextResponse.json({ error: "Access denied. Admin role required. Your account has been registered, please contact the site owner to grant you admin privileges." }, { status: 403 });
    }

    await createAdminSession(idToken);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin login failed", error);
    return NextResponse.json({ error: "Unable to process login." }, { status: 500 });
  }
}
