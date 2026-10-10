"use client";

import { FONTS } from "@/lib/assets";

// 모든 페이지 맨 아래 들어가는 푸터 — 로고와 슬로건, 저작권 표기만 둔다.
export default function Footer() {
  return (
    <footer
      style={{
        background: "#000000",
        color: "rgba(255,255,255,0.45)",
        padding: "72px clamp(24px, 6vw, 120px) 48px",
        fontFamily: FONTS.body,
        fontSize: "12px",
        lineHeight: 1.9,
        letterSpacing: "-0.01em",
      }}
    >
      <p style={{
        fontFamily: FONTS.condensed, fontWeight: 700, fontSize: "26px",
        letterSpacing: "0.02em", color: "#ffffff", margin: "0 0 8px", lineHeight: 1,
      }}>
        MOLTYPE
      </p>
      <p style={{ margin: 0 }}>Thread by thread, it becomes yours.</p>
      <p style={{ margin: "40px 0 0", color: "rgba(255,255,255,0.3)" }}>
        © {new Date().getFullYear()} MOLTYPE. All rights reserved.
      </p>
    </footer>
  );
}
