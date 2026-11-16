"use client";

import { motion, type Variants } from "motion/react";
import { useEffect, useRef } from "react";
import { EASE } from "@/components/ui/motion";
import { FactIcon } from "./factIcons";

type Item = { label: string; value: string; icon?: string };

const row: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const card: Variants = {
  hidden: { opacity: 0, x: 90, filter: "blur(10px)" },
  show: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 1, ease: EASE } },
};

/** "29 companies" → number bright, word in ash. */
function Line({ text }: { text: string }) {
  const m = text.match(/^(\d[\d,.+]*)\s+(.*)$/);
  if (!m) return <span className="block">{text}</span>;
  return (
    <span className="block">
      <span className="text-fog">{m[1]}</span> <span className="text-ash-2">{m[2]}</span>
    </span>
  );
}

/**
 * Project facts as a horizontal row of tall cards. They slide in one after another,
 * and the row runs past the right edge so the last visible card is cut in half —
 * the cue that it scrolls. Trackpad / touch scroll natively; mouse users can drag.
 */
export default function MetaCards({ items }: { items: Item[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const rail = railRef.current;
    const bar = barRef.current;
    if (!track || !rail || !bar) return;

    /* progress line under the row */
    const sync = () => {
      const visible = Math.min(1, track.clientWidth / track.scrollWidth);
      const max = track.scrollWidth - track.clientWidth;
      const p = max > 0 ? track.scrollLeft / max : 0;
      rail.style.opacity = visible >= 0.999 ? "0" : "1";
      bar.style.width = `${visible * 100}%`;
      bar.style.transform = `translateX(${((p * (1 - visible)) / visible) * 100}%)`;
    };

    /* drag to scroll (mouse only — touch and trackpads scroll natively) */
    let down = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = track.scrollLeft;
      track.style.scrollSnapType = "none";
      track.style.scrollBehavior = "auto";
      track.dataset.dragging = "true";
      track.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      track.scrollLeft = startLeft - dx;
    };
    const onUp = (e: PointerEvent) => {
      if (!down) return;
      down = false;
      if (track.hasPointerCapture(e.pointerId)) track.releasePointerCapture(e.pointerId);
      delete track.dataset.dragging;

      // settle on a card, leaning toward the direction of the drag
      // each card's scroll position = its distance from the first card (the first sits at scrollLeft 0)
      const first = track.children[0]?.getBoundingClientRect().left ?? 0;
      const stops = Array.from(track.children, (c) => c.getBoundingClientRect().left - first);
      const pulled = startLeft - track.scrollLeft; // >0: dragged right (going back)
      const bias = pulled > 0 ? -0.35 : pulled < 0 ? 0.35 : 0;
      const step = stops.length > 1 ? stops[1] - stops[0] : 1;
      const target = stops.reduce((best, s) =>
        Math.abs(s - track.scrollLeft - bias * step) < Math.abs(best - track.scrollLeft - bias * step) ? s : best,
      );
      const restore = () => {
        track.style.scrollSnapType = "";
        track.style.scrollBehavior = "";
      };
      track.scrollTo({ left: target, behavior: "smooth" });
      track.addEventListener("scrollend", restore, { once: true });
      window.setTimeout(restore, 700); // fallback where scrollend isn't supported
    };
    const onClick = (e: MouseEvent) => {
      if (!moved) return;
      e.preventDefault();
      e.stopPropagation();
      moved = false;
    };

    sync();
    track.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    track.addEventListener("pointerdown", onDown);
    track.addEventListener("pointermove", onMove);
    track.addEventListener("pointerup", onUp);
    track.addEventListener("pointercancel", onUp);
    track.addEventListener("click", onClick, true);
    return () => {
      track.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      track.removeEventListener("pointerdown", onDown);
      track.removeEventListener("pointermove", onMove);
      track.removeEventListener("pointerup", onUp);
      track.removeEventListener("pointercancel", onUp);
      track.removeEventListener("click", onClick, true);
    };
  }, []);

  return (
    <div>
      <motion.div
        ref={trackRef}
        data-lenis-prevent-horizontal
        variants={row}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        aria-label="Project facts"
        role="list"
        className="flex cursor-grab select-none snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 pl-[max(20px,calc((100%-1320px)/2+20px))] pr-5 [scrollbar-width:none] scroll-pl-[max(20px,calc((100%-1320px)/2+20px))] data-[dragging=true]:cursor-grabbing md:gap-4 md:pl-[max(40px,calc((100%-1320px)/2+40px))] md:pr-10 md:scroll-pl-[max(40px,calc((100%-1320px)/2+40px))] lg:pl-[max(var(--nav-clear),calc((100%-1320px)/2+40px))] lg:scroll-pl-[max(var(--nav-clear),calc((100%-1320px)/2+40px))] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          <motion.article
            key={i}
            role="listitem"
            variants={card}
            // widths leave the last visible card half-cut at the edge: 1½ cards on phones, 2½ on tablets, 3½ on desktop
            // (100% = the row's content box; the +/- px fold in right padding and gaps)
            className="group relative flex h-[196px] w-[calc((100%+8px)/1.5)] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-[22px] bg-[linear-gradient(165deg,#141616_0%,#0a0b0b_55%,#060707_100%)] p-5 ring-1 ring-inset ring-white/[0.06] transition-shadow duration-500 hover:ring-white/[0.13] sm:w-[calc((100%-4px)/2.5)] md:h-[212px] md:w-[calc((100%+8px)/2.5)] md:p-6 lg:w-[calc((100%-8px)/3.5)]"
          >
            {i === items.length - 1 && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_55%_at_100%_0%,rgba(90,210,226,0.12),transparent_70%)]"
              />
            )}
            <div className="relative flex items-start justify-between">
              <span className="eyebrow pt-1 text-ash-3">{item.label}</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-ash-2 ring-1 ring-white/[0.06] transition-colors duration-300 group-hover:text-green">
                <FactIcon name={item.icon} />
              </span>
            </div>
            <p className="relative font-display text-[clamp(21px,1.9vw,27px)] font-semibold leading-[1.08] tracking-[-0.03em] text-fog">
              {item.value.split(" · ").map((line, k) => (
                <Line key={k} text={line} />
              ))}
            </p>
          </motion.article>
        ))}
      </motion.div>

      <div className="container-x mt-6">
        <div ref={railRef} className="relative h-px overflow-hidden bg-white/10 transition-opacity duration-500">
          <span ref={barRef} className="absolute inset-y-0 left-0 bg-green" />
        </div>
      </div>
    </div>
  );
}
