// 상품 데이터 — /product 페이지와 홈 모션 갤러리(상품 팝업)가 함께 쓴다.
// 원래 app/product/page.tsx 안에 있던 것을 갤러리에서도 같은 구매 팝업을 띄우기 위해 분리했다.

export const SIZES = ["XS", "S", "M", "L", "XL"] as const;
// 신발류 — 230부터 270까지 10mm 단위
export const SHOE_SIZES = ["230", "240", "250", "260", "270"] as const;

// 한글 설명은 DESC_KO에서 영문 설명을 키로 찾으므로, 상수로 묶어 양쪽이 어긋나지 않게 한다.
// 줄바꿈은 원문 그대로 유지한다 (렌더링 시 white-space: pre-line)
export const DESC_TUNDRA_EN =
  "A statement outerwear piece that pairs exceptional warmth with\n" +
  "an effortlessly refined silhouette.\n" +
  "Crochet patches can be added to the sleeves and hood,\n" +
  "transforming the jacket into a personalized expression of style.";

// 아래 desc 상수들은 실제로 화면에 표시되지 않고 DESC_KO 조회용 키로만 쓰인다
// (세부 정보 탭은 한글만 노출한다).
export const DESC_TUNDRA_KNIT_EN = "Tundra Knit — soft knit with customizable crochet patches.";
export const DESC_TUNDRA_BOOTS_EN = "Tundra Boots — fur-lined boots with customizable crochet patches.";
export const DESC_TUNDRA_SKIRT_EN = "Tundra Layered Skirt — lace and knit layers with crochet patch points.";
export const DESC_FROZEN_DRESS_EN = "Frozen Bloom Dress — slim knit silhouette with crocheted floral detail.";
export const DESC_FROZEN_LEGWARMER_EN = "Frozen Bloom Leg Warmers — crocheted texture reminiscent of ice crystals.";
export const DESC_FROZEN_BOOTS_EN = "Frozen Bloom Boots — minimal silhouette paired with the leg warmers.";

// Spring — 설명은 public/Product_Detail_Cut/Spring/<패밀리>/<품목>/설명 파일 원문
export const DESC_BG_DRESS_EN     = "Blooming Garden Dress — hundreds of hand-crocheted flowers layered into a mini dress.";
export const DESC_BG_LEGWARMER_EN = "Blooming Garden Leg Warmer — the dress's flower motifs flowing down the leg.";
export const DESC_BG_HEELS_EN     = "Blooming Garden Heels — platform boots crowned with crocheted flowers.";
export const DESC_BT_JACKET_EN    = "Bloom Tailored Jacket — crocheted flowers blooming over precise tailoring.";
export const DESC_BT_PANTS_EN     = "Bloom Tailored Pants — restrained wide silhouette with crochet lace at the hem.";
export const DESC_BT_BAG_EN       = "Bloom Tailored Bag — refined bag with crochet flowers and fringe.";
export const DESC_BT_HEELS_EN     = "Bloom Tailored Heels — pointed-toe heels with crocheted flower detail.";
export const DESC_SR_TOP_EN       = "Soft Reverie Top — satin panels with delicate crochet sleeves.";
export const DESC_SR_PANTS_EN    = "Soft Reverie Pants — softly flowing wide satin pants.";
export const DESC_SR_SLIPPERS_EN  = "Soft Reverie Slippers — satin-textured shoes with ribbon detail.";

// Fall — 설명은 public/Product_Detail_Cut/Fall/<패밀리>/<품목>/설명 파일 원문
export const DESC_PG_KNIT_EN  = "Pastel Grung Knit — vintage motifs bleeding into a soft pastel knit.";
export const DESC_PG_PANTS_EN = "Pastel Grung Pants — vivid pink shorts with clean tailoring.";
export const DESC_FO_JACKET_EN  = "Frosted Office Jacket — black double-breasted tailoring with an ice-blue crochet collar.";
export const DESC_FO_SKIRT_EN   = "Frosted Office Skirt — clean-cut skirt in the jacket's wool blend.";
export const DESC_FO_HEELS_EN   = "Frosted Office Heels — matte black classic high heels.";
export const DESC_FO_GLASSES_EN = "Frosted Office Glasses — clear frame with soft pink tinted lenses.";
export const DESC_CG_SHIRT_EN   = "Contrast Grung Shirts — classic oversized white shirt.";
export const DESC_CG_PANTS_EN   = "Contrast Grung Pants — crinkled cargo pants with hand-knit pocket panels.";

// Summer — 설명은 public/Product_Detail_Cut/Summer/<패밀리>/<품목>/설명 파일 원문
export const DESC_DM_TOP_EN    = "Mirage Top — vintage lace camisole reworked as a crop top with crochet stars.";
export const DESC_DM_PANTS_EN  = "Denim Mirage — wide denim pants with crochet panels along the hem.";
export const DESC_DM_BOOTS_EN  = "Mirage Boots — holographic western boots.";
export const DESC_BV_TOP_EN    = "Bloom Veil — pastel blue and cream crochet-panel mini dress.";
export const DESC_BV_SCARF_EN  = "Bloom Scarf — sheer chiffon scarf that wraps the dress.";
export const DESC_BV_SHOES_EN  = "Bloom Shoes — ivory strap sandals with crochet flowers.";
export const DESC_RD_KNIT_EN   = "Ribbon Doll Knit — off-shoulder top with a satin ribbon.";
export const DESC_RD_SKIRT_EN  = "Ribbon Doll Skirt — hand-knit mini skirt with a drawstring waist.";
export const DESC_RD_SOCKS_EN  = "Ribbon Doll Socks — floral lace tights.";
export const DESC_RD_SHOES_EN  = "Ribbon Doll Shoes — pale pink ballet flats with a mini ribbon.";

