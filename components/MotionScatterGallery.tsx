"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { FONTS } from "@/lib/assets";

// 모션 갤러리 — 흩뿌려진 카드 대신 좌우로 번갈아 놓이는 에디토리얼 레이아웃.
// 한 줄(=한 모션)마다 한쪽엔 모션, 반대쪽엔 그 모션의 설명과 룩을 이루는 아이템들이 놓인다.
// 1·3번째 줄은 모션이 왼쪽, 2·4번째 줄은 모션이 오른쪽.
//   모션 클릭      → 소리 켜기/끄기
//   아이템 클릭    → 그 상품 상세로 이동
//   VIEW THE LOOK  → 해당 시즌의 대표 상품으로 이동
//
// 파일: public/Main_Motion/Image_<id>.png(썸네일) · Motion_<id>.mp4(모션).

export const GALLERY_ID = "motion-gallery";

// 상품으로 나갈 때 남기는 표시. 홈이 이 값을 보면 로고 인트로·뜨개 체험을 건너뛰고
// 갤러리로 바로 보낸다(읽은 쪽에서 지운다 — 그냥 새로고침하면 다시 인트로부터).
export const RETURN_TO_GALLERY_KEY = "moltype:return-to-gallery";

type LookItem = { name: string; image: string };
type Look = {
  video: string;     // 모션 파일 경로
  poster?: string;   // 재생 전 자리를 지킬 썸네일 (없으면 검은 화면)
  season: string;    // /product 의 시즌 탭
  title: string;     // 룩 이름
  copy: string;      // 모션 설명
  items: LookItem[]; // 이 룩을 이루는 아이템 (상품 상세로 이어진다)
};

// 아이템 썸네일은 행거컷이 아니라 상품 상세의 첫 번째 디테일 컷을 쓴다.
const cut = (path: string) => `/Product_Detail_Cut/${path}/Product_Detail_01`;

