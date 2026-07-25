import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth";
import { adminDb } from "@/lib/firebase-admin";

const applicationSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  studentId: z.string().trim().min(2).max(50),
  department: z.string().trim().min(2).max(100),
  shift: z.enum(["Day", "Evening"]),
  intake: z.string().trim().min(1).max(30),
  section: z.string().trim().min(1).max(30),
  yearSemester: z.string().trim().min(2).max(60),
  phone: z.string().trim().min(6).max(30),
  email: z.string().trim().email(),
  emergencyContact: z.string().trim().min(6).max(30),
  expertiseField: z.string().trim().min(2).max(300),
  areaOfInterest: z.string().trim().min(2).max(300),
  interestedChapter: z.string().trim().min(2).max(150),
  agree: z.union([z.literal("on"), z.literal("true"), z.boolean()]).transform((value) =>
    value === "on" || value === "true" || value === true
  )
});

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const snapshot = await adminDb.collection("applications").orderBy("createdAt", "desc").get();
    return NextResponse.json(snapshot.docs.map((doc) => ({ _id: doc.id, ...doc.data() })));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load applications." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const parsed = applicationSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!parsed.success || !parsed.data.agree) {
      return NextResponse.json({ error: "Invalid input.", details: parsed.success ? undefined : parsed.error.flatten() }, { status: 400 });
    }

    const now = new Date();
    const year = now.getFullYear();
    const counterRef = adminDb.collection("applicationCounters").doc(String(year));
    const applicationRef = adminDb.collection("applications").doc();

    const token = await adminDb.runTransaction(async (transaction) => {
      const counterSnapshot = await transaction.get(counterRef);
      const currentSerial = Number(counterSnapshot.data()?.lastSerial ?? 0);
      const nextSerial = currentSerial + 1;
      const nextToken = `${year}${String(nextSerial).padStart(3, "0")}`;

      transaction.set(counterRef, { year, lastSerial: nextSerial, updatedAt: now.toISOString() }, { merge: true });
      transaction.set(applicationRef, {
        ...parsed.data,
        token: nextToken,
        serial: nextSerial,
        applicationYear: year,
        createdAt: now.toISOString()
      });

      return nextToken;
    });

    return NextResponse.redirect(new URL(`/apply/success?token=${encodeURIComponent(token)}`, request.url), 303);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to submit application." }, { status: 500 });
  }
}
