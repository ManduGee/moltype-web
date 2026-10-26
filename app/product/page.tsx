"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import {
  motion, AnimatePresence, animate,
  useMotionValue, useVelocity, useSpring, useTransform, useMotionValueEvent,
} from "framer-motion";
import Image from "next/image";
import PageLayout from "@/components/PageLayout";
import BrandStoryHeroCarousel from "@/components/BrandStoryHeroCarousel";
import { PATTERNS, COLORS, FONTS } from "@/lib/assets";
import ProductDetailModal from "@/components/ProductDetailModal";
import { useCart } from "@/components/CartProvider";
import {
  SEASON_PRODUCTS, SEASON_LABELS, FONT_KO,
  type Product, type CartItem,
} from "@/lib/products";

// ─── Product card ─────────────────────────────────────────────────────────────
function ProductCard({ p, index, onClick }: { p: Product; index: number; onClick: () => void }) {
  const [hov, setHov] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      {/* ── Image area ─────────────────────────────────────── */}
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "3 / 4",
        backgroundColor: p.bg,
        overflow: "hidden",
        marginBottom: "20px",
      }}>
        <Image
          src={p.image}
          alt={p.name}
          fill
          sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 30vw"
          style={{
            objectFit: "contain",
            padding: "28px",
            transition: "transform 0.55s cubic-bezier(0.16,1,0.3,1)",
            transform: hov ? "scale(1.15)" : "scale(1)",
          }}
        />

        {/* Hover: thin pattern strip at bottom */}
        <AnimatePresence>
          {hov && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              style={{
                position: "absolute",
                bottom: 0, left: 0, right: 0,
                height: "20px",
                overflow: "hidden",
                transformOrigin: "left",
              }}
            >
              <img
                src="/Product_Graphic_Line.png"
                alt=""
                style={{ width: "100%", height: "20px", objectFit: "cover" }}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ── Info ───────────────────────────────────────────── */}
      <div>
        <p style={{
          fontFamily: FONTS.condensed, fontSize: "11px",
          letterSpacing: "-0.02em", textTransform: "uppercase",
          color: hov ? COLORS.pink : COLORS.green,
          margin: "0 0 6px", transition: "color 0.3s",
        }}>
          {p.tag}
        </p>
        <h3 style={{
          fontFamily: FONTS.condensed, fontWeight: 700,
          fontSize: "14px", letterSpacing: "-0.02em",
          textTransform: "uppercase", color: "#050505",
          margin: "0 0 4px",
        }}>
          {p.name}
        </h3>
        <p style={{
          fontFamily: FONTS.condensed, fontSize: "13px",
          color: "#888", margin: 0,
        }}>
          {p.price}
        </p>
      </div>
    </motion.article>
  );
}

// ─── THE RACK — 옷장 행거 브라우징 (무한 루프 + 원근 스케일) ───────────────────
// 드래그로 옷을 밀어 넘기고, 중앙에 온 옷이 가장 크고 선명, 양옆은 점점 작아진다.
// 무한 루프라 좌우 여백이 없고, 레일 이동 속도에 따라 옷걸이가 스윙한다.
const RACK_ITEM_W = 380;        // 아이템 폭
const RACK_SPACING = 210;       // 오프셋(드래그/스냅) 단위 — 아이템당 이동량
const RACK_HALF = 8;            // 중앙 기준 좌우로 렌더할 슬롯 수
const RACK_CENTER_SPREAD = 300; // 중앙 부근 간격을 넓히는 양
const RACK_SPREAD_SIGMA = 1.3;  // 넓힘이 감쇠하는 거리

function RackSlot({ slotIndex, offset, product, railRot }: {
  slotIndex: number; offset: any; product: Product; railRot: any;
}) {
  const rel     = useTransform(offset, (o: number) => slotIndex - o / RACK_SPACING); // 중앙 기준 거리(아이템 단위)
  // 중앙 부근일수록 간격을 넓힌다 (선형 간격 + 중앙 가우시안 확장)
  const xPos    = useTransform(rel, (r) => {
    const s = Math.sign(r), a = Math.abs(r);
    return s * (RACK_SPACING * a + RACK_CENTER_SPREAD * RACK_SPREAD_SIGMA * (1 - Math.exp(-a / RACK_SPREAD_SIGMA)));
  });
  const scale   = useTransform(rel, (r) => Math.max(0.5, 1.5 - Math.abs(r) * 0.3));
  const opacity = useTransform(rel, (r) => Math.max(0.22, 1 - Math.abs(r) * 0.34));
  const zIndex  = useTransform(rel, (r) => Math.round(100 - Math.abs(r) * 10));

  return (
    <motion.div
      style={{
        position: "absolute", top: 0, left: "50%",
        width: RACK_ITEM_W, marginLeft: -RACK_ITEM_W / 2,
        x: xPos, scale, opacity, zIndex,
        rotate: railRot, transformOrigin: "50% 6%",
        cursor: "pointer",
      }}
    >
      {/* 옷걸이+옷 통짜 에셋 (300×320 비율 = 900×960). 전용 에셋(/assets/)이 있으면 사용, 없으면 기본 에셋 */}
      <img
        src={product.image.startsWith("/assets/") ? product.image : "/Website_Product_Asset.png"}
        alt={product.name}
        draggable={false}
        style={{
          width: "100%", aspectRatio: "300 / 320", objectFit: "contain",
          display: "block",
          pointerEvents: "none", userSelect: "none",
        }}
      />
    </motion.div>
  );
}

