"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { CartItem } from "@/lib/products";

// 장바구니 — 페이지를 옮겨도 담은 게 유지돼야 해서 전역 상태로 두고 localStorage에 저장한다.
// (예전에는 /product 페이지 안의 로컬 state라 탭을 옮기면 비워졌고, 헤더의 장바구니는
//  항상 "비어있습니다"만 보여줬다.)
const STORAGE_KEY = "moltype:cart";

type CartContextValue = {
  items: CartItem[];
  add: (item: CartItem) => void;
  removeAt: (index: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue>({
  items: [],
  add: () => {},
  removeAt: () => {},
  clear: () => {},
});

export const useCart = () => useContext(CartContext);

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  // 서버에서 만든 HTML과 첫 렌더가 어긋나지 않도록, 저장된 값은 마운트 후에 읽는다
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return; // 읽기 전에 빈 배열로 덮어쓰지 않도록
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, loaded]);

  const value: CartContextValue = {
    items,
    add: (item) => setItems((prev) => [...prev, item]),
    removeAt: (index) => setItems((prev) => prev.filter((_, i) => i !== index)),
    clear: () => setItems([]),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
