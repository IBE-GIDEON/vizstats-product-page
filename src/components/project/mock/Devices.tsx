"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Real-proportion device frames, drawn in CSS so they stay sharp at any size.
 * Every measurement comes from Apple's published dimensions and is expressed in `cqw`
 * (percent of the device's own width), so a frame can be any width and keep its shape.
 *
 * The screen content is rendered at the device's native viewport (in points) and scaled
 * down to fit, so a web page inside looks exactly as it does on the real device.
 */

/* ── shared ───────────────────────────────────────────────────────── */

/** Renders children at `width × height` CSS px and scales them to fill the parent's width. */
export function NativeScreen({ width, height, children }: { width: number; height: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width, height, transform: `scale(${scale})`, visibility: scale ? "visible" : "hidden" }}
      >
        {children}
      </div>
    </div>
  );
}

// anodised aluminium edge, Space Black / Black finish, lit from the top-left
const METAL =
  "bg-[linear-gradient(140deg,#5b5e63_0%,#232427_14%,#2f3034_42%,#18191b_74%,#46484d_100%)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10),0_60px_120px_-40px_rgba(0,0,0,1),0_30px_60px_-30px_rgba(0,0,0,0.9)]";
const BUTTON = "absolute bg-[linear-gradient(90deg,#1b1c1e,#4a4c51_50%,#1b1c1e)]";
// faint reflection across the cover glass
const SHEEN =
  "pointer-events-none absolute inset-0 z-30 bg-[linear-gradient(115deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.02)_28%,transparent_42%)]";

const shortDomain = (d: string) => d.split(".").slice(-2).join(".");

function Signal() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden>
      <rect x="0" y="8" width="3" height="4" rx="0.8" />
      <rect x="5" y="5.5" width="3" height="6.5" rx="0.8" />
      <rect x="10" y="3" width="3" height="9" rx="0.8" />
      <rect x="15" y="0" width="3" height="12" rx="0.8" />
    </svg>
  );
}

function Wifi() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden>
      <path d="M1.2 4.4a9.8 9.8 0 0 1 13.6 0" />
      <path d="M3.8 7.1a6.1 6.1 0 0 1 8.4 0" />
      <path d="M8 11.1 6.5 9.6a2.2 2.2 0 0 1 3 0Z" fill="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

function Battery() {
  return (
    <svg width="27" height="13" viewBox="0 0 27 13" fill="none" aria-hidden>
      <rect x="0.5" y="0.5" width="23" height="12" rx="3.6" stroke="currentColor" strokeOpacity="0.4" />
      <rect x="2" y="2" width="20" height="9" rx="2.3" fill="currentColor" />
      <path d="M25 4.4v4.2c.8-.3 1.4-1.1 1.4-2.1s-.6-1.8-1.4-2.1Z" fill="currentColor" fillOpacity="0.45" />
    </svg>
  );
}

/* ── iPhone 17 ────────────────────────────────────────────────────── */
// 71.5 × 149.6 mm body, 6.3″ 1206 × 2622 display (402 × 874 pt), ~2.45 mm even borders,
// Dynamic Island 126 × 37 pt, Action button + volume on the left, side button + Camera Control on the right.

const IPHONE_W = 402;
const IPHONE_H = 874;

