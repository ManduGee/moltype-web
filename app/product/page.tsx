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

const SIZES = ["XS", "S", "M", "L", "XL"] as const;

// 한글 설명은 DESC_KO에서 영문 설명을 키로 찾으므로, 상수로 묶어 양쪽이 어긋나지 않게 한다.
// 줄바꿈은 원문 그대로 유지한다 (렌더링 시 white-space: pre-line)
const DESC_TUNDRA_EN =
  "A statement outerwear piece that pairs exceptional warmth with\n" +
  "an effortlessly refined silhouette.\n" +
  "Crochet modules can be added to the sleeves and hood,\n" +
  "transforming the jacket into a personalized expression of style.";

// ─── 시즌별 상품 데이터 ────────────────────────────────────────────────────────
const SEASON_PRODUCTS = [
  // 0 — Spring
  [
    { id: 1,  name: "Spring 01", tag: "SPRING / 2026", desc: "A ribbed crop top with an open neckline. Designed to be completed.", image: "/assets/Spring/Website_Product_Asset_01.png", bg: "#F8FDF9", price: "₩ 128,000" },
    { id: 2,  name: "Spring 02", tag: "SPRING / 2026", desc: "Open-ended wear for open-ended use. Patch the flower or leave it.",   image: "/assets/Spring/Website_Product_Asset_02.png", bg: "#F8FDF9", price: "₩ 148,000" },
    { id: 3,  name: "Spring 03", tag: "SPRING / 2026", desc: "A pair of shorts with space left at the seam.",                       image: "/assets/Spring/Website_Product_Asset_03.png", bg: "#F8FDF9", price: "₩ 108,000" },
    { id: 4,  name: "Spring 04", tag: "SPRING / 2026", desc: "A wearable surface made to be interrupted. Same form, new skin.",     image: "/assets/Spring/Website_Product_Asset_04.png", bg: "#F8FDF9", price: "₩ 168,000" },
    { id: 5,  name: "Spring 05", tag: "SPRING / 2026", desc: "The seam is the question. You decide where it ends.",                 image: "/assets/Spring/Website_Product_Asset_05.png", bg: "#F8FDF9", price: "₩ 138,000" },
    { id: 6,  name: "Spring 06", tag: "SPRING / 2026", desc: "A ribbed crop top with an open neckline. Designed to be completed.",  image: "/assets/Spring/Website_Product_Asset_06.png", bg: "#F8FDF9", price: "₩ 128,000" },
    { id: 7,  name: "Spring 07", tag: "SPRING / 2026", desc: "Open-ended wear for open-ended use. Patch the flower or leave it.",   image: "/assets/Spring/Website_Product_Asset_07.png", bg: "#F8FDF9", price: "₩ 118,000" },
    { id: 8,  name: "Spring 08", tag: "SPRING / 2026", desc: "A pair of shorts with space left at the seam.",                       image: "/assets/Spring/Website_Product_Asset_08.png", bg: "#F8FDF9", price: "₩ 112,000" },
    { id: 9,  name: "Spring 09", tag: "SPRING / 2026", desc: "A wearable surface made to be interrupted. Same form, new skin.",     image: "/assets/Spring/Website_Product_Asset_09.png", bg: "#F8FDF9", price: "₩ 158,000" },
    { id: 10, name: "Spring 10", tag: "SPRING / 2026", desc: "The seam is the question. You decide where it ends.",                 image: "/assets/Spring/Website_Product_Asset_10.png", bg: "#F8FDF9", price: "₩ 142,000" },
  ],
  // 1 — Summer
  [
    { id: 1,  name: "Summer 01", tag: "SUMMER / 2026", desc: "A ribbed crop top with an open neckline. Designed to be completed.", image: "/assets/Summer/Website_Product_Asset_01.png", bg: "#F8FDF9", price: "₩ 128,000" },
    { id: 2,  name: "Summer 02", tag: "SUMMER / 2026", desc: "Open-ended wear for open-ended use. Patch the flower or leave it.",   image: "/assets/Summer/Website_Product_Asset_02.png", bg: "#F8FDF9", price: "₩ 148,000" },
    { id: 3,  name: "Summer 03", tag: "SUMMER / 2026", desc: "A pair of shorts with space left at the seam.",                       image: "/assets/Summer/Website_Product_Asset_03.png", bg: "#F8FDF9", price: "₩ 108,000" },
    { id: 4,  name: "Summer 04", tag: "SUMMER / 2026", desc: "A wearable surface made to be interrupted. Same form, new skin.",     image: "/assets/Summer/Website_Product_Asset_04.png", bg: "#F8FDF9", price: "₩ 168,000" },
    { id: 5,  name: "Summer 05", tag: "SUMMER / 2026", desc: "The seam is the question. You decide where it ends.",                 image: "/assets/Summer/Website_Product_Asset_05.png", bg: "#F8FDF9", price: "₩ 138,000" },
    { id: 6,  name: "Summer 06", tag: "SUMMER / 2026", desc: "A ribbed crop top with an open neckline. Designed to be completed.",  image: "/assets/Summer/Website_Product_Asset_06.png", bg: "#F8FDF9", price: "₩ 128,000" },
    { id: 7,  name: "Summer 07", tag: "SUMMER / 2026", desc: "Open-ended wear for open-ended use. Patch the flower or leave it.",   image: "/assets/Summer/Website_Product_Asset_07.png", bg: "#F8FDF9", price: "₩ 118,000" },
    { id: 8,  name: "Summer 08", tag: "SUMMER / 2026", desc: "A pair of shorts with space left at the seam.",                       image: "/assets/Summer/Website_Product_Asset_08.png", bg: "#F8FDF9", price: "₩ 108,000" },
    { id: 9,  name: "Summer 09", tag: "SUMMER / 2026", desc: "A wearable surface made to be interrupted. Same form, new skin.",     image: "/assets/Summer/Website_Product_Asset_09.png", bg: "#F8FDF9", price: "₩ 168,000" },
  ],
  // 2 — Autumn
  [
    { id: 1, name: "Autumn 01", tag: "AUTUMN / 2026", desc: "A wearable surface made to be interrupted. Same form, new skin.", image: "/assets/Fall/Website_Product_Asset_01.png", bg: "#F8FDF9", price: "₩ 158,000" },
    { id: 2, name: "Autumn 02", tag: "AUTUMN / 2026", desc: "A ribbed crop top with an open neckline. Designed to be completed.", image: "/assets/Fall/Website_Product_Asset_02.png", bg: "#F8FDF9", price: "₩ 128,000" },
    { id: 3, name: "Autumn 03", tag: "AUTUMN / 2026", desc: "The seam is the question. You decide where it ends.", image: "/assets/Fall/Website_Product_Asset_03.png", bg: "#F8FDF9", price: "₩ 138,000" },
    { id: 4, name: "Autumn 04", tag: "AUTUMN / 2026", desc: "A pair of shorts with space left at the seam.", image: "/assets/Fall/Website_Product_Asset_04.png", bg: "#F8FDF9", price: "₩ 108,000" },
    { id: 5, name: "Autumn 05", tag: "AUTUMN / 2026", desc: "Open-ended wear for open-ended use. Patch the flower or leave it.", image: "/assets/Fall/Website_Product_Asset_05.png", bg: "#F8FDF9", price: "₩ 98,000" },
    { id: 6, name: "Autumn 06", tag: "AUTUMN / 2026", desc: "A wearable surface made to be interrupted. Same form, new skin.", image: "/assets/Fall/Website_Product_Asset_06.png", bg: "#F8FDF9", price: "₩ 168,000" },
    { id: 7, name: "Autumn 07", tag: "AUTUMN / 2026", desc: "Open-ended wear for open-ended use. Patch the flower or leave it.", image: "/assets/Fall/Website_Product_Asset_07.png", bg: "#F8FDF9", price: "₩ 118,000" },
    { id: 8, name: "Autumn 08", tag: "AUTUMN / 2026", desc: "A wearable surface made to be interrupted. Same form, new skin.", image: "/assets/Fall/Website_Product_Asset_08.png", bg: "#F8FDF9", price: "₩ 148,000" },
    { id: 9, name: "Autumn 09", tag: "AUTUMN / 2026", desc: "A ribbed crop top with an open neckline. Designed to be completed.", image: "/assets/Fall/Website_Product_Asset_09.png", bg: "#F8FDF9", price: "₩ 128,000" },
  ],
  // 3 — Winter
  [
    { id: 1, name: "Tundra Fur Jacket", tag: "WINTER / 2026", desc: DESC_TUNDRA_EN, image: "/assets/Winter/Website_Product_Asset_01.png", bg: "#F8FDF9", price: "₩ 108,000" },
    { id: 2, name: "Winter 02", tag: "WINTER / 2026", desc: "A wearable surface made to be interrupted. Same form, new skin.", image: "/assets/Winter/Website_Product_Asset_02.png", bg: "#F8FDF9", price: "₩ 168,000" },
    { id: 3, name: "Winter 03", tag: "WINTER / 2026", desc: "A ribbed crop top with an open neckline. Designed to be completed.", image: "/assets/Winter/Website_Product_Asset_03.png", bg: "#F8FDF9", price: "₩ 128,000" },
    { id: 4, name: "Winter 04", tag: "WINTER / 2026", desc: "The seam is the question. You decide where it ends.", image: "/assets/Winter/Website_Product_Asset_04.png", bg: "#F8FDF9", price: "₩ 138,000" },
    { id: 5, name: "Winter 05", tag: "WINTER / 2026", desc: "Open-ended wear for open-ended use. Patch the flower or leave it.", image: "/assets/Winter/Website_Product_Asset_05.png", bg: "#F8FDF9", price: "₩ 98,000" },
    { id: 6,  name: "Winter 06", tag: "WINTER / 2026", desc: "A ribbed crop top with an open neckline. Designed to be completed.", image: "/assets/Winter/Website_Product_Asset_06.png", bg: "#F8FDF9", price: "₩ 128,000" },
    { id: 7,  name: "Winter 07", tag: "WINTER / 2026", desc: "Open-ended wear for open-ended use. Patch the flower or leave it.",   image: "/assets/Winter/Website_Product_Asset_07.png", bg: "#F8FDF9", price: "₩ 118,000" },
    { id: 8,  name: "Winter 08", tag: "WINTER / 2026", desc: "A pair of shorts with space left at the seam.",                       image: "/assets/Winter/Website_Product_Asset_08.png", bg: "#F8FDF9", price: "₩ 108,000" },
    { id: 9,  name: "Winter 09", tag: "WINTER / 2026", desc: "A wearable surface made to be interrupted. Same form, new skin.",     image: "/assets/Winter/Website_Product_Asset_09.png", bg: "#F8FDF9", price: "₩ 168,000" },
  ],
] as const;

