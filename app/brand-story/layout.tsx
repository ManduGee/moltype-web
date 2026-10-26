import type { Metadata } from "next";

// 이 폴더의 page.tsx는 클라이언트 컴포넌트라 metadata를 직접 내보낼 수 없어, 여기에 둔다.
export const metadata: Metadata = {
  title: "BRAND STORY",
  description: "미완성이라는 태도에서 출발한 MOLTYPE의 브랜드 스토리. 벗고 다시 입히는 옷, 그리고 마지막 한 코의 의미.",
  openGraph: { images: ["/og.png"], title: "BRAND STORY | MOLTYPE", description: "미완성이라는 태도에서 출발한 MOLTYPE의 브랜드 스토리. 벗고 다시 입히는 옷, 그리고 마지막 한 코의 의미." },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
