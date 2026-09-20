"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { FONTS } from "@/lib/assets";
import { HEADER_H } from "@/components/Header";

// 플로팅 모션 갤러리 — Mobjournal 레퍼런스.
// 작은 모션 카드 10장이 화면 가장자리에 흩어져 떠 있고, 가운데엔 큰 카피가 있다.
// 빈 곳을 더블클릭하면 첫 카드가 중앙으로 날아와 크게 재생되고, 휠·방향키·클릭으로 넘길 때마다
// 지금 카드는 제자리로 돌아가고 다음 카드가 날아온다. 다시 더블클릭(또는 Esc)하면 원래대로.
//   중앙 카드 클릭     → 다음 카드
//   중앙 카드 더블클릭 → 이 모션과 이어지는 상품 상세로 이동
//   우상단 버튼        → 소리 켜기/끄기
//
// 파일: public/Main_Motion/Image_<id>.png(썸네일) · Motion_<id>.mp4(모션). 현재 5쌍(01·02·04·05·06).
const TILES = ["01", "02", "04", "05", "06"];

// 각 모션이 이어지는 상품. (/product 는 이 두 쿼리를 읽어 해당 시즌·상품을 바로 펼친다)
// 썸네일 내용 기준으로 연결했다 — 01 설원+레그워머, 02 데이지 속 얼굴, 04 핑크 크로셰 드레스,
// 05 민트 수트, 06 핑크 퍼 코트+레이어드 스커트
const TILE_PRODUCT: Record<string, { season: string; product: string }> = {
  "01": { season: "Winter", product: "Frozen Bloom Dress" },
  "02": { season: "Summer", product: "Bloom Veil" },
  "04": { season: "Spring", product: "Blooming Garden Dress" },
  "05": { season: "Spring", product: "Bloom Tailored Jacket" },
  "06": { season: "Winter", product: "Tundra Fur Jacket" },
};

// 갤러리 섹션의 앵커. 상품 페이지에서 뒤로 돌아왔을 때 여기로 곧장 스크롤한다.
export const GALLERY_ID = "motion-gallery";

// 상품으로 나갈 때 남기는 표시. 홈이 이 값을 보면 로고 인트로·뜨개 체험을 건너뛰고
// 갤러리로 바로 보낸다(읽은 쪽에서 지운다 — 그냥 새로고침하면 다시 인트로부터).
export const RETURN_TO_GALLERY_KEY = "moltype:return-to-gallery";

const productHref = (id: string) => {
  const m = TILE_PRODUCT[id];
  if (!m) return "/product";
  return `/product?season=${encodeURIComponent(m.season)}&product=${encodeURIComponent(m.product)}`;
};

// 카드 10장 — 5개 모션 × 2. 화면 가장자리를 따라 흩어 놓고 가운데(카피 자리)는 비운다.
//   x, y : 화면 안 위치(%), 카드 중심 기준
//   w    : 카드 폭(vw). 레퍼런스처럼 작고 크기가 제각각이어야 한다.
//   float: 떠다니는 주기(초)
// 크기를 크게 벌려(4~13vw) 제각각으로 두고, 몇 장은 일부러 화면 밖으로 걸친다(x<0, x>100, y>100).
// 윗줄은 고정 헤더(80px) 아래로, 가운데 띠(카피)는 비워 둔다.
//   rotate: 기본 기울기(도). 진짜 카드를 흩어 놓은 것처럼 제각각. 중앙으로 날아오면 0으로 펴진다.
const CARDS = [
// 크기 차이는 두되(11~18vw) 작은 카드도 충분히 보이는 범위로 — 너무 작으면 존재감이 없다.
// 위 4장 · 가운데 양옆 2장 · 아래 4장으로 나눠 상하 균형을 맞춘다. 윗줄은 헤더(80px)에 닿지 않게.
// 모션 5개 × 2장. 같은 모션이 나란히 붙지 않게 배치했다.
  { id: "01", x: 10,  y: 31, w: 18,  rotate: -7,  float: 8.0 },  // 큼
  { id: "02", x: 33,  y: 22, w: 11,  rotate: -62, float: 8.8 }, // 카피 왼쪽 위 — 거의 눕힌 각도
  { id: "04", x: 71,  y: 23, w: 10,  rotate: -22, float: 10.2 }, // 왼쪽으로 기울여 안쪽으로
  { id: "06", x: 92,  y: 28, w: 15,  rotate: 6,   float: 9.0 },  // 큼, 오른쪽으로 잘림
  { id: "05", x: 2,   y: 62, w: 12,  rotate: -12, float: 10.6 }, // 왼쪽으로 잘림
  { id: "01", x: 88,  y: 58, w: 12,  rotate: -9,  float: 8.4 },
  { id: "06", x: 16,  y: 87, w: 16,  rotate: 5,   float: 9.8 },  // 큼, 아래로 잘림
  { id: "02", x: 36,  y: 86, w: 13.5, rotate: -20, float: 9.5 }, // 왼쪽으로 기울여 조금 크게
  { id: "05", x: 58,  y: 90, w: 15,  rotate: 18,  float: 8.2 },  // 오른쪽으로 기울여 크게, 아래로 잘림
  { id: "04", x: 78,  y: 80, w: 14,  rotate: 9,   float: 9.3 },
];
const CARD_MIN = 70;  // px
const CARD_MAX = 420; // px

