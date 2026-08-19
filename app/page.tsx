"use client";

import { useEffect, useState } from "react";
import InteractiveLogoIntro from "@/components/InteractiveLogoIntro";
import FlashIntro from "@/components/FlashIntro";
import MotionScatterGallery, { GALLERY_ID, RETURN_TO_GALLERY_KEY } from "@/components/MotionScatterGallery";

export default function Page() {
  // 홈 진입(새로고침 포함) 또는 로고 클릭 시 항상 인트로 재생
  const [showFlash, setShowFlash] = useState(true);
  // 상품 페이지에서 뒤로 돌아온 경우 — 인트로·뜨개 체험을 건너뛰고 갤러리로 바로 간다
  const [returningToGallery, setReturningToGallery] = useState(false);

  useEffect(() => {
    const replay = () => setShowFlash(true);
    window.addEventListener("moltype:replay-intro", replay);
    return () => window.removeEventListener("moltype:replay-intro", replay);
  }, []);

  // 표시는 읽는 즉시 지운다 — 이 뒤에 새로고침하면 원래대로 인트로부터 시작한다.
  // sessionStorage를 렌더 중이 아니라 이 시점에 읽는 이유: 서버에서 미리 만든 HTML과
  // 첫 렌더가 어긋나(hydration mismatch) 화면이 깜빡이는 것을 피하기 위해서다.
  useEffect(() => {
    let flagged = false;
    try {
      flagged = sessionStorage.getItem(RETURN_TO_GALLERY_KEY) === "1";
      if (flagged) sessionStorage.removeItem(RETURN_TO_GALLERY_KEY);
    } catch {}
    if (!flagged) return;
    setShowFlash(false);
    setReturningToGallery(true);
  }, []);

  // 갤러리로 스크롤 — 뜨개 섹션이 '완료' 상태로 바뀌어 스크롤 잠금이 풀린 뒤에 실행돼야 한다.
  useEffect(() => {
    if (!returningToGallery) return;
    const toGallery = () =>
      document.getElementById(GALLERY_ID)?.scrollIntoView({ block: "center" });
    // 먼저 즉시 이동한다 — rAF에만 맡기면 배경 탭처럼 프레임이 멈춘 상황에서 영영 실행되지 않는다.
    toGallery();
    // 이미지가 늦게 자리를 잡아 위치가 밀리는 경우를 대비해 다음 프레임에 한 번 더 맞춘다.
    const raf = requestAnimationFrame(toGallery);
    return () => cancelAnimationFrame(raf);
  }, [returningToGallery]);

  return (
    <div style={{ background: "#000000", minHeight: "100vh" }}>
      <InteractiveLogoIntro startCompleted={returningToGallery} />
      {/* 드로잉 완료(COMPLETE) 후 스크롤이 열리면 나타나는 대각선 모션 갤러리 */}
      <MotionScatterGallery />
      {showFlash && <FlashIntro onDone={() => setShowFlash(false)} />}
    </div>
  );
}
