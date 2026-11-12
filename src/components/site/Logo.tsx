/**
 * VizStats logo, redrawn from the brand artwork: the "V" mark (long arm, notch, flag)
 * and the slanted squared wordmark, in the brand turquoise (`text-green`).
 * The mark is a hand-traced vector; swap in the master SVG when you have it.
 */

const MARK_PATH =
  "M30 0H190C215 0 240 8 258 33L437 313C452 335 475 347 498 347C514 347 523 338 528 325C540 296 548 250 556 207C561 180 574 162 603 160L788 150C813 149 829 168 821 195L786 318C778 346 760 360 733 362L557 373C545 374 538 381 536 394L500 606C495 632 478 642 452 642C420 642 392 630 374 606L10 57C-6 33 4 0 30 0Z";

export function LogoMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 824 642"
      width={size}
      height={(size * 642) / 824}
      className={`text-green ${className ?? ""}`}
      aria-hidden
    >
      <path d={MARK_PATH} fill="currentColor" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={`inline-block -skew-x-[11deg] font-logo text-[19px] leading-none tracking-[0.01em] text-green ${className ?? ""}`}
    >
      VizStats
    </span>
  );
}
