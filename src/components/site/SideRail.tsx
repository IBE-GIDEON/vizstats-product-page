"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useContent } from "@/lib/cms/useContent";
import { LogoMark, Wordmark } from "./Logo";
import { IconClose, IconPanelOpen, NavGlyph } from "./icons";

export const RAIL_COLLAPSED = 72;
const RAIL_EXPANDED = 296;

/**
 * Icon rail on desktop. Hovering the logo (or tabbing into the rail) expands it into
 * the full-text nav; it closes on mouse-out, focus-out or Esc. Clicking an icon only navigates.
 * On mobile it becomes a top bar with a full-screen menu.
 */
export default function SideRail() {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { site } = useContent();

  const close = () => setOpen(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // the clicked item's icon turns green; before any click, the current page's item is selected
  const [picked, setPicked] = useState<string | null>(null);
  const routeMatch = site.nav.find((n) => n.href.startsWith("/work") && pathname?.startsWith(n.href))?.label ?? null;
  const selected = picked ?? routeMatch;

  // the CMS has its own chrome
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      {/* Scrim behind the expanded rail */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="pointer-events-none fixed inset-0 z-[45] hidden bg-black/50 backdrop-blur-[3px] md:block"
          />
        )}
      </AnimatePresence>

      <motion.aside
        aria-label="Primary"
        onMouseLeave={close}
        // only keyboard focus (Tab) expands the rail — a mouse click on an icon just navigates
        onFocus={(e) => {
          if ((e.target as HTMLElement).matches(":focus-visible")) setOpen(true);
        }}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) close();
        }}
        initial={false}
        animate={{ width: open ? RAIL_EXPANDED : RAIL_COLLAPSED }}
        transition={{ type: "spring", stiffness: 420, damping: 42 }}
        className="fixed inset-y-0 left-0 z-50 hidden flex-col border-r border-line bg-black/55 backdrop-blur-xl md:flex"
      >
        {/* Logo — hover to open */}
        <div onMouseEnter={() => setOpen(true)} className="flex h-[80px] shrink-0 items-center gap-3.5 pl-[20px]">
          <Link href="/" aria-label="VizStats home" className="shrink-0 transition-transform duration-500 hover:-rotate-6">
            <LogoMark size={32} />
          </Link>
          <motion.div
            initial={false}
            animate={{ opacity: open ? 1 : 0, x: open ? 0 : -8 }}
            transition={{ duration: 0.3 }}
            className={`whitespace-nowrap ${open ? "" : "pointer-events-none"}`}
          >
            <Wordmark className="!text-[23px]" />
          </motion.div>
        </div>

        <div className="mx-4 h-px bg-line" />

        <nav className="mt-7 flex flex-col gap-1.5 px-3">
          {site.nav.map((item, i) => {
            const active = selected === item.label;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  setPicked(item.label);
                  close();
                  e.currentTarget.blur(); // don't leave focus behind to reopen the rail
                }}
                aria-current={active ? "page" : undefined}
                className={`group relative flex h-[54px] items-center rounded-xl pl-[15px] pr-3 transition-colors hover:bg-white/[0.045] ${
                  active ? "text-fog" : "text-ash-2 hover:text-fog"
                }`}
              >
                <NavGlyph
                  name={item.icon}
                  className={`shrink-0 transition-colors duration-300 ${active ? "text-green" : ""}`}
                />
                <motion.span
                  initial={false}
                  animate={{ opacity: open ? 1 : 0, x: open ? 0 : -6 }}
                  transition={{ duration: 0.28, delay: open ? 0.05 + 0.04 * i : 0 }}
                  className={`ml-4 whitespace-nowrap font-display text-[19px] font-semibold leading-none tracking-[-0.025em] ${
                    open ? "" : "pointer-events-none"
                  }`}
                >
                  {item.label}
                </motion.span>
                {!open && (
                  <span className="pointer-events-none absolute left-[60px] top-1/2 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-lg bg-ink-3 px-3 py-1.5 font-display text-[13.5px] font-semibold tracking-[-0.015em] text-fog opacity-0 shadow-2xl ring-1 ring-white/[0.06] transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </motion.aside>

      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between px-4 md:hidden">
        {/* solid enough that headings scrolling underneath never collide with the logo */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-20 bg-gradient-to-b from-black via-black/85 to-transparent" />
        <Link href="/" aria-label="VizStats home">
          <LogoMark size={28} />
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-black/40 text-ash backdrop-blur"
        >
          <IconPanelOpen />
        </button>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col bg-black/90 px-5 pb-8 pt-3 backdrop-blur-2xl md:hidden"
          >
            <div className="flex h-11 items-center justify-between">
              <div className="flex items-center gap-3">
                <LogoMark size={28} />
                <Wordmark className="!text-[21px]" />
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-ash"
              >
                <IconClose />
              </button>
            </div>
            <nav className="mt-14 flex flex-col">
              {site.nav.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i + 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={() => {
                      setPicked(item.label);
                      setMobileOpen(false);
                    }}
                    aria-current={selected === item.label ? "page" : undefined}
                    className={`flex items-center gap-4 border-b border-line py-5 ${
                      selected === item.label ? "text-fog" : "text-ash-2"
                    }`}
                  >
                    <NavGlyph
                      name={item.icon}
                      width={22}
                      height={22}
                      className={selected === item.label ? "text-green" : "text-ash-3"}
                    />
                    <span className="font-display text-[34px] font-semibold leading-none tracking-[-0.04em]">
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
