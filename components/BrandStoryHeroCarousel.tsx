"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// 영상 교체가 쉽도록 경로를 배열로 관리 — 봄 → 여름 → 가을 → 겨울
const HERO_VIDEOS = [
  { src: "/Spring_Real_FInal.mp4", label: "Spring" },
  { src: "/Summer_Real_Final.mp4", label: "Summer" },
  { src: "/Fall_Real_Final.mp4",   label: "Autumn" },
  { src: "/Winter_final_Motion.mp4", label: "Winter" },
] as const;

const TRANSITION_SEC = 1.2;       // 크로스페이드 시간 (부드러운 전환)
const AUTO_ADVANCE_MS = 9500;     // 자동 전환 간격 — 영상 마지막 부분을 충분히 보여준 후 부드럽게 전환 (9.5초)

interface Props {
  // controlled 모드: 외부에서 activeIndex와 onChange를 넘기면 외부 state를 사용
  activeIndex?: number;
  onChange?: (index: number) => void;
  autoPlay?: boolean; // false면 자동 전환 비활성화
  loopVideo?: boolean; // true면 영상 루프
}

export default function BrandStoryHeroCarousel({ activeIndex: externalIndex, onChange, autoPlay = true, loopVideo = false }: Props = {}) {
  const [internalIndex, setInternalIndex] = useState(0);
  const activeIndex = externalIndex !== undefined ? externalIndex : internalIndex;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const loopDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);


  // 비디오 재생 제어: active 비디오만 재생, 나머지는 일시정지
  useEffect(() => {
    if (loopDelayRef.current) clearTimeout(loopDelayRef.current);
    videoRefs.current.forEach((video, idx) => {
      if (video) {
        if (idx === activeIndex) {
          video.currentTime = 0;
          video.play().catch(() => {}); // 재생 실패 무시 (오토플레이 정책)
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [activeIndex]);

  const startTimer = () => {
    if (!autoPlay) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const next = (activeIndex + 1) % HERO_VIDEOS.length;
      if (onChange) onChange(next);
      else setInternalIndex(next);
    }, AUTO_ADVANCE_MS);
  };

  useEffect(() => {
    if (!autoPlay) return;
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay]);

  const goTo = (i: number) => {
    if (onChange) onChange(i);
    else setInternalIndex(i);
    if (autoPlay) startTimer();
  };

  const goToOffset = (offset: number) => {
    goTo((activeIndex + offset + HERO_VIDEOS.length) % HERO_VIDEOS.length);
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* 와이드 hero 영역 — 화면 너비를 채우되 세로로 과도하게 늘어나지 않도록 비율 고정 */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          maxHeight: "78vh",
          overflow: "hidden",
          backgroundColor: "#111111",
        }}
      >
        {HERO_VIDEOS.map((video, i) => (
          <motion.div
            key={video.src}
            initial={false}
            animate={{ opacity: i === activeIndex ? 1 : 0 }}
            transition={{ duration: TRANSITION_SEC, ease: [0.4, 0, 0.2, 1] }}
            style={{ position: "absolute", inset: 0 }}
          >
            <video
              ref={(el) => {
                videoRefs.current[i] = el;
              }}
              src={video.src}
              muted
              playsInline
              preload="auto"
              loop
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </motion.div>
        ))}

        {/* 좌우 화살표 — 드래그/스와이프 보조 내비게이션 */}
        <button
          aria-label="Previous video"
          onClick={() => goToOffset(-1)}
          style={{
            position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)",
            width: "36px", height: "36px", borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.5)",
            backgroundColor: "rgba(0,0,0,0.25)",
            color: "#ffffff", fontSize: "15px",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", zIndex: 2,
          }}
        >
          ←
        </button>
        <button
          aria-label="Next video"
          onClick={() => goToOffset(1)}
          style={{
            position: "absolute", right: "20px", top: "50%", transform: "translateY(-50%)",
            width: "36px", height: "36px", borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.5)",
            backgroundColor: "rgba(0,0,0,0.25)",
            color: "#ffffff", fontSize: "15px",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", zIndex: 2,
          }}
        >
          →
        </button>

        {/* 하단 중앙 dot pagination */}
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "10px",
            zIndex: 2,
          }}
        >
          {HERO_VIDEOS.map((video, i) => {
            const active = i === activeIndex;
            return (
              <button
                key={video.src}
                aria-label={`Go to ${video.label} video`}
                onClick={() => goTo(i)}
                style={{
                  width: active ? "22px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  backgroundColor: active ? "#ffffff" : "rgba(255,255,255,0.4)",
                  transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
