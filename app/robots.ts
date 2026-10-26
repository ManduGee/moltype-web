import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// 검색엔진 수집 규칙. 도메인은 lib/site.ts 한 곳에서만 바꾸면 된다.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