function HangerRack({ products, onSelect }: { products: readonly Product[]; onSelect: (p: Product) => void }) {
  const n = products.length;
  const offset = useMotionValue(0);
  const [base, setBase] = useState(0);       // 현재 중앙 슬롯 인덱스(정수)
  const [centerProd, setCenterProd] = useState(0);

  const drag = useRef({ active: false, startX: 0, startOffset: 0, moved: false });
  const tap = useRef({ lastT: 0, timer: null as ReturnType<typeof setTimeout> | null });
  const containerRef = useRef<HTMLDivElement>(null);
  const vel = useVelocity(offset);
  const railRot = useSpring(useTransform(vel, [-2000, 2000], [10, -10]), { stiffness: 150, damping: 12 });

  const wrap = (i: number) => ((i % n) + n) % n;

  useMotionValueEvent(offset, "change", (o) => {
    const c = Math.round(o / RACK_SPACING);
    setBase((prev) => (prev !== c ? c : prev));
    setCenterProd(wrap(c));
  });

  const snapToOffsetIndex = (i: number) =>
    animate(offset, i * RACK_SPACING, { type: "spring", stiffness: 190, damping: 28 });

  const onPointerDown = (e: React.PointerEvent) => {
    offset.stop();
    drag.current = { active: true, startX: e.clientX, startOffset: offset.get(), moved: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 4) d.moved = true;
    offset.set(d.startOffset - dx);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);

    if (d.moved) {
      // 드래그 → 관성 스냅
      const projected = offset.get() + vel.get() * 0.12;
      snapToOffsetIndex(Math.round(projected / RACK_SPACING));
      return;
    }

    // 탭(드래그 아님) → 더블탭이면 상세 오픈, 싱글탭이면 좌우 이동
    const now = performance.now();
    const rect = containerRef.current?.getBoundingClientRect();
    const relX = rect ? e.clientX - rect.left - rect.width / 2 : 0;

    if (now - tap.current.lastT < 300) {
      // 더블클릭 → 중앙 상품 상세
      if (tap.current.timer) { clearTimeout(tap.current.timer); tap.current.timer = null; }
      tap.current.lastT = 0;
      onSelect(products[wrap(Math.round(offset.get() / RACK_SPACING))]);
    } else {
      tap.current.lastT = now;
      const dir = relX > 60 ? 1 : relX < -60 ? -1 : 0;
      if (tap.current.timer) clearTimeout(tap.current.timer);
      tap.current.timer = setTimeout(() => {
        tap.current.timer = null;
        if (dir !== 0) snapToOffsetIndex(Math.round(offset.get() / RACK_SPACING) + dir);
      }, 300);
    }
  };

  const slots = [];
  for (let k = -RACK_HALF; k <= RACK_HALF; k++) {
    const slotIndex = base + k;
    slots.push(
      <RackSlot
        key={slotIndex}
        slotIndex={slotIndex}
        offset={offset}
        product={products[wrap(slotIndex)]}
        railRot={railRot}
      />
    );
  }

  const focused = products[centerProd];

  return (
    <div>
      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          position: "relative", overflow: "hidden",
          height: "640px", touchAction: "pan-y", cursor: "grab",
          userSelect: "none",
        }}
      >
        {/* 행거 레일 봉 — 에셋 고리 위치(약 34px)에 맞춤, 은은하게 */}
        <div style={{
          position: "absolute", top: "44px", left: 0, right: 0,
          height: "4px",
          background: "linear-gradient(180deg, #e0e0e0 0%, #b5b5b5 60%, #d6d6d6 100%)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
          opacity: 0.5,
          zIndex: 0,
        }} />
        <div style={{ position: "absolute", top: "34px", left: 0, right: 0, bottom: 0 }}>
          {slots}
        </div>
      </div>

      {/* 포커스된 옷 정보 */}
      <div style={{ textAlign: "center", padding: "16px 24px 0", minHeight: "72px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={centerProd}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
          >
            <p style={{
              fontFamily: FONTS.condensed, fontWeight: 700,
              fontSize: "20px", letterSpacing: "-0.02em", textTransform: "uppercase",
              color: "#050505", margin: "0 0 4px",
            }}>
              {focused?.name}
            </p>
            <p style={{ fontFamily: FONTS.body, fontSize: "13px", color: "#888", margin: 0 }}>
              {focused?.price}
            </p>
          </motion.div>
        </AnimatePresence>
        <p style={{
          fontFamily: FONTS.body, fontSize: "11px", color: "#bbb",
          margin: "20px 0 0", letterSpacing: "0.1em",
        }}>
          DRAG · DOUBLE-CLICK TO OPEN
        </p>
      </div>
    </div>
  );
}

