"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FONTS } from "@/lib/assets";
import { SEASON_PRODUCTS, SEASON_LABELS } from "@/lib/products";

const NAV_ITEMS = [
  { label: "BRAND STORY",    href: "/brand-story" },
  { label: "PRODUCT",        href: "/product" },
  { label: "WORKSHOP",       href: "/workshop" },
  { label: "FLAGSHIP STORE", href: "/flagship-store" },
] as const;

export const HEADER_H = 80; // 헤더 높이 80px
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

        {/* 검색 — 화면 전체를 덮는 패널로 연다 */}
        <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

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

// 검색 패널 — 헤더 바로 아래부터 화면을 덮는다.
// 입력 전에는 인기 검색어(대표 상품)를 보여주고, 입력하면 그 자리에서 상품을 걸러 보여준다.
const POPULAR = [
  "Frozen Bloom Dress",
  "Blooming Garden Dress",
  "Tundra Fur Jacket",
  "Bloom Veil",
  "Pastel Grung Knit",
];

type Hit = { name: string; image: string; season: string };

const ALL_PRODUCTS: Hit[] = SEASON_PRODUCTS.flatMap((list, i) =>
  list.map((p) => ({ name: p.name, image: p.image, season: SEASON_LABELS[i] })),
);

function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // 열릴 때마다 입력을 비우고, 열려 있는 동안은 뒤 페이지 스크롤을 잠근다
  useEffect(() => {
    if (!open) { setQuery(""); return; }
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  const q = query.trim().toLowerCase();
  const hits = q
    ? ALL_PRODUCTS.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 10)
    : POPULAR.map((n) => ALL_PRODUCTS.find((p) => p.name === n)).filter(Boolean) as Hit[];

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{
            position: "fixed",
            // 헤더(80px 고정)는 페이지 줌을 상쇄하고 있어, 줌이 걸린 좌표계에서는 그만큼 환산해 내려야 한다
            top: `calc(${HEADER_H}px * var(--inv-zoom, 1))`,
            left: 0, right: 0,
            // 화면을 다 덮지 않고 절반 정도만 — 아래로는 페이지가 그대로 보인다
            height: `calc(50vh * var(--inv-zoom, 1))`,
            background: "#ffffff",
            zIndex: 140,
            overflowY: "auto",
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", padding: "40px 56px 48px" }}>
            {/* 닫기 */}
            <button
              onClick={onClose}
              aria-label="Close search"
              style={{
                position: "absolute", top: 28, right: 48,
                background: "none", border: "none", cursor: "pointer",
                fontSize: "20px", color: "#111111", lineHeight: 1, padding: 4,
              }}
            >
              ✕
            </button>

            {/* 검색 입력 — 가운데 정렬 */}
            <div style={{
              maxWidth: "860px", margin: "0 auto",
              display: "flex", alignItems: "center", gap: "12px",
              borderBottom: "1px solid #111111", paddingBottom: "10px",
            }}>
              <SearchIcon color="#111111" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="검색어를 입력하세요"
                style={{
                  flex: 1, background: "none", border: "none", outline: "none",
                  fontFamily: FONTS.body, fontSize: "15px", color: "#111111",
                }}
              />
            </div>

            {/* 결과 / 인기 검색어 */}
            <div style={{ maxWidth: "860px", margin: "40px auto 0" }}>
              <p style={{
                fontFamily: FONTS.body, fontSize: "13px", color: "#111111",
                margin: "0 0 24px",
              }}>
                {q ? (hits.length ? "검색 결과" : "검색 결과가 없습니다") : "인기 검색어"}
              </p>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                gap: "24px",
              }}>
                {hits.map((p) => (
                  <Link
                    key={p.name}
                    href={`/product?season=${encodeURIComponent(p.season)}&product=${encodeURIComponent(p.name)}`}
                    onClick={onClose}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div style={{ position: "relative", width: "100%", aspectRatio: "1 / 1" }}>
                      <Image src={p.image} alt={p.name} fill sizes="160px" style={{ objectFit: "contain" }} />
                    </div>
                    <p style={{
                      fontFamily: FONTS.body, fontSize: "12px", color: "#111111",
                      margin: "14px 0 0", lineHeight: 1.4,
                    }}>
                      {p.name}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function SearchIcon({ color = "#fff" }: { color?: string }) {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
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