// ─── 시즌별 상품 데이터 ────────────────────────────────────────────────────────
export const SEASON_PRODUCTS = [
  // 0 — Spring
  [
    { id: 1,  name: "Blooming Garden Dress",      tag: "SPRING / 2026", desc: DESC_BG_DRESS_EN,     image: "/assets/Spring/Website_Product_Asset_01.png", bg: "#F8FDF9", price: "₩ 288,000" },
    { id: 2,  name: "Blooming Garden Leg Warmer", tag: "SPRING / 2026", desc: DESC_BG_LEGWARMER_EN, image: "/assets/Spring/Website_Product_Asset_02.png", bg: "#F8FDF9", price: "₩ 58,000" },
    { id: 3,  name: "Blooming Garden Heels",      tag: "SPRING / 2026", desc: DESC_BG_HEELS_EN,     image: "/assets/Spring/Website_Product_Asset_03.png", bg: "#F8FDF9", price: "₩ 168,000" },
    { id: 4,  name: "Bloom Tailored Jacket",      tag: "SPRING / 2026", desc: DESC_BT_JACKET_EN,    image: "/assets/Spring/Website_Product_Asset_04.png", bg: "#F8FDF9", price: "₩ 268,000" },
    { id: 5,  name: "Bloom Tailored Pants",       tag: "SPRING / 2026", desc: DESC_BT_PANTS_EN,     image: "/assets/Spring/Website_Product_Asset_05.png", bg: "#F8FDF9", price: "₩ 128,000" },
    { id: 6,  name: "Bloom Tailored Bag",         tag: "SPRING / 2026", desc: DESC_BT_BAG_EN,       image: "/assets/Spring/Website_Product_Asset_06.png", bg: "#F8FDF9", price: "₩ 118,000" },
    { id: 7,  name: "Bloom Tailored Heels",       tag: "SPRING / 2026", desc: DESC_BT_HEELS_EN,     image: "/assets/Spring/Website_Product_Asset_07.png", bg: "#F8FDF9", price: "₩ 148,000" },
    { id: 8,  name: "Soft Reverie Top",           tag: "SPRING / 2026", desc: DESC_SR_TOP_EN,       image: "/assets/Spring/Website_Product_Asset_08.png", bg: "#F8FDF9", price: "₩ 108,000" },
    { id: 9,  name: "Soft Reverie Pants",        tag: "SPRING / 2026", desc: DESC_SR_PANTS_EN,    image: "/assets/Spring/Website_Product_Asset_09.png", bg: "#F8FDF9", price: "₩ 98,000" },
    { id: 10, name: "Soft Reverie Slippers",      tag: "SPRING / 2026", desc: DESC_SR_SLIPPERS_EN,  image: "/assets/Spring/Website_Product_Asset_10.png", bg: "#F8FDF9", price: "₩ 98,000" },
  ],
  // 1 — Summer
  [
    { id: 1,  name: "Mirage Top", tag: "SUMMER / 2026", desc: DESC_DM_TOP_EN, image: "/assets/Summer/Website_Product_Asset_01.png", bg: "#F8FDF9", price: "₩ 88,000" },
    { id: 2,  name: "Denim Mirage", tag: "SUMMER / 2026", desc: DESC_DM_PANTS_EN,   image: "/assets/Summer/Website_Product_Asset_02.png", bg: "#F8FDF9", price: "₩ 118,000" },
    { id: 3,  name: "Mirage Boots", tag: "SUMMER / 2026", desc: DESC_DM_BOOTS_EN,                       image: "/assets/Summer/Website_Product_Asset_03.png", bg: "#F8FDF9", price: "₩ 158,000" },
    { id: 4,  name: "Bloom Veil", tag: "SUMMER / 2026", desc: DESC_BV_TOP_EN,                 image: "/assets/Summer/Website_Product_Asset_05.png", bg: "#F8FDF9", price: "₩ 148,000" },
    { id: 5,  name: "Bloom Scarf", tag: "SUMMER / 2026", desc: DESC_BV_SCARF_EN,  image: "/assets/Summer/Website_Product_Asset_06.png", bg: "#F8FDF9", price: "₩ 48,000" },
    // 04번 에셋 교체분 — 꽃 장식 샌들이라 Bloom 패밀리로 옮기고 05, 06 뒤에 배치했다.
    { id: 6,  name: "Bloom Shoes", tag: "SUMMER / 2026", desc: DESC_BV_SHOES_EN,     image: "/assets/Summer/Website_Product_Asset_04.png", bg: "#F8FDF9", price: "₩ 128,000" },
    { id: 7,  name: "Ribbon Doll Knit", tag: "SUMMER / 2026", desc: DESC_RD_KNIT_EN,   image: "/assets/Summer/Website_Product_Asset_07.png", bg: "#F8FDF9", price: "₩ 98,000" },
    { id: 8,  name: "Ribbon Doll Skirt", tag: "SUMMER / 2026", desc: DESC_RD_SKIRT_EN,                       image: "/assets/Summer/Website_Product_Asset_08.png", bg: "#F8FDF9", price: "₩ 88,000" },
    { id: 9,  name: "Ribbon Doll Socks", tag: "SUMMER / 2026", desc: DESC_RD_SOCKS_EN,     image: "/assets/Summer/Website_Product_Asset_09.png", bg: "#F8FDF9", price: "₩ 28,000" },
    { id: 10, name: "Ribbon Doll Shoes", tag: "SUMMER / 2026", desc: DESC_RD_SHOES_EN,                 image: "/assets/Summer/Website_Product_Asset_10.png", bg: "#F8FDF9", price: "₩ 118,000" },
  ],
  // 2 — Autumn
  [
    { id: 1, name: "Pastel Grung Knit",  tag: "AUTUMN / 2026", desc: DESC_PG_KNIT_EN,  image: "/assets/Fall/Website_Product_Asset_01.png", bg: "#F8FDF9", price: "₩ 98,000" },
    { id: 2, name: "Pastel Grung Pants", tag: "AUTUMN / 2026", desc: DESC_PG_PANTS_EN, image: "/assets/Fall/Website_Product_Asset_02.png", bg: "#F8FDF9", price: "₩ 78,000" },
    // 03(Pastel Grung Shoes)은 라인업에서 제외.
    { id: 3, name: "Frosted Office Jacket", tag: "AUTUMN / 2026", desc: DESC_FO_JACKET_EN, image: "/assets/Fall/Website_Product_Asset_04.png", bg: "#F8FDF9", price: "₩ 248,000" },
    { id: 4, name: "Frosted Office Skirt", tag: "AUTUMN / 2026", desc: DESC_FO_SKIRT_EN, image: "/assets/Fall/Website_Product_Asset_05.png", bg: "#F8FDF9", price: "₩ 118,000" },
    { id: 5, name: "Frosted Office Heels", tag: "AUTUMN / 2026", desc: DESC_FO_HEELS_EN, image: "/assets/Fall/Website_Product_Asset_06.png", bg: "#F8FDF9", price: "₩ 138,000" },
    { id: 6, name: "Frosted Office Glasses", tag: "AUTUMN / 2026", desc: DESC_FO_GLASSES_EN, image: "/assets/Fall/Website_Product_Asset_07.png", bg: "#F8FDF9", price: "₩ 78,000" },
    { id: 7, name: "Contrast Grung Shirts", tag: "AUTUMN / 2026", desc: DESC_CG_SHIRT_EN, image: "/assets/Fall/Website_Product_Asset_08.png", bg: "#F8FDF9", price: "₩ 88,000" },
    { id: 8, name: "Contrast Grung Pants", tag: "AUTUMN / 2026", desc: DESC_CG_PANTS_EN, image: "/assets/Fall/Website_Product_Asset_09.png", bg: "#F8FDF9", price: "₩ 138,000" },
  ],
  // 3 — Winter
  [
    { id: 1, name: "Tundra Fur Jacket", tag: "WINTER / 2026", desc: DESC_TUNDRA_EN, image: "/assets/Winter/Website_Product_Asset_01.png", bg: "#F8FDF9", price: "₩ 318,000" },
    { id: 2, name: "Tundra Knit", tag: "WINTER / 2026", desc: DESC_TUNDRA_KNIT_EN, image: "/assets/Winter/Website_Product_Asset_02.png", bg: "#F8FDF9", price: "₩ 128,000" },
    { id: 3, name: "Tundra Layered Skirt", tag: "WINTER / 2026", desc: DESC_TUNDRA_SKIRT_EN, image: "/assets/Winter/Website_Product_Asset_03.png", bg: "#F8FDF9", price: "₩ 148,000" },
    // 04(Tundra Leg Warmer)는 제외. 05는 새 에셋(.jpg)으로 교체.
    { id: 4, name: "Tundra Boots", tag: "WINTER / 2026", desc: DESC_TUNDRA_BOOTS_EN, image: "/assets/Winter/Website_Product_Asset_05.png", bg: "#F8FDF9", price: "₩ 178,000" },
    { id: 5,  name: "Frozen Bloom Dress", tag: "WINTER / 2026", desc: DESC_FROZEN_DRESS_EN, image: "/assets/Winter/Website_Product_Asset_06.png", bg: "#F8FDF9", price: "₩ 228,000" },
    { id: 6,  name: "Frozen Bloom Leg Warmer", tag: "WINTER / 2026", desc: DESC_FROZEN_LEGWARMER_EN,   image: "/assets/Winter/Website_Product_Asset_07.png", bg: "#F8FDF9", price: "₩ 58,000" },
    { id: 7,  name: "Frozen Bloom Boots", tag: "WINTER / 2026", desc: DESC_FROZEN_BOOTS_EN,                       image: "/assets/Winter/Website_Product_Asset_08.png", bg: "#F8FDF9", price: "₩ 158,000" },
  ],
] as const;

export type Product = typeof SEASON_PRODUCTS[number][number];

export const SEASON_LABELS = ["Spring", "Summer", "Autumn", "Winter"] as const;

// ─── Product Detail Modal ─────────────────────────────────────────────────────
export type CartItem = { name: string; size: string; price: string; image: string; product: Product };

export const FONT_KO = "'SUIT','Pretendard',sans-serif";

