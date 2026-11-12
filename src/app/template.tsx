"use client";

import { motion } from "motion/react";

// Route enter: fade plus 8px rise, about 200ms. Exit animations are unreliable in the App Router.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      data-reveal=""
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
