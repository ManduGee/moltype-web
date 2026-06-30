"use client";

/**
 * StitchCursor — segment-stamp on Catmull-Rom spline
 *
 * Key decisions:
 *  1. MOLTYPE_LINE_PATTERN.png has a white background.  We pre-process it
 *     once on load (removeWhiteBg) so stamps can overlap without white
 *     rectangles covering previous stamps.
 *  2. Each stamp is a short crop of the pattern (SRC_CROP_W × SRC_CROP_H)
 *     drawn at its original colours (opacity ≈ 0.92, no blur, no tint).
 *  3. Stamps are placed along a Catmull-Rom spline sampled at uniform
 *     arc-length intervals — no gaps at high speed, no clumping at low speed.
 *  4. Each stamp is rotated to the spline tangent at that point.
 *     An exponential moving-average smooths rapid direction changes.
 *  5. All stamps are baked into an offscreen canvas once and composited
 *     with a single drawImage per frame (O(1) regardless of trail length).
 *  6. On 'moltype:skin-change': offscreen fades to zero over CLEAR_MS,
 *     then the session is wiped for the next drawing session.
 */

import { useEffect, useRef } from "react";

// ─── Pattern source ────────────────────────────────────────────────────────────
const PATTERN_SRC = "/MOLTYPE_LINE_PATTERN.png";
// Original dimensions: 1325 × 60.
// We use a crop from the left edge showing ~4 clear W-zigzag cycles.
const SRC_CROP_X = 0;
const SRC_CROP_W = 160;   // px — ≈4 cycles × 38px/cycle
const SRC_CROP_H = 60;    // px — full height (preserves zigzag proportions)

// Display scale at scale=1.0 (uniformly 0.5× the source crop)
const BASE_DISP_W = 80;   // px
const BASE_DISP_H = 30;   // px

// Arc-length between stamp centres at scale=1.0
// 55 ÷ 80 = 68.75% of stamp width → slight overlap, natural ribbon feel
const BASE_INTERVAL = 55; // px

// ─── Smoothing ─────────────────────────────────────────────────────────────────
const MIN_PT_DIST  = 4;    // px — ignore micro-jitter between mouse points
const CR_STEPS     = 18;   // sub-divisions per Catmull-Rom segment
const ANGLE_LERP   = 0.55; // exponential smoothing for tangent angle

// ─── Session / clear ───────────────────────────────────────────────────────────
const CLEAR_MS = 220;

// ─── Wheel-controlled size ─────────────────────────────────────────────────────
const DEFAULT_SCALE = 1.0;
const MIN_SCALE     = 0.4;
const MAX_SCALE     = 3.0;
const WHEEL_SENS    = 0.025;

