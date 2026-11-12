"use client";

import { AnimatePresence, motion, type Easing, type TargetAndTransition } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { IconArrowRight } from "@/components/site/icons";
import type { ProjectCard } from "@/content/projects";
import { ProjectShot } from "./mock/ProjectShots";

const STEP_MS = 3000; // each project stays on top for 3 seconds
const MOVE_S = 1.2; // length of one move
const OFFSET = 30; // px each card behind peeks out above the one in front, like folder tabs
const SHRINK = 0.05; // each card behind is 5% narrower
const DROP = 140; // px the front card sinks as it fades away

const mod = (a: number, n: number) => ((a % n) + n) % n;
// every card shares one smooth curve, so the whole stack moves as one
const SMOOTH: Easing = [0.65, 0, 0.35, 1];
const HALVES: Easing[] = [[0.55, 0, 1, 0.45], "linear", [0, 0.55, 0.45, 1]];
const SPLIT = [0, 0.5, 0.501, 1];

/** Resting pose for a card `depth` places behind the front. */
function pose(depth: number) {
  return { y: -depth * OFFSET, scale: 1 - depth * SHRINK, opacity: 1, zIndex: 40 - depth };
}

/**
 * Where each card goes, always downwards: the stack slides down one place, the front card
 * sinks and fades out, and — while it is invisible — moves to the top to fade in at the back.
 * Going back plays the exact reverse. Nothing ever jumps on screen.
 */
function target(depth: number, n: number, dir: number): TargetAndTransition {
  const rest = pose(depth);
  const above = pose(n); // just above the back card
  if (n > 1 && dir === 1 && depth === n - 1) {
    return {
      y: [null, DROP, above.y, rest.y],
      scale: [null, 1, above.scale, rest.scale],
      opacity: [null, 0, 0, 1],
      zIndex: [50, 50, rest.zIndex, rest.zIndex],
      transition: { duration: MOVE_S, times: SPLIT, ease: HALVES },
    };
  }
  if (n > 1 && dir === -1 && depth === 0) {
    return {
      y: [null, above.y, DROP, rest.y],
      scale: [null, above.scale, 1, rest.scale],
      opacity: [null, 0, 0, 1],
      zIndex: [null, pose(n - 1).zIndex, 50, 50],
      transition: { duration: MOVE_S, times: SPLIT, ease: HALVES },
    };
  }
  return { ...rest, transition: { duration: MOVE_S, ease: SMOOTH } };
}

function Arrow({ dir, onClick }: { dir: "up" | "down"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "down" ? "Next project" : "Previous project"}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-line-2 bg-white/[0.03] text-fog transition-colors duration-300 hover:border-transparent hover:bg-fog hover:text-black focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/40 md:h-14 md:w-14"
    >
      <IconArrowRight width={20} height={20} className={dir === "up" ? "-rotate-90" : "rotate-90"} />
    </button>
  );
}

/**
 * "Next project" as a stack of three desktop screenshots, filed like folders: the cards behind peek
 * out above the front one. Every 3 seconds the stack slides down a place — the front card sinks
 * away and the next comes forward. The arrows on the right step down (next) or up (back) right away.
 */
