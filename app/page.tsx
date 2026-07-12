"use client";

import { useEffect, useState } from "react";
import InteractiveLogoIntro from "@/components/InteractiveLogoIntro";
import FlashIntro from "@/components/FlashIntro";

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
      {showFlash && <FlashIntro onDone={() => setShowFlash(false)} />}
    </div>
  );
}
