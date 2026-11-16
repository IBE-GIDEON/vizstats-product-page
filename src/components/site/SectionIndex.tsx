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

/** Width of the index on large screens; the page content is padded by the same amount. */
export const INDEX_WIDTH = 272;

const RULER_PX_PER_PERCENT = 10; // the ruler tape: 10 px per 1% of the page

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/* ── the big name: its letters fly in along the right edge, turned on their side, then settle ── */

const word: Variants = {
  enter: {},
  show: { transition: { staggerChildren: 0.028 } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};
const letter: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: 26, y: dir >= 0 ? 150 : -150, rotate: -90 }),
  show: { opacity: 1, x: 0, y: 0, rotate: 0, transition: { duration: 0.55, ease: EASE } },
};

function BigName({ text, dir }: { text: string; dir: number }) {
  const words = text.toUpperCase().split(" ");
  return (
    <motion.p
      variants={word}
      initial="enter"
      animate="show"
      exit="exit"
      custom={dir}
      aria-hidden
      className="font-display text-[30px] font-bold leading-[0.98] tracking-[-0.01em] text-fog"
    >
      {words.map((w, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {[...w].map((ch, ci) => (
            <motion.span key={ci} variants={letter} custom={dir} className="inline-block origin-bottom-right">
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
 * right-aligned — the ones you've passed at the top, the current one big, the ones to come at the
 * bottom — and a ruler on the right edge that moves with the scroll. Always open; on phones it
 * becomes a slim bar with the logo, the current section and a progress line.
 */
export default function SectionIndex({ names }: { names: Project["sectionNames"] }) {
  const lenis = useLenis();
  const [{ active, dir }, setState] = useState({ active: 0, dir: 0 });

  const tapeRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

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

      if (tapeRef.current) tapeRef.current.style.transform = `translateY(${-page * 100 * RULER_PX_PER_PERCENT}px)`;
      if (markerRef.current) markerRef.current.textContent = `${Math.round(page * 100)}%`;
      if (barRef.current) barRef.current.style.transform = `scaleX(${page})`;
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

  const small = (it: (typeof items)[number]) => (
    <motion.li key={it.key} layout="position" layoutId={`idx-${it.key}`} transition={{ duration: 0.45, ease: EASE }}>
      <button
        type="button"
        onClick={() => go(it.i)}
        className="w-full text-right font-display text-[12.5px] font-semibold uppercase leading-[1.38] tracking-[0.04em] text-ash-3 transition-colors duration-200 hover:text-fog focus-visible:text-fog focus-visible:outline-none"
      >
        {it.name}
      </button>
    </motion.li>
  );

  // ruler marks every 5% of the page
  const marks = Array.from({ length: 21 }, (_, k) => k * 5);

  return (
    <>
      {/* ── large screens: always-open index ─────────────────────────── */}
      <aside
        aria-label="Sections"
        className="fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-line bg-black lg:flex"
        style={{ width: INDEX_WIDTH }}
      >
        <Link href="/" aria-label="VizStats home" className="flex shrink-0 items-center gap-3 px-6 pb-7 pt-7">
          <LogoMark size={30} />
          <Wordmark className="!text-[22px]" />
        </Link>

        <div className="relative min-h-0 flex-1 overflow-hidden border-t border-line">
          <LayoutGroup>
            <nav className="absolute inset-y-0 left-[46px] right-0 flex flex-col pb-8 pl-4 pr-5 pt-5">
              <ul>{past.map(small)}</ul>

              {/* the current section, big */}
              <div className="relative mt-3 min-h-[70px] text-right">
                <button type="button" onClick={() => go(current.i)} className="w-full text-right" aria-current="location">
                  <span className="sr-only">{current.name}</span>
                  <AnimatePresence mode="wait" initial={false} custom={dir}>
                    <BigName key={current.key} text={current.name} dir={dir} />
                  </AnimatePresence>
                </button>
              </div>

              <ul className="mt-auto">{upcoming.map(small)}</ul>
            </nav>
          </LayoutGroup>

          {/* ruler, against the left edge: the tape moves with the page; the marker reads how far down you are */}
          <div aria-hidden className="absolute inset-y-0 left-0 w-[46px] border-r border-line [mask-image:linear-gradient(to_bottom,transparent,#000_12%,#000_88%,transparent)]">
            <div ref={tapeRef} className="absolute inset-x-0 top-[38%] will-change-transform">
              <div
                className="absolute left-0 top-0 w-[10px] bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.16)_0_1px,transparent_1px_10px)]"
                style={{ height: 100 * RULER_PX_PER_PERCENT + 1 }}
              />
              {marks.map((m) => (
                <div key={m} className="absolute left-0 flex items-center gap-1.5" style={{ top: m * RULER_PX_PER_PERCENT - 6 }}>
                  <span className="h-px w-[16px] bg-white/30" />
                  <span className="font-mono text-[9.5px] tabular-nums text-ash-3">{m}</span>
                </div>
              ))}
            </div>
          </div>
          {/* the marker line, across the whole index */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[38%]">
            <div className="h-px bg-white/[0.05]" />
            <div className="absolute left-0 top-0 flex -translate-y-1/2 items-center gap-1.5">
              <span className="h-[2px] w-[22px] bg-green" />
              <span ref={markerRef} className="font-mono text-[10px] tabular-nums text-green">0%</span>
            </div>
          </div>
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