export default function NextProject({ next: cards }: { next: ProjectCard[] }) {
  const n = cards.length;
  const [{ active, dir }, setState] = useState({ active: 0, dir: 0 });
  const sectionRef = useRef<HTMLElement>(null);
  const paused = useRef(false);
  const inView = useRef(false);
  const lastMove = useRef(0);

  const go = useCallback(
    (d: 1 | -1) => {
      lastMove.current = performance.now();
      setState((s) => ({ active: mod(s.active + d, n), dir: d }));
    },
    [n],
  );

  // only runs while on screen and not hovered; any move restarts the 3-second count
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || n < 2) return;
    const io = new IntersectionObserver(([e]) => (inView.current = e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    lastMove.current = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      if (paused.current || !inView.current || document.hidden) {
        lastMove.current = now;
        return;
      }
      if (now - lastMove.current >= STEP_MS) go(1);
    }, 150);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, [go, n]);

  if (n === 0) return null;
  const current = cards[active];

  return (
    <section ref={sectionRef} aria-label="Next project" className="relative pb-24 md:pb-32">
      <div className="container-x">
        {/* the front card's title — moves down with the stack */}
        <p className="eyebrow text-ash-3">Next project</p>
        <div className="relative mt-3 h-[2.05em] overflow-hidden font-display text-[clamp(34px,5vw,78px)] font-semibold leading-[0.98] tracking-[-0.045em]">
          <AnimatePresence initial={false} custom={dir}>
            <motion.h3
              key={current.slug}
              custom={dir}
              variants={{
                enter: (d: number) => ({ y: d < 0 ? "40%" : "-40%", opacity: 0, filter: "blur(8px)" }),
                center: { y: "0%", opacity: 1, filter: "blur(0px)" },
                exit: (d: number) => ({ y: d < 0 ? "-40%" : "40%", opacity: 0, filter: "blur(8px)" }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: MOVE_S, ease: SMOOTH }}
              className="absolute inset-x-0 top-0"
            >
              {current.titleLines[0]}
              <br />
              <span className="text-ash-2">{current.titleLines[1]}</span>
            </motion.h3>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center gap-3 md:mt-10 md:gap-8">
          {/* the stack */}
          <div
            className="relative min-w-0 flex-1 pt-[70px]"
            onMouseEnter={() => (paused.current = true)}
            onMouseLeave={() => (paused.current = false)}
          >
            <div className="relative aspect-[16/11] sm:aspect-[16/10]">
              {cards.map((c, i) => {
                const depth = mod(i - active, n);
                const front = depth === 0;
                return (
                  <motion.a
                    key={c.slug}
                    href="#"
                    aria-label={`${c.titleLines.join(" ")}, ${c.kicker}`}
                    aria-hidden={!front}
                    tabIndex={front ? 0 : -1}
                    initial={false}
                    animate={target(depth, n, dir)}
                    style={{ transformOrigin: "50% 0%" }}
                    className={`group absolute inset-0 flex flex-col overflow-hidden rounded-[14px] border border-white/10 bg-ink-2 shadow-[0_40px_90px_-40px_rgba(0,0,0,1)] md:rounded-[18px] ${
                      front ? "" : "pointer-events-none"
                    }`}
                  >
                    {/* window bar — doubles as the folder tab when the card is behind */}
                    <div className="flex h-[30px] shrink-0 items-center gap-3 border-b border-white/[0.06] bg-[#121414] px-3 md:h-[38px] md:px-4">
                      <span className="flex gap-1.5">
                        {[0, 1, 2].map((k) => (
                          <span key={k} className="h-2 w-2 rounded-full bg-white/15 md:h-2.5 md:w-2.5" />
                        ))}
                      </span>
                      <span className="truncate text-[11.5px] font-semibold text-fog md:text-[13px]">
                        {c.titleLines.join(" ")}
                      </span>
                      <span className="ml-auto hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-ash-3 sm:block">
                        {c.kicker}
                      </span>
                    </div>

                    {/* the screenshot */}
                    <div className="@container relative min-h-0 flex-1">
                      <ProjectShot shot={c.shot} />
                      <span className="absolute bottom-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-fog text-black shadow-xl transition-all duration-500 group-hover:-rotate-45 group-hover:bg-green md:bottom-6 md:right-6 md:h-14 md:w-14">
                        <IconArrowRight width={18} height={18} />
                      </span>
                    </div>

                    {/* cards behind sit in shadow */}
                    <motion.span
                      aria-hidden
                      initial={false}
                      animate={{ opacity: depth * 0.22 }}
                      transition={{ duration: MOVE_S, ease: SMOOTH }}
                      className="pointer-events-none absolute inset-0 z-20 bg-black"
                    />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* controls, outside the stack on the right */}
          <div className="flex shrink-0 flex-col items-center gap-3 pt-[70px] md:gap-4">
            <Arrow dir="up" onClick={() => go(-1)} />
            <span className="font-mono text-[10px] tabular-nums tracking-[0.14em] text-ash-3 md:text-[11px]">
              {String(active + 1).padStart(2, "0")}
              <span className="text-ash-4"> / {String(n).padStart(2, "0")}</span>
            </span>
            <Arrow dir="down" onClick={() => go(1)} />
          </div>
        </div>
      </div>
    </section>
  );
}
