"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import { FONTS, COLORS } from "@/lib/assets";

const FONT_KO = "'SUIT','Pretendard',sans-serif";

type Session = {
  name: string;
  subtitle: string;
  body: string;
  overlayColor: string;
  image: string;
  startImgIdx: number;
};

const SESSIONS: Session[] = [
  {
    name: "CROCHET TATTOO WORKSHOP",
    subtitle: "크로셰 타투 워크숍",
    body: "옷이 아닌 몸 가까이에 뜨개 조각을 얹어보는 체험입니다.\n어깨, 손목, 목, 신발 위 등 원하는 위치에 크로셰 피스를 배치해 나만의 탈부착 바디 장식을 완성합니다.",
    overlayColor: COLORS.pink,
    image: "/Moltype_Workshop_01.png",
    startImgIdx: 0,
  },
  {
    name: "PATCH PLACEMENT LAB",
    subtitle: "패치 플레이스먼트 랩",
    body: "MOLTYPE의 패치와 뜨개 조각을 옷 위에 직접 배치해보는 워크숍입니다.\n같은 패치라도 위치에 따라 달라지는 옷의 인상을 실험하고, 자신만의 방식으로 의류를 커스터마이징합니다.",
    overlayColor: COLORS.green,
    image: "/Moltype_Workshop_02.png",
    startImgIdx: 1,
  },
  {
    name: "UNFINISHED REPAIR CLUB",
    subtitle: "언피니시드 리페어 클럽",
    body: "낡거나 밋밋한 옷을 뜨개, 스티치, 매듭, 프린지로 새롭게 수선하는 체험입니다.\n결함을 숨기기보다 드러내며, 불완전함을 디자인 요소로 바꾸는 MOLTYPE의 태도를 경험합니다.",
    overlayColor: COLORS.pink,
    image: "/Moltype_workshop_03.png",
    startImgIdx: 2,
  },
  {
    name: "CROCHET SURFACE SAMPLING",
    subtitle: "크로셰 서피스 샘플링",
    body: "꽃, 뭉치, 그물, 프린지, 레이스 등 다양한 뜨개 표면을 작은 샘플로 만들어보는 워크숍입니다.\n뜨개를 단순한 장식이 아닌 새로운 의류 표면으로 이해하고 실험합니다.",
    overlayColor: COLORS.green,
    image: "/Moltype_workshop_04.png",
    startImgIdx: 3,
  },
  {
    name: "THREAD CHARM MAKING",
    subtitle: "스레드 참 메이킹",
    body: "남은 실, 비즈, 미니 패치, 작은 뜨개 조각을 이용해 가방이나 신발, 지퍼에 달 수 있는 참을 만드는 체험입니다.\nMOLTYPE의 감각을 작은 오브제로 가볍게 가져갈 수 있습니다.",
    overlayColor: COLORS.pink,
    image: "/Moltype_workshop_05.png",
    startImgIdx: 4,
  },
  {
    name: "YARN PORTRAIT BOOTH",
    subtitle: "얀 포트레이트 부스",
    body: "직접 만든 패치, 참, 크로셰 피스를 착용하고 MOLTYPE 무드의 포토부스에서 촬영하는 체험입니다.\n결과물은 브랜드 매거진처럼 편집된 개인 포트레이트 카드로 완성됩니다.",
    overlayColor: COLORS.green,
    image: "/Moltype_workshop_06.png",
    startImgIdx: 5,
  },
];

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function DatePicker({ value, onChange, inputStyle, labelStyle }: {
  value: string;
  onChange: (v: string) => void;
  inputStyle: React.CSSProperties;
  labelStyle: React.CSSProperties;
}) {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const ref = useRef<HTMLDivElement>(null);

  const selected = value ? new Date(value + "T00:00:00") : null;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const firstDay = new Date(view.year, view.month, 1).getDay();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  const fmt = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const displayValue = selected
    ? `${selected.getFullYear()}년 ${selected.getMonth() + 1}월 ${selected.getDate()}일`
    : "날짜 선택";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <label style={labelStyle}>Date</label>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          ...inputStyle,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: "pointer", border: "1px solid #E0E0E0", background: "#F0F0F0",
          textAlign: "left",
        }}
      >
        <span style={{ color: selected ? "#1a1a1a" : "#999", fontSize: "13px", fontFamily: FONT_KO }}>
          {displayValue}
        </span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1" y="2" width="12" height="11" rx="1.5" stroke="#888" strokeWidth="1.2" />
          <path d="M1 5.5H13" stroke="#888" strokeWidth="1.2" />
          <path d="M4 1V3.5M10 1V3.5" stroke="#888" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
          background: "#fff", border: "1px solid #E0E0E0", borderRadius: "8px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 200, padding: "16px",
        }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <button type="button" onClick={() => setView(v => {
              const d = new Date(v.year, v.month - 1);
              return { year: d.getFullYear(), month: d.getMonth() };
            })} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", fontSize: "16px", color: "#555" }}>‹</button>
            <span style={{ fontFamily: FONT_KO, fontWeight: 600, fontSize: "14px", color: "#1a1a1a" }}>
              {view.year}년 {view.month + 1}월
            </span>
            <button type="button" onClick={() => setView(v => {
              const d = new Date(v.year, v.month + 1);
              return { year: d.getFullYear(), month: d.getMonth() };
            })} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", fontSize: "16px", color: "#555" }}>›</button>
          </div>

          {/* Day labels */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", marginBottom: "4px" }}>
            {["일","월","화","수","목","금","토"].map(d => (
              <span key={d} style={{ fontFamily: FONT_KO, fontSize: "11px", color: "#999", padding: "4px 0" }}>{d}</span>
            ))}
          </div>

          {/* Days grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center" }}>
            {cells.map((day, idx) => {
              if (!day) return <span key={idx} />;
              const date = new Date(view.year, view.month, day);
              const iso = fmt(date);
              const isSelected = selected && fmt(selected) === iso;
              const isToday = fmt(today) === iso;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => { onChange(iso); setOpen(false); }}
                  style={{
                    background: isSelected ? COLORS.pink : "none",
                    color: isSelected ? "#fff" : isToday ? COLORS.pink : "#1a1a1a",
                    border: isToday && !isSelected ? `1px solid ${COLORS.pink}` : "none",
                    borderRadius: "50%",
                    width: "30px", height: "30px",
                    margin: "2px auto",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer",
                    fontFamily: FONT_KO, fontSize: "12px",
                    fontWeight: isSelected ? 700 : 400,
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", borderTop: "1px solid #f0f0f0", paddingTop: "10px" }}>
            <button type="button" onClick={() => { onChange(""); setOpen(false); }}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: FONT_KO, fontSize: "12px", color: "#888" }}>
              삭제
            </button>
            <button type="button" onClick={() => { onChange(fmt(today)); setOpen(false); }}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: FONT_KO, fontSize: "12px", color: COLORS.pink, fontWeight: 700 }}>
              오늘
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const WORKSHOP_IMAGES = [
  "/Moltype_Workshop_01.png",
  "/Moltype_Workshop_02.png",
  "/Moltype_workshop_03.png",
  "/Moltype_workshop_04.png",
  "/Moltype_workshop_05.png",
  "/Moltype_workshop_06.png",
];

function ImageLightbox({ startIndex, onClose }: { startIndex: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIndex);
  const prev = () => setIdx(i => (i - 1 + WORKSHOP_IMAGES.length) % WORKSHOP_IMAGES.length);
  const next = () => setIdx(i => (i + 1) % WORKSHOP_IMAGES.length);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.92)",
        zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      {/* Close */}
      <button onClick={onClose} style={{ position: "absolute", top: "24px", right: "24px", background: "none", border: "none", cursor: "pointer", color: "#fff", fontSize: "24px", zIndex: 10 }}>✕</button>

      {/* Prev */}
      <button onClick={(e) => { e.stopPropagation(); prev(); }} style={{
        position: "absolute", left: "24px",
        background: "rgba(255,255,255,0.12)", border: "none", borderRadius: "50%",
        width: "48px", height: "48px", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "20px", zIndex: 10,
      }}>‹</button>

      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.img
          key={idx}
          src={WORKSHOP_IMAGES[idx]}
          alt=""
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: "90vw", maxHeight: "85vh", objectFit: "contain", display: "block" }}
        />
      </AnimatePresence>

      {/* Next */}
      <button onClick={(e) => { e.stopPropagation(); next(); }} style={{
        position: "absolute", right: "24px",
        background: "rgba(255,255,255,0.12)", border: "none", borderRadius: "50%",
        width: "48px", height: "48px", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "20px", zIndex: 10,
      }}>›</button>

      {/* Dots */}
      <div style={{ position: "absolute", bottom: "28px", display: "flex", gap: "8px" }}>
        {WORKSHOP_IMAGES.map((_, i) => (
          <button key={i} onClick={(e) => { e.stopPropagation(); setIdx(i); }} style={{
            width: i === idx ? "24px" : "8px", height: "8px",
            borderRadius: "4px", border: "none", cursor: "pointer",
            background: i === idx ? COLORS.pink : "rgba(255,255,255,0.4)",
            transition: "all 0.25s",
            padding: 0,
          }} />
        ))}
      </div>
    </motion.div>
  );
}

