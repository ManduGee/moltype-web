"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  motion,
  useSpring,
  useMotionValue,
  useTransform,
  animate,
  MotionValue,
} from "framer-motion";
import Image from "next/image";

// ─── Palette ─────────────────────────────────────────────────────────────────
const PINK  = "#F77DA6";
const GREEN = "#99DAAD";

// ─── Skin definitions — Fur → Knit → Jelly → Vinyl → Flat ───────────────────
// Logo 01, 02 제외 — 03(Knit), 04(Fur), 05(Flat) 만 사용
// 순서: Fur → Knit → Flat (반복)
const SKINS = [
  { src: "/Logo_04.png", label: "FUR"  },
  { src: "/Logo_03.png", label: "KNIT" },
  { src: "/Logo_05.png", label: "FLAT" },
] as const;

const N = SKINS.length; // 3

// ─── Idle-detection parameters ────────────────────────────────────────────────
const IDLE_DELAY_MS   = 1100;
const COOLDOWN_MS     = 1600;
const MIN_DRAW_DIST   = 80;
const MIN_DRAW_POINTS = 6;

// ─── Background stitch marks ──────────────────────────────────────────────────
function StitchMark({ shape, color }: { shape: string; color: string }) {
  const sw = 1.8;
  if (shape === "line")
    return <line x1="-9" y1="0" x2="9" y2="0" stroke={color} strokeWidth={sw} strokeLinecap="round" />;
  if (shape === "dash")
    return <line x1="0" y1="-8" x2="0" y2="8" stroke={color} strokeWidth={sw} strokeLinecap="round" />;
  if (shape === "x")
    return (
      <g>
        <line x1="-5" y1="-5" x2="5" y2="5" stroke={color} strokeWidth={sw} strokeLinecap="round" />
        <line x1="5"  y1="-5" x2="-5" y2="5" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      </g>
    );
  return <circle cx="0" cy="0" r="6" fill="none" stroke={color} strokeWidth={1.5} />;
}

const BG_MARKS = [
  { x: "3.5%", y: "27%", shape: "line",   color: PINK,  rot: 0   },
  { x: "5%",   y: "44%", shape: "x",      color: GREEN, rot: 14  },
  { x: "3%",   y: "62%", shape: "circle", color: PINK,  rot: 0   },
  { x: "93%",  y: "21%", shape: "x",      color: GREEN, rot: -22 },
  { x: "95%",  y: "40%", shape: "dash",   color: PINK,  rot: 8   },
  { x: "92%",  y: "57%", shape: "line",   color: GREEN, rot: 33  },
  { x: "19%",  y: "88%", shape: "line",   color: GREEN, rot: -15 },
  { x: "79%",  y: "11%", shape: "x",      color: PINK,  rot: 22  },
];

