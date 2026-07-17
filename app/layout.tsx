import type { Metadata } from "next";
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
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/sunn-us/SUIT/fonts/static/woff2/SUIT.css"
        />
      </head>
      <body style={{ backgroundColor: "#ffffff", margin: 0, padding: 0 }}>
        {/* 방식 B — 1920 기준 통일: 화면 폭에 맞춰 전체를 균일 줌.
            홈(/)은 캔버스 인터랙션이 자체 반응형이라 줌 제외. 모바일(<=768)도 줌 1(추후 반응형 별도). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              function setZoom(){
                var w = window.innerWidth;
                var isHome = location.pathname === '/';
                var z = (isHome || w <= 768) ? 1 : (w/1920);
                document.documentElement.style.zoom = z;
                document.documentElement.style.setProperty('--inv-zoom', String(1/z));
              }
              setZoom();
              window.addEventListener('resize', setZoom);
            })();`,
          }}
        />
        <ZoomController />
        {children}
      </body>
    </html>
  );
}
