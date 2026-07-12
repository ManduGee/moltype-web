"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COLORS, FONTS } from "@/lib/assets";

// FLASH DECLARATION 오프닝 — 접속 직후 3컷 스트로브 타이포 → Main_Interaction.mp4
// 컷1: UNFINISHED. (흑/백) → 컷2: BY DESIGN. (핑크 풀스크린/흑) → 컷3: FINISH IT. (흑/핑크)
// → 타이포 종료 → 영상 재생 → 종료 시 오버레이 페이드아웃
const CUTS = [
  { text: "UNFINISHED.", bg: "#000000", fg: "#ffffff" },
  { text: "BY DESIGN.",  bg: COLORS.pink, fg: "#000000" },
  { text: "FINISH IT.",  bg: "#000000", fg: COLORS.pink },
] as const;

const CUT_MS = 450;        // 컷 유지 시간
const SHRINK_WINDOW = 1.0; // 영상 종료 전 이 구간(초) 동안 DRAW TO KNIT 크기(72%)로 축소
const SHRINK_TO = 0.72;    // computeLogoRect의 w = vw * 0.72 와 동일

export default function FlashIntro({ onDone }: { onDone: () => void }) {
  // 0,1,2: 타이포 컷 / 3: 영상 재생 / 4: 종료(페이드)
  const [phase, setPhase] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const doneRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    timersRef.current.forEach(clearTimeout);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setPhase(4);
    setTimeout(onDone, 350);
  };

  useEffect(() => {
    const t = timersRef.current;
    t.push(setTimeout(() => setPhase(1), CUT_MS));
    t.push(setTimeout(() => setPhase(2), CUT_MS * 2));
    t.push(setTimeout(() => setPhase(3), CUT_MS * 3));
    return () => t.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // rAF로 매 프레임 직접 transform을 갱신 — timeupdate(약 250ms 간격) 대비 완전히 부드러움
  useEffect(() => {
    if (phase < 3) return;
    const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);
    const loop = () => {
      const v = videoRef.current;
      if (v && v.duration) {
        const remaining = v.duration - v.currentTime;
        const raw = remaining <= SHRINK_WINDOW ? 1 - Math.max(0, remaining) / SHRINK_WINDOW : 0;
        const scale = 1 - easeOutQuad(raw) * (1 - SHRINK_TO);
        v.style.transform = `scale(${scale})`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [phase]);

  const cut = CUTS[Math.min(phase, 2)];

  return (
    <motion.div
      onClick={finish}
      animate={{ opacity: phase === 4 ? 0 : 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{
        position: "fixed", inset: 0, zIndex: 10000,
        backgroundColor: phase >= 3 ? "#000000" : cut.bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden", cursor: "pointer",
        transition: "background-color 0.05s linear",
      }}
    >
      {/* 타이포 컷 — 하드 컷 + 과대 스케일 스냅 */}
      {phase <= 2 && (
        <motion.h1
          key={phase}
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          style={{
            fontFamily: FONTS.condensed, fontWeight: 700,
            fontSize: "clamp(72px, 14vw, 260px)",
            letterSpacing: "-0.04em", textTransform: "uppercase",
            color: cut.fg, margin: 0, lineHeight: 1,
            whiteSpace: "nowrap", userSelect: "none",
          }}
        >
          {cut.text}
        </motion.h1>
      )}

      {/* 컷 전환 화이트 플래시 (1프레임 타격감) */}
      <AnimatePresence>
        {phase >= 1 && phase <= 3 && (
          <motion.div
            key={`flash-${phase}`}
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.09, ease: "linear" }}
            style={{ position: "absolute", inset: 0, backgroundColor: "#ffffff", pointerEvents: "none" }}
          />
        )}
      </AnimatePresence>

      {/* 타이포 종료 후 메인 인터랙션 영상 재생 — 끝나기 직전 DRAW TO KNIT 크기로 축소 (rAF로 매 프레임 갱신) */}
      {phase >= 3 && (
        <motion.video
          ref={videoRef}
          key="main-interaction"
          src="/Main_Interaction.mp4"
          autoPlay
          muted
          playsInline
          onEnded={finish}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{ width: "100%", height: "100%", objectFit: "cover", willChange: "transform" }}
        />
      )}
    </motion.div>
  );
}