function BookingModal({ session, onClose }: { session: Session; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", phone: "", guests: "2", date: "", hour: "10", minute: "00", agreed: false });
  const [btnActive, setBtnActive] = useState(false);
  const [imgIdx, setImgIdx] = useState(session.startImgIdx);
  const [lightbox, setLightbox] = useState(false);

  const HOURS = Array.from({ length: 11 }, (_, i) => String(i + 10).padStart(2, "0"));
  const MINUTES = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.scrollbarGutter = "stable";
    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.scrollbarGutter = "";
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    background: "#F0F0F0",
    border: "1px solid #E0E0E0",
    borderRadius: "4px",
    fontFamily: FONTS.akkurat,
    fontSize: "13px",
    color: "#1a1a1a",
    outline: "none",
    boxSizing: "border-box",
    letterSpacing: "0.04em",
    accentColor: COLORS.pink,
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: FONTS.akkurat,
    fontSize: "11px",
    letterSpacing: "0.12em",
    color: "#1a1a1a",
    textTransform: "uppercase",
    display: "block",
    marginBottom: "8px",
    fontWeight: 500,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.55)",
        zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 16 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 3fr",
          width: "min(960px, 100%)",
          maxHeight: "90vh",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
        }}
      >
        {/* Left: image carousel */}
        <div style={{ position: "relative", minHeight: "500px", overflow: "hidden" }}>
          {/* Images */}
          <AnimatePresence>
            <motion.img
              key={imgIdx}
              src={WORKSHOP_IMAGES[imgIdx]}
              alt={session.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              onClick={() => setLightbox(true)}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", cursor: "zoom-in" }}
            />
          </AnimatePresence>

          {/* Gradient + title */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "44px", left: "24px", right: "24px", pointerEvents: "none" }}>
            <p style={{ fontFamily: FONTS.condensed, fontWeight: 700, fontSize: "clamp(22px, 2.8vw, 40px)", letterSpacing: "-0.02em", textTransform: "uppercase", color: "#fff", margin: 0, lineHeight: 1.0 }}>
              {session.name}
            </p>
          </div>

          {/* Dot nav */}
          <div style={{ position: "absolute", bottom: "18px", left: "24px", display: "flex", gap: "6px" }}>
            {WORKSHOP_IMAGES.map((_, i) => (
              <button key={i} onClick={() => setImgIdx(i)} style={{
                width: i === imgIdx ? "20px" : "6px", height: "6px",
                borderRadius: "3px", border: "none", padding: 0,
                background: i === imgIdx ? "#fff" : "rgba(255,255,255,0.4)",
                cursor: "pointer", transition: "all 0.25s",
              }} />
            ))}
          </div>

          {/* Prev / Next arrows */}
          <button onClick={() => setImgIdx(i => (i - 1 + WORKSHOP_IMAGES.length) % WORKSHOP_IMAGES.length)} style={{
            position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.18)", border: "none", borderRadius: "50%",
            width: "32px", height: "32px", cursor: "pointer", color: "#fff", fontSize: "16px",
            display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)",
          }}>‹</button>
          <button onClick={() => setImgIdx(i => (i + 1) % WORKSHOP_IMAGES.length)} style={{
            position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.18)", border: "none", borderRadius: "50%",
            width: "32px", height: "32px", cursor: "pointer", color: "#fff", fontSize: "16px",
            display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)",
          }}>›</button>

          {/* Close button */}
          <button onClick={onClose} style={{
            position: "absolute", top: "16px", left: "16px",
            background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%",
            width: "34px", height: "34px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)",
          }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Right: booking form */}
        <div style={{
          background: "#ffffff",
          padding: "48px 40px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}>
          {/* Header nav hint */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "32px" }}>
            <span style={{ fontFamily: FONTS.akkurat, fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#1a1a1a", fontWeight: 700 }}>
              BOOKING
            </span>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={labelStyle}>Name</label>
              <input
                style={inputStyle}
                placeholder="YEJIN CHOI"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label style={labelStyle}>Phone Number</label>
              <input
                style={inputStyle}
                placeholder="+82 010 0000 0000"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div>
              <label style={labelStyle}>Guests</label>
              <div style={{ position: "relative" }}>
                <select
                  style={{ ...inputStyle, appearance: "none", paddingRight: "40px", cursor: "pointer" }}
                  value={form.guests}
                  onChange={(e) => setForm({ ...form, guests: e.target.value })}
                >
                  {[1,2,3,4,5,6,7,8].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <svg
                  style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                  width="12" height="7" viewBox="0 0 12 7" fill="none"
                >
                  <path d="M1 1L6 6L11 1" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <DatePicker
              value={form.date}
              onChange={(v) => setForm({ ...form, date: v })}
              inputStyle={inputStyle}
              labelStyle={labelStyle}
            />
            <div>
              <label style={labelStyle}>Time</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div style={{ position: "relative" }}>
                  <select
                    style={{ ...inputStyle, appearance: "none", paddingRight: "36px", cursor: "pointer" }}
                    value={form.hour}
                    onChange={(e) => setForm({ ...form, hour: e.target.value })}
                  >
                    {HOURS.map(h => <option key={h} value={h}>{h}시</option>)}
                  </select>
                  <svg style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1L5 5L9 1" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div style={{ position: "relative" }}>
                  <select
                    style={{ ...inputStyle, appearance: "none", paddingRight: "36px", cursor: "pointer" }}
                    value={form.minute}
                    onChange={(e) => setForm({ ...form, minute: e.target.value })}
                  >
                    {MINUTES.map(m => <option key={m} value={m}>{m}분</option>)}
                  </select>
                  <svg style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1L5 5L9 1" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              onMouseDown={() => setBtnActive(true)}
              onMouseUp={() => setBtnActive(false)}
              onMouseLeave={() => setBtnActive(false)}
              style={{
                marginTop: "4px",
                padding: "18px",
                background: btnActive ? COLORS.pink : "#1a1a1a",
                color: "#ffffff",
                border: "none",
                borderRadius: "4px",
                fontFamily: FONTS.condensed,
                fontWeight: 700,
                fontSize: "15px",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "background 0.15s",
              }}
            >
              BOOK A TABLE
            </button>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <input
                type="checkbox"
                id="privacy"
                checked={form.agreed}
                onChange={(e) => setForm({ ...form, agreed: e.target.checked })}
                style={{ marginTop: "2px", accentColor: COLORS.pink, cursor: "pointer", flexShrink: 0 }}
              />
              <label htmlFor="privacy" style={{
                fontFamily: FONTS.akkurat, fontSize: "10px",
                letterSpacing: "0.08em", textTransform: "uppercase",
                color: "#666", lineHeight: 1.6, cursor: "pointer",
              }}>
                BY CLICKING &quot;BOOK A TABLE&quot;, YOU AGREE TO OUR{" "}
                <span style={{ color: "#1a1a1a", fontWeight: 700, textDecoration: "underline" }}>PRIVACY POLICY.</span>
              </label>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <ImageLightbox startIndex={imgIdx} onClose={() => setLightbox(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SessionCard({ s, idx, onClick }: { s: Session; idx: number; onClick: () => void }) {
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      id={`session-card-${idx}`}
      style={{
        position: "relative",
        aspectRatio: "1 / 1",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      <img
        src={s.image}
        alt={s.name}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
      {/* Pink overlay + pattern on hover */}
      <div style={{
        position: "absolute", inset: 0,
        background: hov ? hexToRgba(COLORS.pink, 0.65) : "transparent",
        transition: "background 0.35s ease",
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        padding: "24px", textAlign: "center" as const,
      }}>
        {hov && (
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(/Moltype_Pattern_01.png)`,
            backgroundSize: "250px",
            backgroundRepeat: "repeat",
            opacity: 0.2,
            pointerEvents: "none",
          }} />
        )}
        <motion.div
          initial={false}
          animate={{ opacity: hov ? 1 : 0, y: hov ? 0 : 12 }}
          transition={{ duration: 0.3 }}
          style={{ position: "relative", zIndex: 1 }}
        >
          <h3 style={{
            fontFamily: FONTS.condensed, fontWeight: 700,
            fontSize: "clamp(26px, 3vw, 44px)", letterSpacing: "-0.02em",
            textTransform: "uppercase", color: "#fff", margin: "0 0 12px",
          }}>
            {s.name}
          </h3>
          <p style={{
            fontFamily: FONT_KO, fontWeight: 400,
            fontSize: "16px", lineHeight: "1.6", color: "rgba(255,255,255,0.9)",
            margin: 0, wordBreak: "keep-all", whiteSpace: "pre-line",
          }}>
            {s.body}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// 세로 스티치 라인: 시작 정원을 클릭하면 점(정원)이 라인을 따라 내려가고, 그 뒤를 핑크 실이 끝까지 채운다.
// 도착하면 BOOK A SESSION 버튼이 나타난다. (uniform scale로 원이 찌그러지지 않게 preserveAspectRatio=meet 사용)
const STITCH_PATH = "M50 30 C 12 78, 88 108, 50 160 C 12 212, 88 242, 50 300 C 12 358, 88 388, 50 446 C 30 500, 50 524, 50 578";

function StitchLine({ onBook }: { onBook: () => void }) {
  const pathRef = useRef<SVGPathElement>(null);
  const rafRef = useRef<number | null>(null);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [dot, setDot] = useState({ x: 50, y: 30 });  // 이동하는 정원 위치 (viewBox 좌표)
  const [pinkD, setPinkD] = useState("");            // 원이 지나온 좌표를 그대로 그린 핑크 라인

  useEffect(() => {
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const run = () => {
    const p = pathRef.current;
    if (!p || started) return;
    setStarted(true);
    const len = p.getTotalLength();
    const dur = 2200;
    const t0 = performance.now();
    const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const frame = (now: number) => {
      const raw = Math.min((now - t0) / dur, 1);
      const t = ease(raw);
      const dist = t * len;
      const pt = p.getPointAtLength(dist);
      setDot({ x: pt.x, y: pt.y });
      // 시작점~현재 원 위치까지 실제 좌표를 샘플링해 폴리라인으로 그린다 → 원과 어긋날 수 없음
      const steps = Math.max(2, Math.ceil(dist / 4));
      let d = "";
      for (let i = 0; i <= steps; i++) {
        const q = p.getPointAtLength((dist * i) / steps);
        d += (i === 0 ? "M" : "L") + q.x.toFixed(2) + " " + q.y.toFixed(2);
      }
      setPinkD(d);
      if (raw < 1) rafRef.current = requestAnimationFrame(frame);
      else setDone(true);
    };
    rafRef.current = requestAnimationFrame(frame);
  };

  return (
    <div style={{ flexShrink: 0, width: "200px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg
        viewBox="0 0 100 600" fill="none" preserveAspectRatio="xMidYMid meet"
        style={{ flex: 1, width: "100%", minHeight: 0, display: "block", cursor: started ? "default" : "pointer" }}
        onClick={run}
      >
        {/* 미완성 점선 스티치 가이드 */}
        <path
          ref={pathRef} d={STITCH_PATH}
          stroke="#3f3f3f" strokeWidth="1.5" strokeDasharray="7 9" strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* 핑크 실 — 원이 지나온 좌표를 그대로 그린 라인이라 원과 항상 정확히 붙어있다 */}
        {pinkD && (
          <path
            d={pinkD}
            stroke={COLORS.pink} strokeWidth="2.5" strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        )}
        {/* 시작 전 클릭 유도 펄스 링 */}
        {!started && (
          <motion.circle
            cx={dot.x} cy={dot.y} r="10"
            fill="none" stroke={COLORS.pink} strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.35, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: `${dot.x}px ${dot.y}px` }}
          />
        )}
        {/* 라인을 따라 이동하는 정원 — 클릭 전 회색, 클릭 시 핑크로 변하며 이동 (uniform scale라 항상 원형) */}
        <circle cx={dot.x} cy={dot.y} r="6" fill={started ? COLORS.pink : "#3f3f3f"} vectorEffect="non-scaling-stroke" />
      </svg>
      <motion.button
        initial={false}
        animate={{ opacity: done ? 1 : 0, y: done ? 0 : 8 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        onClick={done ? onBook : undefined}
        onMouseEnter={(e) => { if (done) e.currentTarget.style.background = COLORS.pink; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        style={{
          background: "transparent",
          border: `1.5px solid ${COLORS.pink}`,
          borderRadius: "999px",
          color: "#ffffff",
          fontFamily: FONTS.condensed, fontWeight: 700,
          fontSize: "14px", letterSpacing: "0.04em", textTransform: "uppercase",
          padding: "12px 24px",
          cursor: done ? "pointer" : "default",
          pointerEvents: done ? "auto" : "none",
          flexShrink: 0,
          whiteSpace: "nowrap",
          marginTop: "12px",
          transition: "background 0.25s ease",
        }}
      >
        BOOK A SESSION
      </motion.button>
    </div>
  );
}

export default function WorkshopPage() {
  const [vh, setVh] = useState(800);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [circlePage, setCirclePage] = useState(0);

  useEffect(() => { setVh(window.innerHeight); }, []);

  const { scrollY } = useScroll();
  const range = [vh * 0.6, vh * 0.72];
  const bgColor     = useTransform(scrollY, range, ["#000000", "#ffffff"]);
  const fgColor     = useTransform(scrollY, range, ["#ffffff", "#050505"]);

  return (
    <>
      <Header />

      {/* fixed background layer */}
      <motion.div style={{ position: "fixed", inset: 0, backgroundColor: bgColor, zIndex: 1 }} />

      {/* Hero section */}
      <section style={{
        minHeight: "100vh",
        display: "flex", flexDirection: "column", justifyContent: "center", gap: "24px",
        padding: "120px 56px 200px",
        boxSizing: "border-box",
        position: "relative", zIndex: 2,
      }}>
        <motion.h1
          initial={{ clipPath: "inset(100% 0 0 0)", y: 24 }}
          animate={{ clipPath: "inset(0% 0 0 0)", y: 0 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: FONTS.condensed, fontWeight: 700,
            fontSize: "clamp(52px, 7.5vw, 108px)",
            letterSpacing: "-0.03em", textTransform: "uppercase",
            color: "#ffffff", margin: "0 0 12px", lineHeight: 0.9,
          }}
        >
          THE LAST STITCH<br />IS ALWAYS YOURS
        </motion.h1>

        <div style={{ position: "relative" }}>
          <motion.div
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 1.1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: "52%", overflow: "hidden", aspectRatio: "16 / 10" }}
          >
            <img src="/workshop_title_01.png" alt="Workshop"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </motion.div>

          {/* 우측 영역: 텍스트 + 이미지2(하단 정렬) + 세로 스티치/CTA — 이미지1 높이에 맞춰 전체를 채운다 */}
          <div style={{
            position: "absolute", top: 0, bottom: 0, left: "55%", right: "56px",
            display: "flex", gap: "40px",
          }}>
            {/* 좌: 텍스트(위) + 이미지2(아래, 남은 공간을 꽉 채우며 이미지1과 하단 라인 정렬) */}
            <div style={{
              flex: 1, minWidth: 0,
              display: "flex", flexDirection: "column",
            }}>
              <div style={{ maxWidth: "480px" }}>
                <h2 style={{
                  fontFamily: FONTS.condensed, fontWeight: 700,
                  fontSize: "40px",
                  letterSpacing: "-0.03em", textTransform: "uppercase",
                  color: "#ffffff", margin: "-4px 0 20px", lineHeight: 1.1,
                }}>
                  EXPERIENCE ON THE FLY,<br />TURNING UNFINISHED<br />INTO FINISHED!
                </h2>
                <p style={{ fontFamily: FONTS.akkurat, fontSize: "15px", lineHeight: "1.5", letterSpacing: "-0.01em", color: "#888888", margin: "0 0 14px" }}>
                  MOLTYPE&apos;S WORKSHOP IS OPEN TO ANYONE AS LONG AS THEY MAKE AN APPOINTMENT.
                  VISIT MOLTYPE&apos;S FLAGSHIP STORE, CHOOSE YOUR OWN UNFINISHED CLOTHING,
                  CHOOSE THE MATERIALS TO COMPLETE, AND THEN TRY.
                  IT IS POSSIBLE WITHOUT DIFFICULT TECHNIQUES. COMPLETE THE LAST STITCH WITH YOUR HANDS.
                </p>
                <p style={{ fontFamily: FONT_KO, fontWeight: 400, fontSize: "15px", lineHeight: "1.55", letterSpacing: "-0.02em", color: "#666666", margin: 0, wordBreak: "keep-all" }}>
                  MOLTYPE의 워크샵은 예약만 한다면 누구나 이용할 수 있습니다. MOLTYPE의 플래그십
                  스토어에 방문해서, 직접 미완성된 의류를 고르고 완성하기 위한 재료를 고른 다음,
                  완성해볼 수 있습니다. 어려운 기술 없이도 가능합니다. 여러분의 손으로 마지막 한 코를 완성해보세요.
                </p>
              </div>

              {/* 이미지2 — 남은 세로 공간을 flex:1로 꽉 채워 이미지1과 하단 라인 정렬 */}
              <motion.div
                initial={{ clipPath: "inset(0 0 0 100%)" }}
                animate={{ clipPath: "inset(0 0 0 0%)" }}
                transition={{ duration: 1.1, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ flex: 1, minHeight: "180px", marginTop: "28px", overflow: "hidden" }}
              >
                <img src="/workshop_title_02.png" alt="Workshop detail"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </motion.div>
            </div>

            {/* 우: 세로 스티치 라인 + 시작 정원(클릭 시 라인을 따라 이동하며 핑크로 채워짐) + CTA */}
            <StitchLine onBook={() => document.getElementById("sessions-section")?.scrollIntoView({ behavior: "smooth" })} />
          </div>
        </div>
      </section>

      {/* Sessions section — Nudake style */}
      <section id="sessions-section" style={{ padding: "160px 56px 80px", position: "relative", zIndex: 2 }}>
        <motion.h2 style={{
          fontFamily: FONTS.condensed, fontWeight: 700,
          fontSize: "clamp(16px, 2vw, 28px)",
          letterSpacing: "-0.02em", textTransform: "uppercase",
          color: fgColor, margin: "0 0 56px",
        }}>
          UPCOMING SESSIONS
        </motion.h2>

        {/* Circular nav — all 6 with arrows */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "80px", justifyContent: "center" }}>
          <button
            onClick={() => setCirclePage(p => (p - 1 + SESSIONS.length) % SESSIONS.length)}
            style={{
              background: "none", border: "1px solid rgba(128,128,128,0.3)", borderRadius: "50%",
              width: "40px", height: "40px", cursor: "pointer", fontSize: "18px",
              color: fgColor as any, display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            &#8592;
          </button>
          <div style={{ display: "flex", gap: "24px", justifyContent: "center" }}>
            {SESSIONS.map((s, i) => (
              <div
                key={s.name}
                onClick={() => {
                  setCirclePage(i);
                  document.getElementById(`session-card-${i}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  cursor: "pointer", opacity: circlePage === i ? 1 : 0.4,
                  transition: "opacity 0.3s ease",
                }}
              >
                <div style={{
                  width: "clamp(80px, 9vw, 140px)", height: "clamp(80px, 9vw, 140px)",
                  borderRadius: "50%", overflow: "hidden", marginBottom: "10px",
                  border: circlePage === i ? `2px solid ${COLORS.pink}` : "2px solid rgba(128,128,128,0.2)",
                  transition: "border 0.3s ease",
                }}>
                  <img src={s.image} alt={s.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <h3 style={{
                  fontFamily: FONTS.condensed, fontWeight: 700,
                  fontSize: "clamp(10px, 0.9vw, 14px)", letterSpacing: "-0.02em",
                  textTransform: "uppercase", color: fgColor as any,
                  margin: 0, textAlign: "center", whiteSpace: "nowrap",
                }}>
                  {s.name}
                </h3>
              </div>
            ))}
          </div>
          <button
            onClick={() => setCirclePage(p => (p + 1) % SESSIONS.length)}
            style={{
              background: "none", border: "1px solid rgba(128,128,128,0.3)", borderRadius: "50%",
              width: "40px", height: "40px", cursor: "pointer", fontSize: "18px",
              color: fgColor as any, display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            &#8594;
          </button>
        </div>

        {/* 3x2 image grid — 3개씩 2줄 (좌우 여백은 섹션 패딩으로 유지) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {SESSIONS.map((s, i) => (
            <SessionCard key={s.name} s={s} idx={i} onClick={() => setActiveSession(s)} />
          ))}
        </div>
      </section>

      {/* Booking modal */}
      <AnimatePresence>
        {activeSession && (
          <BookingModal session={activeSession} onClose={() => setActiveSession(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
