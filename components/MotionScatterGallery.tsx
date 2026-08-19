"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FONTS } from "@/lib/assets";

// 대각선 모션 갤러리 — 카드들이 왼쪽 아래에서 오른쪽 위로 비스듬히 겹쳐 쌓인다.
// 카드를 고르면 스택에서 쑥 뽑혀 나온 뒤 전체화면 영상으로 이어진다.
//
// 05는 영상 원본이 GitHub 100MB 제한을 넘어 저장소에 올라가지 않는다. 이미지는 함께 노출하고,
// 영상을 못 불러오면 안내 문구를 띄운다(로컬에는 파일이 있어 정상 재생된다).
const TILES = ["01", "02", "03", "04", "05", "06"];

// 각 모션이 이어지는 상품. 전체화면에서 CLICK! 을 누르면 이 상품의 상세로 이동한다.
// (/product 는 이 두 쿼리를 읽어 해당 시즌·상품을 바로 펼친다)
const TILE_PRODUCT: Record<string, { season: string; product: string }> = {
  "01": { season: "Autumn", product: "Pastel Grung Knit" },
  "02": { season: "Autumn", product: "Office Contrast Jacket" },
  "03": { season: "Summer", product: "Ribbon Doll Knit" },
  "04": { season: "Summer", product: "Bloom Veil" },
  "05": { season: "Spring", product: "Blooming Garden Dress" },
  "06": { season: "Spring", product: "Bloom Tailored Jacket" },
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

// 스테이지 기준 치수(px). 카드 좌표는 전부 이 값에 대한 비율(%)로 환산하므로,
// 스테이지 폭이 달라져도 배치가 그대로 유지된다.
const STAGE_W = 1800;
const CARD_W = 400;
const CARD_H = Math.round(CARD_W * (1537 / 1080)); // 원본 비율 569
const STEP_X = Math.round((STAGE_W - CARD_W) / (TILES.length - 1)); // 280
const STEP_Y = 56; // 오른쪽으로 갈수록 위로 올라가는 정도
const STAGE_H = STEP_Y * (TILES.length - 1) + CARD_H; // 849

// 스테이지 높이 상한(화면 높이 대비). 실제 카드 크기는 여기서 결정된다 —
// 카드가 커 보이게 하려면 이 값을 올리거나 STEP_Y를 줄여 카드 비중을 키우면 된다.
const STAGE_MAX_VH = 72;

// 전체화면 오버레이는 헤더(z-index 10050)보다 위에 있어야 한다.
// 그렇지 않으면 헤더가 우상단의 소리/닫기 버튼을 덮어 눌리지도, 보이지도 않는다.
const OVERLAY_Z = 11000;

const pct = (v: number, total: number) => `${(v / total) * 100}%`;

export default function MotionScatterGallery() {
  // pulling: 스택에서 뽑히는 중인 카드 / playing: 전체화면 재생 중인 카드
  const [pulling, setPulling] = useState<string | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const pullTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (pullTimer.current) clearTimeout(pullTimer.current); }, []);

  const pick = (id: string) => {
    if (pulling) return;
    setPulling(id);
    // 뽑히는 모션이 끝난 뒤 전체화면으로 이어붙인다
    pullTimer.current = setTimeout(() => setPlaying(id), 380);
  };

  const close = () => {
    if (pullTimer.current) clearTimeout(pullTimer.current);
    setPlaying(null);
    setPulling(null);
  };

  return (
    <section id={GALLERY_ID} style={{
      background: "#000000",
      // 위 여백을 크게 둬서 뜨개 인터랙션(과 HAND MODE 버튼)과 화면상에서 확실히 분리하고,
      // 아래에도 검은 여백을 남겨 카드가 화면 끝에 붙지 않게 한다.
      padding: "min(60vh, 420px) 0 180px",
      overflow: "hidden",
    }}>
      {/* 대각선 스테이지 — 가로를 거의 꽉 채우되, 세로가 화면을 넘어 카드가 잘리지 않도록
          높이 상한(64vh)에서 역산한 폭으로도 제한한다. 비율이 고정이라 배치는 그대로 축소된다. */}
      <div style={{
        position: "relative",
        width: `min(${STAGE_W}px, 96vw, calc(${STAGE_MAX_VH}vh * ${(STAGE_W / STAGE_H).toFixed(4)}))`,
        aspectRatio: `${STAGE_W} / ${STAGE_H}`,
        margin: "0 auto",
      }}>
        {TILES.map((id, i) => {
          const isPulling = pulling === id;
          const isHovered = hovered === id && !pulling;
          return (
            <motion.button
              key={id}
              onClick={() => pick(id)}
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered(null)}
              aria-label={`Play motion ${id}`}
              animate={{
                // 뽑히는 순간: 위로 솟아오르며 커지고, 다른 카드는 뒤로 물러난다
                y: isPulling ? -90 : isHovered ? -22 : 0,
                scale: isPulling ? 1.22 : isHovered ? 1.05 : 1,
                opacity: pulling && !isPulling ? 0.25 : 1,
              }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              style={{
                position: "absolute",
                left: pct(i * STEP_X, STAGE_W),
                bottom: pct(i * STEP_Y, STAGE_H),
                width: pct(CARD_W, STAGE_W),
                height: pct(CARD_H, STAGE_H),
                borderRadius: "10px",
                overflow: "hidden",
                border: "none",
                padding: 0,
                cursor: "pointer",
                background: "#111",
                boxShadow: isPulling
                  ? "0 40px 80px rgba(0,0,0,0.7)"
                  : "0 14px 34px rgba(0,0,0,0.55)",
                // 오른쪽 카드가 앞에 오도록. 뽑히는 카드는 항상 최상단
                zIndex: isPulling ? 50 : i,
              }}
            >
              <Image
                src={`/Main_Motion/Website_main_M_${id}.jpg`}
                alt={`Motion ${id}`}
                fill
                sizes="(max-width: 900px) 45vw, 400px"
                draggable={false}
                style={{ objectFit: "cover", pointerEvents: "none" }}
                priority={i < 3}
              />

              {/* 딤 — 다른 카드에 마우스를 올리면 이 카드를 어둡게 깔아 대비를 준다.
                  framer 대신 CSS 트랜지션을 쓴다. framer는 애니메이션 프레임이 돌기 전까지
                  opacity를 안 써서, 그 사이 기본값 1로 카드가 새까맣게 덮일 수 있다. */}
              <span
                style={{
                  position: "absolute", inset: 0,
                  background: "#000000",
                  opacity: hovered && !isHovered && !pulling ? 0.6 : 0,
                  transition: "opacity 0.25s ease-out",
                  pointerEvents: "none",
                }}
              />
            </motion.button>
          );
        })}
      </div>

      {/* 클릭 유도 힌트 — 메인 로고 인터랙션과 같은 탭 애니메이션 + CLICK!.
          카드 아래 중앙에 둔다. 재생 중에는 숨긴다. */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "36px" }}>
        <AnimatePresence>{!playing && <TapHint />}</AnimatePresence>
      </div>

      <AnimatePresence>
        {playing && <FullscreenMotion id={playing} onClose={close} />}
      </AnimatePresence>
    </section>
  );
}