// 영문 설명 → 한글 설명 (2줄) 매핑
export const DESC_KO: Record<string, string> = {
  "A ribbed crop top with an open neckline. Designed to be completed.": "오픈 넥라인의 골지 크롭탑.\n마지막 완성은 당신의 손에 남겨두었습니다.",
  "Open-ended wear for open-ended use. Patch the flower or leave it.": "열린 쓰임을 위한 열린 옷.\n꽃을 달아도, 비워두어도 좋습니다.",
  "A pair of shorts with space left at the seam.": "솔기에 여백을 남긴 쇼츠.\n비어있는 자리가 곧 시작점이 됩니다.",
  "A wearable surface made to be interrupted. Same form, new skin.": "중단되기 위해 만들어진 입는 표면.\n같은 형태, 새로운 스킨.",
  "The seam is the question. You decide where it ends.": "솔기는 질문입니다.\n어디서 끝낼지는 당신이 정합니다.",
  [DESC_TUNDRA_EN]:
    "극한의 한파에도 따뜻함을 유지하도록 설계된 Tundra Fur Jacket은 풍성한 퍼 텍스처와\n" +
    "가벼운 실루엣을 갖춘 아우터입니다. 뛰어난 보온성과 세련된 감성을 동시에 담았으며,\n" +
    "소매와 후드에 뜨개 패치를 자유롭게 부착해 자신만의 스타일로 커스터마이징할 수 있습니다.",

  [DESC_TUNDRA_KNIT_EN]:
    "부드러운 촉감의 니트 소재와 여유로운 실루엣이 돋보이는 Tundra Knit은 겨울철 편안한 착용감을 " +
    "제공합니다. 다양한 뜨개 패치를 자유롭게 부착할 수 있어, 기본적인 니트웨어를 자신만의 개성이 " +
    "담긴 아이템으로 완성할 수 있습니다.",
  [DESC_TUNDRA_BOOTS_EN]:
    "추운 계절에도 따뜻함을 유지할 수 있도록 설계된 Tundra Boots는 부드러운 퍼 소재와 안정적인 " +
    "착화감을 갖춘 아이템입니다. 부츠 곳곳에 뜨개 패치를 더해 자신만의 방식으로 커스터마이징할 수 있습니다.",
  [DESC_TUNDRA_SKIRT_EN]:
    "레이스와 니트 텍스처가 층층이 쌓인 Tundra Layered Skirt는 풍부한 볼륨감과 유연한 움직임을 " +
    "연출합니다. 뜨개 패치를 활용해 원하는 위치에 포인트를 더하며 자신만의 스타일을 표현할 수 있습니다.",
  [DESC_FROZEN_DRESS_EN]:
    "차가운 겨울 풍경 속에서 피어난 꽃을 모티브로 한 Frozen Bloom Dress는 슬림한 니트 실루엣과 " +
    "섬세한 뜨개 디테일이 조화를 이루는 원피스입니다. 꽃잎을 연상시키는 볼륨감 있는 소매와 유려한 " +
    "드레이프 라인이 부드럽고 우아한 분위기를 완성합니다.",
  [DESC_FROZEN_LEGWARMER_EN]:
    "섬세한 뜨개 패턴으로 제작된 Frozen Bloom Leg Warmers는 얼음 결정이 피어난 듯한 텍스처가 " +
    "특징입니다. 가볍고 유연한 소재로 제작되어 스타일링에 포인트를 더하며, 원피스와 함께 하나의 " +
    "완성된 룩을 연출합니다.",
  [DESC_FROZEN_BOOTS_EN]:
    "겨울철 실용성과 감각적인 디자인을 동시에 담은 Frozen Bloom Boots입니다. 미니멀한 실루엣과 " +
    "안정적인 착화감이 특징이며, 뜨개 레그워머와 조화를 이루어 Frozen Bloom 컬렉션의 우아한 무드를 " +
    "완성합니다.",

  // ── Spring ──
  [DESC_BG_DRESS_EN]:
    "수백 개의 핸드메이드 크로셰 플라워 모티프를 레이어링하여 완성한 미니 드레스입니다. 다양한 크기와 " +
    "컬러의 꽃들이 유기적으로 연결되어 하나의 살아있는 정원을 연상시키며, 입체적인 텍스처가 독보적인 " +
    "존재감을 선사합니다. 슬림한 실루엣과 풍성한 플라워 디테일의 대비가 로맨틱하면서도 아방가르드한 " +
    "무드를 연출합니다.",
  [DESC_BG_LEGWARMER_EN]:
    "드레스와 동일한 플라워 모티프를 활용해 제작된 레그워머입니다. 다채로운 꽃 장식이 다리를 따라 " +
    "자연스럽게 흐르며, 룩 전체에 통일감을 부여합니다. 움직일 때마다 꽃들이 미세하게 흔들리며 생동감 " +
    "있는 실루엣을 만들어냅니다.",
  [DESC_BG_HEELS_EN]:
    "볼륨감 있는 플랫폼 실루엣 위에 크로셰 플라워 장식을 더한 부츠입니다. 안정적인 착화감과 강렬한 " +
    "존재감을 동시에 갖추었으며, 플라워 디테일이 의상과 자연스럽게 연결되어 하나의 완성된 정원처럼 " +
    "보이도록 설계되었습니다.",
  [DESC_BT_JACKET_EN]:
    "정교한 테일러링 위에 크로셰 플라워가 피어난 재킷입니다. 구조적인 실루엣과 유기적인 꽃 장식이 " +
    "대비를 이루며, 기성복의 질서 속에서 개인의 취향이 자연스럽게 드러나는 순간을 표현합니다. 재킷 " +
    "전면을 따라 흐르는 핸드메이드 플라워 모티프는 마치 의복 위에서 꽃이 자라나는 듯한 인상을 만들며, " +
    "MOLTYPE만의 부드러운 조형미를 완성합니다.",
  [DESC_BT_PANTS_EN]:
    "절제된 와이드 실루엣에 크로셰 레이스 디테일을 더한 팬츠입니다. 미니멀한 구조 속에서도 밑단에 " +
    "피어난 꽃 장식이 은은한 존재감을 드러내며, 움직임에 따라 다양한 표정을 만들어냅니다. 재킷과 함께 " +
    "착용했을 때 하나의 정원처럼 이어지는 통일감을 형성합니다.",
  [DESC_BT_BAG_EN]:
    "정제된 형태의 백 위에 크로셰 플라워와 프린지 디테일을 더해 완성한 핸드백입니다. 단순한 수납 " +
    "기능을 넘어 Bloom Tailored Edition의 서사를 담아내는 오브제로 기능하며, 꽃이 피어나는 순간의 " +
    "생동감을 입체적인 텍스처로 표현합니다. 스타일링에 자연스러운 포인트를 더하면서도 컬렉션 전체를 " +
    "연결하는 역할을 합니다.",
  [DESC_BT_HEELS_EN]:
    "우아한 포인티드 토 실루엣에 크로셰 플라워 디테일을 적용한 힐입니다. 의상 곳곳에 피어난 꽃 " +
    "장식과 연결되어 하나의 완성된 룩을 구성하며, 섬세한 디테일 속에서도 균형 잡힌 테일러링 무드를 " +
    "유지합니다. 걸음을 옮길 때마다 은은하게 드러나는 장식이 Bloom Tailored Edition의 분위기를 더욱 " +
    "강조합니다.",
  [DESC_SR_TOP_EN]:
    "은은한 광택의 새틴 패널과 섬세한 크로셰 슬리브가 조화를 이루는 탑입니다. 목선과 프런트 라인을 " +
    "따라 흐르는 러플 디테일이 부드러운 입체감을 더하며, 몸을 자연스럽게 감싸는 슬림한 실루엣이 " +
    "우아한 분위기를 연출합니다. 투명하게 짜인 크로셰 소매는 가벼운 텍스처를 더해 Soft Reverie " +
    "특유의 몽환적인 감성을 완성합니다.",
  [DESC_SR_PANTS_EN]:
    "부드럽게 흐르는 와이드 실루엣의 새틴 팬츠입니다. 걸을 때마다 자연스럽게 움직이는 소재의 광택이 " +
    "우아한 분위기를 연출하며, 사이드 리본 디테일이 은은한 포인트가 됩니다. 편안한 착용감과 세련된 " +
    "실루엣을 동시에 담아 Soft Reverie Edition의 부드러운 무드를 완성합니다.",
  [DESC_SR_SLIPPERS_EN]:
    "부드러운 새틴 텍스처와 리본 디테일을 적용하여 제작된 슈즈입니다. 절제된 디자인 속에서도 은은한 " +
    "광택과 섬세한 장식이 돋보이며, 컬렉션의 로맨틱한 분위기를 자연스럽게 이어줍니다. 가볍고 우아한 " +
    "실루엣으로 다양한 스타일링에 활용할 수 있습니다.",

  // ── Fall ──
  [DESC_PG_KNIT_EN]:
    "부드러운 파스텔 컬러 위로 빈티지한 패턴이 스며든 니트입니다. 은은하게 번진 듯한 모티프와 가벼운 " +
    "니트 조직이 만나 자유롭고 감성적인 분위기를 연출합니다. 클래식한 니트웨어를 기반으로 하면서도 " +
    "색감과 텍스처를 통해 Pastel Grunge 특유의 키치한 매력을 담아냈습니다. 짧은 소매와 슬림한 " +
    "실루엣은 발랄한 무드를 더하며, 다양한 스타일링의 중심이 되는 아이템입니다.",
  // 원문 첫 단어가 "명한"으로 잘려 있어 "선명한"으로 보정했다
  [DESC_PG_PANTS_EN]:
    "선명한 핑크 컬러와 미니멀한 실루엣이 돋보이는 쇼츠입니다. 깔끔한 테일러링을 기반으로 " +
    "제작되었으며, Pastel Grunge 특유의 장난스럽고 자유로운 분위기를 담고 있습니다. 니트와 함께 " +
    "착용했을 때 컬렉션의 색감이 더욱 돋보이며, 블랙 스타킹이나 볼드한 슈즈와 매치해 부드러움과 " +
    "강인함이 공존하는 스타일을 연출할 수 있습니다.",
  [DESC_FO_JACKET_EN]:
    "정교하게 테일러링된 블랙 더블 브레스티드 재킷입니다. 허리를 따라 자연스럽게 들어가는 실루엣과 " +
    "구조적인 숄더 라인이 균형을 이루며, 아이스 블루 크로셰 칼라가 강한 대비를 만들어냅니다. 클래식한 " +
    "오피스웨어를 기반으로 하면서도 수작업 디테일을 통해 MOLTYPE만의 감성을 담아낸 제품입니다.",
  [DESC_FO_SKIRT_EN]:
    "군더더기 없는 실루엣과 깔끔한 재단이 특징이며, 재킷과 동일한 소재로 제작되어 재킷과 함께 " +
    "착용했을 때 하나의 드레스처럼 자연스럽게 연결됩니다. 미니멀한 디자인을 통해 크로셰 칼라 디테일이 " +
    "더욱 돋보이도록 구성되었습니다.",
  [DESC_FO_HEELS_EN]:
    "매트한 블랙 컬러의 클래식 하이힐입니다. 군더더기 없는 실루엣으로 재킷과 스커트의 구조적인 라인을 " +
    "더욱 강조하며, 아이스 블루 크로셰 칼라가 돋보일 수 있도록 전체적인 균형을 잡아줍니다. 절제된 " +
    "디자인을 통해 컬렉션의 세련된 분위기를 완성합니다.",
  [DESC_FO_GLASSES_EN]:
    "투명 프레임과 소프트 핑크 틴트 렌즈가 적용된 선글라스입니다. 차가운 오피스웨어에 부드러운 색감을 " +
    "더해주는 액세서리로, 룩 전체에 가벼운 포인트를 제공합니다. 크로셰 디테일과 자연스럽게 어우러지며 " +
    "도시적인 분위기를 완성합니다.",
  [DESC_CG_SHIRT_EN]:
    "클래식한 오버사이즈 셔츠를 기반으로 제작된 아이템입니다. 절제된 화이트 컬러와 여유로운 실루엣은 " +
    "컬렉션의 강렬한 팬츠와 대비를 이루며 균형을 만들어냅니다. 단정한 셔츠의 형태를 유지하면서도 " +
    "자연스럽게 흐르는 핏을 적용해, 그런지 특유의 무심한 분위기를 현대적으로 표현했습니다. 다양한 " +
    "레이어링 스타일에 활용할 수 있으며 컬렉션 전체를 연결하는 핵심 아이템입니다.",
  [DESC_CG_PANTS_EN]:
    "의도적으로 구겨진 듯한 텍스처와 볼륨감 있는 실루엣이 특징인 카고 팬츠입니다. 양쪽 포켓에 적용된 " +
    "니트 디테일은 기능적인 요소를 장식적 요소로 전환하며, 정제된 셔츠와 강한 대비를 만들어냅니다. " +
    "움직임에 따라 변화하는 주름과 광택은 컬렉션 특유의 자유롭고 실험적인 분위기를 강조하며, 전통적인 " +
    "그런지 스타일을 현대적인 스트리트 감성으로 재해석합니다.",

  // ── Summer ──
  [DESC_DM_TOP_EN]:
    "빈티지 레이스 캐미솔을 재해석한 크롭 탑입니다. 가벼운 아이보리 패브릭 위에 별 모양 크로셰 모티프와 " +
    "플라워 레이스 디테일을 더해 자유로운 보헤미안 무드를 표현했습니다. 섬세한 크로셰 장식이 자연스럽게 " +
    "흩뿌려져 마치 사막 위 신기루처럼 부드럽고 몽환적인 분위기를 연출합니다.",
  [DESC_DM_PANTS_EN]:
    "와이드 실루엣 데님 팬츠에 크로셰 패널을 결합하여 제작된 제품입니다. 자연스럽게 바랜 데님 텍스처와 " +
    "밑단을 따라 이어지는 크로셰 디테일이 조화를 이루며, 클래식한 데님 팬츠에 새로운 표정을 더합니다. " +
    "움직일 때마다 드러나는 니트 패널이 컬렉션 특유의 자유로운 감성을 완성합니다.",
  [DESC_DM_BOOTS_EN]:
    "미래적인 광택감을 가진 홀로그램 웨스턴 부츠입니다. 클래식 웨스턴 부츠 실루엣 위에 오로라처럼 " +
    "변화하는 표면 텍스처를 적용하여, 빈티지 데님과 강렬한 대비를 만들어냅니다. 사막의 신기루를 " +
    "연상시키는 독특한 광택이 Denim Mirage 컬렉션의 상징적인 포인트가 됩니다.",
  [DESC_BV_TOP_EN]:
    "파스텔 블루와 크림 컬러의 크로셰 패널을 조합해 제작된 미니 드레스입니다. 몸을 따라 자연스럽게 " +
    "흐르는 실루엣 위에 다양한 플라워 모티프와 리본 장식을 더해 여름 정원의 꽃들이 피어나는 모습을 " +
    "표현했습니다. 가벼운 레이어드 구조와 핸드메이드 디테일이 어우러져 Summer Bloom Veil 컬렉션의 " +
    "중심이 되는 아이템입니다.",
  [DESC_BV_SCARF_EN]:
    "드레스 상단을 감싸는 투명한 시폰 스카프입니다. 꽃잎이 바람에 흩날리는 순간을 표현한 디자인으로, " +
    "크로셰 디테일과 자연스럽게 연결되며 룩에 부드러운 입체감을 더합니다. 가볍게 드레이프되는 실루엣이 " +
    "로맨틱한 분위기를 완성합니다.",
  [DESC_BV_SHOES_EN]:
    "아이보리 컬러의 스트랩 샌들 위에 크로셰 플라워 모티프를 더해 제작된 제품입니다. 가벼운 여름 " +
    "드레스와 자연스럽게 어우러지도록 디자인되었으며, 섬세한 꽃 장식이 발끝까지 컬렉션의 무드를 " +
    "이어줍니다. 은은한 광택과 안정적인 힐 실루엣이 우아한 균형을 완성합니다.",
  [DESC_RD_KNIT_EN]:
    "오프숄더 실루엣과 새틴 리본 디테일이 돋보이는 탑입니다. 부드럽게 드레이프되는 네크라인과 볼륨감 " +
    "있는 소매가 인형 드레스 특유의 로맨틱한 분위기를 연출합니다. 중앙의 리본 장식은 Ribbon Doll " +
    "컬렉션의 상징적인 요소로, 사랑스럽고 우아한 무드를 더합니다.",
  [DESC_RD_SKIRT_EN]:
    "손뜨개 텍스처가 돋보이는 미니 니트 스커트입니다. 허리의 스트링 디테일과 부드러운 니트 조직이 " +
    "어우러져 편안하면서도 사랑스러운 실루엣을 연출합니다. 인형의 니트웨어에서 영감을 받은 디자인으로, " +
    "탑과 함께 착용 시 하나의 완성된 룩을 만들어냅니다.",
  [DESC_RD_SOCKS_EN]:
    "플라워 패턴이 섬세하게 짜여진 레이스 타이츠입니다. 다리 전체를 감싸는 우아한 레이스 패턴이 룩에 " +
    "로맨틱한 분위기를 더하며, 니트 스커트와 자연스럽게 연결되어 인형 같은 스타일을 완성합니다.",
  [DESC_RD_SHOES_EN]:
    "은은한 핑크 컬러의 클래식 발레 플랫 슈즈입니다. 둥근 토 쉐입과 미니 리본 장식이 조화를 이루며, " +
    "컬렉션 특유의 사랑스럽고 빈티지한 무드를 완성합니다. 과하지 않은 디테일로 다양한 스타일링에도 " +
    "자연스럽게 어우러집니다.",
};