export function IPhone17({
  children,
  domain,
  className = "",
}: {
  children: React.ReactNode;
  /** shown in Safari's address bar */
  domain: string;
  className?: string;
}) {
  return (
    <div className={`@container relative aspect-[71.5/149.6] ${className}`}>
      {/* left: Action button, volume up, volume down */}
      <span className={`${BUTTON} -left-[0.85cqw] top-[17.5%] h-[4.6%] w-[1.1cqw] rounded-l-[0.6cqw]`} />
      <span className={`${BUTTON} -left-[0.85cqw] top-[25.5%] h-[7.6%] w-[1.1cqw] rounded-l-[0.6cqw]`} />
      <span className={`${BUTTON} -left-[0.85cqw] top-[35%] h-[7.6%] w-[1.1cqw] rounded-l-[0.6cqw]`} />
      {/* right: side button, Camera Control */}
      <span className={`${BUTTON} -right-[0.85cqw] top-[28%] h-[11.5%] w-[1.1cqw] rounded-r-[0.6cqw]`} />
      <span className={`${BUTTON} -right-[0.6cqw] top-[55%] h-[6.4%] w-[0.85cqw] rounded-r-[0.5cqw] opacity-80`} />

      {/* aluminium band */}
      <div className={`absolute inset-0 rounded-[17.8cqw] p-[0.95cqw] ${METAL}`}>
        {/* black border under the glass */}
        <div className="relative h-full w-full rounded-[16.9cqw] bg-black p-[2.48cqw]">
          {/* display */}
          <div className="relative h-full w-full overflow-hidden rounded-[14.4cqw] bg-[#0a0a0b]">
            <NativeScreen width={IPHONE_W} height={IPHONE_H}>
              <div className="relative h-full w-full bg-[#0a0a0b] font-sans text-white">
                {/* the web page, between the status bar and Safari's bottom bar */}
                <div className="absolute inset-x-0 bottom-[92px] top-[59px]">{children}</div>

                {/* status bar, centred on the Dynamic Island */}
                <div className="absolute inset-x-0 top-0 flex h-[59px] items-center justify-between px-[34px]">
                  <span className="w-[86px] text-center text-[17px] font-semibold tracking-[-0.01em]">9:41</span>
                  <span className="flex w-[86px] items-center justify-center gap-[6px]">
                    <Signal />
                    <Wifi />
                    <Battery />
                  </span>
                </div>
                {/* Dynamic Island */}
                <div className="absolute left-1/2 top-[11px] h-[37px] w-[126px] -translate-x-1/2 rounded-full bg-black" />

                {/* Safari's floating bottom bar */}
                <div className="absolute inset-x-[14px] bottom-[30px] flex h-[50px] items-center gap-2 rounded-full bg-[#2a2a2c]/90 px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                  <svg width="12" height="20" viewBox="0 0 12 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="text-white/85" aria-hidden>
                    <path d="M10 2 2 10l8 8" />
                  </svg>
                  <span className="flex-1 truncate text-center text-[16px] font-medium text-white/90">{shortDomain(domain)}</span>
                  <svg width="22" height="6" viewBox="0 0 22 6" fill="currentColor" className="text-white/85" aria-hidden>
                    <circle cx="3" cy="3" r="2.6" />
                    <circle cx="11" cy="3" r="2.6" />
                    <circle cx="19" cy="3" r="2.6" />
                  </svg>
                </div>
                {/* home indicator */}
                <div className="absolute bottom-[8px] left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-white/80" />
              </div>
            </NativeScreen>
            <div className={SHEEN} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── iPad Pro 13″ (M5) ────────────────────────────────────────────── */
// 281.6 × 215.5 mm body, 13″ 2752 × 2064 display (1376 × 1032 pt, 4:3), ~8.4 mm even borders,
// front camera on the long (landscape) edge. Shown in landscape.

const IPAD_W = 1376;
const IPAD_H = 1032;

function ToolbarIcon({ d, size = 22 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

export function IPadPro({
  children,
  domain,
  className = "",
}: {
  children: React.ReactNode;
  domain: string;
  className?: string;
}) {
  return (
    <div className={`@container relative aspect-[281.6/215.5] ${className}`}>
      {/* aluminium band */}
      <div className={`absolute inset-0 rounded-[4.3cqw] p-[0.42cqw] ${METAL}`}>
        {/* black border under the glass */}
        <div className="relative h-full w-full rounded-[3.9cqw] bg-black p-[2.58cqw]">
          {/* landscape front camera */}
          <span className="absolute left-1/2 top-[1.05cqw] h-[0.5cqw] w-[0.5cqw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#2b3a4a,#07090c_70%)] ring-1 ring-white/[0.06]" />

          {/* display */}
          <div className="relative h-full w-full overflow-hidden rounded-[1.3cqw] bg-[#0a0a0b]">
            <NativeScreen width={IPAD_W} height={IPAD_H}>
              <div className="relative flex h-full w-full flex-col bg-[#0a0a0b] font-sans text-white">
                {/* status bar */}
                <div className="flex h-[24px] shrink-0 items-center justify-between px-[22px] text-[13px] font-semibold">
                  <span className="tracking-[-0.01em]">
                    9:41&nbsp;&nbsp;<span className="font-medium">Thu Nov 12</span>
                  </span>
                  <span className="flex items-center gap-[7px]">
                    <Wifi />
                    <span className="text-[13px] font-medium">100%</span>
                    <Battery />
                  </span>
                </div>

                {/* Safari toolbar */}
                <div className="flex h-[52px] shrink-0 items-center gap-5 border-b border-white/[0.06] bg-[#141416] px-6 text-white/80">
                  <ToolbarIcon d="M4 5h16v14H4zM10 5v14" />
                  <ToolbarIcon d="M15 5l-7 7 7 7" />
                  <span className="text-white/30">
                    <ToolbarIcon d="M9 5l7 7-7 7" />
                  </span>
                  <div className="mx-auto flex h-[36px] w-[440px] items-center justify-center gap-2 rounded-[11px] bg-white/[0.08] px-4 text-[15px] text-white/90">
                    <svg width="11" height="14" viewBox="0 0 11 14" fill="currentColor" className="text-white/60" aria-hidden>
                      <path d="M5.5 0A3.6 3.6 0 0 0 1.9 3.6V5.6H1.3C.6 5.6 0 6.2 0 6.9v5.8C0 13.4.6 14 1.3 14h8.4c.7 0 1.3-.6 1.3-1.3V6.9c0-.7-.6-1.3-1.3-1.3h-.6V3.6A3.6 3.6 0 0 0 5.5 0Zm-2 5.6V3.6a2 2 0 1 1 4 0v2Z" />
                    </svg>
                    <span className="truncate">{domain}</span>
                  </div>
                  <ToolbarIcon d="M12 15V3M7 8l5-5 5 5M5 13v7h14v-7" />
                  <ToolbarIcon d="M12 5v14M5 12h14" />
                  <ToolbarIcon d="M8 8h11v11H8zM5 16V5h11" />
                </div>

                {/* the web page */}
                <div className="relative min-h-0 flex-1">{children}</div>

                {/* home indicator */}
                <div className="absolute bottom-[8px] left-1/2 h-[5px] w-[300px] -translate-x-1/2 rounded-full bg-white/75" />
              </div>
            </NativeScreen>
            <div className={SHEEN} />
          </div>
        </div>
      </div>
    </div>
  );
}
