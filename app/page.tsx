"use client";

import { useEffect, useState } from "react";
import InteractiveLogoIntro from "@/components/InteractiveLogoIntro";
import FlashIntro from "@/components/FlashIntro";
import MotionScatterGallery from "@/components/MotionScatterGallery";

export default function Page() {
  // 홈 진입(새로고침 포함) 또는 로고 클릭 시 항상 인트로 재생
  const [showFlash, setShowFlash] = useState(true);

  useEffect(() => {
    const replay = () => setShowFlash(true);
    window.addEventListener("moltype:replay-intro", replay);
    return () => window.removeEventListener("moltype:replay-intro", replay);
  }, []);

  return (
    <div style={{ background: "#000000", minHeight: "100vh" }}>
      <InteractiveLogoIntro />
      {/* 드로잉 완료(COMPLETE) 후 스크롤이 열리면 나타나는 세로 스캐터 모션 갤러리 */}
      <MotionScatterGallery />
      {showFlash && <FlashIntro onDone={() => setShowFlash(false)} />}
    </div>
  );
}