// 상품별 상세 컷 — 등록된 상품은 상세 모달에서 이 순서 그대로 노출된다.
// 폴더명에 공백이 있어 세그먼트별로 URL 인코딩한다.
export const detailCut = (...segments: string[]) => {
  const files = segments.pop()!.split(",");
  const dir = segments.map(encodeURIComponent).join("/");
  return files.map((f) => `/Product_Detail_Cut/${dir}/${f}`);
};

// Front → Side_01 → Side_02 → Back → Product Detail 01~05(가변)
export const STD_ORDER = ["Front.png", "Side_01.png", "Side_02.png", "Back.png"];
// ext — 새로 받은 컷은 jpg로 오는 경우가 있어 확장자를 선택할 수 있게 한다 (기본 png)
// back — 네 번째 컷 파일명. 일부 상품(Soft Reverie)은 Back 대신 Bottom으로 왔다.
export const stdOrder = (ext: string, back: string = "Back") =>
  ["Front", "Side_01", "Side_02", back].map((f) => `${f}.${ext}`);
export const withDetails = (
  season: string, family: string, variant: string, detailCount: number,
  ext: string = "png", back: string = "Back",
) =>
  detailCut(season, family, variant, [
    ...stdOrder(ext, back),
    ...Array.from({ length: detailCount }, (_, i) => `Product_Detail_0${i + 1}.${ext}`),
  ].join(","));

