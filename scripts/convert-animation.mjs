import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const ffmpegPath = require("ffmpeg-static");
const inputPattern = path.resolve(__dirname, "../public/animations/Digital_face_dissolving_scattering/frame_%03d.jpg");
const outDir = path.resolve(__dirname, "../public/animations");

console.log("🎬 Converting frame_000.jpg..frame_099.jpg sequence to I-frame WebM & MP4...");

// WebM fast VP9
try {
  execFileSync(ffmpegPath, [
    "-y",
    "-framerate", "25",
    "-i", inputPattern,
    "-c:v", "libvpx-vp9",
    "-deadline", "realtime",
    "-cpu-used", "8",
    "-g", "1",
    "-crf", "26",
    "-b:v", "0",
    "-vf", "scale=1920:-2",
    path.join(outDir, "digital_face.webm")
  ], { stdio: "inherit" });
  console.log("✅ WebM done");
} catch (e) {
  console.error("❌ WebM failed:", e.message);
}

// MP4 fast H264
try {
  execFileSync(ffmpegPath, [
    "-y",
    "-framerate", "25",
    "-i", inputPattern,
    "-c:v", "libx264",
    "-preset", "ultrafast",
    "-g", "1",
    "-crf", "20",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    "-vf", "scale=1920:-2",
    path.join(outDir, "digital_face.mp4")
  ], { stdio: "inherit" });
  console.log("✅ MP4 done");
} catch (e) {
  console.error("❌ MP4 failed:", e.message);
}

console.log("🎉 Frame sequence conversion finished!");
