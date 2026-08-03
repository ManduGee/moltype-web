import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import ZoomController from "@/components/ZoomController";

export const metadata: Metadata = {
  title: "MOLTYPE",
  description: "Thread by Thread",
  icons: {
    icon: [
      { url: "/Moltype_Web-Logo.png", type: "image/png" },
    ],
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
    <html lang="en" suppressHydrationWarning>
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
        {children}
      </body>
    </html>
  );
}
