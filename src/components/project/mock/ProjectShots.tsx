import type { ProjectCard } from "@/content/projects";

/**
 * Desktop "screenshots" for the next-project stack. Each one fills its parent, which must be
 * a size container (`@container`): every size is in `cqw`, so the shot scales as one picture.
 * Swap these for real screenshots (an <img> filling the same box) when they're available.
 */

/* ── Africa Mining Presence — light marble site with a map ───────────── */

/** Deterministic topographic contours. */
function Topo({ className }: { className?: string }) {
  const lines = Array.from({ length: 24 }, (_, k) => {
    const pts: string[] = [];
    const base = 18 + k * 20;
    for (let a = 0; a <= 72; a++) {
      const t = (a / 72) * Math.PI * 2;
      const r = base + 11 * Math.sin(3 * t + k * 0.5) + 6 * Math.sin(5 * t - k * 0.8) + 4 * Math.cos(2 * t + k);
      pts.push(`${(420 + r * Math.cos(t) * 1.45).toFixed(1)} ${(170 + r * Math.sin(t)).toFixed(1)}`);
    }
    return `M${pts.join(" L")}Z`;
  });
  return (
    <svg viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      {lines.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#0a0b0b" strokeOpacity={0.1} strokeWidth={1} />
      ))}
    </svg>
  );
}

const PINS = [
  [64, 38, 1.4],
  [71, 47, 2.2],
  [68, 58, 1.1],
  [77, 62, 1.7],
  [82, 44, 1.2],
  [74, 74, 1.5],
] as const;

