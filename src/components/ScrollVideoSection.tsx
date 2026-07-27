"use client";

import { useEffect, useRef, useState } from "react";
import {
  useScroll,
  useTransform,
  motion,
  useSpring
} from "framer-motion";

const TOTAL_FRAMES = 100;

// Helper to generate frame URLs
function getFrameUrl(index: number) {
  const paddedIndex = String(index).padStart(3, "0");
  return `/animations/Digital_face_dissolving_scattering/frame_${paddedIndex}.jpg`;
}

// ─── Content panels shown at different scroll positions ───────────────────────
const panels = [
  {
    id: "intro",
    range: [0, 0.18] as [number, number],
    eyebrow: "IEEE BUBT Student Branch",
    titleLine1: "Where Innovation",
    titleLine2: "Meets Purpose",
    body: "We are a community of engineers, researchers, and creators tackling tomorrow's challenges through technology, collaboration, and social impact.",
    stats: null as null | { label: string; value: string }[]
  },
  {
    id: "ai",
    range: [0.28, 0.55] as [number, number],
    eyebrow: "Artificial Intelligence",
    titleLine1: "Shaping the Future",
    titleLine2: "with AI",
    body: "Our AI Research Cell explores machine learning, computer vision, NLP, and generative models — applying them to real-world problems across healthcare, agriculture, and smart cities.",
    stats: [
      { label: "Research Papers", value: "12+" },
      { label: "AI Projects", value: "20+" },
      { label: "Workshops", value: "8+" }
    ]
  },
  {
    id: "robotics",
    range: [0.62, 0.88] as [number, number],
    eyebrow: "Robotics and Automation",
    titleLine1: "Engineering Machines",
    titleLine2: "for a Better World",
    body: "From autonomous drones to prosthetic limbs, our Robotics Wing builds systems bridging digital intelligence with physical reality — competing nationally and delivering humanitarian solutions.",
    stats: [
      { label: "Robots Built", value: "6+" },
      { label: "National Awards", value: "3+" },
      { label: "Active Members", value: "40+" }
    ]
  }
];

// ─── Panel component ──────────────────────────────────────────────────────────
function ContentPanel({
  panel,
  scrollProgress
}: {
  panel: (typeof panels)[0];
  scrollProgress: ReturnType<typeof useSpring>;
}) {
  const [inStart, inEnd] = panel.range;
  const fullOn = inStart + 0.06;
  const fadeOut = inEnd - 0.06;

  const opacity = useTransform(
    scrollProgress,
    [inStart, fullOn, fadeOut, inEnd],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    scrollProgress,
    [inStart, fullOn, fadeOut, inEnd],
    [44, 0, 0, -44]
  );
  const scale = useTransform(
    scrollProgress,
    [inStart, fullOn, fadeOut, inEnd],
    [0.94, 1, 1, 0.94]
  );

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center sm:px-10"
      style={{ opacity, y, scale }}
    >
      <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.35em] text-white/75 backdrop-blur-sm sm:text-xs">
        {panel.eyebrow}
      </span>

      <h2 className="heading-font text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem]">
        {panel.titleLine1}{" "}
        <span className="block text-cyan-soft">{panel.titleLine2}</span>
      </h2>

      <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
        {panel.body}
      </p>

      {panel.stats && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-5">
          {panel.stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center rounded-2xl border border-white/15 bg-white/8 px-4 py-3 backdrop-blur-sm sm:px-6"
            >
              <span className="heading-font text-2xl font-bold text-cyan-soft sm:text-3xl">
                {stat.value}
              </span>
              <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-white/50 sm:text-[10px]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Main Canvas Scroll Animation ─────────────────────────────────────────────
export function ScrollVideoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Ultra-smooth spring interpolation for frame index calculation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.0001
  });

  // Preload all 100 image frames
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          setImagesLoaded(true);
        }
      };
      loadedImages.push(img);
    }

    imagesRef.current = loadedImages;
  }, []);

  // Canvas drawing loop linked to smooth scroll progress
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const progress = Math.max(0, Math.min(1, smoothProgress.get()));
      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(progress * TOTAL_FRAMES)
      );

      const img = imagesRef.current[frameIndex];

      if (img && img.complete && img.naturalWidth > 0) {
        // Draw image with object-fit: cover math
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;

        const imgRatio = imgWidth / imgHeight;
        const canvasRatio = canvasWidth / canvasHeight;

        let drawWidth = canvasWidth;
        let drawHeight = canvasHeight;
        let offsetX = 0;
        let offsetY = 0;

        if (canvasRatio > imgRatio) {
          drawHeight = canvasWidth / imgRatio;
          offsetY = (canvasHeight - drawHeight) / 2;
        } else {
          drawWidth = canvasHeight * imgRatio;
          offsetX = (canvasWidth - drawWidth) / 2;
        }

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Handle canvas resize
    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth * window.devicePixelRatio;
        canvas.height = window.innerHeight * window.devicePixelRatio;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [smoothProgress, imagesLoaded]);

  const overlayOpacity = useTransform(
    smoothProgress,
    [0, 0.1, 0.5, 0.9, 1],
    [0.65, 0.38, 0.16, 0.38, 0.65]
  );
  const hintOpacity = useTransform(smoothProgress, [0, 0.07], [1, 0]);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: "380vh" }}
      aria-label="AI and Robotics innovation showcase"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-primary-navy">
        {/* 60 FPS GPU-accelerated Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Dark overlay */}
        <motion.div
          className="absolute inset-0 bg-primary-navy"
          style={{ opacity: overlayOpacity }}
          aria-hidden
        />

        {/* Radial glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(0,174,239,0.12) 0%, transparent 70%)"
          }}
          aria-hidden
        />

        {/* Content panels */}
        {panels.map((panel) => (
          <ContentPanel
            key={panel.id}
            panel={panel}
            scrollProgress={smoothProgress}
          />
        ))}

        {/* Section label — top left */}
        <div className="absolute left-5 top-6 sm:left-8 sm:top-8">
          <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-white/30 sm:text-[10px]">
            AI &amp; Robotics
          </span>
        </div>

        {/* Progress bar */}
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/10">
          <motion.div
            className="h-full origin-left bg-gradient-to-r from-primary to-cyan-soft"
            style={{ scaleX: smoothProgress }}
          />
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
          style={{ opacity: hintOpacity }}
        >
          <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/40 sm:text-[10px]">
            Scroll to explore
          </span>
          <motion.div
            className="h-7 w-px bg-gradient-to-b from-white/40 to-transparent"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
}
