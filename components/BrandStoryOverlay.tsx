"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

interface Props {
  onClose: () => void;
}

const FONT = "Pretendard, 'Arial Narrow', sans-serif";

export default function BrandStoryOverlay({ onClose }: Props) {

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onClick={onClose}
      style={{
        position: "fixed",
        top: "56px",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#ffffff",
        zIndex: 200,
        overflowY: "auto",
        overflowX: "hidden",
        cursor: "default",
      }}
    >
      {/* 헤더 바로 밑 — Thread by Thread + 영상 + 스크롤바 묶음 */}
      {/* 이 wrapper가 정확히 한 화면(100vh - header) */}
      <div style={{
        height: "calc(100vh - 56px)",
        display: "flex",
        flexDirection: "column",
      }}>

        {/* Thread by Thread 이미지 */}
        <div style={{
          flexShrink: 0,
          height: "42px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <img
            src="/thread_by_thread.png"
            alt="Thread by Thread"
            style={{ height: "22px", width: "auto", objectFit: "contain", opacity: 0.55 }}
          />
        </div>

        {/* 영상 — flex:1로 남은 공간 채우되 Scroll 바 위까지 */}
        <div
          style={{ flex: 1, overflow: "hidden", minHeight: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <video
            src="/moltype_brandstory_motion.mp4"
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
        </div>

        {/* 스크롤 유도 바 */}
        <div style={{
          flexShrink: 0,
          height: "64px",
          backgroundColor: "#ffffff",
          borderTop: "1px solid #f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "6px",
        }}>
          <div style={{ width: "1px", height: "16px", backgroundColor: "#c0c0c0" }} />
          <span style={{
            fontFamily: FONT,
            fontSize: "8px",
            letterSpacing: "0.22em",
            color: "#b0b0b0",
            textTransform: "uppercase",
          }}>
            Scroll To Explore
          </span>
        </div>
      </div>

      {/* ── 스크롤 후 브랜드 설명 섹션 ───────────────────── */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "100px 0 120px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "48px",
        }}
      >
        <p style={{ margin: 0, fontFamily: FONT, fontSize: "13px", letterSpacing: "0.18em", color: "#888888", textAlign: "center" }}>
          'Incomplete by Design'
        </p>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", maxWidth: "560px", width: "100%", padding: "0 40px", boxSizing: "border-box" }}>
          <p style={{ margin: 0, fontFamily: FONT, fontSize: "13px", fontWeight: 600, letterSpacing: "0.08em", color: "#333333", textAlign: "center" }}>
            Same Form, New Skin
          </p>
          <p style={{ margin: 0, fontFamily: FONT, fontSize: "13px", lineHeight: "2.0", color: "#555555", textAlign: "center", wordBreak: "keep-all" }}>
            MOLTYPE은 완성된 옷을 판매하지 않습니다.<br />
            구멍이 난 청바지, 챙이 없는 모자, 주머니 없는 셔츠—<br />
            일부가 비어있거나 결핍된 옷을 만듭니다.<br />
            그 빈 자리는 당신이 채웁니다.
          </p>
        </div>

        <div style={{ width: "1px", height: "48px", backgroundColor: "#e0e0e0" }} />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", maxWidth: "560px", width: "100%", padding: "0 40px", boxSizing: "border-box" }}>
          <p style={{ margin: 0, fontFamily: FONT, fontSize: "13px", fontWeight: 600, letterSpacing: "0.08em", color: "#333333", textAlign: "center" }}>
            Molting — 털갈이
          </p>
          <p style={{ margin: 0, fontFamily: FONT, fontSize: "13px", lineHeight: "2.0", color: "#555555", textAlign: "center", wordBreak: "keep-all" }}>
            같은 형태 위에 새로운 표면이 입혀지듯,<br />
            뜨개, 패치, 실, 장식 조각들로 당신만의 옷을 완성합니다.<br />
            결핍은 결함이 아닙니다. 가능성입니다.<br />
            세상에 하나뿐인 옷은 그렇게 만들어집니다.
          </p>
        </div>

        <div style={{ width: "1px", height: "48px", backgroundColor: "#e0e0e0" }} />

        <p style={{ margin: 0, fontFamily: FONT, fontSize: "11px", letterSpacing: "0.3em", color: "#aaaaaa", textAlign: "center", textTransform: "uppercase" }}>
          Made unfinished. Finished by you.
        </p>
      </div>
    </motion.div>
  );
}
