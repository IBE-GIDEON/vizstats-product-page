"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lays its content out at a fixed design width, then scales it down (never up) to fit inside the
 * box, centred — so a detailed visual keeps its proportions in a small box instead of squashing.
 */
export function ScaleToFit({ width, children }: { width: number; children: React.ReactNode }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const box = boxRef.current;
    const inner = innerRef.current;
    if (!box || !inner) return;
    const fit = () => {
      const h = inner.scrollHeight;
      if (!box.clientWidth || !h) return;
      setScale(Math.min(1, box.clientWidth / width, box.clientHeight / h));
    };
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    ro.observe(inner);
    return () => ro.disconnect();
  }, [width]);

  return (
    <div ref={boxRef} className="absolute inset-0 overflow-hidden">
      <div
        ref={innerRef}
        className="absolute left-1/2 top-1/2"
        style={{ width, transform: `translate(-50%, -50%) scale(${scale})`, visibility: scale ? "visible" : "hidden" }}
      >
        {children}
      </div>
    </div>
  );
}
