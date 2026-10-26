import type { Metadata } from "next";

// 이 폴더의 page.tsx는 클라이언트 컴포넌트라 metadata를 직접 내보낼 수 없어, 여기에 둔다.
export const metadata: Metadata = {
  title: "FLAGSHIP STORE",
  description: "MOLTYPE 플래그십 스토어와 공간 안내. 직접 만져보고 완성해보는 오프라인 경험.",
  openGraph: { images: ["/og.png"], title: "FLAGSHIP STORE | MOLTYPE", description: "MOLTYPE 플래그십 스토어와 공간 안내. 직접 만져보고 완성해보는 오프라인 경험." },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
