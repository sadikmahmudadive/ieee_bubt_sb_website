import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { getUploadSignature } from "@/lib/cloudinary";

const folderMap: Record<string, string> = {
  events: "ieee-bubt/events",
  team: "ieee-bubt/team",
  gallery: "ieee-bubt/gallery"
};

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { folder } = await request.json();
    if (typeof folder !== "string" || !folderMap[folder]) {
      return NextResponse.json({ error: "Invalid folder request." }, { status: 400 });
    }

    const targetFolder = folderMap[folder];
    const signature = getUploadSignature(targetFolder);

    if (!signature.signature || !signature.apiKey || !signature.cloudName) {
      return NextResponse.json({ error: "Cloudinary is not configured correctly." }, { status: 500 });
    }

    return NextResponse.json({
      ...signature,
      folder: targetFolder
    });
  } catch (error) {
    console.error("Failed to generate upload signature", error);
    return NextResponse.json({ error: "Unable to generate upload signature." }, { status: 500 });
  }
}
