"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";

// ─── Constants ────────────────────────────────────────────────────────────────
const HEADER_H   = 80;
const CELL       = 12;
const BRUSH_MIN  = 20;
const BRUSH_MAX  = 120;
const BRUSH_STEP = 8;
const BRUSH_DEF  = 55;
const SWITCH_DELAY = 3000;
const FILL_DONE  = 0.99;

// logo-outline.png 원본 비율 — fallback값 (실제 이미지 로드 후 덮어씀)
const OUTLINE_FALLBACK_RATIO = 941 / 1672;

// 드로잉 패턴
const LINE_SRCS = [
  "/graphic_line-01.jpg",
  "/graphic_line-02.jpg",
  "/graphic_line-03.jpg",
  "/graphic_line-04.jpg",
  "/graphic_line-05.jpg",
  "/graphic_line-06.jpg",
] as const;

// ─── Component ────────────────────────────────────────────────────────────────
export default function InteractiveLogoIntro() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ── 오프스크린 캔버스 ─────────────────────────────────────────────────────
  // accumCanvas   : 누적 드로잉. NEVER clearRect.
  // fillMaskCanvas: Logo_White_Area.png 를 LOGO_W×LOGO_H 로 그린 것. 픽셀 캐시.
  // tempCanvas    : source-in 합성용. 반드시 LOGO_W×LOGO_H.
  // tiledPats     : 6개 패턴 pre-tile
  const accumRef    = useRef<HTMLCanvasElement | null>(null);
  const fillMaskRef = useRef<HTMLCanvasElement | null>(null);
  const tempRef     = useRef<HTMLCanvasElement | null>(null);
  const tiledPats   = useRef<HTMLCanvasElement[]>([]);

  // ── 로고 레이아웃 ─────────────────────────────────────────────────────────
  // logo-outline.png 비율 기준으로 1회 계산 → 모든 이미지에 동일 적용
  const logoRect  = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const dprRef    = useRef(1);

  // ── fill mask 픽셀 캐시 (getImageData 1회) ────────────────────────────────
  const maskPixels = useRef<Uint8ClampedArray | null>(null);
  const maskReady  = useRef(false);
  const patsLoaded = useRef(0);

  // ── 드로잉 상태 ───────────────────────────────────────────────────────────
  const isDrawing    = useRef(false);
  const pendingX     = useRef<number | null>(null);
  const pendingY     = useRef<number | null>(null);
  const prevPt       = useRef({ x: 0, y: 0 });
  const brushR       = useRef(BRUSH_DEF);
  const layerIdx     = useRef(0);
  const patternTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── 채움 격자 ─────────────────────────────────────────────────────────────
  const filledCells = useRef(new Set<string>());
  const totalCells  = useRef(1);

  // ── 기타 ──────────────────────────────────────────────────────────────────
  const rafRef           = useRef(0);
  const completedRef     = useRef(false);
  const hasStartedRef    = useRef(false);
  // v11: outline 실제 비율을 로드 후 저장 (941/1672 하드코딩 제거)
  const outlineNaturalRef = useRef<{ w: number; h: number } | null>(null);

  // ── React state (UI) ─────────────────────────────────────────────────────
  const [mounted,         setMounted]         = useState(false);
  const [fillRatio,       setFillRatio]       = useState(0);
  const [hasStarted,      setHasStarted]      = useState(false);
  const [isComplete,      setIsComplete]      = useState(false);
  const [showSlogan,      setShowSlogan]      = useState(false);
  const [progressOpacity, setProgressOpacity] = useState(1);
  // v10: 털 로고 전환 제거 — outline/canvas opacity 고정, fur 없음
  const [cursorPos,       setCursorPos]       = useState({ x: -300, y: -300 });
  const [cursorInside,    setCursorInside]    = useState(false);
  const [brushVis,        setBrushVis]        = useState(BRUSH_DEF);
  // v9: 힌트 텍스트 위치 = 로고 하단 + 32px (top 기준)
  const [hintTop, setHintTop] = useState<number | null>(null);

  // ── 레이아웃 계산 — outline 실제 비율 사용, fallback은 941/1672 ────────────
  const computeLogoRect = useCallback((vw: number, vh: number) => {
    const nat   = outlineNaturalRef.current;
    const ratio = nat ? nat.h / nat.w : OUTLINE_FALLBACK_RATIO;
    const w = Math.round(vw * 0.72);
    const h = Math.round(w * ratio);
    const x = Math.round((vw - w) / 2);
    const availH = vh - HEADER_H - 80;
    const y = HEADER_H + Math.max(0, Math.round((availH - h) / 2));
    return { x, y, w, h };
  }, []);

  // ── fill mask 구축 (Logo_White_Area.png → LOGO_W×LOGO_H, 픽셀 캐싱) ──────
  // v9 방식 유지: Logo_White_Area.png를 outline과 동일한 LOGO_W×LOGO_H 공간에 렌더
  const buildFillMask = useCallback((
    fillMaskImg: HTMLImageElement,
    lw: number, lh: number,
  ) => {
    const fc = fillMaskRef.current;
    if (!fc) return;
    fc.width = lw; fc.height = lh;
    const ctx = fc.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, lw, lh);
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(fillMaskImg, 0, 0, lw, lh);

    // R < 128인 픽셀(검정 배경)을 투명으로 변환 → source-in 클리핑 정상 작동
    const id = ctx.getImageData(0, 0, lw, lh);
    for (let i = 0; i < id.data.length; i += 4) {
      if (id.data[i] < 128) id.data[i + 3] = 0;
    }
    ctx.putImageData(id, 0, 0);

    // ★ 픽셀 배열 1회 캐싱 — isInsideLogo에서 배열 조회만 (getImageData 반복 없음)
    maskPixels.current = id.data;

    // 총 격자 셀 수 계산
    let total = 0;
    for (let gy = 0; gy < lh; gy += CELL)
      for (let gx = 0; gx < lw; gx += CELL) {
        const px = Math.min(Math.round(gx + CELL / 2), lw - 1);
        const py = Math.min(Math.round(gy + CELL / 2), lh - 1);
        const idx2 = (py * lw + px) * 4;
        if (id.data[idx2 + 3] > 10 && id.data[idx2] > 128) total++;
      }
    totalCells.current = Math.max(total, 1);
    maskReady.current = true;
  }, []);

  // ── 패턴 pre-tile ──────────────────────────────────────────────────────────
  const buildTiledPatterns = useCallback((lw: number, lh: number) => {
    tiledPats.current = [];
    patsLoaded.current = 0;
    LINE_SRCS.forEach((src, i) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const tc = document.createElement("canvas");
        tc.width = lw; tc.height = lh;
        const ctx = tc.getContext("2d")!;
        ctx.imageSmoothingEnabled = false;
        const pw = img.naturalWidth, ph = img.naturalHeight;
        for (let row = 0; row < lh; row += ph)
          for (let col = 0; col < lw; col += pw)
            ctx.drawImage(img, col, row, pw, ph);
        tiledPats.current[i] = tc;
        patsLoaded.current++;
      };
      img.src = src;
    });
  }, []);

  // ── isInsideLogo — 캐싱 배열 O(1) 조회 ───────────────────────────────────
  const isInsideLogo = useCallback((sx: number, sy: number): boolean => {
    if (!maskPixels.current || !maskReady.current) return false;
    const { x, y, w, h } = logoRect.current;
    const lx = Math.round(sx - x), ly = Math.round(sy - y);
    if (lx < 0 || ly < 0 || lx >= w || ly >= h) return false;
    const idx = (ly * w + lx) * 4;
    const r = maskPixels.current[idx];
    const a = maskPixels.current[idx + 3];
    return a > 10 && r > 128;
  }, []);

  // ── revealBrush — isInsideLogo 1차 검증, NEVER clears ────────────────────
  const revealBrush = useCallback((sx: number, sy: number) => {
    if (!isInsideLogo(sx, sy)) return;
    const ac = accumRef.current;
    if (!ac || patsLoaded.current < 1) return;
    const tiled = tiledPats.current[layerIdx.current];
    if (!tiled) return;

    const { x, y, w, h } = logoRect.current;
    const lx = sx - x, ly = sy - y;
    const r  = brushR.current;

    const ctx = ac.getContext("2d")!;
    ctx.save();
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = "source-over";
    ctx.imageSmoothingEnabled = false;
    ctx.beginPath();
    ctx.arc(lx, ly, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.globalAlpha = 1.0;
    ctx.drawImage(tiled, 0, 0, w, h);
    ctx.restore();
  }, [isInsideLogo]);

  // ── 채움 격자 마킹 ────────────────────────────────────────────────────────
  const markFilled = useCallback((sx: number, sy: number) => {
    if (!maskReady.current || !maskPixels.current) return;
    const { x, y, w, h } = logoRect.current;
    const lx = sx - x, ly = sy - y;
    const r  = brushR.current;
    const gr = Math.ceil(r / CELL);
    const gcx = Math.floor(lx / CELL);
    const gcy = Math.floor(ly / CELL);
    for (let dy = -gr; dy <= gr; dy++) {
      for (let dx = -gr; dx <= gr; dx++) {
        if (dx * dx + dy * dy > gr * gr) continue;
        const gx = gcx + dx, gy = gcy + dy;
        const cx = gx * CELL + CELL / 2, cy = gy * CELL + CELL / 2;
        if (cx < 0 || cy < 0 || cx >= w || cy >= h) continue;
        const a = maskPixels.current[(Math.round(cy) * w + Math.round(cx)) * 4 + 3];
        if (a > 10) filledCells.current.add(`${gx},${gy}`);
      }
    }
  }, []);

  // ── compositeToMain ────────────────────────────────────────────────────────
  const compositeToMain = useCallback((mainCtx: CanvasRenderingContext2D) => {
    const ac = accumRef.current;
    const fc = fillMaskRef.current;
    const tc = tempRef.current;
    if (!ac || !fc || !tc || !maskReady.current) return;

    const { x, y, w, h } = logoRect.current;

    // 안전 체크
    if (tc.width !== w || tc.height !== h) { tc.width = w; tc.height = h; }

    const tctx = tc.getContext("2d")!;
    tctx.clearRect(0, 0, w, h);

    tctx.globalCompositeOperation = "source-over";
    tctx.globalAlpha = 1.0;
    tctx.drawImage(fc, 0, 0, w, h);       // Step1: fill mask

    tctx.globalCompositeOperation = "source-in";
    tctx.globalAlpha = 1.0;
    tctx.drawImage(ac, 0, 0, w, h);       // Step2: 클리핑

    tctx.globalCompositeOperation = "source-over";
    mainCtx.globalCompositeOperation = "source-over";
    mainCtx.globalAlpha = 1.0;
    mainCtx.drawImage(tc, x, y, w, h);   // Step3: 로고 위치에만 합성
  }, []);

  // ── 패턴 전환 ─────────────────────────────────────────────────────────────
  const nextPattern = useCallback(() => {
    layerIdx.current = (layerIdx.current + 1) % LINE_SRCS.length;
  }, []);

  const scheduleSwitch = useCallback(() => {
    if (patternTimer.current) clearTimeout(patternTimer.current);
    patternTimer.current = setTimeout(nextPattern, SWITCH_DELAY);
  }, [nextPattern]);

  // ── Init ─────────────────────────────────────────────────────────────────
  // v9: outline + fill mask 동시 로드 → 둘 다 완료된 후 init
  useEffect(() => {
    setMounted(true);
    const canvas = canvasRef.current!;

    // v9: devicePixelRatio 처리
    const DPR = window.devicePixelRatio || 1;
    dprRef.current = DPR;
    const vw = window.innerWidth, vh = window.innerHeight;
    canvas.width  = vw * DPR;
    canvas.height = vh * DPR;
    canvas.style.width  = vw + "px";
    canvas.style.height = vh + "px";
    const ctx = canvas.getContext("2d")!;
    ctx.scale(DPR, DPR);

    const rect = computeLogoRect(vw, vh);
    logoRect.current = rect;

    // 힌트 top 초기값 (outline 로드 전 fallback — outline onload에서 재계산됨)
    setHintTop(rect.y + rect.h - 10);

    // 오프스크린 캔버스 (LOGO_W × LOGO_H)
    const mk = () => document.createElement("canvas");
    const ac = mk(); ac.width = rect.w; ac.height = rect.h;
    const fc = mk(); fc.width = rect.w; fc.height = rect.h;
    const tc = mk(); tc.width = rect.w; tc.height = rect.h;
    accumRef.current    = ac;
    fillMaskRef.current = fc;
    tempRef.current     = tc;

    // outline + Logo_White_Area.png 동시 로드 → 둘 다 완료 후 init
    // outline onload: 실제 비율 저장 후 rect 재계산 (하드코딩 941/1672 제거)
    let outlineDone = false, maskDone = false;
    let fillMaskImgRef: HTMLImageElement | null = null;

    const tryInit = (freshRect?: { x: number; y: number; w: number; h: number }) => {
      if (!outlineDone || !maskDone || !fillMaskImgRef) return;
      const r = freshRect ?? rect;
      buildFillMask(fillMaskImgRef, r.w, r.h);
      buildTiledPatterns(r.w, r.h);
    };

    const outlineLoader = new window.Image();
    outlineLoader.crossOrigin = "anonymous";
    outlineLoader.onload = () => {
      // ★ 실제 비율 저장 (하드코딩 제거)
      outlineNaturalRef.current = {
        w: outlineLoader.naturalWidth,
        h: outlineLoader.naturalHeight,
      };
      // 비율 갱신 후 rect 재계산
      const vw2 = window.innerWidth, vh2 = window.innerHeight;
      const freshRect = computeLogoRect(vw2, vh2);
      logoRect.current = freshRect;
      setHintTop(freshRect.y + freshRect.h - 10);
      // 캔버스 크기 조정
      [accumRef.current!, fillMaskRef.current!, tempRef.current!]
        .forEach(c => { c.width = freshRect.w; c.height = freshRect.h; });
      outlineDone = true;
      tryInit(freshRect);
    };
    outlineLoader.src = "/logo-outline.png";

    const maskLoader = new window.Image();
    maskLoader.crossOrigin = "anonymous";
    maskLoader.onload = () => {
      fillMaskImgRef = maskLoader;
      maskDone = true;
      tryInit();
    };
    maskLoader.src = "/Logo_White_Final.png";

    // Resize
    const onResize = () => {
      const vw2 = window.innerWidth, vh2 = window.innerHeight;
      const DPR2 = window.devicePixelRatio || 1;
      dprRef.current = DPR2;
      canvas.width  = vw2 * DPR2;
      canvas.height = vh2 * DPR2;
      canvas.style.width  = vw2 + "px";
      canvas.style.height = vh2 + "px";
      const ctx2 = canvas.getContext("2d")!;
      ctx2.scale(DPR2, DPR2);

      const r = computeLogoRect(vw2, vh2);
      logoRect.current = r;
      setHintTop(r.y + r.h - 10);

      [accumRef.current!, fillMaskRef.current!, tempRef.current!]
        .forEach(c => { c.width = r.w; c.height = r.h; });
      maskReady.current  = false;
      maskPixels.current = null;
      filledCells.current.clear();

      if (fillMaskImgRef) buildFillMask(fillMaskImgRef, r.w, r.h);
      buildTiledPatterns(r.w, r.h);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [computeLogoRect, buildFillMask, buildTiledPatterns]);

  // ── Render loop ───────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const render = () => {
      const ctx = canvas.getContext("2d")!;

      // DPR scale이 매 frame 보존되지 않으므로 매번 setTransform 적용
      const DPR = dprRef.current;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1.0;
      ctx.imageSmoothingEnabled = false;

      // 검정 배경
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width / DPR, canvas.height / DPR);

      // pendingDraw 처리 (RAF 내에서만 드로잉)
      const px = pendingX.current, py = pendingY.current;
      if (px !== null && py !== null && isDrawing.current && !completedRef.current) {
        revealBrush(px, py);
        markFilled(px, py);

        const newRatio = filledCells.current.size / totalCells.current;
        setFillRatio(newRatio);

        // 자동 완성 제거 — 사용자가 완료 버튼으로 직접 완성
        pendingX.current = null;
        pendingY.current = null;
      }

      // 패턴 합성 (fill mask 안쪽만)
      compositeToMain(ctx);

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1.0;

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
  }, [revealBrush, markFilled, compositeToMain]);

  // ── 완료 버튼 핸들러 ──────────────────────────────────────────────────────
  const handleComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    isDrawing.current = false;
    setIsComplete(true);
  }, []);

  // ── 저장 핸들러 — 오프스크린 캔버스로 직접 합성 후 PNG 다운로드 ──
  const handleSave = useCallback(() => {
    const mainCanvas = canvasRef.current;
    const ac = accumRef.current;
    const fc = fillMaskRef.current;
    if (!mainCanvas || !ac || !fc) return;

    const DPR = dprRef.current;
    const { x, y, w, h } = logoRect.current;
    const cssW = mainCanvas.width / DPR;
    const cssH = mainCanvas.height / DPR;

    // ── Step 1: fill mask + accum 합성 → knitCanvas (로고 크기) ──
    const knitCanvas = document.createElement("canvas");
    knitCanvas.width  = w;
    knitCanvas.height = h;
    const kctx = knitCanvas.getContext("2d")!;
    kctx.clearRect(0, 0, w, h);
    kctx.globalCompositeOperation = "source-over";
    kctx.drawImage(fc, 0, 0, w, h);          // fill mask
    kctx.globalCompositeOperation = "source-in";
    kctx.drawImage(ac, 0, 0, w, h);          // 뜨개 패턴 클리핑

    // ── Step 2: 저장 캔버스에 순서대로 합성 ──
    const saveCanvas = document.createElement("canvas");
    saveCanvas.width  = cssW;
    saveCanvas.height = cssH;
    const sctx = saveCanvas.getContext("2d")!;

    // 검정 배경
    sctx.fillStyle = "#000000";
    sctx.fillRect(0, 0, cssW, cssH);

    // 뜨개 패턴 (로고 위치에)
    sctx.drawImage(knitCanvas, x, y, w, h);

    // 핑크 아웃라인 — screen 블렌드 모드로 합성 (HTML img와 동일 렌더링)
    const outlineImg = new Image();
    outlineImg.onload = () => {
      sctx.globalCompositeOperation = "screen";
      sctx.drawImage(outlineImg, x, y, w, h);
      sctx.globalCompositeOperation = "source-over";
      const link = document.createElement("a");
      link.download = "my-moltype-knit.png";
      link.href = saveCanvas.toDataURL("image/png");
      link.click();
    };
    outlineImg.src = "/logo-outline.png";
  }, []);

  // ── 완성 연출 (v10: 털 로고 전환 없음 — 아웃라인+패턴 그대로 유지, 슬로건만) ──
  useEffect(() => {
    if (!isComplete) return;
    // outline, canvas, 패턴 모두 그대로 유지
    // 600ms 후 프로그레스바 → 슬로건만 등장
    setTimeout(() => {
      setProgressOpacity(0);
      setTimeout(() => setShowSlogan(true), 400);
    }, 600);
  }, [isComplete]);

  // ── 이벤트 핸들러 ─────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    document.body.style.overscrollBehavior = "none";

    const onMouseDown = (e: MouseEvent) => {
      if (completedRef.current) return;
      e.preventDefault();
      isDrawing.current = true;
      prevPt.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const sx = e.clientX, sy = e.clientY;
      setCursorPos({ x: sx, y: sy });
      setCursorInside(isInsideLogo(sx, sy));

      if (!isDrawing.current || completedRef.current) return;

      if (!hasStartedRef.current) {
        hasStartedRef.current = true;
        setHasStarted(true);
      }

      const prev = prevPt.current;
      const dist = Math.hypot(sx - prev.x, sy - prev.y);
      if (dist >= 3) {
        const r     = brushR.current;
        const steps = Math.max(1, Math.floor(dist / (r * 0.4)));
        for (let i = 1; i < steps; i++) {
          const t  = i / steps;
          const ix = prev.x + (sx - prev.x) * t;
          const iy = prev.y + (sy - prev.y) * t;
          if (isInsideLogo(ix, iy)) {
            revealBrush(ix, iy);
            markFilled(ix, iy);
          }
        }
        prevPt.current = { x: sx, y: sy };
      }

      if (isInsideLogo(sx, sy)) {
        pendingX.current = sx;
        pendingY.current = sy;
      }

      scheduleSwitch();
    };

    const onMouseUp = () => {
      if (!isDrawing.current) return;
      isDrawing.current = false;
      if (patternTimer.current) clearTimeout(patternTimer.current);
      nextPattern();
    };

    const onMouseLeave = () => setCursorInside(false);

    // Touch
    const onTouchStart = (e: TouchEvent) => {
      if (completedRef.current) return;
      e.preventDefault();
      const t = e.touches[0];
      isDrawing.current = true;
      prevPt.current = { x: t.clientX, y: t.clientY };
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!isDrawing.current || completedRef.current) return;
      const t = e.touches[0];
      const sx = t.clientX, sy = t.clientY;

      if (!hasStartedRef.current) {
        hasStartedRef.current = true;
        setHasStarted(true);
      }

      const prev = prevPt.current;
      const dist = Math.hypot(sx - prev.x, sy - prev.y);
      if (dist >= 3) {
        const r     = brushR.current;
        const steps = Math.max(1, Math.floor(dist / (r * 0.4)));
        for (let i = 1; i < steps; i++) {
          const frac = i / steps;
          const ix = prev.x + (sx - prev.x) * frac;
          const iy = prev.y + (sy - prev.y) * frac;
          if (isInsideLogo(ix, iy)) { revealBrush(ix, iy); markFilled(ix, iy); }
        }
        prevPt.current = { x: sx, y: sy };
      }

      if (isInsideLogo(sx, sy)) { pendingX.current = sx; pendingY.current = sy; }
      scheduleSwitch();
    };

    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      isDrawing.current = false;
      if (patternTimer.current) clearTimeout(patternTimer.current);
      nextPattern();
    };

    // Wheel — 브러시 크기
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? BRUSH_STEP : -BRUSH_STEP;
      brushR.current = Math.min(BRUSH_MAX, Math.max(BRUSH_MIN, brushR.current + delta));
      setBrushVis(brushR.current);
    };

    canvas.addEventListener("mousedown",  onMouseDown);
    canvas.addEventListener("mousemove",  onMouseMove);
    canvas.addEventListener("mouseup",    onMouseUp);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove",  onTouchMove,  { passive: false });
    canvas.addEventListener("touchend",   onTouchEnd,   { passive: false });
    window.addEventListener("wheel",      onWheel,      { passive: false });

    return () => {
      canvas.removeEventListener("mousedown",  onMouseDown);
      canvas.removeEventListener("mousemove",  onMouseMove);
      canvas.removeEventListener("mouseup",    onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove",  onTouchMove);
      canvas.removeEventListener("touchend",   onTouchEnd);
      window.removeEventListener("wheel",      onWheel);
    };
  }, [isInsideLogo, revealBrush, markFilled, scheduleSwitch, nextPattern]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const { x: lx, y: ly, w: lw, h: lh } = logoRect.current;
  const stitchCount = Math.round(fillRatio * 100);
  const brushDia    = brushVis * 2;

  return (
    <div style={{
      position: "fixed", inset: 0, backgroundColor: "#000",
      overflow: "hidden", cursor: isComplete ? "auto" : "none",
    }}>

      {/* ── Drawing canvas ──────────────────────────────────────────────── */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute", inset: 0, display: "block",
          userSelect: "none", WebkitUserSelect: "none",
          pointerEvents: isComplete ? "none" : "auto",
        }}
      />

      {/* ── 로고 이미지 레이어 ──────────────────────────────────────────── */}
      {/* v8: Logo_ref_2~5 완전 제거 — outline/fur 두 img의 opacity 크로스페이드만 */}
      {/* v9: 두 이미지 모두 동일한 lx/ly/lw/lh (logo-outline.png 비율 기준) */}
      {mounted && (
        <div style={{
          position: "absolute",
          left: lx, top: ly,
          width: lw, height: lh,
          pointerEvents: "none",
        }}>
          {/* 1. outline — 항상 보임, 완성 시 fadeout */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-outline.png"
            alt="MOLTYPE"
            draggable={false}
            style={{
              position:     "absolute", top: 0, left: 0,
              width: "100%", height: "100%",
              mixBlendMode: "screen",
            }}
          />

          {/* v10: 털 로고 전환 제거 — 완성 시 아웃라인+패턴 그대로 유지 */}
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 200, cursor: "auto" }}>
        <Header />
      </div>

      {/* ── 커스텀 브러시 커서 — 완성 후 숨김 ──────────────────────────── */}
      {mounted && !isComplete && (
        <div style={{
          position:      "fixed",
          left:          cursorPos.x,
          top:           cursorPos.y,
          width:         brushDia,
          height:        brushDia,
          marginLeft:    -brushVis,
          marginTop:     -brushVis,
          border:        cursorInside
            ? "1.5px solid rgba(247,125,166,1)"
            : "1.5px solid rgba(247,125,166,0.38)",
          borderRadius:  "50%",
          background:    cursorInside ? "rgba(247,125,166,0.07)" : "transparent",
          pointerEvents: "none",
          zIndex:        999,
          transition:    "width 0.12s ease, height 0.12s ease, border-color 0.18s ease",
        }} />
      )}

      {/* ── UI 오버레이 ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
        style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 20 }}
      >
        {/* 힌트 텍스트 — DRAW TO KNIT + 부제 + 브러시 안내 한 블록 */}
        <AnimatePresence>
          {!hasStarted && !isComplete && (
            <motion.div
              key="hint"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6, transition: { duration: 0.4 } }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{
                position:      "fixed",
                top:           hintTop !== null ? `calc(${hintTop}px - 56px)` : "auto",
                bottom:        hintTop !== null ? "auto" : 120,
                left: 0, right: 0,
                display:       "flex",
                flexDirection: "column",
                alignItems:    "center",
                gap:           "4px",
                textAlign:     "center",
                pointerEvents: "none",
              }}
            >
              <span style={{
                fontFamily:    "'Univers Condensed','Arial Narrow',sans-serif",
                fontWeight:    700, fontSize: "clamp(14px,1.8vw,22px)",
                letterSpacing: "-0.01em", textTransform: "uppercase", color: "#ffffff",
              }}>
                DRAW TO KNIT
              </span>
              <span style={{
                fontFamily: "Pretendard, sans-serif",
                fontSize:   "clamp(11px,1.1vw,15px)",
                color:      "rgba(255,255,255,0.55)", letterSpacing: "-0.02em",
              }}>
                클릭+드래그로 나만의 뜨개를 완성해보세요
              </span>
              <span style={{
                fontFamily:    "Pretendard, sans-serif",
                fontSize:      "clamp(10px,0.9vw,12px)",
                color:         "rgba(255,255,255,0.35)",
                letterSpacing: "-0.01em",
                marginTop:     "0px",
              }}>
                스크롤로 브러시 크기 조절
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 프로그레스바 */}
        <AnimatePresence>
          {hasStarted && !showSlogan && (
            <motion.div
              key="progress"
              initial={{ opacity: 0 }}
              animate={{ opacity: progressOpacity }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                position:      "fixed",
                bottom:        56,
                left: 0, right: 0,
                display:       "flex",
                flexDirection: "column",
                alignItems:    "center",
                gap:           "12px",
                pointerEvents: "none",
              }}
            >
              <div style={{
                width: "75vw", height: 4,
                backgroundColor: "rgba(255,255,255,0.25)",
                borderRadius: 2, overflow: "hidden",
              }}>
                <motion.div
                  animate={{ width: `${Math.min(fillRatio * 100, 100)}%` }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{ height: "100%", backgroundColor: "#F77DA6", borderRadius: 2 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 슬로건 */}
        <AnimatePresence>
          {showSlogan && (
            <motion.div
              key="slogan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{
                position: "fixed", bottom: 56,
                left: 0, right: 0,
                textAlign: "center", pointerEvents: "none",
              }}
            >
              <p style={{
                fontFamily:    "'Univers Condensed','Arial Narrow',sans-serif",
                fontWeight:    700, fontSize: "clamp(13px,1.6vw,22px)",
                letterSpacing: "0.01em", textTransform: "uppercase",
                color: "#ffffff", margin: 0, whiteSpace: "nowrap",
              }}>
                THE LAST STITCH IS ALWAYS YOURS.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>

      {/* 완료 버튼 — 드로잉 중일 때 하단 우측에 표시 */}
      <AnimatePresence>
        {hasStarted && !isComplete && (
          <motion.button
            key="complete"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onClick={handleComplete}
            style={{
              position: "fixed", bottom: 32, right: 32,
              height: 36,
              padding: "0 20px",
              background: "#F77DA6",
              border: "none",
              borderRadius: "18px",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              color: "#ffffff",
              fontFamily: "'Univers Condensed','Arial Narrow',sans-serif",
              fontWeight: 700,
              fontSize: "13px",
              letterSpacing: "-0.01em",
              textTransform: "uppercase",
              zIndex: 1000,
              whiteSpace: "nowrap",
            }}
          >
            COMPLETE
          </motion.button>
        )}
      </AnimatePresence>

      {/* 새로고침 + 저장 버튼 — 완성 후 표시 */}
      <AnimatePresence>
        {showSlogan && (
          <>
            {/* 저장 버튼 */}
            <motion.button
              key="save"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              onClick={handleSave}
              style={{
                position: "fixed", bottom: 32, right: 88,
                width: 44, height: 44,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                color: "#ffffff",
                zIndex: 1000,
              }}
              title="이미지 저장"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </motion.button>

            {/* 새로고침 버튼 */}
            <motion.button
              key="refresh"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              onClick={() => window.location.reload()}
              style={{
                position: "fixed", bottom: 32, right: 32,
                width: 44, height: 44,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                color: "#ffffff",
                zIndex: 1000,
              }}
              title="다시 시작"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
            </motion.button>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
