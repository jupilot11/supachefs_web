"use client";

import { motion, type HTMLMotionProps } from "motion/react";

// Reduced motion and no-JS show the content immediately via the
// [data-reveal] overrides in globals.css, so SSR HTML is never left hidden.
const hidden = { opacity: 0, y: 16 };
const shown = { opacity: 1, y: 0 };
const viewport = { once: true, margin: "0px 0px -60px 0px" } as const;
const ease = [0.2, 0.7, 0.2, 1] as const;

/** Fade and rise once as it scrolls into view. */
export function Reveal({
  delay = 0,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number }) {
  return (
    <motion.div
      data-reveal=""
      initial={hidden}
      whileInView={shown}
      viewport={viewport}
      transition={{ duration: 0.4, ease, delay }}
      {...props}
    />
  );
}

/** Staggered list: wrap items in <RevealItem>. */
export function RevealList({
  as = "div",
  ...props
}: HTMLMotionProps<"div"> & { as?: "div" | "ul" | "ol" }) {
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag
      initial="hidden"
      whileInView="shown"
      viewport={viewport}
      transition={{ staggerChildren: 0.08 }}
      {...props}
    />
  );
}

export function RevealItem({
  as = "div",
  ...props
}: HTMLMotionProps<"div"> & { as?: "div" | "li" }) {
  const Tag = (as === "li" ? motion.li : motion.div) as typeof motion.div;
  return (
    <Tag
      data-reveal=""
      variants={{ hidden, shown }}
      transition={{ duration: 0.4, ease }}
      {...props}
    />
  );
}
