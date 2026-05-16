import { NextResponse } from "next/server";
import { z } from "zod";

import { adminDb } from "@/lib/firebase-admin";

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  department: z.string().min(2),
  studentId: z.string().min(2),
  preference: z.string().optional(),
  motivation: z.string().optional(),
  agree: z.union([z.literal("on"), z.literal("true"), z.boolean()]).transform((v) => v === "on" || v === "true" || v === true)
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const payload = Object.fromEntries(formData.entries());
    const parsed = schema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input.", details: parsed.error.flatten() }, { status: 400 });
    }

    const docRef = await adminDb.collection("applications").add({
      ...parsed.data,
      createdAt: new Date().toISOString()
    });

    return NextResponse.redirect(new URL(`/apply/success?id=${docRef.id}`, request.url));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to submit application." }, { status: 500 });
  }
}
