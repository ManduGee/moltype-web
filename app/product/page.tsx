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
// 신발류 — 230부터 270까지 10mm 단위
const SHOE_SIZES = ["230", "240", "250", "260", "270"] as const;

// 한글 설명은 DESC_KO에서 영문 설명을 키로 찾으므로, 상수로 묶어 양쪽이 어긋나지 않게 한다.
// 줄바꿈은 원문 그대로 유지한다 (렌더링 시 white-space: pre-line)
const DESC_TUNDRA_EN =
  "A statement outerwear piece that pairs exceptional warmth with\n" +
  "an effortlessly refined silhouette.\n" +
  "Crochet patches can be added to the sleeves and hood,\n" +
  "transforming the jacket into a personalized expression of style.";

// 아래 desc 상수들은 실제로 화면에 표시되지 않고 DESC_KO 조회용 키로만 쓰인다
// (세부 정보 탭은 한글만 노출한다).
const DESC_TUNDRA_KNIT_EN = "Tundra Knit — soft knit with customizable crochet patches.";
const DESC_TUNDRA_BOOTS_EN = "Tundra Boots — fur-lined boots with customizable crochet patches.";
const DESC_TUNDRA_SKIRT_EN = "Tundra Layered Skirt — lace and knit layers with crochet patch points.";
const DESC_FROZEN_DRESS_EN = "Frozen Bloom Dress — slim knit silhouette with crocheted floral detail.";
const DESC_FROZEN_LEGWARMER_EN = "Frozen Bloom Leg Warmers — crocheted texture reminiscent of ice crystals.";
const DESC_FROZEN_BOOTS_EN = "Frozen Bloom Boots — minimal silhouette paired with the leg warmers.";

// Spring — 설명은 public/Product_Detail_Cut/Spring/<패밀리>/<품목>/설명 파일 원문
const DESC_BG_DRESS_EN     = "Blooming Garden Dress — hundreds of hand-crocheted flowers layered into a mini dress.";
const DESC_BG_LEGWARMER_EN = "Blooming Garden Leg Warmer — the dress's flower motifs flowing down the leg.";
const DESC_BG_HEELS_EN     = "Blooming Garden Heels — platform boots crowned with crocheted flowers.";
const DESC_BT_JACKET_EN    = "Bloom Tailored Jacket — crocheted flowers blooming over precise tailoring.";
const DESC_BT_PANTS_EN     = "Bloom Tailored Pants — restrained wide silhouette with crochet lace at the hem.";
const DESC_BT_BAG_EN       = "Bloom Tailored Bag — refined bag with crochet flowers and fringe.";
const DESC_BT_HEELS_EN     = "Bloom Tailored Heels — pointed-toe heels with crocheted flower detail.";
const DESC_SR_TOP_EN       = "Soft Reverie Top — satin panels with delicate crochet sleeves.";
const DESC_SR_PANTS_EN    = "Soft Reverie Pants — softly flowing wide satin pants.";
const DESC_SR_SLIPPERS_EN  = "Soft Reverie Slippers — satin-textured shoes with ribbon detail.";

