import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // public/ 의 영상·이미지는 기본값(max-age=0)이라 다시 방문할 때마다 전부 서버에 확인을 받았다.
  // 하루는 브라우저에 그대로 두고, 그 뒤 일주일은 쓰면서 뒤에서 새로 확인한다.
  // (같은 파일명으로 교체하는 일이 잦아 1년짜리 immutable은 쓰지 않는다 — 교체 후 최대 하루면 반영된다)
  async headers() {
    return [
      {
        source: "/:all*(mp4|png|jpg|jpeg|webp)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
    ];
  },
};

export default nextConfig;
