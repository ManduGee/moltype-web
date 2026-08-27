"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 홈 하단 룩 캐러셀 — 1920px 디자인 캔버스 기준으로 배치한 뒤, 화면 폭에 맞춰
// 통째로 스케일한다 (사이트 다른 페이지의 1920 zoom 시스템과 동일한 원리).
// 메인 모션(1264×1900)이 압도적으로 크게 자리잡고, 그 위로 245×245 정사각
// 썸네일 6개가 간격 없이 이어진 "모션 바"가 메인 왼쪽 끝에서 시작해 오른쪽으로
// 뻗어나가며 겹쳐진다. 활성 룩의 썸네일만 305×305로 커진다.
// 사운드: 기본 음소거. 모션을 더블클릭하면 확대 오버레이가 열리며 그때만 소리가 재생된다.
const LOOKS = [
  { src: "/Website_Look01_Motion.mp4" },
  { src: "/Spring_Motion.mp4" },
  { src: "/Summer_Motion.mp4" },
  { src: "/Fall_Motion.mp4" },
  { src: "/Winter_Motion.mp4" },
  { src: null }, // TODO: Look06 영상 준비되면 교체
] as const;

// ── 1920 디자인 캔버스 기준 좌표 ──────────────────────────────────────────────
const CANVAS_W = 1920;
const CANVAS_H = 1900;
const MAIN_W = 1264;
const MAIN_H = 1900;
const MAIN_LEFT = (CANVAS_W - MAIN_W) / 2; // 328 — 메인 모션 캔버스 내 좌측 좌표
const THUMB = 245;        // 기본 썸네일 크기 (px, 1920 기준)
const THUMB_ACTIVE = 305; // 활성 썸네일 크기 (px, 1920 기준)
const BAR_TOP_PCT = 60;   // 모션 바 수직 위치 (메인 모션 높이 대비 %)

export default function LookCarousel() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1); // 슬라이드 방향 (1: 다음, -1: 이전)
  const [expanded, setExpanded] = useState(false); // 더블클릭 확대 + 사운드 재생
  const [scale, setScale] = useState(1);
  const dragStartX = useRef<number | null>(null);

  const n = LOOKS.length;

  // 1920 기준 캔버스를 화면 폭에 맞춰 통째로 스케일
  useEffect(() => {
    const update = () => setScale(window.innerWidth / CANVAS_W);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const go = (next: number, direction: number) => {
    const target = ((next % n) + n) % n;
    if (LOOKS[target].src === null) return; // 준비되지 않은 룩은 건너뜀
    setDir(direction);
    setIdx(target);
  };

  const onPointerDown = (e: React.PointerEvent) => { dragStartX.current = e.clientX; };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const dx = e.clientX - dragStartX.current;
    dragStartX.current = null;
    if (dx < -60) go(idx + 1, 1);
    else if (dx > 60) go(idx - 1, -1);
  };

  return (
    <section
      style={{
        position: "relative",
        backgroundColor: "#000",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        height: `${CANVAS_H * scale}px`,
      }}
    >
      {/* 1920 기준 디자인 캔버스 — transform: scale로 화면 폭에 맞춰 축소/확대 */}
      <div
        style={{
          position: "relative",
          width: `${CANVAS_W}px`,
          height: `${CANVAS_H}px`,
          flexShrink: 0,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        {/* 메인 모션 (1264 × 1900) — 기본 음소거, 더블클릭 시 확대+사운드 */}
        <div
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onDoubleClick={() => setExpanded(true)}
          style={{
            position: "absolute",
            left: `${MAIN_LEFT}px`, top: 0,
            width: `${MAIN_W}px`, height: `${MAIN_H}px`,
            overflow: "hidden",
            touchAction: "pan-y",
            cursor: "pointer",
          }}
          title="더블클릭하면 크게 보고 소리를 들을 수 있어요"
        >
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.video
              key={idx}
              custom={dir}
              src={LOOKS[idx].src ?? undefined}
              autoPlay
              muted
              playsInline
              onEnded={() => go(idx + 1, 1)}
              // 브라우저가 리소스 절약을 위해 강제로 pause시키면 즉시 재개
              onPause={(e) => { const v = e.currentTarget; if (!v.ended) v.play().catch(() => {}); }}
              initial={{ x: dir > 0 ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: dir > 0 ? "-100%" : "100%" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%", objectFit: "cover",
                userSelect: "none",
              }}
            />
          </AnimatePresence>
        </div>

        {/* 모션 바 — 메인 모션 좌측 끝에서 시작해 오른쪽으로 뻗으며 겹쳐진다 */}
        <div
          style={{
            position: "absolute",
            left: `${MAIN_LEFT}px`,
            top: `${BAR_TOP_PCT}%`,
            transform: "translateY(-50%)",
            display: "flex",
            alignItems: "center",
            zIndex: 5,
          }}
        >
          {LOOKS.map((look, i) => {
            const active = i === idx;
            const size = active ? THUMB_ACTIVE : THUMB;
            return (
              <button
                key={i}
                onClick={() => go(i, i > idx ? 1 : -1)}
                aria-label={`Look ${i + 1}`}
                disabled={look.src === null}
                style={{
                  position: "relative",
                  width: `${size}px`,
                  height: `${size}px`,
                  flexShrink: 0,
                  padding: 0,
                  margin: 0,
                  border: "none",
                  display: "block",
                  background: look.src ? "#000" : "#B9B9B9",
                  cursor: look.src ? "pointer" : "default",
                  overflow: "hidden",
                  transition: "width 0.45s cubic-bezier(0.16,1,0.3,1), height 0.45s cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                {look.src && (
                  // 썸네일은 첫 프레임만 정지 상태로 보여준다 — 6개가 동시에 autoplay하면
                  // 브라우저 비디오 디코더가 포화되어 인트로 영상까지 멈추기 때문.
                  <video
                    src={look.src}
                    muted
                    playsInline
                    preload="metadata"
                    style={{
                      position: "absolute", inset: 0,
                      width: "100%", height: "100%", objectFit: "cover",
                      userSelect: "none",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 확대 오버레이 — 더블클릭 시 모션이 크게 보이고 소리가 재생된다 */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onDoubleClick={() => setExpanded(false)}
            style={{
              position: "fixed", inset: 0,
              zIndex: 2000,
              background: "rgba(0,0,0,0.92)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <video
              src={LOOKS[idx].src ?? undefined}
              autoPlay
              playsInline
              onEnded={() => setExpanded(false)}
              style={{
                height: "94vh",
                aspectRatio: "1264 / 1900",
                objectFit: "cover",
                userSelect: "none",
              }}
            />
            {/* 닫기 버튼 */}
            <button
              aria-label="Close"
              onClick={() => setExpanded(false)}
              style={{
                position: "absolute", top: 28, right: 28,
                width: 44, height: 44, borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.5)",
                background: "rgba(0,0,0,0.4)",
                color: "#fff", fontSize: 18,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}
            >
              &#215;
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
