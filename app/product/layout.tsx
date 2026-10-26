import type { Metadata } from "next";

// 이 폴더의 page.tsx는 클라이언트 컴포넌트라 metadata를 직접 내보낼 수 없어, 여기에 둔다.
export const metadata: Metadata = {
  title: "PRODUCT",
  description: "봄·여름·가을·겨울 네 시즌 컬렉션. 뜨개 패치와 크로셰 모티프로 직접 완성하는 MOLTYPE의 제품을 만나보세요.",
  openGraph: { images: ["/og.png"], title: "PRODUCT | MOLTYPE", description: "봄·여름·가을·겨울 네 시즌 컬렉션. 뜨개 패치와 크로셰 모티프로 직접 완성하는 MOLTYPE의 제품을 만나보세요." },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
