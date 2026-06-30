"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import Header from "./Header";

interface Props {
  children: ReactNode;
}

export default function PageLayout({ children }: Props) {
  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <Header />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ paddingTop: "80px" }}
      >
        {children}
      </motion.main>
    </div>
  );
}