// ─── Types ─────────────────────────────────────────────────────────────────────
type Pt = { x: number; y: number };

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Catmull-Rom position at t ∈ [0,1] for the P1→P2 segment. */
function crPos(t: number, p0: Pt, p1: Pt, p2: Pt, p3: Pt): Pt {
  const t2 = t * t, t3 = t2 * t;
  return {
    x: 0.5 * (2 * p1.x + (-p0.x + p2.x) * t
        + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2
        + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y: 0.5 * (2 * p1.y + (-p0.y + p2.y) * t
        + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2
        + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
  };
}

/** Angle interpolation that handles the ±π wrap. */
function lerpAngle(cur: number, tgt: number, t: number): number {
  let d = tgt - cur;
  while (d >  Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return cur + d * t;
}

/**
 * Pre-process: replace near-white pixels with transparent.
 * This lets stamps overlap without the white pattern background
 * painting over previously drawn stamps.
 */
function removeWhiteBg(img: HTMLImageElement): HTMLCanvasElement {
  const tc  = document.createElement("canvas");
  tc.width  = img.width;
  tc.height = img.height;
  const ctx = tc.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0);

  const id  = ctx.getImageData(0, 0, tc.width, tc.height);
  const { data } = id;
  for (let i = 0; i < data.length; i += 4) {
    // Threshold: very close to white (255,255,255).
    // Pink (#F77DA6) has G=125 → won't be caught.
    // Green (#99DAAD) has R=153 → won't be caught.
    if (data[i] > 248 && data[i + 1] > 248 && data[i + 2] > 248) {
      data[i + 3] = 0;
    }
  }
  ctx.putImageData(id, 0, 0);
  return tc;
}

// ─── Component ─────────────────────────────────────────────────────────────────
interface StitchCursorProps {
  disabled?: boolean;  // true = 오버레이 등 특정 화면에서 비활성화
}

export default function StitchCursor({ disabled = false }: StitchCursorProps) {
  const mainRef     = useRef<HTMLCanvasElement>(null);
  const offCanvas   = useRef<HTMLCanvasElement | null>(null);
  const offCtx      = useRef<CanvasRenderingContext2D | null>(null);
  // Processed (white-BG-removed) version of the pattern
  const procImg     = useRef<HTMLCanvasElement | null>(null);

  // Spline state
  const allPts      = useRef<Pt[]>([]);
  const procUpTo    = useRef(0);   // next segment index to process
  const stampDist   = useRef(0);   // accumulated arc-length since last stamp
  const smoothAng   = useRef(0);   // smoothed tangent angle

  const tipPos      = useRef<Pt | null>(null);
  const clearAt     = useRef<number | null>(null);
  const targetScale = useRef(DEFAULT_SCALE);
  const curScale    = useRef(DEFAULT_SCALE);
  const rafId       = useRef(0);

  // disabled를 ref로 관리 → 클로저 stale 문제 해결
  const disabledRef = useRef(disabled);
  useEffect(() => {
    disabledRef.current = disabled;
    document.body.style.cursor = disabled ? "default" : "none";
  }, [disabled]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;

    document.body.style.cursor = "none";

    // ── Offscreen canvas ───────────────────────────────────────────────────
    const initOff = (w: number, h: number) => {
      const oc  = document.createElement("canvas");
      oc.width  = w;
      oc.height = h;
      offCanvas.current = oc;
      offCtx.current    = oc.getContext("2d");
    };
    initOff(window.innerWidth, window.innerHeight);

    // ── Pattern pre-processing ─────────────────────────────────────────────
    const img = new Image();
    img.src   = PATTERN_SRC;
    img.onload = () => {
      procImg.current = removeWhiteBg(img);
    };

    // ── Bake one stamp ─────────────────────────────────────────────────────
    const bakeStamp = (x: number, y: number, angle: number, scale: number) => {
      const ctx = offCtx.current;
      const src = procImg.current;
      if (!ctx || !src) return;

      const dW = BASE_DISP_W * scale;
      const dH = BASE_DISP_H * scale;

      ctx.save();
      ctx.globalAlpha = 0.92;           // near-opaque: preserve original colours
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.drawImage(
        src,
        SRC_CROP_X, 0, SRC_CROP_W, SRC_CROP_H,   // source crop (transparent BG)
        -dW / 2,   -dH / 2, dW, dH               // dest: centred on stamp origin
      );
      ctx.restore();
    };

    // ── Walk Catmull-Rom spline, place stamps at uniform arc-length ────────
    const processNewSegs = () => {
      const pts = allPts.current;
      if (pts.length < 2) return;

      const scale    = curScale.current;
      const interval = BASE_INTERVAL * scale;

      while (procUpTo.current < pts.length - 1) {
        const i  = procUpTo.current;
        const p0 = pts[Math.max(0, i - 1)];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[Math.min(pts.length - 1, i + 2)];

        let prev = crPos(0, p0, p1, p2, p3);

        for (let s = 1; s <= CR_STEPS; s++) {
          const t   = s / CR_STEPS;
          const cur = crPos(t, p0, p1, p2, p3);
          const dx  = cur.x - prev.x;
          const dy  = cur.y - prev.y;
          const sd  = Math.sqrt(dx * dx + dy * dy); // sub-segment length

          stampDist.current += sd;

          // Place as many stamps as this sub-segment covers
          while (stampDist.current >= interval) {
            const overflow = stampDist.current - interval;
            // Fraction into the sub-segment where the interval was hit
            const frac = sd > 0.001 ? (sd - overflow) / sd : 0.5;
            const sx   = prev.x + dx * frac;
            const sy   = prev.y + dy * frac;

            const raw = Math.atan2(dy, dx);
            smoothAng.current = lerpAngle(smoothAng.current, raw, ANGLE_LERP);

            bakeStamp(sx, sy, smoothAng.current, scale);
            stampDist.current -= interval;
          }

          prev = cur;
        }

        procUpTo.current++;
      }
    };

    // ── Mouse move ─────────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      const x = e.clientX, y = e.clientY;
      tipPos.current = { x, y };

      if (disabledRef.current) return;          // 오버레이 열릴 때 그리기 중단
      if (y < 56) return;                       // 헤더 영역(56px)에서는 그리기 안 함
      if (clearAt.current !== null) return;

      const prev = allPts.current[allPts.current.length - 1];
      if (prev && Math.hypot(x - prev.x, y - prev.y) < MIN_PT_DIST) return;

      allPts.current.push({ x, y });
      processNewSegs();
    };

    // ── Skin-change event ─────────────────────────────────────────────────
    const onSkinChange = () => {
      clearAt.current = performance.now();
    };

    // ── Wheel ──────────────────────────────────────────────────────────────
    const onWheel = (e: WheelEvent) => {
      const c = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), 80);
      targetScale.current = Math.max(MIN_SCALE,
        Math.min(MAX_SCALE, targetScale.current - c * WHEEL_SENS));
    };

    // ── RAF draw loop ──────────────────────────────────────────────────────
    const tick = (now: number) => {
      const canvas = mainRef.current;
      if (!canvas) { rafId.current = requestAnimationFrame(tick); return; }
      const ctx = canvas.getContext("2d");
      if (!ctx)   { rafId.current = requestAnimationFrame(tick); return; }

      // Smooth scale
      curScale.current += (targetScale.current - curScale.current) * 0.1;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // disabled 상태면 캔버스 비우고 스킵
      if (disabledRef.current) {
        rafId.current = requestAnimationFrame(tick);
        return;
      }

      // Composite offscreen
      const oc = offCanvas.current;
      if (oc) {
        if (clearAt.current !== null) {
          const t     = Math.min(1, (now - clearAt.current) / CLEAR_MS);
          const alpha = 1 - t;
          if (alpha > 0) {
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.drawImage(oc, 0, 0);
            ctx.restore();
          }
          if (t >= 1) {
            offCtx.current?.clearRect(0, 0, oc.width, oc.height);
            allPts.current  = [];
            procUpTo.current = 0;
            stampDist.current = 0;
            clearAt.current  = null;
          }
        } else {
          ctx.drawImage(oc, 0, 0);
        }
      }

      // Cursor tip: disabled 상태에서는 숨김 (기본 커서가 표시됨)
      const tip = tipPos.current;
      if (tip && !disabledRef.current) {
        const r  = Math.max(3, 5 * curScale.current);
        const cf = clearAt.current !== null
          ? Math.max(0, 1 - (now - clearAt.current) / CLEAR_MS) : 1;

        ctx.save();
        ctx.beginPath();
        ctx.arc(tip.x, tip.y, r * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = "#F77DA6";
        ctx.globalAlpha = 0.12 * cf;
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.arc(tip.x, tip.y, r, 0, Math.PI * 2);
        ctx.fillStyle = "#F77DA6";
        ctx.globalAlpha = 0.92 * cf;
        ctx.fill();
        ctx.restore();
      }

      rafId.current = requestAnimationFrame(tick);
    };

    // ── Resize ─────────────────────────────────────────────────────────────
    const onResize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      if (mainRef.current) { mainRef.current.width = w; mainRef.current.height = h; }
      initOff(w, h);
      allPts.current    = [];
      procUpTo.current  = 0;
      stampDist.current = 0;
    };

    onResize();
    window.addEventListener("mousemove", onMove);
    window.addEventListener("moltype:skin-change" as keyof WindowEventMap, onSkinChange);
    window.addEventListener("wheel",  onWheel,  { passive: true });
    window.addEventListener("resize", onResize);
    rafId.current = requestAnimationFrame(tick);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("moltype:skin-change" as keyof WindowEventMap, onSkinChange);
      window.removeEventListener("wheel",  onWheel);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <canvas
      ref={mainRef}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999 }}
    />
  );
}
