/**
 * MOLTYPE Graphic Asset Registry
 *
 * 모든 그래픽 에셋을 여기서 중앙 관리합니다.
 * 새 에셋이 생기면 이 파일에 추가하고 각 페이지에서 import해서 사용하세요.
 */

// ─── Logo skins (Home hero only — Logo 1, 2 사용 금지) ─────────────────────────
export const LOGO_SKINS = [
  { src: "/Logo_04.png", label: "FUR"  },
  { src: "/Logo_03.png", label: "KNIT" },
  { src: "/Logo_05.png", label: "FLAT" },
] as const;

// ─── Line / Pattern strips (horizontal repeating bands) ───────────────────────
export const PATTERNS = {
  /** 지그재그 W형 핑크/연두 — 메인 라인 패턴 (Brand Story 상단) */
  linePattern:     "/pattern-top.png",
  /** 다이아몬드 X형 핑크/연두 — 세밀한 니트 패턴 */
  diamondPattern:  "/Moltype_Graphic_Pattern_02.png",
  /** 체크보드 + 격자 2단 — 굵은 패턴 (Brand Story 하단) */
  checkPattern:    "/pattern-bottom.png",
  /** 지그재그 화살표 — 얇은 액센트 밴드 */
  arrowPattern:    "/Moltype_Graphic_Pattern_04.png",
  /** 큰 체크 + X — 큰 패턴 오브젝트 */
  blockPattern:    "/Moltype_Pattern_01.png",
  /** 꽃 라인 그래픽 — Brand Story 끝 */
  flowerGraphic:   "/graphic-flower.png",
} as const;

// ─── Brand imagery ─────────────────────────────────────────────────────────────
export const BRAND_IMAGES = {
  /** MOLTYPE 로고 (블랙) */
  logoBlack:       "/Moltype_LOGO_BLACK.png",
  /** 플래그십 스토어 외관 */
  flagshipStore:   "/Moltype_Flagship_Store_01.png",
  /** Thread by Thread 슬로건 이미지 */
  threadByThread:  "/thread_by_thread.png",
  /** Brand Story 엔딩 텍스트 그래픽 — 885 × 160px */
  endText:         "/end-text.png",
} as const;

// ─── Posters ───────────────────────────────────────────────────────────────────
export const POSTERS = {
  poster01: "/MOLTYPE_Poster-01.jpg",
  poster02: "/MOLTYPE_Poster-02.jpg",
} as const;

// ─── Per-page graphic recommendations ─────────────────────────────────────────
export const PAGE_GRAPHICS = {
  home:         [PATTERNS.linePattern],
  brandStory:   [PATTERNS.checkPattern, POSTERS.poster01],
  product:      [PATTERNS.diamondPattern],
  workshop:     [PATTERNS.arrowPattern, PATTERNS.linePattern],
  reservation:  [PATTERNS.diamondPattern],
  flagshipStore:[BRAND_IMAGES.flagshipStore, PATTERNS.arrowPattern],
} as const;

// ─── Design tokens ─────────────────────────────────────────────────────────────
export const COLORS = {
  pink:    "#F77DA6",
  green:   "#99DAAD",
  black:   "#050505",
  gray:    "#A0A0A0",
  white:   "#FFFFFF",
} as const;

// "Univers Condensed"는 사용자가 제공한 실제 폰트 파일(Bold/Medium .ttf)을
// app/globals.css 의 @font-face 로 등록해 사용한다 — 시스템 대체 폰트(Arial Narrow 등)는
// 폴백으로만 남겨둔다 (폰트 로드 실패 시에만 적용됨).
export const FONTS = {
  condensed: "'Univers Condensed','Arial Narrow','Helvetica Neue',Arial,sans-serif",
  body:      "Pretendard,'Arial Narrow',sans-serif",
  // Akkurat — Concept Cards 영문 본문 전용 (한글 글리프 미지원이라 한글 텍스트에는 사용하지 않음)
  akkurat:   "'Akkurat','Arial Narrow',sans-serif",
} as const;
