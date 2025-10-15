import { NextResponse } from "next/server";

import { getChapterSummaries } from "@/lib/actions";

export async function GET() {
  try {
    const chapters = await getChapterSummaries();
    return NextResponse.json(chapters, { status: 200 });
  } catch (error) {
    console.error("Failed to load chapter summaries", error);
    return NextResponse.json({ error: "Unable to load chapter data." }, { status: 500 });
  }
}