function Marble() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#e6e8e6] text-[#0b0c0c]">
      <Topo className="absolute inset-0 h-full w-full" />
      {PINS.map(([x, y, s], i) => (
        <span
          key={i}
          className="absolute rounded-full border border-black/50 bg-black/[0.06]"
          style={{ left: `${x}%`, top: `${y}%`, width: `${s * 2.4}cqw`, height: `${s * 2.4}cqw` }}
        >
          <span className="absolute inset-[30%] rounded-full bg-black/80" />
        </span>
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-[#e6e8e6] via-[#e6e8e6]/75 to-transparent" />

      <div className="relative flex items-center gap-[2.2cqw] border-b border-black/10 px-[3cqw] py-[1.5cqw] text-[1.25cqw] text-black/60">
        <span className="h-[2cqw] w-[2cqw] rounded-[0.4cqw] bg-black/80" />
        <span className="font-semibold text-black/80">China–Global South</span>
        <span className="ml-[1.5cqw]">Projects</span>
        <span>Resources</span>
        <span>News &amp; Updates</span>
        <span>About</span>
      </div>
      <div className="relative px-[4cqw] pt-[7cqw]">
        <p className="max-w-[46cqw] font-display text-[4.6cqw] font-bold leading-[1.02] tracking-[-0.035em]">
          Chinese Presence in Critical Minerals in Africa
        </p>
        <div className="mt-[2.6cqw] space-y-[1.1cqw]">
          {[40, 44, 29].map((w, i) => (
            <div key={i} className="h-[0.9cqw] rounded-full bg-black/10" style={{ width: `${w}cqw` }} />
          ))}
        </div>
        <span className="mt-[3.4cqw] inline-flex items-center gap-[0.8cqw] rounded-[0.6cqw] bg-[#0b0c0c] px-[1.8cqw] py-[1.1cqw] text-[1.3cqw] font-medium text-white">
          Explore map →
        </span>
      </div>
    </div>
  );
}

/* ── Stand-in: dark dashboard, amber ─────────────────────────────────── */

const SERIES = [12, 14, 13, 17, 19, 18, 24, 27, 26, 33, 38, 41, 47, 52, 58, 61];

function Pulse() {
  const max = 64;
  const pts = SERIES.map((v, i) => `${(i / (SERIES.length - 1)) * 600} ${200 - (v / max) * 190}`);
  const line = `M${pts.join(" L")}`;
  return (
    <div className="absolute inset-0 flex overflow-hidden bg-[#0c0c0d] text-white">
      {/* sidebar */}
      <div className="flex w-[17cqw] shrink-0 flex-col gap-[1.6cqw] border-r border-white/[0.06] p-[2.2cqw]">
        <span className="h-[2.2cqw] w-[2.2cqw] rounded-[0.5cqw] bg-[#f0a43a]" />
        {["Overview", "Countries", "Sources", "Pipeline", "Methods"].map((t, i) => (
          <span key={t} className={`text-[1.25cqw] ${i === 0 ? "text-white" : "text-white/35"}`}>
            {t}
          </span>
        ))}
      </div>
      {/* main */}
      <div className="flex min-w-0 flex-1 flex-col p-[3cqw]">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono text-[0.95cqw] uppercase tracking-[0.2em] text-white/40">Installed capacity</p>
            <p className="mt-[0.6cqw] font-display text-[5.4cqw] font-bold leading-none tracking-[-0.04em]">
              61<span className="text-[2.4cqw] text-white/40"> GW</span>
            </p>
          </div>
          <div className="flex gap-[0.8cqw]">
            {["1Y", "5Y", "ALL"].map((t, i) => (
              <span
                key={t}
                className={`rounded-[0.5cqw] px-[1.2cqw] py-[0.6cqw] font-mono text-[0.95cqw] ${
                  i === 2 ? "bg-[#f0a43a] text-black" : "bg-white/[0.06] text-white/50"
                }`}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <svg viewBox="0 0 600 210" preserveAspectRatio="none" className="mt-[2.4cqw] min-h-0 w-full flex-1" aria-hidden>
          <defs>
            <linearGradient id="pulse-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#f0a43a" stopOpacity="0.35" />
              <stop offset="1" stopColor="#f0a43a" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[50, 100, 150, 200].map((y) => (
            <line key={y} x1="0" x2="600" y1={y} y2={y} stroke="#ffffff10" />
          ))}
          <path d={`${line} L600 210 L0 210Z`} fill="url(#pulse-fill)" />
          <path d={line} fill="none" stroke="#f0a43a" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="mt-[2cqw] grid grid-cols-4 gap-[1.2cqw]">
          {[
            ["Solar", "38%"],
            ["Wind", "21%"],
            ["Hydro", "29%"],
            ["Other", "12%"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-[0.8cqw] bg-white/[0.04] p-[1.3cqw]">
              <p className="text-[1cqw] text-white/40">{k}</p>
              <p className="mt-[0.4cqw] text-[1.8cqw] font-semibold">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Stand-in: light editorial story with a bar chart, blue ──────────── */

const BARS = [92, 74, 61, 55, 41, 33, 24];

function Ledger() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#f4f2ee] text-[#151515]">
      <div className="flex items-center justify-between border-b border-black/10 px-[3cqw] py-[1.5cqw] text-[1.2cqw]">
        <span className="font-semibold">The Ledger</span>
        <span className="text-black/45">Chapter 3 of 7</span>
      </div>
      <div className="grid h-full grid-cols-[1fr_1.15fr] gap-[4cqw] px-[4cqw] pt-[5cqw]">
        <div>
          <p className="font-mono text-[0.95cqw] uppercase tracking-[0.2em] text-[#3157ff]">Data story</p>
          <p className="mt-[1.4cqw] font-display text-[4.2cqw] font-bold leading-[1.02] tracking-[-0.035em]">
            Who pays for the roads?
          </p>
          <div className="mt-[2.4cqw] space-y-[1.1cqw]">
            {[34, 36, 31, 35, 22].map((w, i) => (
              <div key={i} className="h-[0.8cqw] rounded-full bg-black/10" style={{ width: `${w}cqw` }} />
            ))}
          </div>
        </div>
        <div className="space-y-[1.5cqw] pt-[1cqw]">
          {BARS.map((v, i) => (
            <div key={i} className="flex items-center gap-[1.2cqw]">
              <span className="h-[0.8cqw] w-[7cqw] shrink-0 rounded-full bg-black/15" />
              <span
                className={`h-[2.4cqw] rounded-[0.3cqw] ${i === 0 ? "bg-[#3157ff]" : "bg-black/20"}`}
                style={{ width: `${v * 0.36}cqw` }}
              />
              <span className="font-mono text-[1cqw] text-black/50">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Stand-in: dark network explorer, violet ─────────────────────────── */

const NODES = [
  [300, 150, 16],
  [180, 90, 9],
  [420, 80, 11],
  [470, 200, 8],
  [200, 225, 10],
  [110, 160, 6],
  [370, 255, 7],
  [520, 120, 6],
  [250, 40, 5],
  [80, 60, 5],
] as const;
const LINKS = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [1, 5],
  [1, 8],
  [2, 7],
  [3, 6],
  [4, 6],
  [5, 9],
  [1, 9],
  [2, 3],
] as const;

function Network() {
  return (
    <div className="absolute inset-0 flex overflow-hidden bg-[#0b0a10] text-white">
      <div className="relative min-w-0 flex-1">
        <svg viewBox="0 0 600 300" className="absolute inset-0 h-full w-full" aria-hidden>
          {LINKS.map(([a, b], i) => (
            <line
              key={i}
              x1={NODES[a][0]}
              y1={NODES[a][1]}
              x2={NODES[b][0]}
              y2={NODES[b][1]}
              stroke={a === 0 ? "#9b7bff" : "#ffffff"}
              strokeOpacity={a === 0 ? 0.6 : 0.14}
              strokeWidth="1.2"
            />
          ))}
          {NODES.map(([x, y, r], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={r}
              fill={i === 0 ? "#9b7bff" : "#16141f"}
              stroke={i === 0 ? "#c9b8ff" : "#ffffff40"}
              strokeWidth="1.2"
            />
          ))}
        </svg>
        <p className="absolute left-[3cqw] top-[2.6cqw] font-mono text-[0.95cqw] uppercase tracking-[0.2em] text-white/40">
          Ownership graph
        </p>
      </div>
      <div className="w-[24cqw] shrink-0 border-l border-white/[0.06] p-[2.4cqw]">
        <p className="font-mono text-[0.95cqw] uppercase tracking-[0.2em] text-[#9b7bff]">Selected</p>
        <div className="mt-[1.2cqw] h-[1.4cqw] w-[15cqw] rounded-full bg-white/80" />
        <div className="mt-[2.4cqw] space-y-[1.4cqw]">
          {[
            ["Links", "14"],
            ["Countries", "6"],
            ["Stake", "51%"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between border-t border-white/[0.06] pt-[1.2cqw] text-[1.15cqw]">
              <span className="text-white/45">{k}</span>
              <span className="font-semibold">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const SHOTS = { marble: Marble, pulse: Pulse, ledger: Ledger, network: Network } as const;

export function ProjectShot({ shot }: { shot: ProjectCard["shot"] }) {
  const Shot = SHOTS[shot];
  return <Shot />;
}
