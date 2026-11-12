"use client";

import { useLenis } from "lenis/react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { IconArrowRight, IconClose } from "@/components/site/icons";
import { EASE } from "./motion";

const subscribeNoop = () => () => {};
/** true once mounted in the browser (portals need `document`) */
const useMounted = () => useSyncExternalStore(subscribeNoop, () => true, () => false);

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

function NavButton({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous" : "Next"}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-line-2 text-ash transition-colors duration-300 hover:border-transparent hover:bg-fog hover:text-black"
    >
      <IconArrowRight width={17} height={17} className={dir === "prev" ? "rotate-180" : ""} />
    </button>
  );
}

/**
 * A detail modal: a centred panel on larger screens, a bottom sheet on phones.
 * Long content scrolls inside the panel (the page behind is locked); Esc or the backdrop closes it,
 * ← / → step through siblings when `onPrev` / `onNext` are given.
 */
export default function Modal({
  open,
  onClose,
  eyebrow,
  title,
  contentKey,
  onPrev,
  onNext,
  children,
}: {
  open: boolean;
  onClose: () => void;
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  /** changes when the content changes (crossfades and scrolls back to the top) */
  contentKey?: string;
  onPrev?: () => void;
  onNext?: () => void;
  children: React.ReactNode;
}) {
  const mounted = useMounted();
  const lenis = useLenis();
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // lock the page behind, move focus in, and give it back on close
  useEffect(() => {
    if (!open) return;
    const returnTo = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    lenis?.stop();
    const t = window.setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 50);
    return () => {
      window.clearTimeout(t);
      root.style.overflow = prevOverflow;
      lenis?.start();
      returnTo?.focus({ preventScroll: true });
    };
  }, [open, lenis]);

  // keyboard: Esc closes, arrows step, Tab stays inside the panel
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key === "ArrowLeft" && onPrev) return onPrev();
      if (e.key === "ArrowRight" && onNext) return onNext();
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, onPrev, onNext]);

  // new content starts at the top
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [contentKey]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[65] flex items-end justify-center md:items-center md:p-6">
          {/* backdrop */}
          <motion.div
            aria-hidden
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={typeof title === "string" ? title : undefined}
            initial={{ opacity: 0, y: 60, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.985 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="relative flex max-h-[92svh] w-full flex-col overflow-hidden rounded-t-[24px] border border-white/10 bg-ink-1 shadow-[0_60px_160px_-40px_rgba(0,0,0,1)] md:max-h-[88svh] md:max-w-[1120px] md:rounded-[28px]"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(60%_100%_at_20%_0%,rgba(90,210,226,0.08),transparent)]" />

            {/* grab handle (phones) */}
            <span aria-hidden className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-white/15 md:hidden" />

            {/* header */}
            <div className="relative flex shrink-0 items-start gap-4 px-5 pb-4 pt-4 md:px-9 md:pb-6 md:pt-8">
              <div className="min-w-0 flex-1">
                {eyebrow && <p className="eyebrow text-ash-3">{eyebrow}</p>}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.h2
                    key={contentKey}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="mt-2 font-display text-[clamp(26px,3.4vw,46px)] font-semibold leading-[1] tracking-[-0.04em] text-fog"
                  >
                    {title}
                  </motion.h2>
                </AnimatePresence>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {onPrev && (
                  <span className="hidden sm:block">
                    <NavButton dir="prev" onClick={onPrev} />
                  </span>
                )}
                {onNext && (
                  <span className="hidden sm:block">
                    <NavButton dir="next" onClick={onNext} />
                  </span>
                )}
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.07] text-fog transition-colors duration-300 hover:bg-fog hover:text-black focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white/50"
                >
                  <IconClose width={18} height={18} />
                </button>
              </div>
            </div>

            {/* body — scrolls on its own; Lenis leaves it alone */}
            <div
              ref={scrollRef}
              data-lenis-prevent
              className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[max(24px,env(safe-area-inset-bottom))] md:px-9 md:pb-9 [scrollbar-color:rgba(255,255,255,0.15)_transparent] [scrollbar-width:thin]"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={contentKey}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* step controls (phones) */}
            {(onPrev || onNext) && (
              <div className="flex shrink-0 items-center justify-between border-t border-white/[0.06] px-5 py-3 sm:hidden">
                {onPrev ? <NavButton dir="prev" onClick={onPrev} /> : <span />}
                {onNext ? <NavButton dir="next" onClick={onNext} /> : <span />}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