function FullscreenMotion({ id, onClose }: { id: string; onClose: () => void }) {
  // 메인 로고 모션과 같은 방식 — 소리를 켠 채로 재생을 시도하고,
  // 브라우저 자동재생 정책에 막히면 음소거로 폴백하며 버튼 표시도 맞춘다.
  const [soundOn, setSoundOn] = useState(true);
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 마운트될 때마다 재생을 보장한다. StrictMode(개발)에서 effect가 두 번 돌아
  // 아래 정리 코드로 일시정지된 경우에도 여기서 다시 재생된다.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !soundOn;
    // 아직 데이터가 없을 수 있어 실패는 무시한다. 소리 켠 재생이 막히는 경우의
    // 음소거 폴백은 데이터가 준비된 시점(onLoadedData)에서 처리한다.
    v.play().catch(() => {});
    // 언마운트 시 정지 — src를 지우는 등 파괴적인 처리는 하지 않는다(재마운트를 깨뜨린다).
    return () => { v.pause(); v.muted = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 닫을 때 오버레이가 0.25초간 페이드아웃되는 동안에도 소리가 계속 들리던 문제 —
  // 언마운트를 기다리지 말고 닫는 즉시 정지시킨다.
  const handleClose = () => {
    const v = videoRef.current;
    if (v) { v.pause(); v.muted = true; }
    onClose();
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !soundOn;
    setSoundOn(next);
    if (videoRef.current) videoRef.current.muted = !next;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={handleClose}
      style={{
        position: "fixed", inset: 0, zIndex: OVERLAY_Z,
        background: "rgba(0,0,0,0.94)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer",
      }}
    >
      {failed ? (
        <p style={{
          fontFamily: FONTS.body, fontSize: "14px",
          color: "rgba(255,255,255,0.6)", textAlign: "center", padding: "0 24px",
        }}>
          이 모션은 아직 준비 중이에요.
        </p>
      ) : (
        <motion.video
          ref={videoRef}
          key={id}
          src={`/Main_Motion/Website_main_M_${id}.mp4`}
          autoPlay
          loop
          playsInline
          onClick={(e) => e.stopPropagation()}
          onError={() => setFailed(true)}
          onLoadedData={(e) => {
            const v = e.currentTarget;
            v.muted = !soundOn;
            v.play().catch(() => {
              // 소리 켠 재생이 막히면 음소거로라도 재생한다
              v.muted = true;
              setSoundOn(false);
              v.play().catch(() => setFailed(true));
            });
          }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{ height: "92vh", maxWidth: "94vw", objectFit: "contain" }}
        />
      )}

      {/* 이 모션과 이어지는 상품으로 — 메인 로고 인터랙션과 같은 탭 힌트.
          오버레이 배경 클릭은 닫기라서, 여기서는 전파를 막고 이동만 한다. */}
      <Link
        href={productHref(id)}
        onClick={(e) => {
          e.stopPropagation();
          // 페이지를 떠나기 전에 소리부터 끊는다
          const v = videoRef.current;
          if (v) { v.pause(); v.muted = true; }
          // 뒤로 돌아왔을 때 인트로를 다시 보지 않고 갤러리로 바로 오도록 표시를 남긴다
          try { sessionStorage.setItem(RETURN_TO_GALLERY_KEY, "1"); } catch {}
        }}
        style={{
          position: "absolute", bottom: "6%", left: "50%",
          transform: "translateX(-50%)", zIndex: 1,
          textDecoration: "none", cursor: "pointer",
        }}
      >
        <TapHint />
      </Link>

      {/* 소리 토글 / 닫기 — 헤더에 가리지 않도록 오버레이 z-index를 헤더보다 높게 두었다 */}
      <button
        onClick={toggleSound}
        aria-label={soundOn ? "Mute" : "Unmute"}
        style={{
          position: "absolute", top: 24, right: 80, zIndex: 1,
          width: 44, height: 44, borderRadius: "50%",
          background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", backdropFilter: "blur(4px)",
        }}
      >
        <SoundIcon on={soundOn} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); handleClose(); }}
        aria-label="Close"
        style={{
          position: "absolute", top: 24, right: 24, zIndex: 1,
          width: 44, height: 44, borderRadius: "50%",
          background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.5)",
          color: "#fff", fontSize: 18,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", backdropFilter: "blur(4px)",
        }}
      >
        ✕
      </button>
    </motion.div>
  );
}

// 클릭 유도 힌트 — 메인 로고 인터랙션(FlashIntro)과 동일한 연출.
// 링이 퍼졌다 사라지고, 그 위에 손끝이 눌리듯 스케일 다운했다 올라온다.
function TapHint() {
  return (
    <motion.div
      key="tap-hint"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
        pointerEvents: "none",
      }}
    >
      <div style={{ position: "relative", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.span
          animate={{ scale: [0.4, 1.6], opacity: [0.6, 0] }}
          transition={{ duration: 1.3, repeat: Infinity, ease: "easeOut" }}
          style={{
            position: "absolute", width: 30, height: 30, borderRadius: "50%",
            border: "1.5px solid #ffffff",
          }}
        />
        <motion.span
          animate={{ scale: [1, 0.72, 1] }}
          transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut", times: [0, 0.35, 1] }}
          style={{ width: 14, height: 14, borderRadius: "50%", background: "#ffffff" }}
        />
      </div>
      <span style={{
        fontFamily: FONTS.condensed, fontWeight: 700,
        fontSize: "15px", letterSpacing: "0.04em", textTransform: "uppercase",
        color: "#ffffff",
      }}>
        Click!
      </span>
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
