import "server-only";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

type AdminSession = {
  username: string;
  issuedAt: number;
  expiresAt: number;
};

const SESSION_COOKIE = "ieee_admin_session";

function getRequiredEnv(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} is required for admin authentication.`);
  }
  return value;
}

function getSecretKey() {
  return new TextEncoder().encode(getRequiredEnv("ADMIN_JWT_SECRET"));
}

export function validateAdminCredentials(username: string, password: string) {
  const expectedUser = getRequiredEnv("ADMIN_USERNAME");
  const expectedPassword = getRequiredEnv("ADMIN_PASSWORD");
  return username === expectedUser && password === expectedPassword;
}

export async function createAdminSession(username: string) {
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + 60 * 60 * 24 * 7; // 7 days

  const token = await new SignJWT({ username, issuedAt: now, expiresAt })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(now)
    .setExpirationTime(expiresAt)
    .sign(getSecretKey());

  cookies().set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expiresAt * 1000)
  });
}

export async function clearAdminSession() {
  cookies().delete(SESSION_COOKIE);
}

export async function getAdminSessionFromCookies(): Promise<AdminSession | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    const session = payload as AdminSession;
    if (!session.expiresAt || session.expiresAt * 1000 < Date.now()) {
      cookies().delete(SESSION_COOKIE);
      return null;
    }
    return session;
  } catch (error) {
    console.error("Failed to verify admin session", error);
    cookies().delete(SESSION_COOKIE);
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
