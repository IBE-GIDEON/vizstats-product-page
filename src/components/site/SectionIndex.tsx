"use client";

import { useLenis } from "lenis/react";
import { AnimatePresence, LayoutGroup, motion, type Variants } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { EASE } from "@/components/ui/motion";
import type { Project } from "@/content/projects";
import { LogoMark, Wordmark } from "./Logo";

/** The page's sections, top to bottom, and the element each one scrolls to. */
const SECTIONS: { key: keyof Project["sectionNames"]; target: string }[] = [
  { key: "project", target: "#project" },
  { key: "overview", target: "#overview" },
  { key: "inside", target: "#inside" },
  { key: "devices", target: "#showcase" },
  { key: "more", target: "#more" },
  { key: "contact", target: "#contact" },
];

/** Width of the floating index on large screens (page text starts clear of it: --nav-clear in globals.css). */
export const INDEX_WIDTH = 236;

/** Colours for dark surfaces (default) and for light ones like the paper "Inside the product" section. */
const TONE = {
  dark: {
    small: "text-white/65 hover:text-white [text-shadow:0_1px_14px_rgba(0,0,0,0.6)]",
    big: "text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.55)]",
    logo: "drop-shadow-[0_1px_10px_rgba(0,0,0,0.5)]",
  },
  light: {
    small: "text-ink-1/55 hover:text-ink-1",
    big: "text-ink-1",
    logo: "!text-green-2",
  },
} as const;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/* ── the big name: its letters fly in up the left edge, turned on their side, then settle ── */

const word: Variants = {
  enter: {},
  show: { transition: { staggerChildren: 0.028 } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};
const letter: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: -26, y: dir >= 0 ? 150 : -150, rotate: -90 }),
  show: { opacity: 1, x: 0, y: 0, rotate: 0, transition: { duration: 0.55, ease: EASE } },
};