type Product = typeof SEASON_PRODUCTS[number][number];

const SEASON_LABELS = ["Spring", "Summer", "Autumn", "Winter"] as const;

// ─── Product Detail Modal ─────────────────────────────────────────────────────
type CartItem = { name: string; size: string; price: string; image: string; product: Product };

const FONT_KO = "'SUIT','Pretendard',sans-serif";

// 영문 설명 → 한글 설명 (2줄) 매핑
const DESC_KO: Record<string, string> = {
  "A ribbed crop top with an open neckline. Designed to be completed.": "오픈 넥라인의 골지 크롭탑.\n마지막 완성은 당신의 손에 남겨두었습니다.",
  "Open-ended wear for open-ended use. Patch the flower or leave it.": "열린 쓰임을 위한 열린 옷.\n꽃을 달아도, 비워두어도 좋습니다.",
  "A pair of shorts with space left at the seam.": "솔기에 여백을 남긴 쇼츠.\n비어있는 자리가 곧 시작점이 됩니다.",
  "A wearable surface made to be interrupted. Same form, new skin.": "중단되기 위해 만들어진 입는 표면.\n같은 형태, 새로운 스킨.",
  "The seam is the question. You decide where it ends.": "솔기는 질문입니다.\n어디서 끝낼지는 당신이 정합니다.",
  [DESC_TUNDRA_EN]:
    "극한의 한파 속에서도 따뜻함을 유지하도록 설계된 Tundra Fur Jacket은 풍성한 퍼 텍스처와\n" +
    "가벼운 실루엣이 조화를 이루는 아우터입니다.\n" +
    "보온성을 극대화하면서도 둔탁한 겨울 아우터의 인상을 벗어나, 부드럽고 세련된 감성을 담았습니다.\n" +
    "또한 소매와 후드에는 다양한 뜨개 모듈을 자유롭게 부착할 수 있어,\n" +
    "계절과 취향에 따라 자신만의 스타일로 커스터마이징할 수 있습니다.",
};