export const DETAIL_IMAGES: Record<string, string[]> = {
  // Tundra Fur Jacket만 하위 variant 폴더 없이 시즌 바로 아래 있다.
  "Tundra Fur Jacket": detailCut("Winter", "Tundra Fur Jacket", [
    ...STD_ORDER,
    "Product_Detail_01.png", "Product_Detail_02.png", "Product_Detail_03.png", "Product_Detail_04.png",
  ].join(",")),

  // Denim Mirage 패밀리 — Pants(Denim Mirage 본체) / Top(Mirage Top) / Shoes(Mirage Boots)
  "Denim Mirage":  withDetails("Summer", "Denim Mirage", "Pants", 5),
  "Mirage Top":    withDetails("Summer", "Denim Mirage", "Top", 5),
  "Mirage Boots":  withDetails("Summer", "Denim Mirage", "Shoes", 5),

  // Ribbon Doll 패밀리 — 폴더명과 1:1 일치
  "Ribbon Doll Knit":  withDetails("Summer", "Ribbon Doll", "Top", 5),
  "Ribbon Doll Skirt": withDetails("Summer", "Ribbon Doll", "Skirt", 4), // 이 컷만 Product Detail 4장뿐
  "Ribbon Doll Socks": withDetails("Summer", "Ribbon Doll", "Socks", 5),
  "Ribbon Doll Shoes": withDetails("Summer", "Ribbon Doll", "Shoes", 5),

  // Summer Bloom Veil 패밀리 — Top(Bloom Veil) / Scrarf(Bloom Scarf) / Shoes(Bloom Shoes)
  "Bloom Veil":  withDetails("Summer", "Summer Bloom Veil", "Top", 5),
  "Bloom Scarf": withDetails("Summer", "Summer Bloom Veil", "Scrarf", 5),
  "Bloom Shoes": withDetails("Summer", "Summer Bloom Veil", "Shoes", 5),

  // Frozen Bloom 패밀리
  "Frozen Bloom Dress":      withDetails("Winter", "Frozen Bloom", "Dress", 5),
  "Frozen Bloom Leg Warmer": withDetails("Winter", "Frozen Bloom", "Socks", 5),
  "Frozen Bloom Boots":      withDetails("Winter", "Frozen Bloom", "Boots", 5),

  // Tundra 패밀리(2차) — 폴더명이 "Tundra " (끝에 공백 포함). 컷은 jpg로 받았다.
  "Tundra Knit":  withDetails("Winter", "Tundra ", "Knit", 5, "jpg"),
  "Tundra Boots": withDetails("Winter", "Tundra ", "Shoes", 5, "jpg"),
  "Tundra Layered Skirt": withDetails("Winter", "Tundra ", "Skirt", 4, "jpg"), // 이 컷만 Product Detail 4장뿐

  // ── Spring (전부 jpg) ──
  // Blooming Garden 패밀리 — Heels 상품은 폴더명도 Heels(설명상으론 부츠 실루엣)
  "Blooming Garden Dress":      withDetails("Spring", "Blooming Garden", "Dress", 5, "jpg"),
  "Blooming Garden Leg Warmer": withDetails("Spring", "Blooming Garden", "Leg Warmer", 5, "jpg"),
  "Blooming Garden Heels":      withDetails("Spring", "Blooming Garden", "Heels", 5, "jpg"),

  // Bloom Tailored 패밀리 — 폴더명과 1:1 일치
  "Bloom Tailored Jacket": withDetails("Spring", "Bloom Tailored", "Jacket", 5, "jpg"),
  "Bloom Tailored Pants":  withDetails("Spring", "Bloom Tailored", "Pants", 5, "jpg"),
  "Bloom Tailored Bag":    withDetails("Spring", "Bloom Tailored", "Bag", 5, "jpg"),
  "Bloom Tailored Heels":  withDetails("Spring", "Bloom Tailored", "Heels", 5, "jpg"),

  // Soft Reverie 패밀리 — 네 번째 컷이 Back이 아니라 Bottom으로 왔다.
  // Bottom(상품) → Pants 폴더, Slippers → Shoes 폴더.
  "Soft Reverie Top":      withDetails("Spring", "Soft Reverie", "Top", 5, "jpg", "Bottom"),
  "Soft Reverie Pants":   withDetails("Spring", "Soft Reverie", "Pants", 5, "jpg", "Bottom"),
  "Soft Reverie Slippers": withDetails("Spring", "Soft Reverie", "Shoes", 5, "jpg", "Bottom"),

  // ── Fall (전부 jpg) ──
  "Pastel Grung Knit":  withDetails("Fall", "Pastel Grung", "Knit", 5, "jpg"),
  "Pastel Grung Pants": withDetails("Fall", "Pastel Grung", "Pants", 5, "jpg"),

  // Frosted Office 패밀리 — Heels 상품은 Shoes 폴더, Glasses 상품은 Glass 폴더
  "Frosted Office Jacket":  withDetails("Fall", "Frosted Office", "Jacket", 5, "jpg"),
  "Frosted Office Skirt":   withDetails("Fall", "Frosted Office", "Skirt", 5, "jpg"),
  "Frosted Office Heels":   withDetails("Fall", "Frosted Office", "Shoes", 5, "jpg"),
  "Frosted Office Glasses": withDetails("Fall", "Frosted Office", "Glass", 5, "jpg"),

  // Contrast Grung 패밀리 — Shirts 상품은 Shirt 폴더
  "Contrast Grung Shirts": withDetails("Fall", "Contrast Grung", "Shirt", 5, "jpg"),
  "Contrast Grung Pants":  withDetails("Fall", "Contrast Grung", "Pants", 5, "jpg"),
};

// ─── 상세 모달 레이아웃 (1920 기준 고정 px) ───────────────────────────────────
// 패널이 고정 크기라 이미지 프레임 크기를 직접 계산한다. 높이에만 맞추면 1:1 컷이
// 가로로 넘치고, 폭에만 맞추면 3:4 컷이 세로로 넘치므로 둘 다 만족하는 값을 쓴다.
export const MODAL_W = 1560;
export const MODAL_H = 960;
export const MODAL_PAD = 28;        // 패널 바깥 여백 = 이미지 좌측 여백
export const THUMB_W = 72;
export const THUMB_COL_PAD = 10;    // 선택 테두리가 열 경계에 닿지 않도록 하는 안쪽 여백
export const THUMB_SCROLLBAR_W = 8; // 스크롤바가 차지하는 폭 (globals.css의 3px + 여유)
// border-box라 패딩과 스크롤바가 모두 width 안에 들어간다. 셋을 다 더해야 썸네일이 안 눌린다.
export const THUMB_COL_W = THUMB_W + THUMB_COL_PAD * 2 + THUMB_SCROLLBAR_W;
// 이미지 우측 여백 = flex gap + 썸네일 열 안쪽 패딩. 좌측 여백(MODAL_PAD)과 같아지도록 역산한다.
export const GALLERY_GAP = MODAL_PAD - THUMB_COL_PAD;
export const GALLERY_PAD_R = 16;    // 썸네일 열이 오른쪽 경계선에 붙지 않게
export const IMG_AREA_W = 740;      // 이미지 프레임 폭 (에셋 제작 기준)
export const GALLERY_W = MODAL_PAD + IMG_AREA_W + GALLERY_GAP + THUMB_COL_W + GALLERY_PAD_R;
export const IMG_AREA_H = MODAL_H - MODAL_PAD * 2;

// 프레임 비율은 고정한다. 컷마다 비율을 따라가게 두면 프레임 크기가 바뀌면서
// 하단 여백과 썸네일 스크롤바가 컷에 따라 생겼다 사라진다.
// 갤러리에 남는 공간이 없도록 사용 가능한 영역(636 x 904)을 그대로 비율로 쓴다.
export const FRAME_RATIO = IMG_AREA_W / IMG_AREA_H;
// ADD TO CART 높이 — 이 값만 바꾸면 버튼 크기가 조정된다
export const ADD_TO_CART_H = 64;

// 상품별 세부 정보 — 값이 있는 항목만 아코디언에 노출된다.
export type SizeRow = { size: string; length: string; shoulder: string; chest: string; sleeve: string };
export type ShoeRow = { size: string; footLength: string; eu: string };
export type ProductInfo = {
  // 선택 버튼에 노출할 사이즈 목록. 없으면 의류 기본(XS~XL).
  sizes?: readonly string[];
  sizeTable?: SizeRow[];
  // 신발류는 총장/어깨너비 대신 이 표를 쓴다
  shoeTable?: ShoeRow[];
  // FREE 단일 사이즈 소품용 — 품목마다 재는 부위가 달라 열 이름과 값을 함께 넣는다
  freeTable?: { columns: string[]; values: string[] };
  material?: string;
  care?: string;
};

// 신발 사이즈표 — mm 사이즈, 발길이(cm), EU 환산(통상 기준의 근사치)
export const SHOE_TABLE: ShoeRow[] = [
  { size: "230", footLength: "23.0cm", eu: "36" },
  { size: "240", footLength: "24.0cm", eu: "37" },
  { size: "250", footLength: "25.0cm", eu: "38.5" },
  { size: "260", footLength: "26.0cm", eu: "40" },
  { size: "270", footLength: "27.0cm", eu: "42" },
];
// 신발류 공통 — 사이즈 버튼과 표만 신발용으로 바꾼다
export const SHOE_INFO = { sizes: SHOE_SIZES, shoeTable: SHOE_TABLE } as const;

