"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FONTS } from "@/lib/assets";

// 세로형 스캐터 갤러리 — 살짝 기울어진 사진들이 겹쳐 쌓인 모바일 UI 레퍼런스
// (핀터레스트: kr.pinterest.com/pin/548031848427969356) 를 참고했다.
// public/Main_Motion 의 각 정지 이미지(.jpg)를 타일로 깔고, 클릭하면 같은 이름의
// 모션(.mp4)이 전체화면으로 재생된다.
// 05번은 원본 영상이 GitHub 파일 크기 제한(100MB)을 넘어 당장은 뺐다.
// 압축본이나 대체 파일이 준비되면 여기에 다시 추가하면 된다.
const TILES = [
  { id: "01", rotate: -4, width: "80%",  align: "flex-start" as const },
  { id: "02", rotate: 3,  width: "94%",  align: "flex-end"   as const },
  { id: "03", rotate: -2, width: "100%", align: "center"     as const },
  { id: "04", rotate: 5,  width: "72%",  align: "flex-start" as const },
  { id: "06", rotate: -3, width: "88%",  align: "flex-end"   as const },
];

const OVERLAP = -56; // 타일 간 겹치는 정도(px) — 첫 타일 제외 전부 이만큼 위로 당긴다

export default function MotionScatterGallery() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <section style={{ background: "#000000", padding: "120px 24px 140px" }}>
      <div style={{ textAlign: "center", marginBottom: "56px" }}>
        <p style={{
          fontFamily: FONTS.condensed, fontWeight: 700,
          fontSize: "clamp(20px, 2.4vw, 32px)",
          letterSpacing: "-0.01em", textTransform: "uppercase",
          color: "#ffffff", margin: "0 0 10px",
        }}>
          Motion Gallery
        </p>
        <p style={{
          fontFamily: FONTS.body, fontSize: "13px",
          color: "rgba(255,255,255,0.45)", margin: 0,
        }}>
          이미지를 클릭하면 모션으로 재생됩니다
        </p>
      </div>

      {/* 세로 스캐터 스택 — 휴대폰 화면 비율에 맞춘 좁은 폭 컨테이너 */}
      <div style={{
        display: "flex", flexDirection: "column",
        width: "min(420px, 100%)", margin: "0 auto",
      }}>
        {TILES.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setActiveId(t.id)}
            aria-label={`Play motion ${t.id}`}
            style={{
              alignSelf: t.align,
              width: t.width,
              marginTop: i === 0 ? 0 : `${OVERLAP}px`,
              transform: `rotate(${t.rotate}deg)`,
              position: "relative",
              aspectRatio: "1080 / 1537",
              border: "none", padding: 0, cursor: "pointer",
              boxShadow: "0 18px 40px rgba(0,0,0,0.55)",
              // z-index를 아래로 갈수록 높여, 스캐터 사진이 이전 것 위에 올라오게 한다
              zIndex: i,
            }}
          >
            <Image
              src={`/Main_Motion/Website_main_M_${t.id}.jpg`}
              alt={`Motion ${t.id}`}
              fill
              sizes="420px"
              style={{ objectFit: "cover" }}
            />
          </button>
        ))}
      </div>

      {/* 전체화면 모션 재생 */}
      <AnimatePresence>
        {activeId && (
          <FullscreenMotion id={activeId} onClose={() => setActiveId(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

function FullscreenMotion({ id, onClose }: { id: string; onClose: () => void }) {
  const [muted, setMuted] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 2000,
        background: "rgba(0,0,0,0.94)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer",
      }}
    >
      <motion.video
        key={id}
        src={`/Main_Motion/Website_main_M_${id}.mp4`}
        autoPlay
        loop
        muted={muted}
        playsInline
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.96 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ height: "92vh", maxWidth: "94vw", objectFit: "contain" }}
      />

      <button
        onClick={(e) => { e.stopPropagation(); setMuted((m) => !m); }}
        aria-label={muted ? "Unmute" : "Mute"}
        style={{
          position: "absolute", top: 24, right: 80, zIndex: 1,
          width: 44, height: 44, borderRadius: "50%",
          background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="4 9 8 9 12 5 12 19 8 15 4 15 4 9" fill="#fff" stroke="none" />
          {!muted ? (
            <>
              <path d="M16.5 8.5a5 5 0 0 1 0 7" />
              <path d="M19 6a9 9 0 0 1 0 12" />
            </>
          ) : (
            <path d="M17 9l5 6M22 9l-5 6" />
          )}
        </svg>
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Close"
        style={{
          position: "absolute", top: 24, right: 24, zIndex: 1,
          width: 44, height: 44, borderRadius: "50%",
          background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.5)",
          color: "#fff", fontSize: 18,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
        }}
      >
        ✕
      </button>
    </motion.div>
  );
}