// 모션 4개 — 시즌별 대표 룩. 아이템 이름은 /product 의 상품명과 같아야 상세로 연결된다.
const LOOKS: Look[] = [
  {
    video: "/Main_Motion/Motion_04.mp4",
    poster: "/Main_Motion/Image_04.png",
    season: "Spring",
    title: "Blooming Garden",
    copy:
      "꽃이 만개한 정원의 화사함에서 영감을 받은 에디션입니다. " +
      "다채로운 크로셰 플라워 모티프와 풍성한 니트 텍스처, 사랑스러운 컬러가 어우러져 생동감 넘치는 " +
      "정원의 모습을 표현합니다. 손뜨개 장식과 입체적인 디테일이 조화를 이루며, 자유롭고 로맨틱한 " +
      "분위기를 완성합니다.",
    items: [
      { name: "Blooming Garden Dress",      image: cut("Spring/Blooming Garden/Dress") + ".jpg" },
      { name: "Blooming Garden Leg Warmer", image: cut("Spring/Blooming Garden/Leg Warmer") + ".jpg" },
      { name: "Blooming Garden Heels",      image: cut("Spring/Blooming Garden/Heels") + ".jpg" },
    ],
  },
  {
    video: "/Main_Motion/Motion_02.mp4",
    poster: "/Main_Motion/Image_02.png",
    season: "Summer",
    title: "Bloom Veil",
    copy:
      "햇살이 스며드는 여름 정원에서 영감을 받은 컬렉션입니다. " +
      "가볍게 흩날리는 베일과 손뜨개 플라워 모티프, 투명한 파스텔 컬러가 어우러져 한여름의 꽃잎과 " +
      "바람을 표현합니다. 섬세한 크로셰 디테일과 부드러운 시폰 소재가 조화를 이루며, 몽환적이면서도 " +
      "로맨틱한 분위기를 완성합니다.",
    items: [
      { name: "Bloom Veil",  image: cut("Summer/Summer Bloom Veil/Top") + ".jpg" },
      { name: "Bloom Scarf", image: cut("Summer/Summer Bloom Veil/Scrarf") + ".jpg" },
      { name: "Bloom Shoes", image: cut("Summer/Summer Bloom Veil/Shoes") + ".jpg" },
    ],
  },
  {
    // 새로 교체한 모션 (Website_07_최종)
    video: "/Website_07_최종.mp4",
    poster: "/Main_Motion/Image_07.png",
    season: "Winter",
    title: "Tundra",
    copy:
      "광활한 설원과 혹독한 자연 속에서 발견하는 아름다움에서 영감을 받은 에디션입니다. " +
      "포근한 퍼 텍스처와 독특한 니트 디테일, 차분하면서도 감각적인 실루엣이 어우러져 차가운 자연과 " +
      "따뜻한 소재의 대비를 표현합니다. 풍성한 텍스처와 개성 있는 장식이 조화를 이루며, 자유롭고 " +
      "대담한 겨울 스타일을 완성합니다.",
    items: [
      { name: "Tundra Fur Jacket",    image: cut("Winter/Tundra Fur Jacket") + ".jpg" },
      { name: "Tundra Knit",          image: cut("Winter/Tundra /Knit") + ".jpg" },
      { name: "Tundra Layered Skirt", image: cut("Winter/Tundra /Skirt") + ".jpg" },
      { name: "Tundra Boots",         image: cut("Winter/Tundra /Shoes") + ".jpg" },
    ],
  },
  {
    video: "/Main_Motion/Motion_01.mp4",
    poster: "/Main_Motion/Image_01.png",
    season: "Winter",
    title: "Frozen Bloom",
    copy:
      "얼어붙은 겨울 속에서도 피어나는 꽃에서 영감을 받은 컬렉션입니다. " +
      "풍성한 니트 텍스처와 입체적인 크로셰 플라워 모티프가 어우러져 겨울의 차가움 속에 따뜻하고 " +
      "낭만적인 분위기를 더합니다. 섬세한 뜨개 디테일과 유기적인 실루엣을 통해 변화와 성장의 " +
      "아름다움을 표현합니다.",
    items: [
      { name: "Frozen Bloom Dress",      image: cut("Winter/Frozen Bloom/Dress") + ".jpg" },
      { name: "Frozen Bloom Leg Warmer", image: cut("Winter/Frozen Bloom/Socks") + ".jpg" },
      { name: "Frozen Bloom Boots",      image: cut("Winter/Frozen Bloom/Boots") + ".jpg" },
    ],
  },
];

const productHref = (season: string, product: string) =>
  `/product?season=${encodeURIComponent(season)}&product=${encodeURIComponent(product)}`;

export default function MotionScatterGallery() {
  const router = useRouter();

  const goToProduct = (season: string, product: string) => {
    // 뒤로 돌아왔을 때 인트로를 다시 보지 않고 갤러리로 바로 오도록 표시를 남긴다
    try { sessionStorage.setItem(RETURN_TO_GALLERY_KEY, "1"); } catch {}
    router.push(productHref(season, product));
  };

  return (
    <section
      id={GALLERY_ID}
      style={{
        position: "relative",
        background: "#000000",
        padding: "160px 0 180px",
        overflow: "hidden",
      }}
    >
      {/* 섹션 머리말 */}
      <div style={{ padding: "0 clamp(24px, 6vw, 120px)", marginBottom: "clamp(80px, 9vw, 140px)" }}>
        <p style={{
          fontFamily: FONTS.condensed, fontWeight: 700,
          fontSize: "clamp(34px, 4.4vw, 76px)",
          lineHeight: 1.0, letterSpacing: "-0.02em", textTransform: "uppercase",
          color: "#ffffff", margin: 0,
        }}>
          Thread by Thread,<br />It becomes Yours.
        </p>
      </div>

      {/* 모션 4개 — 홀수 줄은 모션이 왼쪽, 짝수 줄은 오른쪽 */}
      {LOOKS.map((look, i) => (
        <LookRow
          key={look.title}
          look={look}
          // 1·3번째(인덱스 0·2)는 좌측 모션, 2·4번째(인덱스 1·3)는 우측 모션
          motionSide={i % 2 === 0 ? "left" : "right"}
          index={i}
          onPick={goToProduct}
        />
      ))}

</section>
  );
}


