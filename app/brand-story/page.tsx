"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import { COLORS, FONTS, PATTERNS, BRAND_IMAGES } from "@/lib/assets";

// ─── Manifesto lines — 스크롤하면서 지정된 문장만 핑크+볼드로 강조되는 구조 ───
// em: true 인 문장은 화면 중앙 부근을 지나는 시점에 그린 → 핑크/볼드로 전환된다.
const MANIFESTO_LINES: { text: string; em: boolean }[] = [
  { text: "WE DO NOT FINISH CLOTHES.",        em: false },
  { text: "WE LEAVE SPACE FOR YOU.",          em: true  },
  { text: "A HOLE IS NOT DAMAGE.",            em: false },
  { text: "A MISSING POCKET IS NOT A DEFECT.", em: false },
  { text: "IT IS A PLACE TO BEGIN.",          em: true  },
  { text: "THREAD BY THREAD,",                em: true  },
  { text: "THE WEARER BECOMES THE MAKER.",    em: false },
];

// ─── Concept cards (Figma 원문 텍스트 그대로) ────────────────────────────────
const CONCEPT_CARDS = [
  {
    no: "01",
    title: "MOLTING",
    text: "SAME FORM, NEW SKIN. THE GARMENT DOESN'T CHANGE SHAPE — ONLY ITS SURFACE DOES. LIKE SHEDDING, BUT BY HAND.",
  },
  {
    no: "02",
    title: "MISSING PARTS",
    text: "EVERY MOLTYPE PIECE ARRIVES INCOMPLETE. THE ABSENCE IS NOT AN ERROR. IT IS THE INVITATION TO BEGIN.",
  },
  {
    no: "03",
    title: "USER COMPLETES",
    text: "YOU KNIT THE MISSING SECTION. YOU PATCH THE GAP. YOU CHOOSE THE THREAD. THE LAST PROCESS IS YOURS.",
  },
];

// ─── Section 1 — Hero (와이드 이미지 + Scroll To Explore + 중앙 작은 캡션/본문) ──────────────────
function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleEnded = () => {
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }, 2500); // 마지막 프레임 2.5초 유지 후 루프
  };

  return (
    <section>
      {/* full-bleed hero video */}
      <div style={{
        width: "100%",
        height: "90vh",
        backgroundColor: "#000000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        position: "relative",
      }}>
        <video
          ref={videoRef}
          src="/Graphic_Motion_v2.mp4"
          autoPlay
          muted
          playsInline
          onEnded={handleEnded}
          style={{ maxWidth: "100%", maxHeight: "92%", objectFit: "contain", display: "block" }}
        />

        {/* Scroll to Explore — 하단 검정 여백 안에 배치 */}
        <div style={{
          position: "absolute",
          bottom: "32px",
          left: 0, right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
        }}>
          <div style={{ width: "1px", height: "20px", overflow: "hidden", position: "relative" }}>
            <motion.div
              animate={{ height: ["0px", "20px", "0px"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: "1px", backgroundColor: "#999", position: "absolute", bottom: 0 }}
            />
          </div>
          <p style={{
            fontFamily: FONTS.body,
            fontSize: "11px",
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            color: "#999",
            margin: 0,
          }}>
            Scroll To Explore
          </p>
        </div>
      </div>


      {/* small centered caption + body copy below image — viewport 기반 표시 */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          maxWidth: "640px",
          margin: "80px auto",
          textAlign: "center",
          padding: "0 24px",
        }}
      >
        <p style={{
          fontFamily: FONTS.condensed,
          fontWeight: 700,
          fontSize: "13px",
          letterSpacing: "-0.03em",
          textTransform: "uppercase",
          color: COLORS.black,
          margin: "0 0 18px",
        }}>
          THE LAST STITCH IS ALWAYS YOURS
        </p>
        <p style={{
          fontFamily: FONTS.body,
          fontSize: "12px",
          lineHeight: "1.9",
          color: "#9a9a9a",
          margin: 0,
          whiteSpace: "pre-line",
        }}>
          {"하나의 옷이 완성되기까지, 빠진 마지막 한 코.\n그 여백은 트렌드가 아닌 당신의 손끝으로 채워집니다.\n미완이라는 가장 솔직한 형태 위에 당신만의 우연과 개성이 증식하는 순간\n— MOLTYPE의 세계를 경험해보세요."}
        </p>
      </motion.div>
    </section>
  );
}