// 상품별 상세 컷 — 등록된 상품은 상세 모달에서 이 순서 그대로 노출된다.
// 폴더명에 공백이 있어 URL 인코딩이 필요하다.
const detailCut = (season: string, product: string, files: string[]) =>
  files.map((f) => `/Product_Detail_Cut/${season}/${encodeURIComponent(product)}/${f}`);

const DETAIL_IMAGES: Record<string, string[]> = {
  // Front → Side → Back → Product Detail 01~04
  "Tundra Fur Jacket": detailCut("Winter", "Tundra Fur Jacket", [
    "Front.png",
    "Side_01.png",
    "Side_02.png",
    "Back.png",
    "Product_Detail_01.png",
    "Product_Detail_02.png",
    "Product_Detail_03.png",
    "Product_Detail_04.png",
  ]),
};

// ─── 상세 모달 레이아웃 (1920 기준 고정 px) ───────────────────────────────────
// 패널이 고정 크기라 이미지 프레임 크기를 직접 계산한다. 높이에만 맞추면 1:1 컷이
// 가로로 넘치고, 폭에만 맞추면 3:4 컷이 세로로 넘치므로 둘 다 만족하는 값을 쓴다.
const MODAL_W = 1380;
const MODAL_H = 960;
const MODAL_PAD = 28;        // 패널 좌우 바깥 여백 — 좌/우를 같게 맞춘다
const THUMB_W = 72;
const THUMB_COL_W = 84;      // 썸네일 + 스크롤바 자리 (썸네일이 잘리지 않게)
const GALLERY_GAP = 12;
const GALLERY_PAD_R = 16;    // 썸네일 열이 오른쪽 경계선에 붙어 선택 테두리가 잘리지 않게
const IMG_AREA_W = 636;      // 이미지 프레임 기준 폭 (에셋 제작 기준과 동일하게 고정)
const GALLERY_W = MODAL_PAD + IMG_AREA_W + GALLERY_GAP + THUMB_COL_W + GALLERY_PAD_R;
const IMG_AREA_H = MODAL_H - MODAL_PAD * 2;

