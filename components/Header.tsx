"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FONTS } from "@/lib/assets";

const NAV_ITEMS = [
  { label: "BRAND STORY",    href: "/brand-story" },
  { label: "PRODUCT",        href: "/product" },
  { label: "WORKSHOP",       href: "/workshop" },
  { label: "FLAGSHIP STORE", href: "/flagship-store" },
] as const;

export const HEADER_H = 90; // 헤더 높이 90px
const LOGO_DISPLAY_H = 40;
const LOGO_DISPLAY_W = Math.round(LOGO_DISPLAY_H * (974 / 377)); // ≈103

export default function Header() {
  const pathname   = usePathname();
  const isHome     = pathname === "/";
  const navCursor  = isHome ? "default" : "pointer";
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <header
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 150,
        // 페이지 줌을 상쇄해 모든 탭에서 헤더를 동일한 실제 크기(1:1)로 고정
        zoom: "var(--inv-zoom, 1)",
        padding: "0 48px",
        height: `${HEADER_H}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#000000",
        borderBottom: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      {/* 좌 — 네비게이션 */}
      <nav style={{ display: "flex", alignItems: "center", gap: "44px" }}>
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              onMouseEnter={() => setHoveredItem(item.label)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: navCursor,
                textDecoration: "none",
                position: "relative",
                padding: "4px 0",
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.condensed,
                  fontWeight: 700,
                  fontSize: "15px",
                  letterSpacing: "-0.01em",
                  textTransform: "uppercase",
                  color: "#ffffff",
                }}
              >
                {item.label}
              </span>
              {(active || hoveredItem === item.label) && (
                <span style={{
                  position: "absolute",
                  bottom: "-6px",
                  left: 0, right: 0,
                  height: "1px",
                  backgroundColor: "#ffffff",
                }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* 중앙 — 로고. 절대 위치로 화면 정중앙에 고정(좌우 폭이 달라도 흔들리지 않는다).
          이미 홈이면 Link가 리마운트를 안 시키므로, 인트로 재생 이벤트를 직접 쏜다 */}
      <Link
        href="/"
        onClick={(e) => {
          if (isHome) {
            e.preventDefault();
            window.dispatchEvent(new Event("moltype:replay-intro"));
          }
        }}
        style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex", alignItems: "center", cursor: navCursor,
        }}
      >
        <Image
          src="/Moltype_LOGO_BLACK.png"
          alt="MOLTYPE"
          width={LOGO_DISPLAY_W}
          height={LOGO_DISPLAY_H}
          style={{ objectFit: "contain", filter: "invert(1)" }}
          priority
        />
      </Link>

      {/* 우 — 검색 / 마이페이지 / 장바구니.
          검색·마이페이지는 아직 실제 기능(검색 인덱스, 로그인)이 없어 자리만 잡아둔 UI다.
          장바구니는 현재 product 페이지 안에서만 로컬 상태로 관리돼 헤더와 공유되지 않으므로,
          여기서는 빈 상태만 보여준다 — 실제 담긴 상품을 띄우려면 장바구니 상태를 전역(context)으로
          끌어올려야 한다. */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px", position: "relative" }}>
        <button
          onClick={() => { setSearchOpen((v) => !v); setCartOpen(false); }}
          aria-label="Search"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}
        >
          <SearchIcon />
        </button>

        <Link href="#" aria-label="My Page" onClick={(e) => e.preventDefault()} style={{ display: "flex", padding: 4 }}>
          <UserIcon />
        </Link>

        <button
          onClick={() => { setCartOpen((v) => !v); setSearchOpen(false); }}
          aria-label="Cart"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}
        >
          <BagIcon />
        </button>

        {/* 검색 드롭다운 */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              style={{
                position: "absolute", top: `${HEADER_H - 8}px`, right: 0,
                width: "280px", background: "#0a0a0a",
                border: "1px solid rgba(255,255,255,0.15)",
                padding: "14px 16px",
              }}
            >
              <input
                autoFocus
                placeholder="검색어를 입력하세요"
                style={{
                  width: "100%", background: "none", border: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.3)",
                  color: "#fff", fontSize: "13px", padding: "6px 0",
                  fontFamily: FONTS.body, outline: "none",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 장바구니 드롭다운 */}
        <AnimatePresence>
          {cartOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              style={{
                position: "absolute", top: `${HEADER_H - 8}px`, right: 0,
                width: "280px", background: "#0a0a0a",
                border: "1px solid rgba(255,255,255,0.15)",
                padding: "24px 16px",
                textAlign: "center",
              }}
            >
              <p style={{
                fontFamily: FONTS.body, fontSize: "13px",
                color: "rgba(255,255,255,0.6)", margin: 0,
              }}>
                장바구니가 비어있습니다
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
