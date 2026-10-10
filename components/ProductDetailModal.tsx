"use client";

// 상품 구매 팝업 — /product 페이지와 홈 모션 갤러리에서 함께 쓴다.
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { COLORS, FONTS } from "@/lib/assets";
import {
  SIZES, FONT_KO, DESC_KO,
  DETAIL_IMAGES, PRODUCT_INFO, DEFAULT_INFO,
  MODAL_W, MODAL_H, MODAL_PAD, THUMB_W, THUMB_COL_PAD, THUMB_COL_W,
  GALLERY_GAP, GALLERY_PAD_R, IMG_AREA_W, IMG_AREA_H, GALLERY_W,
  FRAME_RATIO, ADD_TO_CART_H,
  type Product, type CartItem, type SizeRow, type ShoeRow,
} from "@/lib/products";

function SizeTable({ rows }: { rows: SizeRow[] }) {
  const cell: React.CSSProperties = {
    fontFamily: FONT_KO, fontSize: "12px", letterSpacing: "-0.02em",
    padding: "9px 4px", textAlign: "center", color: "#999",
    borderBottom: "1px solid #f4f4f4", whiteSpace: "nowrap",
  };
  const head: React.CSSProperties = {
    ...cell, color: "#666", fontWeight: 600, borderBottom: "1px solid #e6e6e6",
  };

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {["", "총장", "어깨너비", "가슴단면", "소매길이"].map((h) => (
            <th key={h} style={head}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.size}>
            {/* 사이즈명은 좌측 정렬 + 진하게 — 표의 기준 열 */}
            <td style={{ ...cell, color: "#555", fontWeight: 600, textAlign: "left" }}>{r.size}</td>
            <td style={cell}>{r.length}</td>
            <td style={cell}>{r.shoulder}</td>
            <td style={cell}>{r.chest}</td>
            <td style={cell}>{r.sleeve}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// 신발용 사이즈표 — 사이즈(mm) / 발길이 / EU
function ShoeSizeTable({ rows }: { rows: ShoeRow[] }) {
  const cell: React.CSSProperties = {
    fontFamily: FONT_KO, fontSize: "12px", letterSpacing: "-0.02em",
    padding: "9px 4px", textAlign: "center", color: "#999",
    borderBottom: "1px solid #f4f4f4", whiteSpace: "nowrap",
  };
  const head: React.CSSProperties = {
    ...cell, color: "#666", fontWeight: 600, borderBottom: "1px solid #e6e6e6",
  };

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {["사이즈(mm)", "발길이", "EU"].map((h) => (
            <th key={h} style={{ ...head, textAlign: h === "사이즈(mm)" ? "left" : "center" }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.size}>
            <td style={{ ...cell, color: "#555", fontWeight: 600, textAlign: "left" }}>{r.size}</td>
            <td style={cell}>{r.footLength}</td>
            <td style={cell}>{r.eu}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// FREE 단일 사이즈 소품용 표 — 한 줄(FREE)에 품목별 실측 항목만 보여준다
function FreeSizeTable({ columns, values }: { columns: string[]; values: string[] }) {
  const cell: React.CSSProperties = {
    fontFamily: FONT_KO, fontSize: "12px", letterSpacing: "-0.02em",
    padding: "9px 4px", textAlign: "center", color: "#999",
    borderBottom: "1px solid #f4f4f4", whiteSpace: "nowrap",
  };
  const head: React.CSSProperties = {
    ...cell, color: "#666", fontWeight: 600, borderBottom: "1px solid #e6e6e6",
  };

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={head} />
          {columns.map((h) => <th key={h} style={head}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ ...cell, color: "#555", fontWeight: 600, textAlign: "left" }}>FREE</td>
          {values.map((v, i) => <td key={i} style={cell}>{v}</td>)}
        </tr>
      </tbody>
    </table>
  );
}

// 클릭하면 펼쳐지는 세부 정보 목록
function InfoAccordion({ items }: { items: { title: string; body: React.ReactNode }[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0); // 첫 항목은 펼친 채로 시작

  return (
    <div style={{ marginTop: "28px" }}>
      {items.map((item, i) => {
        const open = openIdx === i;
        return (
          <div key={item.title} style={{ borderTop: "1px solid #ececec" }}>
            <button
              onClick={() => setOpenIdx(open ? null : i)}
              aria-expanded={open}
              style={{
                width: "100%", padding: "18px 0",
                background: "none", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                fontFamily: FONT_KO, fontSize: "13px", fontWeight: 500,
                letterSpacing: "-0.02em", color: "#333", textAlign: "left",
              }}
            >
              {item.title}
              {/* +/− — 회전으로 상태를 표시 */}
              <motion.span
                animate={{ rotate: open ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ fontSize: "17px", lineHeight: 1, color: "#666", display: "inline-block" }}
              >
                +
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{ padding: "0 0 20px" }}>{item.body}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default function ProductDetailModal({ p, onClose, onAddToCart }: { p: Product; onClose: () => void; onAddToCart: (item: CartItem) => void }) {
  // 상세 컷이 등록된 상품은 지정 순서대로, 없으면 기존처럼 대표 이미지 6장
  const detailCuts = DETAIL_IMAGES[p.name];
  const thumbs = detailCuts ?? [p.image, p.image, p.image, p.image, p.image, p.image];

  // 상품 정보 — 신발류는 사이즈 버튼(230~270)과 표가 다르다
  const info = PRODUCT_INFO[p.name] ?? DEFAULT_INFO;
  const sizeOptions = info.sizes ?? SIZES;

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
        {/* 폭을 고정하지 않고 프레임 실제 크기를 따라가게 한다. 고정하면 화면이 낮아
            프레임이 줄었을 때 그만큼이 이미지와 썸네일 사이 빈 공간으로 남는다. */}
        <div ref={galleryRef} style={{
          flexShrink: 0, display: "flex", gap: `${GALLERY_GAP}px`,
          padding: `${MODAL_PAD}px ${GALLERY_PAD_R}px ${MODAL_PAD}px ${MODAL_PAD}px`,
          alignItems: "flex-start",
          minHeight: 0,
        }}>
          {/* 메인 이미지 — 계산된 프레임에 딱 맞아 상/하·좌/우 여백이 없다.
              클릭하면 확대해서 볼 수 있다. */}
          <div style={{ flexShrink: 0, display: "flex", alignItems: "flex-start" }}>
            <div
              onClick={() => setZoomed(true)}
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
                sizes={`${IMG_AREA_W}px`}
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
              좌우 안쪽 여백을 둬서 선택 테두리가 스크롤바나 열 경계에 닿지 않는다. */}
          <div
            className="thumb-scroll"
            style={{
              display: "flex", flexDirection: "column", gap: "8px",
              width: `${THUMB_COL_W}px`,
              padding: `0 ${THUMB_COL_PAD}px`,
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

          {/* 가격 */}
          <p style={{
            fontFamily: FONTS.condensed, fontWeight: 700,
            fontSize: "18px", color: "#050505",
            margin: "0 0 18px",
          }}>
            {p.price}
          </p>

          {/* 구분선 — 가격과 설명 사이 */}
          <div style={{ height: "1px", backgroundColor: "#f0f0f0", marginBottom: "18px" }} />

          {/* 사이즈 선택 */}
          <p style={{
            fontFamily: FONTS.condensed, fontWeight: 700, fontSize: "14px",
            letterSpacing: "-0.01em", textTransform: "uppercase",
            color: "#333", margin: "0 0 12px",
          }}>
            SIZE
          </p>
          <div style={{ display: "flex", gap: "10px", marginBottom: "28px", flexWrap: "wrap" }}>
            {sizeOptions.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                style={{
                  // FREE처럼 글자가 긴 단일 사이즈는 칸을 두 배로 넓힌다
                  width: size === "FREE" ? "88px" : "56px", height: "56px",
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
              width: "100%", height: `${ADD_TO_CART_H}px`,
              /* 세로 공간이 모자랄 때 flex가 버튼부터 눌러버리므로 축소를 막는다 */
              flexShrink: 0,
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

          {/* 세부 정보 — 클릭하면 펼쳐진다. 탭 구성은 모든 상품 동일(세부 정보/사이즈/
              소재 및 관리/배송 및 반품), 값을 안 채운 상품은 DEFAULT_INFO로 채운다. */}
          <InfoAccordion
            items={[
              {
                title: "세부 정보",
                body: (
                  <p style={{
                    fontFamily: FONT_KO, fontSize: "12px",
                    lineHeight: "1.7", color: "#999",
                    margin: 0, whiteSpace: "pre-line",
                    letterSpacing: "-0.02em", wordBreak: "keep-all",
                  }}>
                    {DESC_KO[p.desc] ?? ""}
                  </p>
                ),
              },
              {
                title: "사이즈",
                // 신발류는 mm 사이즈표, FREE 소품은 품목별 실측표, 의류는 총장/어깨/가슴/소매 표
                body: info.shoeTable
                  ? <ShoeSizeTable rows={info.shoeTable} />
                  : info.freeTable
                    ? <FreeSizeTable {...info.freeTable} />
                    : <SizeTable rows={info.sizeTable ?? DEFAULT_INFO.sizeTable!} />,
              },
              {
                title: "소재 및 관리",
                body: (
                  <div>
                    <p style={{
                      fontFamily: FONT_KO, fontSize: "12px", lineHeight: "1.7",
                      color: "#999", margin: 0,
                      letterSpacing: "-0.02em", wordBreak: "keep-all",
                    }}>
                      {(PRODUCT_INFO[p.name] ?? DEFAULT_INFO).material}
                    </p>
                    {(PRODUCT_INFO[p.name] ?? DEFAULT_INFO).care && (
                      <>
                        <p style={{
                          fontFamily: FONT_KO, fontSize: "12px", fontWeight: 600,
                          color: "#666", margin: "18px 0 6px", letterSpacing: "-0.02em",
                        }}>
                          관리 방법
                        </p>
                        <p style={{
                          fontFamily: FONT_KO, fontSize: "12px", lineHeight: "1.7",
                          color: "#999", margin: 0,
                          letterSpacing: "-0.02em", wordBreak: "keep-all",
                        }}>
                          {(PRODUCT_INFO[p.name] ?? DEFAULT_INFO).care}
                        </p>
                      </>
                    )}
                  </div>
                ),
              },
              {
                title: "배송 및 반품",
                body: (
                  <p style={{
                    fontFamily: FONT_KO, fontSize: "12px", lineHeight: "1.7",
                    color: "#999", margin: 0, letterSpacing: "-0.02em", wordBreak: "keep-all",
                  }}>
                    ₩200,000 이상 구매 시 무료 배송입니다.<br />
                    All MOLTYPE pieces arrive incomplete — by design.
                  </p>
                ),
              },
            ]}
          />
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
              /* 오버레이(fixed, inset:0)를 그대로 채운다.
                 이 페이지는 html에 CSS zoom이 걸려 있어 vw/vh가 배율만큼 줄어들므로,
                 뷰포트 단위 대신 부모를 채우는 방식으로 크기를 잡는다. */
              style={{
                position: "absolute",
                inset: 0,
              }}
            >
              <Image src={mainImg} alt={p.name} fill sizes="100vw" style={{ objectFit: "contain" }} />
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

