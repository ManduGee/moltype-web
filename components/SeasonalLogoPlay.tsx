"use client";

import { useRef, useState } from "react";

// 봄 → 여름 → 가을 → 겨울 순서로 이어 재생되는 로고플레이 모션 시퀀스
const SEASON_VIDEOS = [
  "/봄_로고플레이.mp4",
  "/여름_로고플레이.mp4",
  "/가을_로고플레이.mp4",
  "/겨울_로고플레이.mp4",
] as const;

interface Props {
  style?: React.CSSProperties;
  className?: string;
}

export default function SeasonalLogoPlay({ style, className }: Props) {
  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleEnded = () => {
    setIndex((prev) => (prev + 1) % SEASON_VIDEOS.length);
  };

  return (
    <video
      key={SEASON_VIDEOS[index]}
      ref={videoRef}
      src={SEASON_VIDEOS[index]}
      autoPlay
      muted
      playsInline
      onEnded={handleEnded}
      className={className}
      style={{ width: "100%", height: "100%", objectFit: "cover", ...style }}
    />
  );
}
