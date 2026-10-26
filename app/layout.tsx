import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION } from "@/lib/site";
import ZoomController from "@/components/ZoomController";
import CartProvider from "@/components/CartProvider";

export const metadata: Metadata = {
  // 페이지마다 "<페이지 이름> | MOLTYPE" 으로 붙는다 (각 폴더의 layout.tsx 참고)
  title: {
    default: SITE_TITLE,
    template: "%s | MOLTYPE",
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: "/Moltype_Web-Logo.png", type: "image/png" },
    ],
  },
  // 카카오톡·인스타그램·슬랙 등에 링크를 붙일 때 보이는 미리보기
  openGraph: {
    type: "website",
    siteName: "MOLTYPE",
    locale: "ko_KR",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "MOLTYPE" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: "미완성으로 도착하는 옷. 마지막 한 코는 입는 사람의 몫입니다.",
    images: ["/og.png"],
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* 아래 zoom-init 스크립트가 하이드레이션 전에 html의 style(zoom, --inv-zoom)을
       바꾸므로 서버 HTML과 달라진다. 의도된 조작이라 이 요소만 불일치 경고를 끈다. */
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* SUIT은 public/fonts에 포함돼 globals.css에서 @font-face로 등록한다.
            Pretendard는 SUIT이 못 덮는 글리프용 폴백이라 CDN 유지. */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body style={{ backgroundColor: "#ffffff", margin: 0, padding: 0 }}>
        {/* 방식 B — 1920 기준 통일: 화면 폭에 맞춰 전체를 균일 줌.
            홈(/)은 캔버스 인터랙션이 자체 반응형이라 줌 제외. 모바일(<=768)도 줌 1(추후 반응형 별도).
            next/script(beforeInteractive)로 실행 — raw <script> 태그는 하이드레이션 불일치를 유발한다. */}
        <Script id="zoom-init" strategy="beforeInteractive">
          {`(function(){
              function setZoom(){
                var w = window.innerWidth;
                var isHome = location.pathname === '/';
                var z = (isHome || w <= 768) ? 1 : (w/1920);
                document.documentElement.style.zoom = z;
                document.documentElement.style.setProperty('--inv-zoom', String(1/z));
              }
              setZoom();
              window.addEventListener('resize', setZoom);
            })();`}
        </Script>
        <ZoomController />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
