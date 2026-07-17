"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// 방식 B — 1920 기준 자동 줌. 홈(/)과 모바일(<=768)은 줌 1로 두고, 그 외는 화면 폭/1920 배율로 통일.
// 인라인 스크립트는 최초 로드(깜빡임 방지)를 담당하고, 이 컴포넌트는 SPA 라우트 전환 + 리사이즈를 담당한다.
export default function ZoomController() {
  const pathname = usePathname();

  useEffect(() => {
    const setZoom = () => {
      const w = window.innerWidth;
      const isHome = pathname === "/";
      const z = isHome || w <= 768 ? 1 : w / 1920;
      (document.documentElement.style as unknown as { zoom: string }).zoom = String(z);
      // 헤더 등 줌을 상쇄해 1:1로 고정할 요소용 역수 변수
      document.documentElement.style.setProperty("--inv-zoom", String(1 / z));
    };
    setZoom();
    window.addEventListener("resize", setZoom);
    return () => window.removeEventListener("resize", setZoom);
  }, [pathname]);

  return null;
}
