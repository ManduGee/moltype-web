"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FONTS } from "@/lib/assets";

const NAV_ITEMS = [
  { label: "BRAND STORY",    href: "/brand-story" },
  { label: "PRODUCT",        href: "/product" },
  { label: "WORKSHOP",       href: "/workshop" },
  { label: "FLAGSHIP STORE", href: "/flagship-store" },
] as const;

const HEADER_H = 80; // 헤더 높이 80px
const LOGO_DISPLAY_H = 40;
const LOGO_DISPLAY_W = Math.round(LOGO_DISPLAY_H * (974 / 377)); // ≈103

export default function Header() {
  const pathname   = usePathname();
  const isHome     = pathname === "/";
  const navCursor  = isHome ? "default" : "pointer";
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <header
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 100,
        padding: "0 48px",
        height: `${HEADER_H}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#000000",
        borderBottom: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      {/* Logo → home */}
      <Link href="/" style={{ display: "flex", alignItems: "center", cursor: navCursor }}>
        <Image
          src="/Moltype_LOGO_BLACK.png"
          alt="MOLTYPE"
          width={LOGO_DISPLAY_W}
          height={LOGO_DISPLAY_H}
          style={{ objectFit: "contain", filter: "invert(1)" }}
          priority
        />
      </Link>

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", gap: "44px" }}>
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              onMouseEnter={() => setHoveredItem(item.label)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: navCursor,
                textDecoration: "none",
                position: "relative",
                padding: "4px 0",
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.condensed,
                  fontWeight: 700,
                  fontSize: "15px",
                  letterSpacing: "-0.01em",
                  textTransform: "uppercase",
                  color: "#ffffff",
                }}
              >
                {item.label}
              </span>
              {(active || hoveredItem === item.label) && (
                <span style={{
                  position: "absolute",
                  bottom: "-6px",
                  left: 0, right: 0,
                  height: "1px",
                  backgroundColor: "#ffffff",
                }} />
              )}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