// ─── Section 2 — Manifesto: 스크롤에 따라 핵심 문장이 그린 → 핑크/볼드로 강조 ──
// 각 줄을 화면 중앙 부근(viewport 중앙)에서 감지해, em(강조 대상) 줄만
// 그 시점에 #99DAAD(그린) → #F77DA6(핑크)+볼드 로 부드럽게(280ms) 전환된다.
// 한 번 강조된 줄은 핑크를 유지해 "스크롤할수록 중요한 문장이 점점 핑크로
// 물들어가는" 누적 강조 흐름을 만든다. (보라/라벤더/블랙 강조 절대 사용 안 함)
function ManifestoLine({ text, em, index }: { text: string; em: boolean; index: number }) {
  const ref = useRef(null);
  // 줄이 화면 세로 중앙 대역을 지날 때 활성화 — 스크롤 위치에 따른 진행형 강조
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const active = em && inView;

  return (
    <div ref={ref} style={{ overflow: "hidden" }}>
      <motion.p
        initial={{ clipPath: "inset(100% 0 0 0)", y: 20 }}
        whileInView={{ clipPath: "inset(0% 0 0 0)", y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
        animate={{
          color: active ? COLORS.pink : COLORS.green,
          fontWeight: active ? 700 : 500,
        }}
        style={{
          fontFamily: FONTS.condensed,
          fontSize: "clamp(30px, 4.2vw, 80px)",
          lineHeight: 1.25,
          letterSpacing: "-0.03em",
          textTransform: "uppercase",
          textAlign: "center",
          margin: 0,
          transition: "color 0.15s ease, font-weight 0.15s ease",
        }}
      >
        {text}
      </motion.p>
    </div>
  );
}

function ManifestoSection() {
  return (
    <section
      style={{
        // Figma 스펙: width 1231px, 화면 가로 중앙 정렬 (left: calc(50% - 1231px/2))
        maxWidth: "1231px",
        margin: "0 auto",
        padding: "64px 24px 80px",
      }}
    >
      {MANIFESTO_LINES.map((line, i) => (
        <ManifestoLine key={line.text} text={line.text} em={line.em} index={i} />
      ))}
    </section>
  );
}

function ConceptRow({ card, active, onEnter, onLeave }: { card: typeof CONCEPT_CARDS[0]; active: boolean; onEnter: () => void; onLeave: () => void }) {
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        display: "grid",
        gridTemplateColumns: "560px 1fr",
        gap: "40px",
        alignItems: "center",
        padding: "72px 0",
        borderBottom: "none",
        cursor: "pointer",
        overflow: "hidden",
        height: "260px",
      }}
    >
      {/* Left: number + title */}
      <motion.div
        initial={{ opacity: 0, x: "-100%" }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: "flex", alignItems: "baseline", gap: "16px" }}
      >
        <motion.span
          animate={{ color: active ? COLORS.pink : "#bbb", fontSize: active ? "clamp(48px, 5.5vw, 96px)" : "clamp(32px, 3.6vw, 64px)" }}
          transition={{ duration: 0.3 }}
          style={{
            fontFamily: FONTS.condensed,
            fontWeight: 500,
            letterSpacing: "-0.05em",
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          {card.no}
        </motion.span>
        <motion.h3
          animate={{ color: active ? COLORS.pink : COLORS.black, fontSize: active ? "clamp(32px, 3.5vw, 64px)" : "clamp(22px, 2.3vw, 42px)" }}
          transition={{ duration: 0.3 }}
          style={{
            fontFamily: FONTS.condensed,
            fontWeight: 700,
            lineHeight: 1.3,
            letterSpacing: "-0.04em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            margin: 0,
          }}
        >
          {card.title}
        </motion.h3>
      </motion.div>

      {/* Right: description */}
      <motion.div
        initial={{ opacity: 0, x: "100%" }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.p
          animate={{ color: active ? "#333" : "#999", fontSize: active ? "clamp(16px, 1.3vw, 24px)" : "clamp(12px, 0.9vw, 16px)" }}
          transition={{ duration: 0.3 }}
          style={{
            fontFamily: FONTS.akkurat,
            fontWeight: 400,
            lineHeight: 1.4,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          {card.text}
        </motion.p>
      </motion.div>
    </div>
  );
}

function ConceptCardsSection() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <>
      <div style={{ width: "100vw", marginBottom: "0", aspectRatio: "1920 / 35", marginLeft: "calc(-50vw + 50%)" }}>
        <img src={PATTERNS.checkPattern} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      <section style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px 56px 56px" }}>
        {CONCEPT_CARDS.map((card, i) => (
          <ConceptRow
            key={card.no}
            card={card}
            active={activeIdx === i}
            onEnter={() => setActiveIdx(i)}
            onLeave={() => setActiveIdx(null)}
          />
        ))}
      </section>

      <div style={{ width: "100vw", marginBottom: "0", aspectRatio: "1920 / 38", marginLeft: "calc(-50vw + 50%)" }}>
        <img src={PATTERNS.checkPattern} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    </>
  );
}

// ─── Section 4 — Graphic ending ──────────────────────────────────────────────
function ClusterGraphic() {
  return (
    <img
      src={PATTERNS.flowerGraphic}
      alt="MOLTYPE flower graphic"
      style={{ width: "100%", maxWidth: "579px", aspectRatio: "1159 / 1614", objectFit: "contain" }}
    />
  );
}

function GraphicEndingSection() {
  return (
    <section style={{
      padding: "88px 24px 120px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: "40px" }}
      >
        <ClusterGraphic />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.12 }}
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        <img
          src={BRAND_IMAGES.endText}
          alt="The Last Stitch Always Yours — MOLTYPE Seoul"
          style={{ width: "100%", maxWidth: "442px", aspectRatio: "885 / 160", objectFit: "contain" }}
        />
      </motion.div>
    </section>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function BrandStoryPage() {
  return (
    <PageLayout>
      <HeroSection />
      <ManifestoSection />
      <ConceptCardsSection />
    </PageLayout>
  );
}