// ─── 시즌별 상품 데이터 ────────────────────────────────────────────────────────
const SEASON_PRODUCTS = [
  // 0 — Spring
  [
    { id: 1,  name: "Blooming Garden Dress",      tag: "SPRING / 2026", desc: DESC_BG_DRESS_EN,     image: "/assets/Spring/Website_Product_Asset_01.png", bg: "#F8FDF9", price: "₩ 128,000" },
    { id: 2,  name: "Blooming Garden Leg Warmer", tag: "SPRING / 2026", desc: DESC_BG_LEGWARMER_EN, image: "/assets/Spring/Website_Product_Asset_02.png", bg: "#F8FDF9", price: "₩ 148,000" },
    { id: 3,  name: "Blooming Garden Heels",      tag: "SPRING / 2026", desc: DESC_BG_HEELS_EN,     image: "/assets/Spring/Website_Product_Asset_03.png", bg: "#F8FDF9", price: "₩ 108,000" },
    { id: 4,  name: "Bloom Tailored Jacket",      tag: "SPRING / 2026", desc: DESC_BT_JACKET_EN,    image: "/assets/Spring/Website_Product_Asset_04.png", bg: "#F8FDF9", price: "₩ 168,000" },
    { id: 5,  name: "Bloom Tailored Pants",       tag: "SPRING / 2026", desc: DESC_BT_PANTS_EN,     image: "/assets/Spring/Website_Product_Asset_05.png", bg: "#F8FDF9", price: "₩ 138,000" },
    { id: 6,  name: "Bloom Tailored Bag",         tag: "SPRING / 2026", desc: DESC_BT_BAG_EN,       image: "/assets/Spring/Website_Product_Asset_06.png", bg: "#F8FDF9", price: "₩ 128,000" },
    { id: 7,  name: "Bloom Tailored Heels",       tag: "SPRING / 2026", desc: DESC_BT_HEELS_EN,     image: "/assets/Spring/Website_Product_Asset_07.png", bg: "#F8FDF9", price: "₩ 118,000" },
    { id: 8,  name: "Soft Reverie Top",           tag: "SPRING / 2026", desc: DESC_SR_TOP_EN,       image: "/assets/Spring/Website_Product_Asset_08.png", bg: "#F8FDF9", price: "₩ 112,000" },
    { id: 9,  name: "Soft Reverie Pants",        tag: "SPRING / 2026", desc: DESC_SR_PANTS_EN,    image: "/assets/Spring/Website_Product_Asset_09.png", bg: "#F8FDF9", price: "₩ 158,000" },
    { id: 10, name: "Soft Reverie Slippers",      tag: "SPRING / 2026", desc: DESC_SR_SLIPPERS_EN,  image: "/assets/Spring/Website_Product_Asset_10.png", bg: "#F8FDF9", price: "₩ 142,000" },
  ],
  // 1 — Summer
  [
    { id: 1,  name: "Mirage Top", tag: "SUMMER / 2026", desc: "A ribbed crop top with an open neckline. Designed to be completed.", image: "/assets/Summer/Website_Product_Asset_01.png", bg: "#F8FDF9", price: "₩ 128,000" },
    { id: 2,  name: "Denim Mirage", tag: "SUMMER / 2026", desc: "Open-ended wear for open-ended use. Patch the flower or leave it.",   image: "/assets/Summer/Website_Product_Asset_02.png", bg: "#F8FDF9", price: "₩ 148,000" },
    { id: 3,  name: "Mirage Boots", tag: "SUMMER / 2026", desc: "A pair of shorts with space left at the seam.",                       image: "/assets/Summer/Website_Product_Asset_03.png", bg: "#F8FDF9", price: "₩ 108,000" },
    { id: 4,  name: "Bloom Veil", tag: "SUMMER / 2026", desc: "The seam is the question. You decide where it ends.",                 image: "/assets/Summer/Website_Product_Asset_05.png", bg: "#F8FDF9", price: "₩ 138,000" },
    { id: 5,  name: "Bloom Scarf", tag: "SUMMER / 2026", desc: "A ribbed crop top with an open neckline. Designed to be completed.",  image: "/assets/Summer/Website_Product_Asset_06.png", bg: "#F8FDF9", price: "₩ 128,000" },
    // 04번 에셋 교체분 — 꽃 장식 샌들이라 Bloom 패밀리로 옮기고 05, 06 뒤에 배치했다.
    { id: 6,  name: "Bloom Shoes", tag: "SUMMER / 2026", desc: "A wearable surface made to be interrupted. Same form, new skin.",     image: "/assets/Summer/Website_Product_Asset_04.png", bg: "#F8FDF9", price: "₩ 168,000" },
    { id: 7,  name: "Ribbon Doll Knit", tag: "SUMMER / 2026", desc: "Open-ended wear for open-ended use. Patch the flower or leave it.",   image: "/assets/Summer/Website_Product_Asset_07.png", bg: "#F8FDF9", price: "₩ 118,000" },
    { id: 8,  name: "Ribbon Doll Skirt", tag: "SUMMER / 2026", desc: "A pair of shorts with space left at the seam.",                       image: "/assets/Summer/Website_Product_Asset_08.png", bg: "#F8FDF9", price: "₩ 108,000" },
    { id: 9,  name: "Ribbon Doll Socks", tag: "SUMMER / 2026", desc: "A wearable surface made to be interrupted. Same form, new skin.",     image: "/assets/Summer/Website_Product_Asset_09.png", bg: "#F8FDF9", price: "₩ 168,000" },
    { id: 10, name: "Ribbon Doll Shoes", tag: "SUMMER / 2026", desc: "The seam is the question. You decide where it ends.",                 image: "/assets/Summer/Website_Product_Asset_10.png", bg: "#F8FDF9", price: "₩ 138,000" },
  ],
  // 2 — Autumn
  [
    { id: 1, name: "Pastel Grung Knit", tag: "AUTUMN / 2026", desc: "A wearable surface made to be interrupted. Same form, new skin.", image: "/assets/Fall/Website_Product_Asset_01.png", bg: "#F8FDF9", price: "₩ 158,000" },
    { id: 2, name: "Pastel Grung Pants", tag: "AUTUMN / 2026", desc: "A ribbed crop top with an open neckline. Designed to be completed.", image: "/assets/Fall/Website_Product_Asset_02.png", bg: "#F8FDF9", price: "₩ 128,000" },
    // 03(Pastel Grung Shoes)은 라인업에서 제외.
    { id: 3, name: "Office Contrast Jacket", tag: "AUTUMN / 2026", desc: "A pair of shorts with space left at the seam.", image: "/assets/Fall/Website_Product_Asset_04.png", bg: "#F8FDF9", price: "₩ 108,000" },
    { id: 4, name: "Office Contrast Skirt", tag: "AUTUMN / 2026", desc: "Open-ended wear for open-ended use. Patch the flower or leave it.", image: "/assets/Fall/Website_Product_Asset_05.png", bg: "#F8FDF9", price: "₩ 98,000" },
    { id: 5, name: "Office Contrast Heels", tag: "AUTUMN / 2026", desc: "A wearable surface made to be interrupted. Same form, new skin.", image: "/assets/Fall/Website_Product_Asset_06.png", bg: "#F8FDF9", price: "₩ 168,000" },
    { id: 6, name: "Office Contrast Glasses", tag: "AUTUMN / 2026", desc: "Open-ended wear for open-ended use. Patch the flower or leave it.", image: "/assets/Fall/Website_Product_Asset_07.png", bg: "#F8FDF9", price: "₩ 118,000" },
    { id: 7, name: "Contrast Grung Shirts", tag: "AUTUMN / 2026", desc: "A wearable surface made to be interrupted. Same form, new skin.", image: "/assets/Fall/Website_Product_Asset_08.png", bg: "#F8FDF9", price: "₩ 148,000" },
    { id: 8, name: "Contrast Grung Pants", tag: "AUTUMN / 2026", desc: "A ribbed crop top with an open neckline. Designed to be completed.", image: "/assets/Fall/Website_Product_Asset_09.png", bg: "#F8FDF9", price: "₩ 128,000" },
  ],
  // 3 — Winter
  [
    { id: 1, name: "Tundra Fur Jacket", tag: "WINTER / 2026", desc: DESC_TUNDRA_EN, image: "/assets/Winter/Website_Product_Asset_01.png", bg: "#F8FDF9", price: "₩ 108,000" },
    { id: 2, name: "Tundra Knit", tag: "WINTER / 2026", desc: DESC_TUNDRA_KNIT_EN, image: "/assets/Winter/Website_Product_Asset_02.png", bg: "#F8FDF9", price: "₩ 168,000" },
    { id: 3, name: "Tundra Layered Skirt", tag: "WINTER / 2026", desc: DESC_TUNDRA_SKIRT_EN, image: "/assets/Winter/Website_Product_Asset_03.png", bg: "#F8FDF9", price: "₩ 128,000" },
    // 04(Tundra Leg Warmer)는 제외. 05는 새 에셋(.jpg)으로 교체.
    { id: 4, name: "Tundra Boots", tag: "WINTER / 2026", desc: DESC_TUNDRA_BOOTS_EN, image: "/assets/Winter/Website_Product_Asset_05.png", bg: "#F8FDF9", price: "₩ 98,000" },
    { id: 5,  name: "Frozen Bloom Dress", tag: "WINTER / 2026", desc: DESC_FROZEN_DRESS_EN, image: "/assets/Winter/Website_Product_Asset_06.png", bg: "#F8FDF9", price: "₩ 128,000" },
    { id: 6,  name: "Frozen Bloom Leg Warmer", tag: "WINTER / 2026", desc: DESC_FROZEN_LEGWARMER_EN,   image: "/assets/Winter/Website_Product_Asset_07.png", bg: "#F8FDF9", price: "₩ 118,000" },
    { id: 7,  name: "Frozen Bloom Boots", tag: "WINTER / 2026", desc: DESC_FROZEN_BOOTS_EN,                       image: "/assets/Winter/Website_Product_Asset_08.png", bg: "#F8FDF9", price: "₩ 108,000" },
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
};

// 상품별 상세 컷 — 등록된 상품은 상세 모달에서 이 순서 그대로 노출된다.
// 폴더명에 공백이 있어 세그먼트별로 URL 인코딩한다.
const detailCut = (...segments: string[]) => {
  const files = segments.pop()!.split(",");
  const dir = segments.map(encodeURIComponent).join("/");
  return files.map((f) => `/Product_Detail_Cut/${dir}/${f}`);
};

// Front → Side_01 → Side_02 → Back → Product Detail 01~05(가변)
const STD_ORDER = ["Front.png", "Side_01.png", "Side_02.png", "Back.png"];
// ext — 새로 받은 컷은 jpg로 오는 경우가 있어 확장자를 선택할 수 있게 한다 (기본 png)
// back — 네 번째 컷 파일명. 일부 상품(Soft Reverie)은 Back 대신 Bottom으로 왔다.
const stdOrder = (ext: string, back: string = "Back") =>
  ["Front", "Side_01", "Side_02", back].map((f) => `${f}.${ext}`);
const withDetails = (
  season: string, family: string, variant: string, detailCount: number,
  ext: string = "png", back: string = "Back",
) =>
  detailCut(season, family, variant, [
    ...stdOrder(ext, back),
    ...Array.from({ length: detailCount }, (_, i) => `Product_Detail_0${i + 1}.${ext}`),
  ].join(","));

const DETAIL_IMAGES: Record<string, string[]> = {
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

  // ── Fall (jpg) ── Pastel Grung 패밀리. Pants는 Front/Side/Back 4컷만 있고 Product Detail이 없다.
  "Pastel Grung Knit":  withDetails("Fall", "Pastel Grung", "Knit", 5, "jpg"),
  "Pastel Grung Pants": withDetails("Fall", "Pastel Grung", "Pants", 0, "jpg"),
};

// ─── 상세 모달 레이아웃 (1920 기준 고정 px) ───────────────────────────────────
// 패널이 고정 크기라 이미지 프레임 크기를 직접 계산한다. 높이에만 맞추면 1:1 컷이
// 가로로 넘치고, 폭에만 맞추면 3:4 컷이 세로로 넘치므로 둘 다 만족하는 값을 쓴다.
const MODAL_W = 1560;
const MODAL_H = 960;
const MODAL_PAD = 28;        // 패널 바깥 여백 = 이미지 좌측 여백
const THUMB_W = 72;
const THUMB_COL_PAD = 10;    // 선택 테두리가 열 경계에 닿지 않도록 하는 안쪽 여백
const THUMB_SCROLLBAR_W = 8; // 스크롤바가 차지하는 폭 (globals.css의 3px + 여유)
// border-box라 패딩과 스크롤바가 모두 width 안에 들어간다. 셋을 다 더해야 썸네일이 안 눌린다.
const THUMB_COL_W = THUMB_W + THUMB_COL_PAD * 2 + THUMB_SCROLLBAR_W;
// 이미지 우측 여백 = flex gap + 썸네일 열 안쪽 패딩. 좌측 여백(MODAL_PAD)과 같아지도록 역산한다.
const GALLERY_GAP = MODAL_PAD - THUMB_COL_PAD;
const GALLERY_PAD_R = 16;    // 썸네일 열이 오른쪽 경계선에 붙지 않게
const IMG_AREA_W = 740;      // 이미지 프레임 폭 (에셋 제작 기준)
const GALLERY_W = MODAL_PAD + IMG_AREA_W + GALLERY_GAP + THUMB_COL_W + GALLERY_PAD_R;
const IMG_AREA_H = MODAL_H - MODAL_PAD * 2;

// 프레임 비율은 고정한다. 컷마다 비율을 따라가게 두면 프레임 크기가 바뀌면서
// 하단 여백과 썸네일 스크롤바가 컷에 따라 생겼다 사라진다.
// 갤러리에 남는 공간이 없도록 사용 가능한 영역(636 x 904)을 그대로 비율로 쓴다.
const FRAME_RATIO = IMG_AREA_W / IMG_AREA_H;
// ADD TO CART 높이 — 이 값만 바꾸면 버튼 크기가 조정된다
const ADD_TO_CART_H = 64;

// 상품별 세부 정보 — 값이 있는 항목만 아코디언에 노출된다.
type SizeRow = { size: string; length: string; shoulder: string; chest: string; sleeve: string };
type ShoeRow = { size: string; footLength: string; eu: string };
type ProductInfo = {
  // 선택 버튼에 노출할 사이즈 목록. 없으면 의류 기본(XS~XL).
  sizes?: readonly string[];
  sizeTable?: SizeRow[];
  // 신발류는 총장/어깨너비 대신 이 표를 쓴다
  shoeTable?: ShoeRow[];
  material?: string;
  care?: string;
};

// 신발 사이즈표 — mm 사이즈, 발길이(cm), EU 환산(통상 기준의 근사치)
const SHOE_TABLE: ShoeRow[] = [
  { size: "230", footLength: "23.0cm", eu: "36" },
  { size: "240", footLength: "24.0cm", eu: "37" },
  { size: "250", footLength: "25.0cm", eu: "38.5" },
  { size: "260", footLength: "26.0cm", eu: "40" },
  { size: "270", footLength: "27.0cm", eu: "42" },
];
// 신발류 공통 — 사이즈 버튼과 표만 신발용으로 바꾼다
const SHOE_INFO = { sizes: SHOE_SIZES, shoeTable: SHOE_TABLE } as const;

// 상품마다 실측치가 다르므로, 아직 값을 안 넣은 상품은 이 기본값(Tundra Fur Jacket
// 기준)으로 채운다. 탭 자체(세부 정보/사이즈/소재 및 관리/배송 및 반품)는 모든 상품에
// 동일하게 노출되고, 내용만 상품별로 나중에 채워 넣으면 된다.
const DEFAULT_INFO: ProductInfo = {
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
const PRODUCT_INFO: Record<string, ProductInfo> = {
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
    sizeTable: DEFAULT_INFO.sizeTable,
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
  "Mirage Boots":          { ...DEFAULT_INFO, sizeTable: undefined, ...SHOE_INFO },
  "Bloom Shoes":           { ...DEFAULT_INFO, sizeTable: undefined, ...SHOE_INFO },
  "Ribbon Doll Shoes":     { ...DEFAULT_INFO, sizeTable: undefined, ...SHOE_INFO },
  "Office Contrast Heels": { ...DEFAULT_INFO, sizeTable: undefined, ...SHOE_INFO },
  "Tundra Boots":          { ...DEFAULT_INFO, sizeTable: undefined, ...SHOE_INFO },

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

function ProductDetailModal({ p, onClose, onAddToCart }: { p: Product; onClose: () => void; onAddToCart: (item: CartItem) => void }) {
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
                // 신발류는 mm 사이즈표, 의류는 총장/어깨/가슴/소매 표
                body: info.shoeTable
                  ? <ShoeSizeTable rows={info.shoeTable} />
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