export default function ProductPage() {
  const [seasonIndex, setSeasonIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  // 장바구니는 전역(CartProvider)에서 관리한다 — 페이지를 옮겨도 유지된다
  const { items: cartItems, add: addCartItem, removeAt: removeCartItem, clear: clearCart } = useCart();
  const [showCart, setShowCart] = useState(false);
  const products = SEASON_PRODUCTS[seasonIndex];

  // ── 딥링크 — /product?season=Autumn&product=Pastel%20Grung%20Knit ─────────
  // 모션 갤러리에서 특정 상품으로 바로 들어올 때 쓴다. useSearchParams 대신
  // location.search를 읽는 이유: 이 페이지는 정적 생성 대상이라 useSearchParams를 쓰면
  // Suspense 경계 없이는 프로덕션 빌드가 실패한다.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const season = params.get("season");
    const name = params.get("product");
    if (!season && !name) return;

    const idx = SEASON_LABELS.findIndex(
      s => s.toLowerCase() === (season ?? "").toLowerCase(),
    );
    if (idx >= 0) setSeasonIndex(idx);

    if (name) {
      // 시즌이 지정됐으면 그 시즌에서, 아니면 전체에서 이름으로 찾는다
      const pool = idx >= 0 ? SEASON_PRODUCTS[idx] : SEASON_PRODUCTS.flat();
      const found = pool.find(p => p.name.toLowerCase() === name.toLowerCase());
      if (found) setSelectedProduct(found);
    }
  }, []);

  const handleAddToCart = (item: CartItem) => {
    addCartItem(item);
  };

  return (
    <PageLayout>
      {/* ── 상단 Hero 캐러셀 ─────────────────────────────────────────────── */}
      <BrandStoryHeroCarousel activeIndex={seasonIndex} onChange={setSeasonIndex} autoPlay={false} loopVideo={true} />

      {/* ── 시즌 레이블 + 랙 — 한 섹션에 묶어 스크롤 시 함께 한 화면에 담김 ── */}
      <section style={{ minHeight: "1015px", display: "flex", flexDirection: "column", justifyContent: "center", padding: "20px 0 60px" }}>
      {/* 시즌 레이블 + 좌우 화살표 — 이름 정중앙, 화살표는 글자 양옆 40px */}
      <div style={{ height: "48px", display: "flex", alignItems: "center", justifyContent: "center", gap: "40px" }}>
        {/* 이전 계절 */}
        <button
          onClick={() => setSeasonIndex((seasonIndex - 1 + SEASON_LABELS.length) % SEASON_LABELS.length)}
          aria-label="Previous season"
          style={{
            flexShrink: 0,
            background: "none", border: "1px solid #dcdcdc", borderRadius: "50%",
            width: "34px", height: "34px", cursor: "pointer", color: "#555",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.pink; e.currentTarget.style.color = COLORS.pink; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#dcdcdc"; e.currentTarget.style.color = "#555"; }}
        >
          &#8592;
        </button>

        {/* 시즌 이름 — 가장 긴 이름 기준 고정 너비라 화살표 위치가 흔들리지 않음 */}
        <div style={{ width: "220px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={seasonIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              style={{
                fontFamily: FONTS.condensed, fontWeight: 700,
                fontSize: "clamp(19px, 2.67vw, 37px)",
                letterSpacing: "-0.02em", textTransform: "uppercase",
                color: "#050505", margin: 0, lineHeight: 1, textAlign: "center", whiteSpace: "nowrap",
              }}
            >
              {SEASON_LABELS[seasonIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* 다음 계절 */}
        <button
          onClick={() => setSeasonIndex((seasonIndex + 1) % SEASON_LABELS.length)}
          aria-label="Next season"
          style={{
            flexShrink: 0,
            background: "none", border: "1px solid #dcdcdc", borderRadius: "50%",
            width: "34px", height: "34px", cursor: "pointer", color: "#555",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.pink; e.currentTarget.style.color = COLORS.pink; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#dcdcdc"; e.currentTarget.style.color = "#555"; }}
        >
          &#8594;
        </button>
      </div>

      {/* THE RACK — 행거 브라우징 */}
      <div style={{ width: "100%", marginTop: "40px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={seasonIndex}
            initial={{ x: 340, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -340, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <HangerRack
              products={products}
              onSelect={(p) => setSelectedProduct(p)}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      </section>

      {/* 하단 그래픽 라인 — 20px 위로 */}
      <div style={{ overflow: "hidden", display: "flex", marginTop: "-20px" }}>
        <img src="/Web_Graphic_Line_01.jpg" alt="" style={{ width: "100%", height: "20px", objectFit: "cover" }} />
      </div>

      {/* Footer note */}
      <div style={{ padding: "28px 56px", textAlign: "center" }}>
        <p style={{
          fontFamily: FONTS.body, fontSize: "9px",
          letterSpacing: "-0.01em", color: "#C0C0C0", textTransform: "uppercase",
        }}>
          All items arrive incomplete — by design.
        </p>
      </div>

      {/* ── 상품 상세 모달 ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal
            key={selectedProduct.name}
            p={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>
      {/* ── 플로팅 장바구니 버튼 ─────────────────────────────────────────── */}
      <AnimatePresence>
        {cartItems.length > 0 && (
          <motion.button
            key="cart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => setShowCart(true)}
            style={{
              position: "fixed", bottom: 32, right: 32, zIndex: 500,
              width: 56, height: 56,
              background: "#F77DA6",
              border: "none", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", boxShadow: "0 4px 20px rgba(247,125,166,0.4)",
            }}
          >
            {/* 장바구니 아이콘 */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {/* 수량 뱃지 */}
            <span style={{
              position: "absolute", top: -4, right: -4,
              background: "#050505", color: "#fff",
              fontSize: "10px", fontFamily: "sans-serif", fontWeight: 700,
              borderRadius: "50%", width: 18, height: 18,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {cartItems.length}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── 장바구니 드로어 ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCart(false)}
            style={{
              position: "fixed", inset: 0,
              backgroundColor: "rgba(0,0,0,0.4)", zIndex: 600,
              display: "flex", justifyContent: "flex-end",
            }}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "min(90vw, 380px)", height: "100%",
                background: "#fff",
                display: "flex", flexDirection: "column",
                padding: "32px 24px",
                overflowY: "auto",
                gap: "0",
              }}
            >
              {/* 헤더 */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
                <h2 style={{ fontFamily: FONTS.condensed, fontWeight: 700, fontSize: "18px", letterSpacing: "-0.02em", margin: 0 }}>
                  CART ({cartItems.length})
                </h2>
                <button onClick={() => setShowCart(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "#333" }}>✕</button>
              </div>

              {/* 아이템 목록 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>
                {cartItems.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid #f0f0f0" }}>
                    <div
                      onClick={() => { setShowCart(false); setSelectedProduct(item.product); }}
                      style={{ width: 64, height: 80, background: "#fafafa", position: "relative", flexShrink: 0, cursor: "pointer" }}
                    >
                      <Image src={item.image} alt={item.name} fill style={{ objectFit: "contain", padding: "6px" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: FONTS.condensed, fontWeight: 700, fontSize: "13px", letterSpacing: "-0.02em", margin: "0 0 4px", textTransform: "uppercase" }}>{item.name}</p>
                      <p style={{ fontFamily: FONTS.body, fontSize: "11px", color: "#999", margin: "0 0 4px" }}>SIZE: {item.size}</p>
                      <p style={{ fontFamily: FONTS.condensed, fontSize: "13px", color: "#050505", margin: 0 }}>{item.price}</p>
                    </div>
                    <button
                      onClick={() => removeCartItem(i)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#bbb", fontSize: "14px", padding: "4px" }}
                    >✕</button>
                  </div>
                ))}
              </div>

              {/* 합계 + 결제 버튼 */}
              <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "20px", marginTop: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                  <span style={{ fontFamily: FONTS.condensed, fontSize: "13px", letterSpacing: "-0.01em" }}>TOTAL</span>
                  <span style={{ fontFamily: FONTS.condensed, fontWeight: 700, fontSize: "15px" }}>
                    ₩ {cartItems.reduce((sum, item) => sum + parseInt(item.price.replace(/[^0-9]/g, "")), 0).toLocaleString()}
                  </span>
                </div>
                <button
                  // 결제 연동 전까지는 "주문 완료"에 해당하는 동작으로 장바구니를 비운다
                  onClick={() => { clearCart(); setShowCart(false); }}
                  style={{
                    width: "100%", height: "52px",
                    background: "#F77DA6", color: "#fff",
                    border: "none", cursor: "pointer",
                    fontFamily: FONTS.condensed, fontWeight: 700,
                    fontSize: "13px", letterSpacing: "-0.01em",
                    textTransform: "uppercase",
                  }}
                >
                  CHECKOUT
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}

