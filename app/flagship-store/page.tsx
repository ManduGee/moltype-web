"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import PageLayout from "@/components/PageLayout";
import { COLORS, FONTS } from "@/lib/assets";

const MAIN_IMAGES = [
  "/store_01.jpg",
  "/store_02.jpg",
  "/store_05.jpg",
  "/store_04.jpg",
  "/store_03.jpg",
];

const MAIN_STORE = {
  name: "MOLTYPE FLAGSHIP STORE",
  location: "세종대학교 광개토관",
  address: "서울특별시 광진구 능동로 209",
  tel: "02-000-0000",
  hours: "월요일 - 일요일  11:00am - 9:00pm",
};

const BRANCHES = [
  {
    name: "MOLTYPE Gangnam Space",
    address: "서울특별시 강남구 능동로 209",
    tel: "02-1234-5678",
    hours: "월~일  10:00am - 10:00pm",
    image: "/플래그십스토어_강남.png",
  },
  {
    name: "MOLTYPE Seongsu Space",
    address: "서울특별시 성동구 능동로 209",
    tel: "02-1234-5678",
    hours: "월~일  10:00am - 10:00pm",
    image: "/플래그십스토어_성수.png",
  },
  {
    name: "MOLTYPE Apgujeong Space",
    address: "서울특별시 강남구 능동로 209",
    tel: "02-1234-5678",
    hours: "월~일  10:00am - 10:00pm",
    image: "/플래그십스토어_압구정.png",
  },
  {
    name: "MOLTYPE Hanam Space",
    address: "경기도 하남시 능동로 209",
    tel: "031-1234-5678",
    hours: "월~일  10:00am - 10:00pm",
    image: "/플래그십스토어_부산.png",
  },
];

function MainSlider() {
  const [idx, setIdx] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx(i => (i + 1) % MAIN_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [resetKey]);

  const goTo = (i: number) => {
    setIdx(i);
    setResetKey(k => k + 1);
  };

  return (
    <section style={{ position: "relative", width: "100%", aspectRatio: "16 / 7", backgroundColor: "#111", overflow: "hidden" }}>
      {MAIN_IMAGES.map((src, i) => (
        <div
          key={src}
          style={{
            position: "absolute", inset: 0, zIndex: 1,
            opacity: i === idx ? 1 : 0,
            transition: "opacity 0.8s ease-in-out",
          }}
        >
          <Image
            src={src}
            alt={MAIN_STORE.name}
            fill
            priority={i === 0}
            style={{ objectFit: "cover" }}
            sizes="100vw"
          />
        </div>
      ))}

      {/* 하단 그라디언트 + 정보 오버레이 */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2,
        background: "linear-gradient(to top, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.1) 45%, transparent 100%)",
        pointerEvents: "none",
      }} />
      <div style={{ position: "absolute", bottom: "40px", left: "56px", right: "56px", color: "#fff", zIndex: 3 }}>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontFamily: FONTS.condensed, fontWeight: 700,
            fontSize: "clamp(22px, 3vw, 48px)", letterSpacing: "-0.06em",
            textTransform: "uppercase", margin: "0 0 8px",
          }}
        >
          {MAIN_STORE.name}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}
        >
          <p style={{ fontFamily: FONTS.body, fontSize: "13px", color: "rgba(255,255,255,0.8)", margin: 0 }}>
            {MAIN_STORE.address}
          </p>
          <p style={{ fontFamily: FONTS.body, fontSize: "13px", color: "rgba(255,255,255,0.8)", margin: 0 }}>
            {MAIN_STORE.tel}
          </p>
          <p style={{ fontFamily: FONTS.body, fontSize: "13px", color: "rgba(255,255,255,0.8)", margin: 0 }}>
            {MAIN_STORE.hours}
          </p>
        </motion.div>
      </div>

      {/* 슬라이더 도트 */}
      <div style={{ position: "absolute", bottom: "16px", right: "56px", display: "flex", gap: "6px", zIndex: 3 }}>
        {MAIN_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === idx ? "20px" : "6px",
              height: "6px",
              borderRadius: "3px",
              background: i === idx ? "#fff" : "rgba(255,255,255,0.4)",
              border: "none", cursor: "pointer", padding: 0,
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
    </section>
  );
}

function MapModal({ name, address, onClose }: { name: string; address: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: "8px", overflow: "hidden",
          width: "90%", maxWidth: "720px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "16px 20px", borderBottom: "1px solid #eee",
        }}>
          <div>
            <h3 style={{
              fontFamily: FONTS.condensed, fontWeight: 700,
              fontSize: "16px", letterSpacing: "-0.02em",
              textTransform: "uppercase", color: "#050505", margin: "0 0 4px",
            }}>{name}</h3>
            <p style={{ fontFamily: FONTS.body, fontSize: "12px", color: "#777", margin: 0 }}>{address}</p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: "18px", color: "#999", padding: 0, lineHeight: 1,
              width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            X
          </button>
        </div>
        <iframe
          src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed&hl=ko`}
          style={{ width: "100%", height: "420px", border: "none" }}
          loading="lazy"
        />
      </motion.div>
    </motion.div>
  );
}

export default function FlagshipStorePage() {
  const [mapBranch, setMapBranch] = useState<typeof BRANCHES[0] | null>(null);

  return (
    <PageLayout>
      {/* 메인 슬라이더 */}
      <MainSlider />

      {/* 서브 스토어 4개 */}
      <section style={{ padding: "48px 56px 100px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
          <p style={{
            fontFamily: FONTS.condensed, fontWeight: 700,
            fontSize: "clamp(16px, 2vw, 28px)", letterSpacing: "-0.02em",
            textTransform: "uppercase", color: "#050505", margin: 0,
          }}>
            BRAND STORE
          </p>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#ebebeb" }} />
          <p style={{ fontFamily: FONTS.body, fontSize: "11px", color: "#aaa", margin: 0, textTransform: "uppercase" }}>
            Korea
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
          {BRANCHES.map((branch, i) => (
            <motion.div
              key={branch.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              style={{ border: "1px solid #ebebeb", overflow: "hidden" }}
            >
              <div style={{ position: "relative", width: "100%", aspectRatio: "3 / 2", backgroundColor: "#f5f5f5" }}>
                <Image
                  src={branch.image}
                  alt={branch.name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="25vw"
                />
              </div>
              <div style={{ padding: "14px 16px 18px" }}>
                <h3 style={{
                  fontFamily: FONTS.condensed, fontWeight: 700,
                  fontSize: "13px", letterSpacing: "-0.01em",
                  textTransform: "uppercase", color: "#050505",
                  margin: "0 0 8px",
                }}>
                  {branch.name}
                </h3>
                <p style={{ fontFamily: FONTS.body, fontSize: "11px", color: "#555", margin: "0 0 3px" }}>
                  {branch.address}
                </p>
                <p style={{ fontFamily: FONTS.body, fontSize: "11px", color: "#555", margin: "0 0 3px" }}>
                  {branch.tel}
                </p>
                <p style={{ fontFamily: FONTS.body, fontSize: "11px", color: "#555", margin: 0 }}>
                  {branch.hours}
                </p>
                <button
                  onClick={() => setMapBranch(branch)}
                  style={{
                    display: "inline-block",
                    marginTop: "10px", background: "none", border: "none", padding: 0,
                    fontFamily: FONTS.body, fontSize: "11px", color: COLORS.pink,
                    textDecoration: "underline", cursor: "pointer",
                  }}
                >
                  위치보기
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {mapBranch && (
          <MapModal
            name={mapBranch.name}
            address={mapBranch.address}
            onClose={() => setMapBranch(null)}
          />
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