const CARD_RATIO = 1445 / 1089; // 세로 / 가로 (썸네일 기준)
// 영상 비율 캐시 — 한 번 메타데이터를 읽으면 같은 세션에서 다시 계산하지 않는다
const VIDEO_RATIO: Record<string, number> = {};

// 중앙으로 날아온 카드의 크기(화면 높이 대비)
const FOCUS_VH = 0.9;

// 휠로 넘길 때 연속 입력을 이 시간(ms) 동안 무시한다 — 한 번 굴리면 딱 한 장만
const WHEEL_COOLDOWN = 700;
// 클릭 vs 더블클릭 구분 대기(ms)
const DBLCLICK_WAIT = 260;

export default function MotionScatterGallery() {
  const router = useRouter();
  // focus: 카드가 중앙에 와 있는 모드. current: 중앙에 온 "카드"의 인덱스(CARDS 기준).
  // 같은 모션의 카드가 여러 장이라 모션 번호가 아니라 카드 번호를 들고 있어야,
  // 더블클릭한 바로 그 카드가 날아온다(예전엔 같은 모션의 첫 카드가 대신 날아왔다).
  const [focus, setFocus] = useState(false);
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [soundOn, setSoundOn] = useState(false);

  // 화면 크기 — 카드를 제자리에서 중앙까지 px로 옮기려면 실제 크기가 필요하다
  const [vp, setVp] = useState({ w: 1920, h: 1080 });
  useEffect(() => {
    const read = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  // 넘기기 — 모션 순서(TILES)를 따라가되, 각 모션은 첫 번째 카드가 날아온다
  const step = (dir: 1 | -1) =>
    setCurrent((c) => {
      const m = TILES.indexOf(CARDS[c].id);
      const nextId = TILES[(m + dir + TILES.length) % TILES.length];
      return CARDS.findIndex((card) => card.id === nextId);
    });
  const next = useCallback(() => step(1), []);
  const prev = useCallback(() => step(-1), []);

  const sectionRef = useRef<HTMLDivElement>(null);

  // 등장 — 섹션이 화면의 40% 이상 들어오면 한 번만. 카드들이 중앙 한 점에서 방사형으로
  // 퍼져 나가 제자리를 찾고, 그 뒤에 카피가 떠오른다.
  const revealed = useInView(sectionRef, { once: true, amount: 0.4 });

  // 포커스 모드에 들어가면 섹션을 화면에 딱 맞춘다. 카드 위치는 섹션 기준이라, 섹션이
  // 위로 조금 밀려 있으면 중앙에 온 카드의 아래가 화면 밖으로 잘린다.
  useEffect(() => {
    if (!focus) return;
    sectionRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [focus]);

  // 휠 — 포커스 모드에선 페이지 스크롤 대신 카드를 넘긴다(passive: false 로 막아야 한다)
  const wheelLock = useRef(0);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !focus) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - wheelLock.current < WHEEL_COOLDOWN) return;
      if (Math.abs(e.deltaY) < 8) return;
      wheelLock.current = now;
      if (e.deltaY > 0) next(); else prev();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [focus, next, prev]);

  // 방향키 / Esc
  useEffect(() => {
    if (!focus) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
      else if (e.key === "Escape") setFocus(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focus, next, prev]);

  // 중앙 카드: 클릭은 다음 카드, 더블클릭은 상품 — 첫 클릭을 잠시 기다려 구분한다
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (clickTimer.current) clearTimeout(clickTimer.current); }, []);
  const onCenterClick = () => {
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => { clickTimer.current = null; next(); }, DBLCLICK_WAIT);
  };
  const goToProduct = (id: string) => {
    if (clickTimer.current) { clearTimeout(clickTimer.current); clickTimer.current = null; }
    // 뒤로 돌아왔을 때 인트로를 다시 보지 않고 갤러리로 바로 오도록 표시를 남긴다
    try { sessionStorage.setItem(RETURN_TO_GALLERY_KEY, "1"); } catch {}
    router.push(productHref(id));
  };

  return (
    <section
      id={GALLERY_ID}
      ref={sectionRef}
      // 빈 곳 더블클릭 → 포커스 모드 켜기/끄기
      onDoubleClick={() => setFocus((f) => !f)}
      style={{
        position: "relative",
        background: "#000000",
        height: "100vh",
        overflow: "hidden",
        cursor: "default",
        userSelect: "none",
      }}
    >
      {/* 중앙 카피 — 포커스 모드에선 물러난다.
          정렬은 바깥 div(flex)가 맡는다 — motion 요소에 transform으로 정렬을 걸면
          framer가 자기 transform(scale)으로 덮어써 버린다. */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        pointerEvents: "none", zIndex: 1,
      }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{
          opacity: revealed && !focus ? 1 : 0,
          y: revealed ? 0 : 16,
          scale: focus ? 0.96 : 1,
        }}
        // 카드들이 퍼져 나간 뒤에 등장한다
        transition={{ duration: 0.7, delay: revealed && !focus ? 0.75 : 0, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: "center" }}
      >
        <p style={{
          fontFamily: FONTS.condensed, fontWeight: 700,
          fontSize: "clamp(40px, 5.6vw, 100px)",
          lineHeight: 0.98, letterSpacing: "-0.02em", textTransform: "uppercase",
          color: "#ffffff", margin: 0,
        }}>
          Thread by Thread,<br />It becomes Yours.
        </p>
      </motion.div>
      </div>

      {/* 카드들 */}
      {CARDS.map((c, i) => (
        <FloatingCard
          key={i}
          index={i}
          cfg={c}
          vp={vp}
          revealed={revealed}
          isCurrent={focus && current === i}
          dimmed={focus && current !== i}
          hovered={hovered === i && !focus}
          soundOn={soundOn}
          onEnter={() => setHovered(i)}
          onLeave={() => setHovered(null)}
          onClick={onCenterClick}
          // 평소: 그 카드의 모션으로 포커스 모드 진입 / 포커스 모드의 중앙 카드: 상품으로
          onDoubleClick={() => {
            if (focus && current === i) goToProduct(c.id);
            else { setCurrent(i); setFocus(true); }
          }}
        />
      ))}

      {/* 포커스 모드 UI — 소리 토글 / 진행 / 닫기 */}
      <AnimatePresence>
        {focus && (
          <motion.div
            key="focus-ui"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onDoubleClick={(e) => e.stopPropagation()}
            style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 200 }}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setSoundOn((s) => !s); }}
              aria-label={soundOn ? "Mute" : "Unmute"}
              style={{ ...ROUND_BTN, top: 100, right: 80 }}
            >
              <SoundIcon on={soundOn} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setFocus(false); }}
              aria-label="Close"
              style={{ ...ROUND_BTN, top: 100, right: 24, color: "#fff", fontSize: 18 }}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