function BigName({ text, dir, color }: { text: string; dir: number; color: string }) {
  const words = text.toUpperCase().split(" ");
  return (
    <motion.p
      variants={word}
      initial="enter"
      animate="show"
      exit="exit"
      custom={dir}
      aria-hidden
      className={`font-display text-[30px] font-bold leading-[0.98] tracking-[-0.01em] transition-colors duration-300 ${color}`}
    >
      {words.map((w, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {[...w].map((ch, ci) => (
            <motion.span key={ci} variants={letter} custom={dir} className="inline-block origin-bottom-left">
              {ch}
            </motion.span>
          ))}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </motion.p>
  );
}

/**
 * Section index, after the reference: the full logo on top; the page's sections listed small,
 * flush with the left edge: the ones you've passed at the top, the current one big, the ones to
 * come at the bottom. Always open, floating over the full-width page with no background of its own; each part
 * switches to dark text over light sections so it stays readable. On phones it becomes a slim bar
 * with the logo, the current section and a progress line.
 */
export default function SectionIndex({ names }: { names: Project["sectionNames"] }) {
  const lenis = useLenis();
  const [{ active, dir }, setState] = useState({ active: 0, dir: 0 });

  const barRef = useRef<HTMLDivElement>(null);
  // which parts of the floating index sit over a light section right now
  const [light, setLight] = useState({ logo: false, top: false, bottom: false });
  const logoRef = useRef<HTMLAnchorElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLUListElement>(null);

  // which section is in view, and how far down the page we are (written straight to the DOM)
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.4;
      let idx = 0;
      SECTIONS.forEach((s, i) => {
        const el = document.querySelector(s.target);
        if (el && el.getBoundingClientRect().top <= line) idx = i;
      });
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const page = max > 0 ? clamp01(window.scrollY / max) : 0;
      if (page > 0.995) idx = SECTIONS.length - 1;

      setState((s) => (s.active === idx ? s : { active: idx, dir: idx > s.active ? 1 : -1 }));

      if (barRef.current) barRef.current.style.transform = `scaleX(${page})`;

      // light sections are marked data-surface="light"; check what sits under the middle of each part
      const surfaces = [...document.querySelectorAll<HTMLElement>('[data-surface="light"]')].map((el) => el.getBoundingClientRect());
      const over = (el: HTMLElement | null) => {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        const y = r.top + r.height / 2;
        return surfaces.some((b) => b.top <= y && b.bottom >= y);
      };
      const next = { logo: over(logoRef.current), top: over(topRef.current), bottom: over(bottomRef.current) };
      setLight((t) => (t.logo === next.logo && t.top === next.top && t.bottom === next.bottom ? t : next));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const go = (i: number) => {
    const el = document.querySelector<HTMLElement>(SECTIONS[i].target);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { duration: 1.2 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  const items = SECTIONS.map((s, i) => ({ ...s, i, name: names[s.key] }));
  const past = items.slice(0, active);
  const current = items[active];
  const upcoming = items.slice(active + 1);

  const top = light.top ? TONE.light : TONE.dark;
  const bottom = light.bottom ? TONE.light : TONE.dark;
  const logo = light.logo ? TONE.light : TONE.dark;

  const small = (it: (typeof items)[number], tone: (typeof TONE)[keyof typeof TONE]) => (
    <motion.li key={it.key} layout="position" layoutId={`idx-${it.key}`} transition={{ duration: 0.45, ease: EASE }}>
      <button
        type="button"
        onClick={() => go(it.i)}
        className={`pointer-events-auto block w-fit text-left font-display text-[13px] font-semibold uppercase leading-[1.4] tracking-[0.04em] transition-colors duration-300 focus-visible:outline-none ${tone.small}`}
      >
        {it.name}
      </button>
    </motion.li>
  );

  return (
    <>
      {/* ── large screens: always-open index ─────────────────────────── */}
      <aside
        aria-label="Sections"
        // no background: it floats over the page; only the logo and names catch the mouse
        className="pointer-events-none fixed inset-y-0 left-0 z-40 hidden flex-col lg:flex"
        style={{ width: INDEX_WIDTH }}
      >
        <Link ref={logoRef} href="/" aria-label="VizStats home" className="pointer-events-auto flex w-fit shrink-0 items-center gap-3 px-5 pb-7 pt-7">
          <LogoMark size={30} className={`transition-colors duration-300 ${logo.logo}`} />
          <Wordmark className={`!text-[22px] transition-colors duration-300 ${logo.logo}`} />
        </Link>

        <div className="relative min-h-0 flex-1 overflow-hidden">
          <LayoutGroup>
            <nav className="absolute inset-0 flex flex-col px-5 pb-8 pt-5">
              <div ref={topRef}>
                <ul>{past.map((it) => small(it, top))}</ul>

                {/* the current section, big */}
                <div className="relative mt-3 min-h-[70px] text-left">
                  <button type="button" onClick={() => go(current.i)} className="pointer-events-auto block w-fit text-left" aria-current="location">
                    <span className="sr-only">{current.name}</span>
                    <AnimatePresence mode="wait" initial={false} custom={dir}>
                      <BigName key={current.key} text={current.name} dir={dir} color={top.big} />
                    </AnimatePresence>
                  </button>
                </div>
              </div>

              <ul ref={bottomRef} className="mt-auto">
                {upcoming.map((it) => small(it, bottom))}
              </ul>
            </nav>
          </LayoutGroup>
        </div>
      </aside>

      {/* ── phones and tablets: slim bar ─────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-black/75 backdrop-blur-md lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/" aria-label="VizStats home" className="flex items-center gap-2.5">
            <LogoMark size={24} />
            <Wordmark className="!text-[18px]" />
          </Link>
          <button type="button" onClick={() => go(Math.min(active + 1, SECTIONS.length - 1))} className="overflow-hidden" aria-label={`Current section: ${current.name}`}>
            <AnimatePresence mode="wait" initial={false} custom={dir}>
              <motion.span
                key={current.key}
                custom={dir}
                initial={{ opacity: 0, y: dir >= 0 ? 14 : -14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: dir >= 0 ? -14 : 14 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="block font-display text-[13px] font-bold uppercase tracking-[0.04em] text-fog"
              >
                {current.name}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
        <div className="h-px bg-white/[0.04]">
          <div ref={barRef} className="h-px origin-left scale-x-0 bg-green" />
        </div>
      </header>
    </>
  );
}
