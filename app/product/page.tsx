"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import PageLayout from "@/components/PageLayout";
import BrandStoryHeroCarousel from "@/components/BrandStoryHeroCarousel";
import { PATTERNS, COLORS, FONTS } from "@/lib/assets";

const SIZES = ["XS", "S", "M", "L", "XL"] as const;

// ─── 시즌별 상품 데이터 ────────────────────────────────────────────────────────
const SEASON_PRODUCTS = [
  // 0 — Spring
  [
    { id: 1,  name: "Spring 01", tag: "SPRING / 2026", desc: "A ribbed crop top with an open neckline. Designed to be completed.", image: "/Spring_01.png", bg: "#F8FDF9", price: "₩ 128,000" },
    { id: 2,  name: "Spring 02", tag: "SPRING / 2026", desc: "Open-ended wear for open-ended use. Patch the flower or leave it.",   image: "/Spring_02.png", bg: "#F8FDF9", price: "₩ 148,000" },
    { id: 3,  name: "Spring 03", tag: "SPRING / 2026", desc: "A pair of shorts with space left at the seam.",                       image: "/Spring_03.png", bg: "#F8FDF9", price: "₩ 108,000" },
    { id: 4,  name: "Spring 04", tag: "SPRING / 2026", desc: "A wearable surface made to be interrupted. Same form, new skin.",     image: "/Spring_04.png", bg: "#F8FDF9", price: "₩ 168,000" },
    { id: 5,  name: "Spring 05", tag: "SPRING / 2026", desc: "The seam is the question. You decide where it ends.",                 image: "/Spring_05.png", bg: "#F8FDF9", price: "₩ 138,000" },
    { id: 6,  name: "Spring 06", tag: "SPRING / 2026", desc: "A ribbed crop top with an open neckline. Designed to be completed.",  image: "/Spring_06.png", bg: "#F8FDF9", price: "₩ 128,000" },
    { id: 7,  name: "Spring 07", tag: "SPRING / 2026", desc: "Open-ended wear for open-ended use. Patch the flower or leave it.",   image: "/Spring_07.png", bg: "#F8FDF9", price: "₩ 118,000" },
  ],
  // 1 — Summer
  [
    { id: 1,  name: "Summer 01", tag: "SUMMER / 2026", desc: "A ribbed crop top with an open neckline. Designed to be completed.", image: "/Summer_01.png", bg: "#F8FDF9", price: "₩ 128,000" },
    { id: 2,  name: "Summer 02", tag: "SUMMER / 2026", desc: "Open-ended wear for open-ended use. Patch the flower or leave it.",   image: "/Summer_02.png", bg: "#F8FDF9", price: "₩ 148,000" },
    { id: 3,  name: "Summer 03", tag: "SUMMER / 2026", desc: "A pair of shorts with space left at the seam.",                       image: "/Summer_03.png", bg: "#F8FDF9", price: "₩ 108,000" },
    { id: 4,  name: "Summer 04", tag: "SUMMER / 2026", desc: "A wearable surface made to be interrupted. Same form, new skin.",     image: "/Summer_04.png", bg: "#F8FDF9", price: "₩ 168,000" },
    { id: 5,  name: "Summer 05", tag: "SUMMER / 2026", desc: "The seam is the question. You decide where it ends.",                 image: "/Summer_05.png", bg: "#F8FDF9", price: "₩ 138,000" },
    { id: 6,  name: "Summer 06", tag: "SUMMER / 2026", desc: "A ribbed crop top with an open neckline. Designed to be completed.",  image: "/Summer_06.png", bg: "#F8FDF9", price: "₩ 128,000" },
    { id: 7,  name: "Summer 07", tag: "SUMMER / 2026", desc: "Open-ended wear for open-ended use. Patch the flower or leave it.",   image: "/Summer_07.png", bg: "#F8FDF9", price: "₩ 118,000" },
    { id: 8,  name: "Summer 08", tag: "SUMMER / 2026", desc: "A pair of shorts with space left at the seam.",                       image: "/Summer_08.png", bg: "#F8FDF9", price: "₩ 108,000" },
    { id: 9,  name: "Summer 09", tag: "SUMMER / 2026", desc: "A wearable surface made to be interrupted. Same form, new skin.",     image: "/Summer_09.png", bg: "#F8FDF9", price: "₩ 168,000" },
  ],
  // 2 — Autumn
  [
    { id: 1, name: "Autumn 01", tag: "AUTUMN / 2026", desc: "A wearable surface made to be interrupted. Same form, new skin.", image: "/Fall_01.png", bg: "#F8FDF9", price: "₩ 158,000" },
    { id: 2, name: "Autumn 02", tag: "AUTUMN / 2026", desc: "A ribbed crop top with an open neckline. Designed to be completed.", image: "/Fall_02.png", bg: "#F8FDF9", price: "₩ 128,000" },
    { id: 3, name: "Autumn 03", tag: "AUTUMN / 2026", desc: "The seam is the question. You decide where it ends.", image: "/Fall_03.png", bg: "#F8FDF9", price: "₩ 138,000" },
    { id: 4, name: "Autumn 04", tag: "AUTUMN / 2026", desc: "A pair of shorts with space left at the seam.", image: "/Fall_04.png", bg: "#F8FDF9", price: "₩ 108,000" },
    { id: 5, name: "Autumn 05", tag: "AUTUMN / 2026", desc: "Open-ended wear for open-ended use. Patch the flower or leave it.", image: "/Fall_05.png", bg: "#F8FDF9", price: "₩ 98,000" },
    { id: 6, name: "Autumn 06", tag: "AUTUMN / 2026", desc: "A wearable surface made to be interrupted. Same form, new skin.", image: "/Fall_06.png", bg: "#F8FDF9", price: "₩ 168,000" },
    { id: 7, name: "Autumn 07", tag: "AUTUMN / 2026", desc: "Open-ended wear for open-ended use. Patch the flower or leave it.", image: "/Fall_07.png", bg: "#F8FDF9", price: "₩ 118,000" },
    { id: 8, name: "Autumn 08", tag: "AUTUMN / 2026", desc: "A wearable surface made to be interrupted. Same form, new skin.", image: "/Fall_08.png", bg: "#F8FDF9", price: "₩ 148,000" },
    { id: 9, name: "Autumn 09", tag: "AUTUMN / 2026", desc: "A ribbed crop top with an open neckline. Designed to be completed.", image: "/Fall_09.png", bg: "#F8FDF9", price: "₩ 128,000" },
    { id: 10, name: "Autumn 10", tag: "AUTUMN / 2026", desc: "The seam is the question. You decide where it ends.", image: "/Fall_10.png", bg: "#F8FDF9", price: "₩ 138,000" },
  ],
  // 3 — Winter
  [
    { id: 1, name: "Winter 01", tag: "WINTER / 2026", desc: "A pair of shorts with space left at the seam.", image: "/Winter_01.png", bg: "#F8FDF9", price: "₩ 108,000" },
    { id: 2, name: "Winter 02", tag: "WINTER / 2026", desc: "A wearable surface made to be interrupted. Same form, new skin.", image: "/Winter_02.png", bg: "#F8FDF9", price: "₩ 168,000" },
    { id: 3, name: "Winter 03", tag: "WINTER / 2026", desc: "A ribbed crop top with an open neckline. Designed to be completed.", image: "/Winter_03.png", bg: "#F8FDF9", price: "₩ 128,000" },
    { id: 4, name: "Winter 04", tag: "WINTER / 2026", desc: "The seam is the question. You decide where it ends.", image: "/Winter_04.png", bg: "#F8FDF9", price: "₩ 138,000" },
    { id: 5, name: "Winter 05", tag: "WINTER / 2026", desc: "Open-ended wear for open-ended use. Patch the flower or leave it.", image: "/Winter_05.png", bg: "#F8FDF9", price: "₩ 98,000" },
    { id: 6,  name: "Winter 06", tag: "WINTER / 2026", desc: "A ribbed crop top with an open neckline. Designed to be completed.", image: "/Winter_06.png", bg: "#F8FDF9", price: "₩ 128,000" },
    { id: 7,  name: "Winter 07", tag: "WINTER / 2026", desc: "Open-ended wear for open-ended use. Patch the flower or leave it.",   image: "/Winter_07.png", bg: "#F8FDF9", price: "₩ 118,000" },
    { id: 8,  name: "Winter 08", tag: "WINTER / 2026", desc: "A pair of shorts with space left at the seam.",                       image: "/Winter_08.png", bg: "#F8FDF9", price: "₩ 108,000" },
    { id: 9,  name: "Winter 09", tag: "WINTER / 2026", desc: "A wearable surface made to be interrupted. Same form, new skin.",     image: "/Winter_09.png", bg: "#F8FDF9", price: "₩ 168,000" },
    { id: 10, name: "Winter 10", tag: "WINTER / 2026", desc: "The seam is the question. You decide where it ends.",                 image: "/Winter_10.png", bg: "#F8FDF9", price: "₩ 138,000" },
  ],
] as const;