// 상품마다 실측치가 다르므로, 아직 값을 안 넣은 상품은 이 기본값(Tundra Fur Jacket
// 기준)으로 채운다. 탭 자체(세부 정보/사이즈/소재 및 관리/배송 및 반품)는 모든 상품에
// 동일하게 노출되고, 내용만 상품별로 나중에 채워 넣으면 된다.
export const DEFAULT_INFO: ProductInfo = {
  sizeTable: [
    { size: "XS", length: "66cm", shoulder: "50cm", chest: "58cm", sleeve: "55cm" },
    { size: "S",  length: "68cm", shoulder: "52cm", chest: "60cm", sleeve: "56cm" },
    { size: "M",  length: "70cm", shoulder: "54cm", chest: "62cm", sleeve: "57cm" },
    { size: "L",  length: "72cm", shoulder: "56cm", chest: "64cm", sleeve: "58cm" },
    { size: "XL", length: "74cm", shoulder: "58cm", chest: "66cm", sleeve: "59cm" },
  ],
  material:
    "프리미엄 에코 퍼, 핸드메이드 뜨개 패치, 폴리에스터 새틴 안감을 사용하여 " +
    "보온성과 부드러운 착용감을 제공합니다.",
  care:
    "제품의 형태와 소재를 오래 유지하기 위해 드라이클리닝을 권장하며, " +
    "세탁 전 뜨개 패치를 분리해 주세요. 직사광선을 피해 보관하시기 바랍니다.",
};

