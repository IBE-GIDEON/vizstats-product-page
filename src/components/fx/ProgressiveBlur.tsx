/**
 * Stacked backdrop blurs with overlapping masks — the blur ramps up smoothly
 * toward `direction` instead of ending on a hard edge.
 */
export default function ProgressiveBlur({
  className,
  layers = 7,
  maxBlur = 48,
  direction = "bottom",
}: {
  className?: string;
  layers?: number;
  maxBlur?: number;
  direction?: "bottom" | "top";
}) {
  const step = 100 / (layers + 1);
  return (
    <div aria-hidden className={`pointer-events-none ${className ?? ""}`}>
      {Array.from({ length: layers }, (_, i) => {
        const blur = maxBlur / Math.pow(2, layers - 1 - i);
        const a = i * step;
        const b = (i + 1) * step;
        const c = (i + 2) * step;
        const last = i === layers - 1;
        const mask = last
          ? `linear-gradient(to ${direction}, transparent ${a}%, black ${b}%)`
          : `linear-gradient(to ${direction}, transparent ${a}%, black ${b}%, black ${c}%, transparent ${Math.min(100, c + step)}%)`;
        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        );
      })}
    </div>
  );
}