type Product = typeof SEASON_PRODUCTS[number][number];

const SEASON_LABELS = ["Spring", "Summer", "Autumn", "Winter"] as const;

// ─── Product Detail Modal ─────────────────────────────────────────────────────
type CartItem = { name: string; size: string; price: string; image: string; product: Product };

function ProductDetailModal({ p, onClose, onAddToCart }: { p: Product; onClose: () => void; onAddToCart: (item: CartItem) => void }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [mainImg, setMainImg] = useState(p.image);
  const [added, setAdded] = useState(false);

  // 썸네일: 메인 이미지를 포함해 동일 이미지 3장 (실제 상품별 다중 이미지로 교체 가능)
  const thumbs = [p.image, p.image, p.image];

  const handleAddToCart = () => {
    if (!selectedSize) return;
    onAddToCart({ name: p.name, size: selectedSize, price: p.price, image: p.image, product: p });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
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
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      {/* Modal panel */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          width: "min(90vw, 960px)",
          maxHeight: "90vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "row",
          position: "relative",
        }}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16, zIndex: 10,
            background: "none", border: "none", cursor: "pointer",
            fontSize: "20px", color: "#333", lineHeight: 1,
          }}
        >
          ✕
        </button>

        {/* ── 왼쪽: 이미지 갤러리 ─────────────────────────────── */}
        <div style={{ flex: "0 0 55%", display: "flex", gap: "10px", padding: "24px" }}>
          {/* 썸네일 세로 목록 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "72px" }}>
            {thumbs.map((src, i) => (
              <div
                key={i}
                onClick={() => setMainImg(src)}
                style={{
                  width: "72px", height: "90px",
                  backgroundColor: p.bg,
                  cursor: "pointer",
                  border: mainImg === src && i === thumbs.indexOf(mainImg) ? "1.5px solid #050505" : "1.5px solid transparent",
                  overflow: "hidden", position: "relative",
                  flexShrink: 0,
                }}
              >
                <Image src={src} alt={p.name} fill style={{ objectFit: "contain", padding: "6px" }} />
              </div>
            ))}
          </div>

          {/* 메인 이미지 */}
          <div style={{
            flex: 1, backgroundColor: p.bg,
            position: "relative", aspectRatio: "3 / 4",
          }}>
            <Image src={mainImg} alt={p.name} fill style={{ objectFit: "contain", padding: "24px" }} />
          </div>
        </div>

        {/* ── 오른쪽: 상품 정보 ────────────────────────────────── */}
        <div style={{
          flex: "0 0 45%",
          padding: "48px 32px 32px",
          display: "flex", flexDirection: "column", gap: "0",
          borderLeft: "1px solid #f0f0f0",
        }}>
          {/* 태그 */}
          <p style={{
            fontFamily: FONTS.condensed, fontSize: "13px",
            letterSpacing: "-0.02em", textTransform: "uppercase",
            color: COLORS.pink, margin: "0 0 10px",
          }}>
            {p.tag}
          </p>

          {/* 제품명 */}
          <h2 style={{
            fontFamily: FONTS.condensed, fontWeight: 700,
            fontSize: "clamp(18px, 2vw, 26px)", letterSpacing: "-0.02em",
            textTransform: "uppercase", color: "#050505",
            margin: "0 0 12px",
          }}>
            {p.name}
          </h2>

          {/* 가격 */}
          <p style={{
            fontFamily: FONTS.condensed, fontWeight: 700,
            fontSize: "18px", color: "#050505",
            margin: "0 0 24px",
          }}>
            {p.price}
          </p>

          {/* 구분선 */}
          <div style={{ height: "1px", backgroundColor: "#f0f0f0", marginBottom: "24px" }} />

          {/* 설명 */}
          <p style={{
            fontFamily: FONTS.body, fontSize: "12px",
            lineHeight: "1.8", color: "#888",
            margin: "0 0 28px",
          }}>
            {p.desc}
          </p>

          {/* 사이즈 선택 */}
          <p style={{
            fontFamily: FONTS.condensed, fontSize: "10px",
            letterSpacing: "-0.01em", textTransform: "uppercase",
            color: "#333", margin: "0 0 10px",
          }}>
            SIZE
          </p>
          <div style={{ display: "flex", gap: "8px", marginBottom: "28px", flexWrap: "wrap" }}>
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                style={{
                  width: "48px", height: "48px",
                  border: selectedSize === size ? "2px solid #F77DA6" : "1px solid #ddd",
                  background: "#fff",
                  color: selectedSize === size ? "#F77DA6" : "#333",
                  fontFamily: FONTS.condensed, fontSize: "12px",
                  letterSpacing: "-0.01em", cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {size}
              </button>
            ))}
          </div>

          {/* 장바구니 */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            style={{
              width: "100%", height: "52px",
              background: added ? "#F77DA6" : selectedSize ? "#050505" : "#e0e0e0",
              color: selectedSize ? "#fff" : "#aaa",
              border: "none", cursor: selectedSize ? "pointer" : "not-allowed",
              fontFamily: FONTS.condensed, fontWeight: 700,
              fontSize: "13px", letterSpacing: "-0.01em",
              textTransform: "uppercase",
              transition: "background 0.2s",
              marginBottom: "12px",
            }}
          >
            {added ? "✓  ADDED TO CART" : "ADD TO CART"}
          </button>

          {/* 사이즈 미선택 안내 */}
          {!selectedSize && (
            <p style={{
              fontFamily: FONTS.body, fontSize: "11px",
              color: COLORS.pink, textAlign: "center", margin: 0,
            }}>
              Please select a size
            </p>
          )}

          {/* 구분선 */}
          <div style={{ height: "1px", backgroundColor: "#f0f0f0", margin: "24px 0 16px" }} />

          {/* 안내 텍스트 */}
          <p style={{
            fontFamily: FONTS.body, fontSize: "10px",
            color: "#bbb", lineHeight: "1.7", margin: 0,
            letterSpacing: "-0.02em",
          }}>
            All MOLTYPE pieces arrive incomplete — by design.<br />
            Free shipping on orders over ₩100,000.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProductPage() {
  const [seasonIndex, setSeasonIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const products = SEASON_PRODUCTS[seasonIndex];

  const handleAddToCart = (item: CartItem) => {
    setCartItems(prev => [...prev, item]);
  };

  return (
    <PageLayout>
      {/* ── 상단 Hero 캐러셀 ─────────────────────────────────────────────── */}
      <BrandStoryHeroCarousel activeIndex={seasonIndex} onChange={setSeasonIndex} autoPlay={false} loopVideo={true} />

      {/* ── Scroll to Explore ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 24px 8px" }}
      >
        <div style={{ width: "1px", height: "20px", marginBottom: "12px", overflow: "hidden", position: "relative" }}>
          <motion.div
            animate={{ height: ["0px", "20px", "0px"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: "1px", backgroundColor: "#999", position: "absolute", bottom: 0 }}
          />
        </div>
        <p style={{
          fontFamily: FONTS.body, fontSize: "11px",
          letterSpacing: "-0.01em", textTransform: "uppercase",
          color: "#999", margin: 0,
        }}>
          Scroll To Explore
        </p>
      </motion.div>

      {/* ── 시즌 레이블 ──────────────────────────────────────────────────── */}
      <div style={{ padding: "32px 56px 0", display: "flex", alignItems: "center", gap: "16px" }}>
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
              color: "#050505", margin: 0, lineHeight: 1,
            }}
          >
            {SEASON_LABELS[seasonIndex]}
          </motion.p>
        </AnimatePresence>
        <div style={{ flex: 1, height: "1px", backgroundColor: "#ebebeb" }} />
        <p style={{
          fontFamily: FONTS.body, fontSize: "11px",
          letterSpacing: "0em", color: "#aaaaaa",
          margin: 0, textTransform: "uppercase",
        }}>
          {products.length} items
        </p>
      </div>

      {/* ── 상품 그리드 ──────────────────────────────────────────────────── */}
      <section style={{ padding: "40px 56px 100px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={seasonIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "56px 32px",
            }}
          >
            {products.map((p, i) => (
              <ProductCard
                key={`${seasonIndex}-${p.id}-${i}`}
                p={p}
                index={i}
                onClick={() => setSelectedProduct(p)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Product_Spring_Line divider */}
      <div style={{ overflow: "hidden", margin: "0 0 0", display: "flex" }}>
        <img src="/Product_Spring_Line.png" alt="" style={{ width: "50%", height: "20px", objectFit: "cover" }} />
        <img src="/Product_Spring_Line.png" alt="" style={{ width: "50%", height: "20px", objectFit: "cover" }} />
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
                      onClick={() => setCartItems(prev => prev.filter((_, idx) => idx !== i))}
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
                <button style={{
                  width: "100%", height: "52px",
                  background: "#F77DA6", color: "#fff",
                  border: "none", cursor: "pointer",
                  fontFamily: FONTS.condensed, fontWeight: 700,
                  fontSize: "13px", letterSpacing: "-0.01em",
                  textTransform: "uppercase",
                }}>
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