// 프레임은 3:4로 고정한다. 컷마다 비율을 따라가게 두면 프레임 크기가 바뀌면서
// 하단 여백과 썸네일 스크롤바가 컷에 따라 생겼다 사라진다.
const FRAME_RATIO = 3 / 4;
// ADD TO CART 높이 — 이 값만 바꾸면 버튼 크기가 조정된다
const ADD_TO_CART_H = 240;

function ProductDetailModal({ p, onClose, onAddToCart }: { p: Product; onClose: () => void; onAddToCart: (item: CartItem) => void }) {
  // 상세 컷이 등록된 상품은 지정 순서대로, 없으면 기존처럼 대표 이미지 6장
  const detailCuts = DETAIL_IMAGES[p.name];
  const thumbs = detailCuts ?? [p.image, p.image, p.image, p.image, p.image, p.image];

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [mainImg, setMainImg] = useState(thumbs[0]);
  const [added, setAdded] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [cartHover, setCartHover] = useState(false);

  // 갤러리의 실제 높이를 재서 프레임과 썸네일 열 크기를 잡는다.
  // 상수(모달 1040px 기준)로 고정하면, 화면이 낮아 모달이 maxHeight로 잘릴 때
  // 썸네일 열이 패널 밖으로 넘쳐 마지막 컷을 고를 수 없게 된다.
  const galleryRef = useRef<HTMLDivElement>(null);
  const [galleryH, setGalleryH] = useState(IMG_AREA_H);

  useLayoutEffect(() => {
    const el = galleryRef.current;
    if (!el) return;
    // clientHeight는 패딩을 포함하므로 위/아래 패딩을 빼야 이미지에 쓸 높이가 된다
    const measure = () => setGalleryH(Math.max(0, el.clientHeight - MODAL_PAD * 2));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 배경(상품 목록)이 같이 스크롤되지 않도록 모달이 열려 있는 동안 body 스크롤을 잠근다
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const frameH = Math.min(galleryH, IMG_AREA_W / FRAME_RATIO);
  const frameW = frameH * FRAME_RATIO;

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
          /* 가로형 패널 — 높이를 넉넉히 잡아 ADD TO CART까지 스크롤 없이 들어온다 */
          width: `${MODAL_W}px`, maxWidth: "94vw",
          height: `${MODAL_H}px`, maxHeight: "96vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "row",
          position: "relative",
        }}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: MODAL_PAD, right: MODAL_PAD, zIndex: 10,
            background: "none", border: "none", cursor: "pointer",
            fontSize: "20px", color: "#333", lineHeight: 1,
          }}
        >
          ✕
        </button>

        {/* ── 왼쪽: 이미지 갤러리 — 큰 이미지가 앞(좌측), 썸네일이 뒤(우측) ── */}
        <div ref={galleryRef} style={{
          flex: `0 0 ${GALLERY_W}px`, display: "flex", gap: `${GALLERY_GAP}px`,
          padding: `${MODAL_PAD}px ${GALLERY_PAD_R}px ${MODAL_PAD}px ${MODAL_PAD}px`,
          alignItems: "flex-start",
          minHeight: 0,
        }}>
          {/* 메인 이미지 — 계산된 프레임에 딱 맞아 상/하·좌/우 여백이 없다.
              클릭하면 확대해서 볼 수 있다. */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "flex-start", justifyContent: "flex-start" }}>
            <div
              onClick={() => setZoomed(true)}
              title="클릭하면 크게 볼 수 있어요"
              style={{
                width: `${frameW}px`, height: `${frameH}px`,
                backgroundColor: "#ffffff",
                position: "relative",
                overflow: "hidden",
                cursor: "zoom-in",
                flexShrink: 0,
              }}
            >
              <Image
                src={mainImg}
                alt={p.name}
                fill
                sizes="640px"
                style={{
                  objectFit: "contain",
                  /* 상단 기준 정렬 — 프레임과 비율이 어긋나도 위쪽은 잘리지 않고
                     남거나 모자란 부분이 아래쪽으로 간다 */
                  objectPosition: "top",
                  transform: detailCuts ? undefined : "scale(1.12)",
                  transformOrigin: "top center",
                }}
              />
            </div>
          </div>

          {/* 썸네일 세로 목록 — 세로 스크롤만, 가로 스크롤바는 생기지 않게 한다.
              열 폭을 썸네일보다 넓게 잡아 스크롤바가 썸네일을 가리거나 자르지 않는다. */}
          <div
            className="thumb-scroll"
            style={{
              display: "flex", flexDirection: "column", gap: "8px",
              width: `${THUMB_COL_W}px`,
              height: `${frameH}px`,
              /* scroll(=항상 표시) — auto로 두면 선택한 컷의 비율에 따라 열 높이가 바뀌면서
                 스크롤바가 나타났다 사라져 보인다 */
              overflowY: "scroll", overflowX: "hidden", flexShrink: 0,
            }}
          >
            {thumbs.map((src, i) => (
              <div
                key={i}
                onClick={() => setMainImg(src)}
                style={{
                  width: `${THUMB_W}px`, height: "90px",
                  backgroundColor: "#ffffff",
                  cursor: "pointer",
                  border: mainImg === src && i === thumbs.indexOf(mainImg) ? `1.5px solid ${COLORS.pink}` : "1.5px solid transparent",
                  overflow: "hidden", position: "relative",
                  flexShrink: 0,
                }}
              >
                <Image src={src} alt={p.name} fill style={{ objectFit: "contain", padding: "6px" }} />
              </div>
            ))}
          </div>
        </div>

        {/* ── 오른쪽: 상품 정보 — 설명이 길어지면 이 영역만 스크롤 ── */}
        <div style={{
          flex: 1, minWidth: 0,
          padding: `${MODAL_PAD + 12}px ${MODAL_PAD}px ${MODAL_PAD}px 32px`,
          display: "flex", flexDirection: "column", gap: "0",
          borderLeft: "1px solid #f0f0f0",
          /* 높이를 넉넉히 잡아 평소엔 스크롤바가 뜨지 않는다.
             설명이 아주 긴 상품에서만 스크롤이 생기고, 내용이 잘리지는 않는다. */
          overflowY: "auto",
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

          {/* 가격 — 아래 간격(14 + 구분선 1 + 13 = 28)을 한글 설명~SIZE 간격과 맞춘다 */}
          <p style={{
            fontFamily: FONTS.condensed, fontWeight: 700,
            fontSize: "18px", color: "#050505",
            margin: "0 0 14px",
          }}>
            {p.price}
          </p>

          {/* 구분선 */}
          <div style={{ height: "1px", backgroundColor: "#f0f0f0", marginBottom: "13px" }} />

          {/* 설명 — 영문 2줄(Akkurat) + 한글 2줄(SUIT) */}
          <div style={{ margin: "0 0 28px" }}>
            <p style={{
              fontFamily: FONTS.akkurat, fontSize: "13px",
              lineHeight: "1.7", color: "#888",
              margin: "0 0 10px", whiteSpace: "pre-line",
              /* 전체 대문자는 긴 문단에서 가독성이 떨어져, 원문의 문장 첫 글자 대문자를 그대로 쓴다 */
              letterSpacing: "-0.01em",
            }}>
              {/* 줄바꿈은 원문 그대로 (white-space: pre-line) */}
              {p.desc}
            </p>
            <p style={{
              fontFamily: FONT_KO, fontSize: "12px",
              lineHeight: "1.7", color: "#999",
              margin: 0, whiteSpace: "pre-line",
              letterSpacing: "-0.02em", wordBreak: "keep-all",
            }}>
              {DESC_KO[p.desc] ?? ""}
            </p>
          </div>

          {/* 사이즈 선택 */}
          <p style={{
            fontFamily: FONTS.condensed, fontWeight: 700, fontSize: "14px",
            letterSpacing: "-0.01em", textTransform: "uppercase",
            color: "#333", margin: "0 0 12px",
          }}>
            SIZE
          </p>
          <div style={{ display: "flex", gap: "10px", marginBottom: "28px", flexWrap: "wrap" }}>
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                style={{
                  width: "56px", height: "56px",
                  border: selectedSize === size ? "2px solid #F77DA6" : "1px solid #ddd",
                  background: selectedSize === size ? "#F77DA6" : "#fff",
                  color: selectedSize === size ? "#ffffff" : "#333",
                  fontFamily: FONTS.condensed, fontSize: "14px",
                  letterSpacing: "-0.01em", cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {size}
              </button>
            ))}
          </div>

          {/* 장바구니 — 높이 고정. 남는 공간은 marginTop:auto로 버튼 위에 두어
              버튼이 패널 하단에 붙는다. */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            onMouseEnter={() => setCartHover(true)}
            onMouseLeave={() => setCartHover(false)}
            style={{
              marginTop: "auto",
              width: "100%", height: `${ADD_TO_CART_H}px`,
              /* 사이즈 선택 전 회색 → 선택 후 블랙 → 마우스를 올리면 핑크 */
              background: added
                ? COLORS.pink
                : selectedSize
                  ? (cartHover ? COLORS.pink : "#050505")
                  : "#e0e0e0",
              color: selectedSize ? "#fff" : "#aaa",
              border: "none", cursor: selectedSize ? "pointer" : "not-allowed",
              fontFamily: FONTS.condensed, fontWeight: 700,
              fontSize: "17px", letterSpacing: "-0.01em",
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

      {/* 이미지 확대 보기 — 메인 이미지를 클릭하면 열리고, 아무 곳이나 누르면 닫힌다 */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            key="zoom"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => { e.stopPropagation(); setZoomed(false); }}
            style={{
              position: "fixed", inset: 0, zIndex: 1100,
              background: "rgba(0,0,0,0.9)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "zoom-out",
            }}
          >
            <motion.div
              initial={{ scale: 0.94 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.94 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: "relative",
                height: "92vh",
                aspectRatio: String(FRAME_RATIO),
                maxWidth: "94vw",
              }}
            >
              <Image src={mainImg} alt={p.name} fill sizes="94vw" style={{ objectFit: "contain" }} />
            </motion.div>

            <button
              aria-label="Close zoom"
              onClick={(e) => { e.stopPropagation(); setZoomed(false); }}
              style={{
                position: "absolute", top: 24, right: 24,
                width: 44, height: 44, borderRadius: "50%",
                background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.5)",
                color: "#fff", fontSize: 18, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
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