const ROUND_BTN: React.CSSProperties = {
  position: "absolute", pointerEvents: "auto",
  width: 44, height: 44, borderRadius: "50%",
  background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.5)",
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", backdropFilter: "blur(4px)",
};

// 카드 한 장 — 평소엔 제자리에서 살짝 떠다니고, 자기 차례가 되면 중앙으로 날아와 커진다.
function FloatingCard({
  index, cfg, vp, revealed, isCurrent, dimmed, hovered, soundOn, onEnter, onLeave, onClick, onDoubleClick,
}: {
  index: number;
  cfg: (typeof CARDS)[number];
  vp: { w: number; h: number };
  revealed: boolean; isCurrent: boolean; dimmed: boolean; hovered: boolean; soundOn: boolean;
  onEnter: () => void; onLeave: () => void; onClick: () => void; onDoubleClick: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // 등장 시차는 처음 퍼져 나갈 때만. 그 뒤(포커스 모드에서 제자리로 돌아올 때 등)엔 바로 움직인다.
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    if (!revealed) return;
    const t = setTimeout(() => setSettled(true), 1400);
    return () => clearTimeout(t);
  }, [revealed]);

  // 제자리(px)와 중앙까지의 거리, 그리고 중앙에서의 배율.
  // 카드 폭의 기준을 화면 폭만이 아니라 높이에도 묶는다 — 가로로 넓고 세로가 짧은 화면에서
  // 폭 기준으로만 키우면 카드가 카피 영역을 침범한다.
  const sizeBase = Math.min(vp.w, vp.h * 1.6);
  const baseW = Math.min(CARD_MAX, Math.max(CARD_MIN, (cfg.w / 100) * sizeBase));
  const baseH = baseW * CARD_RATIO;
  const posX = (cfg.x / 100) * vp.w;
  const posY = (cfg.y / 100) * vp.h;
  // 중앙 목표는 화면 전체가 아니라 "고정 헤더 아래 영역"의 중앙이다. 화면 중앙에 맞추면
  // 카드 윗부분이 헤더에 가려진다. 크기도 그 영역 기준으로 잡아 위아래가 절대 잘리지 않게 한다.
  const areaTop = HEADER_H;
  const areaH = vp.h - HEADER_H;

  // 영상의 실제 비율(세로/가로). 썸네일 비율과 다르면 카드를 썸네일 비율로 두고 영상을 채울 때
  // 위아래가 잘린다. 그래서 중앙에 올 때는 카드 자체를 영상 비율로 만든다 — 그러면 영상이
  // 잘릴 일이 없다. 비율은 메타데이터가 오면 알 수 있고, 한 번 알면 다음부턴 바로 쓴다.
  const [videoRatio, setVideoRatio] = useState<number | undefined>(VIDEO_RATIO[cfg.id]);
  const focusRatio = videoRatio ?? CARD_RATIO;
  // 영상 크기가 읽히는 시점이 브라우저·캐시 상태에 따라 달라서(loadedmetadata가 리스너보다
  // 먼저 지나가기도 한다) 이벤트뿐 아니라 마운트·중앙 진입 시점에도 직접 읽는다.
  const readRatio = () => {
    const v = videoRef.current;
    if (!v || !v.videoWidth || !v.videoHeight) return;
    const r = v.videoHeight / v.videoWidth;
    if (VIDEO_RATIO[cfg.id] !== r) VIDEO_RATIO[cfg.id] = r;
    setVideoRatio((prev) => (prev === r ? prev : r));
  };
  useEffect(() => { readRatio(); }, [isCurrent]); // eslint-disable-line react-hooks/exhaustive-deps
  const targetH = Math.min(FOCUS_VH * areaH, 0.92 * vp.w * focusRatio);
  const targetW = targetH / focusRatio;

  // 놓일 자리(px, 좌상단 기준) — 평소 / 중앙 / 등장 전
  const restBox  = { left: posX - baseW / 2, top: posY - baseH / 2, width: baseW, height: baseH };
  const focusBox = { left: vp.w / 2 - targetW / 2, top: areaTop + areaH / 2 - targetH / 2, width: targetW, height: targetH };
  const seedBox  = { left: vp.w / 2 - baseW * 0.1, top: areaTop + areaH / 2 - baseH * 0.1, width: baseW * 0.2, height: baseH * 0.2 };

  // 중앙에 온 동안만 재생. src도 그때 붙인다(영상이 무거워서).
  const ensurePlaying = () => {
    const v = videoRef.current;
    if (v && isCurrent && v.paused) v.play().catch(() => {});
  };
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isCurrent) { v.currentTime = 0; ensurePlaying(); }
    else v.pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCurrent]);
  useEffect(() => {
    const v = videoRef.current;
    if (v) v.muted = !(isCurrent && soundOn);
  }, [isCurrent, soundOn]);

  const drift = 6;

  return (
    <motion.div
      // 바깥: 제자리 ↔ 중앙 이동. scale 대신 실제 크기(width/height)를 움직인다 —
      // 중앙에서는 카드 비율 자체가 영상 비율로 바뀌어야 하기 때문.
      // 등장 전엔 화면 중앙에 작게 모여 있다가(initial), 섹션이 보이면 방사형으로 퍼져 나간다.
      initial={{ ...seedBox, opacity: 0, rotate: 0 }}
      animate={
        !revealed
          ? { ...seedBox, opacity: 0, rotate: 0 }
          : isCurrent
          // 중앙으로 날아오며 똑바로 선다
          ? { ...focusBox, rotate: 0, opacity: 1 }
          : { ...restBox, rotate: cfg.rotate, opacity: 1 }
      }
      transition={
        isCurrent
          ? { type: "spring", stiffness: 120, damping: 20, mass: 0.9 }
          // 퍼져 나갈 때는 카드마다 조금씩 시차를 둔다
          : { type: "spring", stiffness: 90, damping: 18, mass: 1, delay: revealed && !settled ? index * 0.055 : 0 }
      }
      style={{
        position: "absolute",
        zIndex: isCurrent ? 100 : hovered ? 20 : 2,
      }}
    >
      <motion.div
        // 안쪽: 떠다니는 idle + 호버/딤
        animate={
          isCurrent
            // 중앙에선 떠다니던 기울기·흔들림을 전부 0으로 — 안 그러면 흔들리던 각도가 남아 살짝 기운다
            ? { y: 0, rotate: 0, scale: 1, opacity: 1 }
            : {
                y: [0, -drift, 0, drift * 0.6, 0],
                // 떠다니면서 기울기도 아주 살짝 흔들린다 — 바닥에 놓인 게 아니라 떠 있는 카드
                rotate: [0, 1.2, 0, -1, 0],
                opacity: dimmed ? 0.28 : 1,
                scale: hovered ? 1.08 : 1,
              }
        }
        transition={
          isCurrent
            ? { duration: 0.3 }
            : {
                y: { duration: cfg.float, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: cfg.float * 1.15, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 0.4 },
                scale: { type: "spring", stiffness: 300, damping: 22 },
              }
        }
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onClick={(e) => { if (isCurrent) { e.stopPropagation(); onClick(); } }}
        // 섹션의 더블클릭(포커스 토글)으로 번지지 않게 막고, 카드 자체의 더블클릭으로 처리한다
        onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick(); }}
        style={{
          position: "absolute", inset: 0,
          borderRadius: isCurrent ? "4px" : "2px",
          overflow: "hidden",
          background: "#111",
          cursor: isCurrent ? "pointer" : "default",
          // 겹친 카드 위로 떨어지는 그림자 — 검은 배경에선 안 보이지만 다른 카드 위에 겹칠 때
          // 위 카드가 아래 카드를 어둡게 눌러 앞뒤가 읽힌다. 가까운 진한 그림자 + 넓게 퍼지는 그림자 두 겹.
          boxShadow: isCurrent
            ? "0 60px 140px rgba(0,0,0,0.85)"
            : "0 6px 14px rgba(0,0,0,0.7), 0 24px 56px rgba(0,0,0,0.65)",
        }}
      >
        <Image
          src={`/Main_Motion/Image_${cfg.id}.png`}
          alt={`Motion ${cfg.id}`}
          fill
          // 중앙에 오면 화면을 거의 채우므로 그 크기에 맞는 해상도를 받아둔다
          sizes="(max-width: 900px) 92vw, 1000px"
          draggable={false}
          style={{ objectFit: "cover", pointerEvents: "none" }}
          priority={index < 5}
        />
        <motion.video
          ref={videoRef}
          // src는 항상 두되 metadata만 미리 받는다(비율을 알기 위해). 본편은 중앙에 왔을 때 play()로.
          src={`/Main_Motion/Motion_${cfg.id}.mp4`}
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedMetadata={readRatio}
          onCanPlay={() => { readRatio(); ensurePlaying(); }}
          initial={false}
          animate={{ opacity: isCurrent ? 1 : 0 }}
          transition={{ duration: 0.5, delay: isCurrent ? 0.3 : 0 }}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            // 카드가 영상 비율이라 contain == cover. 혹시 비율을 아직 모를 때도 잘리지는 않게 contain.
            objectFit: "contain", pointerEvents: "none",
            background: "#000",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

function SoundIcon({ on }: { on: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="4 9 8 9 12 5 12 19 8 15 4 15 4 9" fill="#fff" stroke="none" />
      {on ? (
        <>
          <path d="M16.5 8.5a5 5 0 0 1 0 7" />
          <path d="M19 6a9 9 0 0 1 0 12" />
        </>
      ) : (
        <path d="M17 9l5 6M22 9l-5 6" />
      )}
    </svg>
  );
}