// 한 줄 — 모션 + 설명/아이템. 화면에 들어오면 양쪽이 각자 방향에서 살짝 올라오며 나타난다.
function LookRow({
  look, motionSide, index, onPick,
}: {
  look: Look;
  motionSide: "left" | "right";
  index: number;
  onPick: (season: string, product: string) => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rowRef, { once: true, amount: 0.25 });

  const ease = [0.16, 1, 0.3, 1] as const;
  const shift = motionSide === "left" ? -40 : 40;

  const motionCol = (
    <motion.div
      initial={{ opacity: 0, x: shift }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: shift }}
      transition={{ duration: 0.9, ease }}
      style={{ flex: "0 0 auto" }}
    >
      <MotionCard look={look} eager={index === 0} />
    </motion.div>
  );

  const textCol = (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.9, delay: 0.15, ease }}
      style={{
        display: "flex", flexDirection: "column", justifyContent: "center",
        // 모션과 함께 화면 가운데에 놓이도록 글 칸의 폭을 고정한다
        flex: "0 0 auto", width: "min(44vw, 520px)",
      }}
    >
      {/* 번호만 — 시즌 표기는 빼고, 에디션 이름과 24px 띄운다 */}
      <div style={{
        fontFamily: FONTS.condensed, fontSize: "12px", letterSpacing: "0.18em",
        color: "rgba(255,255,255,0.45)", marginBottom: "20px", lineHeight: 1,
      }}>
        {String(index + 1).padStart(2, "0")}
      </div>

      <h3 style={{
        fontFamily: FONTS.condensed, fontWeight: 700,
        fontSize: "clamp(30px, 3.2vw, 56px)",
        lineHeight: 1.04, letterSpacing: "-0.02em", textTransform: "uppercase",
        color: "#ffffff", margin: "0 0 20px",
      }}>
        {look.title}
      </h3>

      <p style={{
        fontFamily: FONTS.body, fontSize: "15px", lineHeight: 1.7,
        letterSpacing: "-0.01em", color: "rgba(255,255,255,0.62)",
        margin: "0 0 44px", maxWidth: "440px",
      }}>
        {look.copy}
      </p>

      {/* 룩을 이루는 아이템 — 클릭하면 상품 상세로.
          아이템이 4개인 에디션(툰드라)은 네 칸으로 늘리되 칸 하나의 크기는 비슷하게 유지한다. */}
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${look.items.length}, minmax(0, 1fr))`,
        gap: "14px",
        maxWidth: `${look.items.length * 142 + (look.items.length - 1) * 14}px`,
      }}>
        {look.items.map((it) => (
          <ItemCard key={it.name} item={it} onClick={() => onPick(look.season, it.name)} />
        ))}
      </div>

      <button
        onClick={() => onPick(look.season, look.items[0].name)}
        style={{
          marginTop: "36px", alignSelf: "flex-start",
          background: "none", border: "none", padding: 0, cursor: "pointer",
          fontFamily: FONTS.condensed, fontSize: "13px", letterSpacing: "0.16em",
          textTransform: "uppercase", color: "#ffffff",
          borderBottom: "1px solid rgba(255,255,255,0.4)", paddingBottom: "4px",
        }}
      >
        View the look →
      </button>
    </motion.div>
  );

  return (
    <div
      ref={rowRef}
      style={{
        // 모션과 글 칸을 각자의 폭 그대로 두고 둘을 한 덩어리로 화면 가운데에 놓는다
        // (칼럼을 비율로 나누면 양쪽 여백이 어긋난다)
        display: "flex",
        justifyContent: "center",
        gap: "clamp(40px, 6vw, 110px)",
        alignItems: "center",
        padding: "0 clamp(24px, 6vw, 120px)",
        marginBottom: "clamp(100px, 11vw, 190px)",
      }}
    >
      {motionSide === "left" ? motionCol : textCol}
      {motionSide === "left" ? textCol : motionCol}
    </div>
  );
}

// 모션 한 편 — 화면에 들어오면 음소거로 재생되고, 클릭하면 전체화면으로 크게 볼 수 있다.
// 소리는 오른쪽 아래 버튼으로 켜고 끈다.
function MotionCard({ look, eager }: { look: Look; eager: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(wrapRef, { amount: 0.3 });
  const [soundOn, setSoundOn] = useState(false);
  const [full, setFull] = useState(false);
  // 한 번이라도 재생이 시작됐는지 — 그 전까지는 영상이 검은 판으로 보이므로 썸네일을 덮지 않는다
  const [started, setStarted] = useState(false);
  // 영상의 실제 비율(가로/세로). 메타데이터가 오기 전에는 세로 영상(9:16)으로 가정한다.
  const [ratio, setRatio] = useState<number | null>(null);
  const readRatio = () => {
    const v = videoRef.current;
    if (v?.videoWidth && v.videoHeight) setRatio(v.videoWidth / v.videoHeight);
  };

  // 보일 때만 재생 — 4편이 동시에 돌면 디코더가 포화된다
  const play = () => { const v = videoRef.current; if (v) v.play().catch(() => {}); };
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView) play();
    else v.pause();
  }, [inView]);

  useEffect(() => {
    const v = videoRef.current;
    if (v) v.muted = !soundOn;
  }, [soundOn]);

  // 전체화면 동안엔 뒤 페이지가 스크롤되지 않게 하고, Esc로 닫는다
  useEffect(() => {
    if (!full) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setFull(false); };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // 고정 헤더는 z-index로 덮이지 않아 클래스로 숨긴다 (globals.css)
    document.body.classList.add("motion-fullscreen");
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.classList.remove("motion-fullscreen");
      window.removeEventListener("keydown", onKey);
    };
  }, [full]);

  return (
    <>
    <div
      ref={wrapRef}
      onClick={() => setFull(true)}
      style={{
        position: "relative",
        // 영상 원본 비율 그대로. 높이를 화면의 92%까지 허용하되(위아래 검은 여백을 줄인다),
        // max-height로 자르면 비율이 깨지므로 그 높이에 해당하는 폭으로 폭을 정한다.
        aspectRatio: `${ratio ?? 9 / 16}`,
        width: `min(42vw, calc(92vh * ${ratio ?? 9 / 16}))`,
        overflow: "hidden",
        borderRadius: "2px",
        // 배경을 페이지와 같은 검정으로 — 폭이 소수점으로 떨어질 때 가장자리에 밝은 실선이 보였다
        background: "#000",
        cursor: "pointer",
        boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
      }}
    >
      {/* 영상이 준비되기 전에는 썸네일이 자리를 지킨다 */}
      {look.poster && (
        <Image
          src={look.poster}
          alt={look.title}
          fill
          sizes="(max-width: 900px) 92vw, 48vw"
          draggable={false}
          style={{ objectFit: "cover", pointerEvents: "none" }}
          priority={eager}
        />
      )}
      <video
        ref={videoRef}
        src={look.video}
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedMetadata={readRatio}
        onCanPlay={() => { readRatio(); if (inView) play(); }}
        // playing 이벤트는 리스너가 붙기 전에 지나갈 수 있어 timeupdate 로도 확인한다
        onPlaying={() => setStarted(true)}
        onTimeUpdate={() => { if (!started) setStarted(true); }}
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover", pointerEvents: "none",
          // 재생 전 영상은 빈 검은 판이라, 썸네일이 있는 경우엔 시작 전까지 투명하게 둔다
          opacity: started || !look.poster ? 1 : 0,
          transition: "opacity 0.5s ease",
          // 소수점 폭에서 가장자리에 1px 띠가 생기는 것을 막는다
          transform: "scale(1.004)",
        }}
      />
      {/* 소리 켜기/끄기 — 카드 클릭(전체화면)과 겹치지 않게 전파를 막는다 */}
      <button
        onClick={(e) => { e.stopPropagation(); setSoundOn((s) => !s); }}
        aria-label={soundOn ? "Mute" : "Unmute"}
        style={{
          position: "absolute", bottom: 16, right: 16,
          width: 40, height: 40, borderRadius: "50%", padding: 0,
          background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(4px)", cursor: "pointer",
        }}
      >
        <SoundIcon on={soundOn} />
      </button>
    </div>

    {/* 전체화면 — 카드를 클릭하면 열린다. 배경이나 ✕, Esc로 닫는다. */}
    {full && (
      <FullscreenMotion look={look} onClose={() => setFull(false)} />
    )}
    </>
  );
}

// 전체화면 재생 — 화면을 꽉 채우되 잘리지 않게(contain) 보여준다. 소리는 기본으로 켠다.
// 등장 애니메이션(transform)이 걸린 칼럼 안에 두면 position: fixed 가 그 안쪽 기준이 되어
// 전체화면이 되지 않는다. 그래서 body로 포털해 띄운다.
function FullscreenMotion({ look, onClose }: { look: Look; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [soundOn, setSoundOn] = useState(true);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !soundOn;
    v.play().catch(() => {
      // 사용자 제스처 없이 소리까지 켜는 건 막힐 수 있다 — 그럴 땐 음소거로 재생
      v.muted = true;
      setSoundOn(false);
      v.play().catch(() => {});
    });
  }, [soundOn]);

  if (!mounted) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 3000,
        background: "#000",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "zoom-out",
      }}
    >
      <video
        ref={videoRef}
        src={look.video}
        loop
        playsInline
        autoPlay
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", height: "100%", objectFit: "contain", cursor: "default" }}
      />
      <button
        onClick={(e) => { e.stopPropagation(); setSoundOn((s) => !s); }}
        aria-label={soundOn ? "Mute" : "Unmute"}
        style={{ ...FULL_BTN, right: 76 }}
      >
        <SoundIcon on={soundOn} />
      </button>
      <button onClick={onClose} aria-label="Close" style={{ ...FULL_BTN, right: 20, fontSize: 18, color: "#fff" }}>
        ✕
      </button>
    </motion.div>,
    document.body,
  );
}

const FULL_BTN: React.CSSProperties = {
  position: "absolute", top: 20,
  width: 44, height: 44, borderRadius: "50%", padding: 0,
  background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.45)",
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", backdropFilter: "blur(4px)",
};

// 룩 아이템 한 칸 — 상품 썸네일 + 이름
function ItemCard({ item, onClick }: { item: LookItem; onClick: () => void }) {
  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "none", border: "none", padding: 0, cursor: "pointer",
        textAlign: "left", display: "block",
      }}
    >
      <div style={{
        position: "relative", width: "100%", aspectRatio: "3 / 4",
        overflow: "hidden", borderRadius: "2px", background: "#111",
        transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
        transform: hover ? "translateY(-4px)" : "none",
      }}>
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="200px"
          draggable={false}
          // 디테일 컷은 사진이라 칸을 채워야 한다
          style={{ objectFit: "cover", pointerEvents: "none" }}
        />
      </div>
      <p style={{
        fontFamily: FONTS.condensed, fontSize: "11px", letterSpacing: "0.08em",
        textTransform: "uppercase", margin: "10px 0 0",
        // 이름이 두 줄로 넘어가도 세 칸의 높이가 어긋나지 않게
        lineHeight: 1.35, minHeight: "2.7em",
        color: hover ? "#ffffff" : "rgba(255,255,255,0.38)",
        transition: "color 0.3s",
      }}>
        {item.name}
      </p>
    </button>
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