// 상품별로 값을 채워 넣을 곳. 아직은 비어 있고, 전부 DEFAULT_INFO를 그대로 쓴다.
export const PRODUCT_INFO: Record<string, ProductInfo> = {
  "Tundra Fur Jacket": DEFAULT_INFO,
  // 사이즈표는 아직 실측치가 없어 DEFAULT_INFO(Tundra Fur Jacket 기준)를 그대로 쓴다.
  "Frozen Bloom Boots": {
    ...SHOE_INFO,
    material:
      "프리미엄 스웨이드 텍스처와 부드러운 내피 소재를 사용하여 보온성과 편안한 착화감을 " +
      "제공합니다. 다양한 스타일과 조화롭게 어우러지는 미니멀한 디자인이 특징입니다.",
    care:
      "오염 시 부드러운 브러시로 가볍게 관리해 주세요. 물기와 직사광선을 피해 보관하시고, " +
      "형태 유지를 위해 통풍이 잘되는 곳에서 보관하시기 바랍니다.",
  },
  "Frozen Bloom Dress": {
    sizeTable: DEFAULT_INFO.sizeTable,
    material:
      "프리미엄 니트 원사와 핸드메이드 뜨개 디테일을 사용하여 부드러운 착용감과 우아한 실루엣을 " +
      "제공합니다. 몸을 자연스럽게 감싸는 니트 소재와 드레이프 디테일이 조화를 이루어 편안하면서도 " +
      "세련된 스타일을 완성합니다.",
    care:
      "제품의 형태와 뜨개 디테일을 오래 유지하기 위해 드라이클리닝을 권장합니다. 장시간 마찰과 " +
      "늘어짐에 주의하시고, 직사광선을 피해 보관하시기 바랍니다.",
  },
  "Frozen Bloom Leg Warmer": {
    sizeTable: DEFAULT_INFO.sizeTable,
    material:
      "핸드메이드 뜨개 원사로 제작되어 가볍고 유연한 착용감을 제공합니다. 섬세한 오픈워크 패턴이 " +
      "특징이며 다양한 스타일링에 포인트를 더할 수 있습니다.",
    care:
      "손세탁 또는 드라이클리닝을 권장합니다. 뜨개 조직이 손상되지 않도록 강한 마찰을 피하고, " +
      "평평한 곳에 눕혀 건조해 주시기 바랍니다.",
  },

  // ── Spring — public/Product_Detail_Cut/Spring/<패밀리>/<품목>/소재 및 관리 파일 원문.
  //    사이즈표는 아직 실측치가 없어 DEFAULT_INFO를 그대로 쓴다.
  "Blooming Garden Dress": {
    sizeTable: DEFAULT_INFO.sizeTable,
    material:
      "핸드메이드 크로셰 플라워 모티프, 니트 베이스 원단, 입체 플라워 아플리케 디테일을 사용하여 정원 " +
      "속 꽃들이 피어난 듯한 풍성한 입체감을 표현했습니다. 수작업으로 연결된 다양한 꽃 모티프가 " +
      "유기적으로 어우러져 독창적인 실루엣을 완성합니다.",
    care:
      "제품의 형태와 장식을 오래 유지하기 위해 드라이클리닝을 권장합니다. 꽃 모티프 부분에 강한 " +
      "마찰이나 당김을 가하지 마시고, 보관 시에는 접어서 보관해 주세요. 직사광선과 고온 환경은 변색 및 " +
      "형태 변형의 원인이 될 수 있으므로 피해주시기 바랍니다. 꽃 장식이 많은 의류는 열과 마찰, 과도한 " +
      "세탁에 의해 손상될 수 있으므로 섬세한 관리가 필요합니다.",
  },
  "Blooming Garden Leg Warmer": {
    sizeTable: DEFAULT_INFO.sizeTable,
    material:
      "핸드메이드 크로셰 플라워 모티프와 니트 구조를 결합하여 제작된 레그워머입니다. 다양한 크기와 " +
      "컬러의 꽃 장식이 입체적으로 배치되어 드레스와 자연스럽게 연결되는 하나의 조형적 오브제로 " +
      "기능합니다.",
    care:
      "드라이클리닝을 권장하며, 착용 시 꽃 장식 부분이 날카로운 물체에 걸리지 않도록 주의해 주세요. " +
      "세탁 시 강한 비틀기나 탈수는 형태 변형을 유발할 수 있습니다. 보관 시에는 평평하게 접어 보관하는 " +
      "것을 권장합니다. 크로셰 장식은 늘어남을 방지하기 위해 접어서 보관하는 것이 좋습니다.",
  },
  "Blooming Garden Heels": {
    ...SHOE_INFO,
    material:
      "부츠 베이스 위에 핸드메이드 크로셰 플라워 모티프를 입체적으로 부착하여 제작되었습니다. 신발과 " +
      "크로셰 장식이 결합된 구조로 Blooming Garden 특유의 화려하고 조형적인 실루엣을 완성합니다.",
    care:
      "부드러운 천으로 오염 부위를 가볍게 닦아 관리해 주세요. 장식 부분에 직접적인 물 세척은 피하시고, " +
      "비나 눈에 젖었을 경우 통풍이 잘 되는 그늘에서 충분히 건조해 주세요. 꽃 장식 부분에 과도한 " +
      "압력이 가해지지 않도록 주의해 주시기 바랍니다.",
  },
  "Bloom Tailored Jacket": {
    sizeTable: DEFAULT_INFO.sizeTable,
    material:
      "테일러드 수트 원단, 핸드메이드 크로셰 플라워 모티프, 입체 플라워 아플리케 디테일, 시어 러플 " +
      "커프스를 사용하여 제작되었습니다. 구조적인 재킷 실루엣 위에 수작업 꽃 장식이 유기적으로 배치되어 " +
      "Bloom Tailored Edition 특유의 우아하면서도 조형적인 분위기를 완성합니다.",
    care:
      "제품의 형태와 장식을 오래 유지하기 위해 드라이클리닝을 권장합니다. 크로셰 플라워와 아플리케 " +
      "장식 부분에 강한 마찰이나 압력을 가하지 마시고, 보관 시에는 넓은 옷걸이에 걸어 형태를 유지해 " +
      "주세요. 직사광선과 고온 환경은 변색 및 장식 손상의 원인이 될 수 있으므로 피해주시기 바랍니다. " +
      "입체 장식이 있는 의류는 일반 세탁 시 형태가 변형될 수 있어 전문 세탁 관리가 권장됩니다.",
  },
  "Bloom Tailored Pants": {
    sizeTable: DEFAULT_INFO.sizeTable,
    material:
      "테일러드 수트 원단과 핸드메이드 크로셰 레이스 모티프를 사용하여 제작되었습니다. 여유로운 와이드 " +
      "실루엣과 밑단의 꽃 장식이 조화를 이루며, 움직임에 따라 섬세한 디테일이 드러나는 것이 특징입니다.",
    care:
      "드라이클리닝을 권장합니다. 밑단의 크로셰 장식이 눌리거나 접히지 않도록 보관해 주세요. 착용 " +
      "후에는 통풍이 잘 되는 곳에서 충분히 환기한 뒤 보관하는 것이 좋으며, 스팀 사용 시에는 장식 " +
      "부위에 직접적인 열이 닿지 않도록 주의해 주시기 바랍니다.",
  },
  "Bloom Tailored Bag": {
    sizes: ["FREE"],
    freeTable: { columns: ["가로", "세로", "폭", "스트랩"], values: ["28cm", "20cm", "9cm", "52cm"] },
    material:
      "가방 전면에 핸드메이드 크로셰 플라워 모티프와 프린지 디테일을 적용하여 제작되었습니다. 정제된 " +
      "구조의 백 디자인과 유기적인 꽃 장식이 대비를 이루며 컬렉션의 핵심 아이덴티티를 보여줍니다.",
    care:
      "오염 발생 시 부드러운 천으로 가볍게 닦아 관리해 주세요. 물세탁은 권장하지 않으며, 꽃 장식 " +
      "부분에 과도한 마찰이나 압력이 가해지지 않도록 주의해 주시기 바랍니다. 사용하지 않을 때는 내부 " +
      "충전재를 넣어 형태를 유지한 상태로 보관하는 것을 권장합니다.",
  },
  "Bloom Tailored Heels": {
    ...SHOE_INFO,
    material:
      "슈즈 바디와 동일한 톤의 크로셰 플라워 모티프를 적용하여 제작되었습니다. 우아한 포인티드 토 " +
      "실루엣과 섬세한 꽃 장식이 결합되어 룩 전체를 하나의 완성된 정원처럼 연결합니다.",
    care:
      "부드러운 천으로 오염 부위를 가볍게 닦아 관리해 주세요. 물에 장시간 노출되는 것을 피하고, 비에 " +
      "젖었을 경우 통풍이 잘 되는 그늘에서 자연 건조해 주세요. 꽃 장식 부분은 마찰에 의해 손상될 수 " +
      "있으므로 보관 시 개별 더스트백 사용을 권장합니다.",
  },
  "Soft Reverie Top": {
    sizeTable: DEFAULT_INFO.sizeTable,
    material:
      "은은한 광택감을 지닌 폴리에스터 새틴 원단과 섬세한 크로셰 니트 소재를 함께 사용하여 " +
      "제작되었습니다. 부드러운 촉감과 가벼운 착용감이 특징이며, 서로 다른 소재가 조화를 이루어 우아한 " +
      "실루엣을 완성합니다.",
    care:
      "드라이클리닝을 권장합니다. 크로셰 조직은 마찰에 의해 늘어날 수 있으므로 착용 및 보관 시 주의해 " +
      "주세요. 세탁이 필요한 경우 차가운 물에서 손세탁 후 평평한 곳에 눕혀 자연 건조해 주세요. " +
      "직사광선 노출은 피해 주세요.",
  },
  "Soft Reverie Pants": {
    sizeTable: DEFAULT_INFO.sizeTable,
    material:
      "고밀도 폴리에스터 새틴 원단으로 제작되어 자연스러운 드레이프와 은은한 광택감을 제공합니다. " +
      "가볍고 부드러운 착용감이 특징이며 움직임에 따라 우아한 실루엣이 연출됩니다.",
    care:
      "드라이클리닝을 권장합니다. 장시간 접어 보관할 경우 주름이 발생할 수 있으므로 옷걸이에 걸어 " +
      "보관해 주세요. 다림질 시에는 반드시 낮은 온도에서 천을 덧대어 사용해 주세요.",
  },
  // 다른 시즌 신발류 — 소재·관리 원문은 아직 없어 기본값을 쓰고, 사이즈만 신발용으로 바꾼다
  "Tundra Boots":          { ...DEFAULT_INFO, sizeTable: undefined, ...SHOE_INFO },

  // ── Fall — public/Product_Detail_Cut/Fall/Pastel Grung/<품목>/소재 및 관리 파일 원문
  "Pastel Grung Knit": {
    sizeTable: DEFAULT_INFO.sizeTable,
    material:
      "부드러운 터치감의 코튼 블렌드 니트 소재로 제작되었습니다. 가벼운 착용감과 자연스러운 신축성을 " +
      "제공하며, 빈티지한 무드의 패턴과 파스텔 컬러가 조화를 이루어 편안하면서도 개성 있는 스타일을 " +
      "완성합니다.",
    care:
      "드라이클리닝 또는 찬물 손세탁을 권장합니다. 니트 특성상 옷걸이에 장시간 걸어둘 경우 형태가 " +
      "변형될 수 있으므로 접어서 보관해 주세요. 세탁 후에는 평평한 곳에 눕혀 자연 건조하는 것을 " +
      "권장합니다.",
  },
  "Pastel Grung Pants": {
    sizeTable: DEFAULT_INFO.sizeTable,
    material:
      "코튼과 폴리에스터가 혼방된 탄탄한 원단으로 제작되었습니다. 부드러운 촉감과 안정적인 형태감을 " +
      "유지하며, 활동성이 뛰어나 일상적인 착용에도 편안함을 제공합니다.",
    care:
      "드라이클리닝을 권장합니다. 세탁 시에는 뒤집어서 단독 세탁해 색상 변형을 최소화해 주세요. " +
      "건조기 사용은 피하고 통풍이 잘 되는 그늘에서 자연 건조하는 것을 권장합니다. 주름이 생길 경우 " +
      "낮은 온도로 가볍게 다림질해 주세요.",
  },

  "Frosted Office Jacket": {
    sizeTable: DEFAULT_INFO.sizeTable,
    material:
      "고밀도 울 블렌드 원단과 수작업 크로셰 칼라 디테일을 적용하여 제작되었습니다. 재킷 본체는 형태 " +
      "유지력이 우수하며, 크로셰 칼라는 부드러운 입체감을 더해줍니다. 단정한 수트 구조와 핸드메이드 " +
      "디테일이 조화를 이루는 것이 특징입니다.",
    care:
      "드라이클리닝을 권장합니다. 크로셰 칼라 부분은 강한 마찰을 피하고, 보관 시 어깨 형태를 유지할 수 " +
      "있는 옷걸이를 사용해 주세요. 장기간 보관 시에는 커버를 씌워 직사광선을 피해 보관하는 것을 " +
      "권장합니다.",
  },
  "Frosted Office Skirt": {
    sizeTable: DEFAULT_INFO.sizeTable,
    material:
      "울 블렌드 소재를 사용하여 제작되었습니다. 탄탄한 조직감과 부드러운 착용감을 동시에 제공하며, " +
      "오랜 착용에도 형태가 쉽게 무너지지 않습니다.",
    care:
      "드라이클리닝을 권장합니다. 착용 후에는 통풍이 잘 되는 곳에서 충분히 환기해 주세요. 장시간 접어서 " +
      "보관하기보다 걸어서 보관하는 것이 형태 유지에 도움이 됩니다.",
  },
  "Frosted Office Heels": {
    ...SHOE_INFO,
    material:
      "매끄러운 레더 텍스처 소재를 적용하여 제작되었습니다. 심플한 외관과 안정적인 착화감을 중심으로 " +
      "설계되었으며 다양한 스타일링에 활용 가능합니다.",
    care:
      "부드러운 천으로 오염 부위를 가볍게 닦아 관리해 주세요. 물에 장시간 노출되는 것을 피하고, 사용 " +
      "후에는 슈트리를 넣거나 형태를 유지한 상태로 보관하는 것을 권장합니다.",
  },
  "Frosted Office Glasses": {
    sizes: ["FREE"], // 선글라스 — 단일 사이즈
    freeTable: { columns: ["렌즈너비", "브릿지", "템플길이", "전체너비"], values: ["52mm", "18mm", "145mm", "140mm"] },
    material:
      "가벼운 아세테이트 프레임과 틴트 렌즈를 적용하여 제작되었습니다. 투명한 프레임 특유의 깔끔한 " +
      "인상이 특징이며 장시간 착용에도 부담이 적습니다.",
    care:
      "전용 안경 천으로 렌즈를 관리해 주세요. 사용하지 않을 때에는 하드 케이스에 보관하여 스크래치를 " +
      "방지하는 것을 권장합니다. 고온 환경이나 직사광선에 장시간 노출되는 것을 피해주세요.",
  },
  "Contrast Grung Shirts": {
    sizeTable: DEFAULT_INFO.sizeTable,
    material:
      "고밀도 코튼 원단으로 제작되어 부드러운 착용감과 자연스러운 실루엣을 제공합니다. 가벼우면서도 " +
      "형태 유지력이 우수하며, 착용할수록 자연스러운 텍스처가 형성됩니다.",
    care:
      "30°C 이하의 찬물 세탁 또는 드라이클리닝을 권장합니다. 세탁 후 옷걸이에 걸어 자연 건조해 주세요. " +
      "다림질이 필요한 경우 중저온에서 사용해 주시고, 원단 손상을 방지하기 위해 천을 덧대어 다림질하는 " +
      "것을 권장합니다.",
  },
  "Contrast Grung Pants": {
    sizeTable: DEFAULT_INFO.sizeTable,
    material:
      "가벼운 나일론 블렌드 원단을 사용하여 제작되었습니다. 자연스럽게 형성되는 크링클 텍스처가 " +
      "특징이며, 측면 포켓에는 손뜨개 니트 패널을 적용해 소재 간의 대비를 강조했습니다. 가볍지만 " +
      "내구성이 우수하여 활동적인 착용에도 적합합니다.",
    care:
      "드라이클리닝을 권장합니다. 세탁 시 강한 탈수는 피하고 자연 건조해 주세요. 크링클 텍스처는 디자인 " +
      "요소이므로 다림질을 통해 완전히 펴지 않도록 주의해 주세요. 니트 포켓 부분은 마찰에 의해 손상될 " +
      "수 있으므로 착용 및 보관 시 주의가 필요합니다. 접어서 보관하기보다 옷걸이에 걸어 형태를 유지하는 " +
      "것을 권장합니다.",
  },

  // ── Summer — public/Product_Detail_Cut/Summer/<패밀리>/<품목>/소재 및 관리 파일 원문
  "Mirage Top": {
    sizeTable: DEFAULT_INFO.sizeTable,
    material:
      "코튼 블렌드 원단과 핸드 크로셰 모티프를 함께 사용하여 제작되었습니다. 가볍고 통기성이 뛰어나며, " +
      "섬세한 크로셰 별 장식과 레이스 트리밍이 입체적인 텍스처를 형성합니다. 여름 시즌에 편안하게 착용할 " +
      "수 있는 것이 특징입니다.",
    care:
      "손세탁 또는 드라이클리닝을 권장합니다. 크로셰 장식 부분은 강한 마찰에 의해 변형될 수 있으므로 " +
      "주의해 주세요. 세탁 후에는 평평한 곳에 눕혀 자연 건조하는 것을 권장합니다.",
  },
  "Denim Mirage": {
    sizeTable: DEFAULT_INFO.sizeTable,
    material:
      "프리미엄 데님 원단과 수작업 크로셰 패널을 적용하여 제작되었습니다. 탄탄한 데님 조직감과 부드러운 " +
      "니트 텍스처가 대비를 이루며, 편안한 착용감과 독창적인 실루엣을 제공합니다.",
    care:
      "찬물 단독 세탁 또는 드라이클리닝을 권장합니다. 데님 특성상 이염이 발생할 수 있으므로 밝은 색상 " +
      "제품과 분리하여 관리해 주세요. 크로셰 패널 부분은 다림질 시 천을 덮어 낮은 온도로 관리하는 것을 " +
      "권장합니다.",
  },
  "Mirage Boots": {
    ...SHOE_INFO,
    material:
      "홀로그램 코팅이 적용된 합성 레더 소재로 제작되었습니다. 빛의 각도에 따라 다양한 색감이 나타나며, " +
      "가볍고 내구성이 우수한 것이 특징입니다. 안정적인 힐 구조로 편안한 착용감을 제공합니다.",
    care:
      "부드러운 마른 천으로 오염 부위를 가볍게 닦아 관리해 주세요. 표면 코팅 손상을 방지하기 위해 거친 " +
      "소재와의 마찰을 피하고, 직사광선이 강한 장소에서 장시간 보관하는 것을 권장하지 않습니다. 사용하지 " +
      "않을 때에는 형태를 유지한 상태로 보관해 주세요.",
  },
  "Bloom Veil": {
    sizeTable: DEFAULT_INFO.sizeTable,
    material:
      "핸드 크로셰 패널과 소프트 튤, 시폰 소재를 함께 사용하여 제작되었습니다. 가볍고 통기성이 우수하며, " +
      "다양한 플라워 모티프가 입체적인 텍스처를 형성합니다. 크로셰와 시어 소재의 조합이 여름 특유의 " +
      "가벼운 무드를 강조합니다.",
    care:
      "드라이클리닝을 권장합니다. 플라워 모티프와 크로셰 장식은 강한 마찰에 의해 변형될 수 있으므로 " +
      "주의해 주세요. 보관 시에는 접기보다 옷걸이에 걸어 형태를 유지하는 것을 권장합니다.",
  },
  "Bloom Scarf": {
    sizes: ["FREE"], // 스카프 — 단일 사이즈
    freeTable: { columns: ["길이", "너비"], values: ["180cm", "32cm"] },
    material:
      "초경량 시폰 소재를 사용하여 제작되었습니다. 은은한 비침과 부드러운 광택이 특징이며, 움직임에 따라 " +
      "자연스럽게 흐르는 실루엣을 연출합니다.",
    care:
      "손세탁 또는 드라이클리닝을 권장합니다. 날카로운 액세서리와의 마찰을 피하고, 세탁 후에는 비틀어 " +
      "짜지 말고 평평한 곳에서 자연 건조해 주세요. 보관 시에는 접힘 자국이 생기지 않도록 걸어서 보관하는 " +
      "것이 좋습니다.",
  },
  "Bloom Shoes": {
    ...SHOE_INFO,
    material:
      "새틴 텍스처 스트랩과 크로셰 플라워 모티프를 적용하여 제작되었습니다. 부드러운 광택과 섬세한 장식 " +
      "디테일이 특징이며, 가볍고 편안한 착용감을 제공합니다.",
    care:
      "부드러운 천으로 오염 부위를 가볍게 닦아 관리해 주세요. 물에 장시간 노출되는 것을 피하고, 젖었을 " +
      "경우 통풍이 잘 되는 그늘에서 자연 건조해 주세요. 플라워 모티프 부분은 마찰에 의해 손상될 수 " +
      "있으므로 보관 시 개별 더스트백 사용을 권장합니다.",
  },
  "Ribbon Doll Knit": {
    sizeTable: DEFAULT_INFO.sizeTable,
    material:
      "소프트 코튼 블렌드 원단과 레이스 트리밍, 새틴 리본 디테일을 적용하여 제작되었습니다. 부드러운 " +
      "촉감과 편안한 착용감을 제공하며, 가벼운 셔링 디테일이 자연스러운 실루엣을 완성합니다.",
    care:
      "손세탁 또는 드라이클리닝을 권장합니다. 리본과 레이스 부분은 마찰에 의해 손상될 수 있으므로 주의해 " +
      "주세요. 세탁 후에는 형태를 정리한 뒤 자연 건조하는 것을 권장합니다.",
  },
  "Ribbon Doll Skirt": {
    sizeTable: DEFAULT_INFO.sizeTable,
    material:
      "프리미엄 코튼 혼방 니트와 크로셰 조직을 사용하여 제작되었습니다. 부드럽고 가벼운 착용감이 " +
      "특징이며, 핸드메이드 감성이 살아있는 텍스처를 제공합니다.",
    care:
      "찬물 손세탁을 권장합니다. 니트 특성상 늘어짐을 방지하기 위해 세탁 후 평평한 곳에서 자연 건조해 " +
      "주세요. 장시간 옷걸이에 걸어 보관하는 것은 권장하지 않습니다.",
  },
  "Ribbon Doll Socks": {
    sizes: ["FREE"], // 타이츠 — 단일 사이즈
    freeTable: { columns: ["총장", "발길이", "권장 신장"], values: ["96cm", "22–25cm", "155–170cm"] },
    material:
      "신축성이 우수한 레이스 니트 원단으로 제작되었습니다. 가볍고 부드러운 착용감을 제공하며, 섬세한 " +
      "플라워 패턴이 특징입니다.",
    care:
      "손세탁을 권장합니다. 날카로운 액세서리나 거친 표면과의 접촉을 피해주세요. 세탁 시에는 뒤집어서 " +
      "세탁망 사용을 권장하며, 비틀어 짜지 말고 자연 건조해 주세요.",
  },
  "Ribbon Doll Shoes": {
    ...SHOE_INFO,
    material:
      "매트한 레더 텍스처 소재와 리본 장식을 적용하여 제작되었습니다. 가볍고 편안한 착화감을 제공하며, " +
      "부드러운 핑크 컬러가 전체 룩과 조화롭게 연결됩니다.",
    care:
      "부드러운 천으로 오염 부위를 가볍게 닦아 관리해 주세요. 물에 장시간 노출되는 것을 피하고, 사용 " +
      "후에는 형태를 유지한 상태로 보관하는 것을 권장합니다. 리본 장식은 강한 마찰을 피하여 관리해 " +
      "주세요.",
  },

  "Soft Reverie Slippers": {
    ...SHOE_INFO,
    material:
      "새틴 텍스처를 적용한 합성피혁 소재와 리본 장식을 사용하여 제작되었습니다. 부드러운 광택감과 " +
      "우아한 분위기를 동시에 표현하며, 컬렉션의 섬세한 무드를 완성합니다.",
    care:
      "부드러운 천으로 오염 부위를 가볍게 닦아 관리해 주세요. 물에 장시간 노출되는 것을 피하고, 젖었을 " +
      "경우 통풍이 잘 되는 그늘에서 자연 건조해 주세요. 형태 유지를 위해 슈즈 전용 더스트백 또는 박스에 " +
      "보관하는 것을 권장합니다.",
  },
};