// ─── Main component ───────────────────────────────────────────────────────────
export default function HeroMoltingLogo() {
  const [skinIndex, setSkinIndex] = useState(0);
  const [mounted,   setMounted]   = useState(false);

  // Refs for async animation & setTimeout (avoid stale closures)
  const skinIndexRef       = useRef(0);
  const isTransitioningRef = useRef(false);
  const lastTransitionTime = useRef(0);
  const accDist            = useRef(0);
  const drawPoints         = useRef(0);
  const lastPos            = useRef({ x: -999, y: -999 });
  const idleTimer          = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mouse parallax
  const mouseX  = useMotionValue(0);
  const mouseY  = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 30, mass: 0.8 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30, mass: 0.8 });

  // Logo animation — scale barely moves, blur hides the src swap
  const logoScale:   MotionValue<number> = useMotionValue(1);
  const logoBlurAmt: MotionValue<number> = useMotionValue(0);
  const logoFilter:  MotionValue<string> = useTransform(
    logoBlurAmt, (v) => `blur(${v}px)`
  );

  // ── Skin change: breath in → swap src → breath out ───────────────────────
  const triggerSkinChange = useCallback(async () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    const nextIdx = (skinIndexRef.current + 1) % N;

    // Signal StitchCursor to clear its drawing session stamps
    window.dispatchEvent(new CustomEvent("moltype:skin-change"));

    // Phase 1: extremely subtle inflate + blur builds
    await animate(logoScale,   1.025, { duration: 0.28, ease: [0.22, 0, 0.4, 1] });
    await animate(logoBlurAmt, 1.4,   { duration: 0.13 });

    // ── Swap at blur peak — hidden under blur, no crossfade ghost ──────────
    skinIndexRef.current = nextIdx;
    setSkinIndex(nextIdx);

    // Phase 2: blur clears first, then scale settles back
    await animate(logoBlurAmt, 0, { duration: 0.14 });
    await animate(logoScale,   1, { duration: 0.48, ease: [0.16, 1, 0.3, 1] });

    lastTransitionTime.current = Date.now();
    isTransitioningRef.current = false;
  }, [logoScale, logoBlurAmt]);

  // ── Mousemove: parallax + drawing accumulation + idle trigger ────────────
  useEffect(() => {
    setMounted(true);

    // Preload all skin images so instant swap is gapless
    if (typeof window !== "undefined") {
      SKINS.forEach((skin) => {
        const img = new window.Image();
        img.src = skin.src;
      });
    }

    const onMove = (e: MouseEvent) => {
      // Parallax
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      mouseX.set(((e.clientX - cx) / cx) * 8);
      mouseY.set(((e.clientY - cy) / cy) * 5);

      // Accumulate drawing distance
      const dx   = e.clientX - lastPos.current.x;
      const dy   = e.clientY - lastPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      lastPos.current = { x: e.clientX, y: e.clientY };

      if (dist > 1.5) {
        accDist.current    += dist;
        drawPoints.current += 1;
      }

      // Reset idle timer on every move
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        const cooldownOk = Date.now() - lastTransitionTime.current > COOLDOWN_MS;
        const drewEnough = accDist.current >= MIN_DRAW_DIST &&
                           drawPoints.current >= MIN_DRAW_POINTS;

        if (drewEnough && cooldownOk && !isTransitioningRef.current) {
          triggerSkinChange();
        }

        accDist.current    = 0;
        drawPoints.current = 0;
      }, IDLE_DELAY_MS);
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [mouseX, mouseY, triggerSkinChange]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Entrance + mouse parallax wrapper ───────────────────────────── */}
      <motion.div
        style={{ x: springX, y: springY }}
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={mounted ? { opacity: 1, filter: "blur(0px)" } : {}}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/*
         * Breath target: scale barely moves (1 → 1.025 → 1),
         * blur masks the src swap — wrapper opacity stays 1 throughout.
         * No click handler. No AnimatePresence crossfade.
         */}
        <motion.div
          style={{
            scale:  logoScale,
            filter: logoFilter,
            position: "relative",
            width: "min(95vw, 1350px)",
            cursor: "none",
            transformOrigin: "center center",
          }}
        >
          {/* Aspect-ratio spacer */}
          <div style={{ width: "100%", aspectRatio: "2048 / 768" }} />

          {/*
           * All 5 skins always in the DOM (preloaded by browser).
           * Only the active skin is visible (opacity 1); others are opacity 0.
           * No CSS transition on opacity — the switch is instant under blur.
           * This avoids any crossfade ghost: one frame has the old skin, next
           * has the new skin, the transition blur hides the cut completely.
           */}
          {SKINS.map((skin, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                inset: 0,
                opacity: i === skinIndex ? 1 : 0,
                // No transition: swap happens under blur peak
              }}
            >
              <Image
                src={skin.src}
                alt={skin.label}
                fill
                priority={i === 0}
                style={{ objectFit: "contain" }}
                sizes="(max-width: 768px) 90vw, 72vw"
              />
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
