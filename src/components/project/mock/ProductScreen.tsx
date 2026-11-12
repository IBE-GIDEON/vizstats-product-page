"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { ERAS, Machine } from "./Machines";

const EARLY = (
  <>
    For over a century, energy systems were built around burning fuel, giving rise to the <b>mechanical systems</b>{" "}
    that defined the modern world.
  </>
);
const LATE = (
  <>
    From <b>steam engines</b> to <b>combustion, turbines, and electric motors</b>, power has steadily advanced.
  </>
);

/**
 * Layouts:
 *  - "fluid":  sized off the browser window, for the desktop browser frame;
 *  - "phone":  real sizes for a 402pt-wide iPhone 17 viewport;
 *  - "tablet": real sizes for a 1376pt-wide iPad Pro 13″ viewport (landscape).
 * Phone and tablet are rendered at the device's native size and scaled down by the device frame,
 * so they look exactly like the site does on that screen.
 */
export type ScreenVariant = "fluid" | "phone" | "tablet";

const STYLE = {
  fluid: {
    tabs: "gap-1 px-3 py-2",
    tab: "rounded-[3px] px-2 py-1 text-[clamp(6px,0.7vw,9px)]",
    copy: "mt-[6%] max-w-[80%] text-[clamp(10px,1.45vw,19px)]",
    ghosts: true,
    hero: "w-[24%]",
    yearWrap: "mb-[3%]",
    year: "text-[clamp(16px,2.5vw,34px)]",
    name: "text-[clamp(7px,0.85vw,11px)]",
    axis: "px-[6%] py-[1.6%]",
    axisText: "text-[clamp(5px,0.65vw,8px)]",
    shortLabels: false,
    fab: "-top-[52%] right-[2.5%] h-[clamp(18px,2.4vw,30px)] w-[clamp(18px,2.4vw,30px)]",
  },
  phone: {
    tabs: "gap-1.5 px-4 py-3",
    tab: "rounded-[6px] px-3 py-1.5 text-[13px]",
    copy: "mt-10 max-w-[88%] text-[20px]",
    ghosts: false,
    hero: "w-[74%]",
    yearWrap: "mb-7 mt-2",
    year: "text-[54px]",
    name: "text-[15px]",
    axis: "px-6 py-5",
    axisText: "text-[10.5px]",
    shortLabels: true,
    fab: "-top-[68px] right-5 h-12 w-12",
  },
  tablet: {
    tabs: "gap-1.5 px-6 py-3.5",
    tab: "rounded-[6px] px-3.5 py-1.5 text-[14px]",
    copy: "mt-16 max-w-[70%] text-[30px]",
    ghosts: true,
    hero: "w-[25%]",
    yearWrap: "mb-8",
    year: "text-[64px]",
    name: "text-[17px]",
    axis: "px-[6%] py-6",
    axisText: "text-[12px]",
    shortLabels: false,
    fab: "-top-[76px] right-8 h-14 w-14",
  },
} as const;

/**
 * A working recreation of the product's "Energy Transition" chapter:
 * chapter tabs, the machine stage and the era axis. Auto-advances while visible.
 */
export function ProductScreen({
  chapters,
  variant = "fluid",
  interactive = true,
  initial = 2,
}: {
  chapters: string[];
  variant?: ScreenVariant;
  interactive?: boolean;
  initial?: number;
}) {
  const [i, setI] = useState(initial);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const uid = useId();
  const s = STYLE[variant];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const t = setInterval(() => setI((v) => (v + 1) % ERAS.length), 3400);
    return () => clearInterval(t);
  }, [visible, i]);

  const era = ERAS[i];
  const AxisItem = interactive ? "button" : "span";

  return (
    <div ref={ref} className="relative flex h-full flex-col overflow-hidden bg-[#0a0a0b] text-white">
      {/* chapter tabs — on the phone they run off the edge, like a scrollable chip row */}
      <div
        className={`flex shrink-0 items-center overflow-hidden border-b border-white/[0.06] ${s.tabs} ${
          variant === "phone" ? "[mask-image:linear-gradient(to_right,#000_80%,transparent)]" : ""
        }`}
      >
        {chapters.map((c, k) => (
          <span
            key={c}
            className={`shrink-0 whitespace-nowrap ${s.tab} ${k === 0 ? "bg-signal text-white" : "text-white/40"}`}
          >
            {c}
          </span>
        ))}
      </div>

      {/* stage */}
      <div className="relative flex min-h-0 flex-1 flex-col items-center px-4 text-center">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-[radial-gradient(45%_55%_at_50%_100%,rgba(224,53,60,0.24),transparent)]" />
        <p
          className={`relative mx-auto font-light leading-snug text-white/50 [&_b]:font-semibold [&_b]:text-white ${s.copy}`}
        >
          {i < 2 ? EARLY : LATE}
        </p>

        <div className="relative mt-auto flex w-full items-end justify-center gap-[5%]">
          {s.ghosts && <Machine era={ERAS[(i + 3) % 4].key} className="w-[15%] opacity-25 blur-[1.5px]" />}
          <AnimatePresence mode="wait">
            <motion.div
              key={era.key}
              initial={{ opacity: 0, y: 14, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={s.hero}
            >
              <Machine era={era.key} className="w-full drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]" />
            </motion.div>
          </AnimatePresence>
          {s.ghosts && <Machine era={ERAS[(i + 1) % 4].key} className="w-[15%] opacity-25 blur-[1.5px]" />}
        </div>

        <div className={`relative ${s.yearWrap}`}>
          <div className={`font-display font-bold tabular-nums tracking-[-0.03em] text-signal ${s.year}`}>{era.year}</div>
          <div className={`text-white/70 ${s.name}`}>{era.name}</div>
        </div>
      </div>

      {/* era axis */}
      <div className={`relative flex shrink-0 items-center justify-between border-t border-white/[0.06] ${s.axis}`}>
        {ERAS.map((e, k) => (
          <AxisItem
            key={e.key}
            {...(interactive ? { type: "button" as const, onClick: () => setI(k) } : {})}
            className={`relative font-mono uppercase tracking-[0.14em] transition-colors ${s.axisText} ${
              k === i ? "text-white" : "text-white/35 hover:text-white/70"
            }`}
          >
            {s.shortLabels ? e.label.split(" ")[0] : e.label}
            {k === i && (
              <motion.span layoutId={`era-${uid}`} className="absolute -top-[1.15em] left-0 right-0 h-px bg-signal" />
            )}
          </AxisItem>
        ))}
        <span
          className={`absolute flex items-center justify-center rounded-full bg-signal shadow-[0_0_24px_rgba(224,53,60,0.55)] ${s.fab}`}
        >
          <svg viewBox="0 0 12 12" className="w-[45%]" fill="white" aria-hidden>
            <rect x="1" y="1" width="4" height="4" rx="1" />
            <rect x="7" y="1" width="4" height="4" rx="1" />
            <rect x="1" y="7" width="4" height="4" rx="1" />
            <rect x="7" y="7" width="4" height="4" rx="1" />
          </svg>
        </span>
      </div>
    </div>
  );
}
