import "server-only";

import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";

const SESSION_COOKIE = "ieee_admin_session";

export async function createAdminSession(idToken: string) {
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  try {
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    cookies().set({
      name: SESSION_COOKIE,
      value: sessionCookie,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: expiresIn / 1000
    });
  } catch (error) {
    console.error("Failed to create session cookie", error);
    throw new Error("UNAUTHORIZED REQUEST!");
  }
}

export async function clearAdminSession() {
  cookies().delete(SESSION_COOKIE);
}

export async function getAdminSessionFromCookies() {
  const sessionCookie = cookies().get(SESSION_COOKIE)?.value;
  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decodedClaims;
  } catch (error) {
    console.error("Failed to verify admin session", error);
    // Note: We cannot delete cookies here because this function is often called from Server Components,
    // which only have read access to cookies. Returning null effectively logs them out.
    return null;
  }
}

export async function requireAdminSession() {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    return null;
  }
  return session;
}
