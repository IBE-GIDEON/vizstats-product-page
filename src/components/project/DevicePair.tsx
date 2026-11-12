"use client";

import { motion, type Variants } from "motion/react";
import { EASE } from "@/components/ui/motion";

// the iPad comes in from the left, the iPhone from the right, and they meet in place
const tablet: Variants = {
  apart: { opacity: 0, x: "-16%" },
  together: { opacity: 1, x: "0%", transition: { duration: 1.4, ease: EASE } },
};
const phone: Variants = {
  apart: { opacity: 0, x: "70%" },
  together: { opacity: 1, x: "0%", transition: { duration: 1.4, ease: EASE, delay: 0.12 } },
};

/**
 * The iPad with the iPhone resting over its lower-right corner. Both slide in sideways and come
 * together once, when the pair first comes into view (not tied to scroll position).
 */
export default function DevicePair({ tabletSlot, phoneSlot }: { tabletSlot: React.ReactNode; phoneSlot: React.ReactNode }) {
  return (
    <motion.div
      initial="apart"
      whileInView="together"
      viewport={{ once: true, amount: 0.3 }}
      className="relative mt-16 md:mt-24"
    >
      <div className="pointer-events-none absolute inset-x-[10%] -bottom-24 top-1/3 -z-10 bg-[radial-gradient(50%_50%_at_50%_60%,rgba(224,53,60,0.14),transparent)] blur-2xl" />
      <motion.div variants={tablet} className="mr-[12%] md:mr-[9%]">
        {tabletSlot}
      </motion.div>
      <motion.div
        variants={phone}
        className="absolute -bottom-10 right-0 z-10 w-[30%] max-w-[250px] md:-bottom-14 md:w-[21%]"
      >
        {phoneSlot}
      </motion.div>
    </motion.div>
  );
}
