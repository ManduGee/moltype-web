import type { Metadata } from "next";

// 이 폴더의 page.tsx는 클라이언트 컴포넌트라 metadata를 직접 내보낼 수 없어, 여기에 둔다.
export const metadata: Metadata = {
  title: "WORKSHOP",
  description: "MOLTYPE 워크숍 — 예약만 하면 누구나. 미완성된 의류와 재료를 골라 직접 마지막 한 코를 완성하는 체험 프로그램.",
  openGraph: { images: ["/og.png"], title: "WORKSHOP | MOLTYPE", description: "MOLTYPE 워크숍 — 예약만 하면 누구나. 미완성된 의류와 재료를 골라 직접 마지막 한 코를 완성하는 체험 프로그램." },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
