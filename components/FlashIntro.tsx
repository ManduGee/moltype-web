"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FONTS } from "@/lib/assets";
import { HEADER_H } from "@/components/Header";

// 오프닝 — 접속 직후(또는 로고 클릭 시) 재생. 타이포 컷 없이 영상 두 개를 이어서 보여준다.
// 1) Logo_Motion_VoiceO.mp4 — 소리 포함, 언뮤트로 먼저 재생
// 2) Main_Interaction.mp4  — 기존 모션. 끝나기 직전 DRAW TO KNIT 캔버스 크기로 축소되며 이어진다
type Phase = "voice" | "main" | "done";

const SHRINK_WINDOW = 1.0; // 영상 종료 전 이 구간(초) 동안 DRAW TO KNIT 크기(72%)로 축소
const SHRINK_TO = 0.72;    // computeLogoRect의 w = vw * 0.72 와 동일
const STALL_LIMIT = 6;     // 500ms × 6 = 3초 정지 시 다음 단계로 강제 진행

export default function FlashIntro({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>("voice");
  // 실제로 소리가 나는지(정책상 강제 음소거된 경우도 반영) — 버튼 아이콘의 기준
  const [soundOn, setSoundOn] = useState(true);
  const doneRef = useRef(false);
  const voiceRef = useRef<HTMLVideoElement>(null);
  const mainRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);

  const activeRef = phase === "voice" ? voiceRef : mainRef;

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setPhase("done");
    setTimeout(onDone, 350);
  };

  // 재생 감시 — setInterval 기반이라 백그라운드 탭에서도 동작한다 (rAF는 hidden 탭에서 완전 정지).
  // 브라우저가 영상을 강제 pause시키면 재개하고, 3초 이상 진행이 없으면 다음 단계로 넘어간다
  // (오버레이가 페이지를 영원히 덮는 것 방지).
  useEffect(() => {
    if (phase === "done") return;
    let lastT = -1;
    let stallCount = 0;
    const advance = () => (phase === "voice" ? setPhase("main") : finish());
    const t = setInterval(() => {
      const v = activeRef.current;
      if (!v) return;
      if (v.currentTime !== lastT) {
        lastT = v.currentTime;
        stallCount = 0;
        return;
      }
      stallCount += 1;
      if (v.paused && !doneRef.current) v.play().catch(() => {});
      if (stallCount >= STALL_LIMIT) advance();
    }, 500);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // rAF로 매 프레임 직접 transform을 갱신 — main 단계에서만, 종료 직전 DRAW TO KNIT 크기로 축소
  useEffect(() => {
    if (phase !== "main") return;
    const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);
    const loop = () => {
      const v = mainRef.current;
      if (v && v.duration) {
        const remaining = v.duration - v.currentTime;
        const raw = remaining <= SHRINK_WINDOW ? 1 - Math.max(0, remaining) / SHRINK_WINDOW : 0;
        const scale = 1 - easeOutQuad(raw) * (1 - SHRINK_TO);
        v.style.transform = `scale(${scale})`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [phase]);

  // 단계가 바뀌면(보이스 → 메인) 방금 전 소리 on/off 선택을 새로 시작하는 영상에도 그대로 적용한다
  useEffect(() => {
    const v = activeRef.current;
    if (v) v.muted = !soundOn;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation(); // 버튼 클릭이 인트로 스킵(finish)으로 번지지 않게
    const next = !soundOn;
    setSoundOn(next);
    const v = activeRef.current;
    if (v) v.muted = !next;
  };

  return (
    <motion.div
      onClick={finish}
      animate={{ opacity: phase === "done" ? 0 : 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{
        // 상단을 헤더 높이만큼 내려서, 모션 자체가 헤더 아래에서 시작한다
        // (헤더가 모션 위에 그냥 겹쳐 위쪽이 가려 보이는 것과 다르다).
        position: "fixed", top: HEADER_H, left: 0, right: 0, bottom: 0, zIndex: 10000,
        backgroundColor: "#000000",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden", cursor: "pointer",
      }}
    >
      {/* 1단계 — 보이스 모션 (소리 포함). 자동재생 정책상 언뮤트가 막히면 음소거로 폴백한다. */}
      {phase === "voice" && (
        <motion.video
          ref={voiceRef}
          key="voice-motion"
          src="/Logo_Motion_VoiceO.mp4"
          playsInline
          onEnded={() => setPhase("main")}
          onError={() => setPhase("main")}
          onLoadedData={(e) => {
            const v = e.currentTarget;
            v.muted = !soundOn;
            v.play().catch(() => {
              // 언뮤트 재생이 막히면(자동재생 정책) 음소거로라도 재생하고, 버튼 표시도 맞춘다
              v.muted = true;
              setSoundOn(false);
              v.play().catch(() => setPhase("main"));
            });
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}

      {/* 2단계 — 기존 메인 인터랙션 영상. 끝나기 직전 DRAW TO KNIT 크기로 축소 (rAF로 매 프레임 갱신) */}
      {phase === "main" && (
        <motion.video
          ref={mainRef}
          key="main-interaction"
          src="/Main_Interaction.mp4"
          autoPlay
          muted={!soundOn}
          playsInline
          onEnded={finish}
          onError={finish}
          onLoadedData={(e) => {
            const v = e.currentTarget;
            v.play().catch(() => finish());
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{ width: "100%", height: "100%", objectFit: "cover", willChange: "transform" }}
        />
      )}

      {/* 음소거 토글 — 화면 우상단. 컨테이너 자체가 이미 헤더 아래에서 시작하므로
          여기서는 헤더 높이를 다시 더하지 않는다. */}
      {phase !== "done" && (
        <button
          onClick={toggleSound}
          aria-label={soundOn ? "Mute" : "Unmute"}
          style={{
            position: "absolute", top: 20, right: 24, zIndex: 1,
            width: 40, height: 40, borderRadius: "50%",
            background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", backdropFilter: "blur(4px)",
          }}
        >
          <SoundIcon on={soundOn} />
        </button>
      )}

      {/* 클릭 유도 힌트 — 손가락 탭 애니메이션 + CLICK! 텍스트. 화면 중앙 하단. */}
      <AnimatePresence>
        {phase !== "done" && <TapHint />}
      </AnimatePresence>
    </motion.div>
  );
}

function SoundIcon({ on }: { on: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="4 9 8 9 12 5 12 19 8 15 4 15 4 9" fill="#fff" stroke="none" />
      {on ? (
        <>
          <path d="M16.5 8.5a5 5 0 0 1 0 7" />
          <path d="M19 6a9 9 0 0 1 0 12" />
        </>
      ) : (
        <path d="M17 9l5 6M22 9l-5 6" />
      )}
    </svg>
  );
}

// 손가락으로 탭하는 듯한 작은 인터랙션 — 링이 퍼졌다 사라지고, 그 위에 점(손끝)이
// 눌리듯 스케일 다운했다 올라오는 동작을 반복한다.
function TapHint() {
  return (
    <motion.div
      key="tap-hint"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      style={{
        position: "absolute", bottom: "9%", left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
        pointerEvents: "none",
      }}
    >
      <div style={{ position: "relative", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* 퍼지는 링 */}
        <motion.span
          animate={{ scale: [0.4, 1.6], opacity: [0.6, 0] }}
          transition={{ duration: 1.3, repeat: Infinity, ease: "easeOut" }}
          style={{
            position: "absolute", width: 30, height: 30, borderRadius: "50%",
            border: "1.5px solid #ffffff",
          }}
        />
        {/* 손끝 — 눌렸다 떼지는 탭 동작 */}
        <motion.span
          animate={{ scale: [1, 0.72, 1] }}
          transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut", times: [0, 0.35, 1] }}
          style={{
            width: 14, height: 14, borderRadius: "50%",
            background: "#ffffff",
          }}
        />
      </div>
      <span style={{
        fontFamily: FONTS.condensed, fontWeight: 700,
        fontSize: "15px", letterSpacing: "0.04em", textTransform: "uppercase",
        color: "#ffffff",
      }}>
        Click!
      </span>
    </motion.div>
  );
}
