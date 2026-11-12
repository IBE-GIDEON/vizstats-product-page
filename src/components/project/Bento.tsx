"use client";

import { useCallback, useMemo, useState } from "react";
import { IconLock, IconPlus } from "@/components/site/icons";
import Modal from "@/components/ui/Modal";
import { Reveal } from "@/components/ui/motion";
import type { InsideItem, Project } from "@/content/projects";
import { BentoDetailBody, bentoDetails } from "./BentoDetails";
import { CHAIN, ELEMENTS, KEY, REGISTRY, SECONDARY, card, smoothPath } from "./mock/bentoData";
import { IPhone17 } from "./mock/Devices";
import { ERAS, Machine } from "./mock/Machines";
import { ProductScreen } from "./mock/ProductScreen";

/* ── Cell shell: hairline grid, cursor spotlight, label bottom-left ── */
function Cell({
  label,
  onOpen,
  className = "",
  children,
}: {
  label: string;
  onOpen: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseMove={onMove}
      aria-haspopup="dialog"
      aria-label={`${label} — open details`}
      className={`group relative block min-h-[320px] w-full cursor-pointer overflow-hidden border-b border-r border-line bg-black text-left focus-visible:z-10 focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-green/60 lg:min-h-0 ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(420px circle at var(--mx) var(--my), rgba(90,210,226,0.08), transparent 45%)" }}
      />
      <div className="absolute inset-0 transition-transform duration-700 ease-out-expo group-hover:-translate-y-1.5">
        {children}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[58%] bg-gradient-to-t from-black via-black/85 to-transparent"
      />
      <span className="absolute bottom-6 left-6 z-[3] flex items-center gap-2 text-[17px] font-medium tracking-[-0.015em] text-fog md:bottom-7 md:left-8">
        {label}
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/15 text-ash transition-all duration-500 group-hover:rotate-90 group-hover:border-transparent group-hover:bg-green group-hover:text-black">
          <IconPlus width={13} height={13} />
        </span>
      </span>
    </button>
  );
}

/* ── Mocks ────────────────────────────────────────────────────────── */
function TimelineMock() {
  return (
    <div className={`${card} absolute left-6 right-[-28px] top-8 p-5 md:left-8`}>
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-fog">Energy transition</span>
        <span className="font-mono text-[10px] text-ash-3">03 / 04</span>
      </div>
      <div className="mt-4 flex items-end gap-2">
        {ERAS.map((e, i) => (
          <div
            key={e.key}
            className={`flex flex-1 flex-col items-center rounded-xl border p-2 ${
              i === 2 ? "border-green/40 bg-green/[0.06]" : "border-white/[0.06] bg-white/[0.02]"
            }`}
          >
            <Machine era={e.key} accent="#5ad2e2" className={`h-12 w-12 ${i === 2 ? "" : "opacity-45"}`} />
            <span className={`mt-1 font-mono text-[9px] ${i === 2 ? "text-green" : "text-ash-3"}`}>{e.year}</span>
          </div>
        ))}
      </div>
      <div className="relative mt-5 h-px bg-white/10">
        <div className="absolute inset-y-0 left-0 w-[62%] bg-gradient-to-r from-green/10 to-green" />
        <div className="absolute left-[62%] top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-black bg-green shadow-[0_0_10px_#5ad2e2]" />
      </div>
    </div>
  );
}

function PeriodicMock() {
  return (
    <div className="absolute left-6 top-8 md:left-8">
      <div className="grid grid-cols-[repeat(18,40px)] grid-rows-[repeat(4,44px)] gap-1">
        {ELEMENTS.map(([z, sym, col, row]) => {
          const key = KEY.has(sym);
          const sec = SECONDARY.has(sym);
          return (
            <div
              key={sym}
              style={{ gridColumn: col, gridRow: row }}
              className={`flex flex-col justify-between rounded-md border p-1 ${
                key
                  ? "border-green/50 bg-green/[0.09] text-green shadow-[0_0_18px_-6px_#5ad2e2]"
                  : sec
                    ? "border-white/15 bg-white/[0.03] text-ash"
                    : "border-white/[0.05] text-ash-4"
              } ${sym === "Co" ? "ring-1 ring-green" : ""}`}
            >
              <span className="font-mono text-[7.5px] opacity-70">{z}</span>
              <span className="text-[13px] font-semibold leading-none">{sym}</span>
            </div>
          );
        })}
        {/* the gap in the table holds the detail card */}
        <div style={{ gridColumn: "4 / 12", gridRow: "1 / 4" }} className="p-1">
          <div className={`${card} flex h-full items-center gap-4 px-4`}>
            <div className="flex h-[92px] w-[80px] shrink-0 flex-col justify-between rounded-lg border border-green/50 bg-green/[0.1] p-2 text-green">
              <span className="font-mono text-[9px]">27</span>
              <span className="text-[30px] font-semibold leading-none">Co</span>
              <span className="text-[9px] text-green/80">Cobalt</span>
            </div>
            <div className="min-w-0 text-[11.5px]">
              <div className="text-[14px] font-semibold text-fog">Cobalt</div>
              <div className="mt-0.5 text-ash-3">Transition mineral</div>
              <div className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                <span className="text-ash-3">Used in</span>
                <span className="text-ash">Battery cathodes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegistryMock() {
  return (
    <div className={`${card} absolute left-6 right-[-40px] top-8 md:left-8`}>
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
        <span className="text-[14px] font-semibold text-fog">Company registry</span>
        <span className="rounded-full bg-white/[0.06] px-2 py-0.5 font-mono text-[10px] text-ash-2">29</span>
      </div>
      <div className="flex gap-2 px-5 py-3">
        {["All", "State-backed", "Hybrid"].map((t, i) => (
          <span
            key={t}
            className={`rounded-full px-2.5 py-1 text-[11px] ${i === 0 ? "bg-fog text-black" : "border border-white/10 text-ash-2"}`}
          >
            {t}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-[1fr_62px_28px_28px] gap-x-3 px-5 pb-2 font-mono text-[9px] uppercase tracking-[0.12em] text-ash-3">
        <span>Company</span>
        <span>Owner</span>
        <span>Ctry</span>
        <span>Min</span>
      </div>
      {REGISTRY.map((r, i) => (
        <div
          key={i}
          className={`grid grid-cols-[1fr_62px_28px_28px] items-center gap-x-3 border-t border-white/[0.04] px-5 py-2.5 ${
            i === 2 ? "bg-white/[0.04]" : ""
          }`}
        >
          <span className="flex min-w-0 items-center gap-2.5">
            <span className="h-5 w-5 shrink-0 rounded-md bg-gradient-to-br from-white/15 to-white/[0.04]" />
            <span className="h-2 rounded-full bg-white/[0.13]" style={{ width: `${r.w}%` }} />
          </span>
          <span
            className={`rounded-full border py-0.5 text-center text-[10px] ${
              r.own === "State" ? "border-green/40 text-green" : "border-white/15 text-ash-2"
            }`}
          >
            {r.own}
          </span>
          <span className="font-mono text-[10px] text-ash-2">{r.c}</span>
          <span className="font-mono text-[10px] text-ash">{r.m}</span>
        </div>
      ))}
    </div>
  );
}

function StatMock({ value, word }: { value: number; word: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center pt-9">
      <div className="pointer-events-none absolute -right-28 -top-36 h-[380px] w-[380px] rounded-full border-[34px] border-white/[0.05] blur-[3px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_100%_0%,rgba(195,199,196,0.14),transparent_65%)]" />
      <span className="relative font-display text-[68px] font-bold leading-none tracking-[-0.05em] text-fog tabular-nums">
        {value}
      </span>
      <span className="relative -mt-1 bg-gradient-to-b from-ash-2 via-ash-3/50 to-transparent bg-clip-text font-display text-[58px] font-bold leading-none tracking-[-0.05em] text-transparent">
        {word}
      </span>
    </div>
  );
}

function BrowserMock({ domain }: { domain: string }) {
  return (
    <div className={`${card} absolute left-6 right-[-60px] top-[70px] flex items-center gap-4 px-4 py-3 md:left-8`}>
      <span className="flex items-center gap-3 text-ash-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
          <path d="M19 12H5M11 6l-6 6 6 6" />
        </svg>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
          <path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v4.5h-4.5" />
        </svg>
      </span>
      <span className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-white/[0.05] px-3 py-2 text-[13.5px] text-ash">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-green/15 text-green">
          <IconLock width={12} height={12} />
        </span>
        <span className="truncate">https://{domain}</span>
      </span>
    </div>
  );
}

function ChainMock({ stats }: { stats: Project["stats"] }) {
  return (
    <div className={`${card} absolute bottom-[-40px] left-6 right-[-40px] top-8 md:left-8`}>
      <div className="grid max-w-[460px] grid-cols-3 gap-6 border-b border-white/[0.06] px-6 py-5">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="text-[12px] text-ash-2">{s.label}</div>
            <div className="mt-1 text-[19px] font-semibold tracking-[-0.02em] text-fog">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="relative px-2 pt-2">
        <svg viewBox="0 0 700 250" className="w-full" aria-hidden>
          <defs>
            <linearGradient id="chain-g" x1="0" x2="1">
              <stop offset="0" stopColor="#8d928f" stopOpacity="0.5" />
              <stop offset="1" stopColor="#5ad2e2" />
            </linearGradient>
          </defs>
          {[60, 110, 160, 210].map((y) => (
            <line key={y} x1="0" x2="700" y1={y} y2={y} stroke="#ffffff08" />
          ))}
          <path d={smoothPath(CHAIN, 34)} fill="none" stroke="#5c615e" strokeWidth="1.4" strokeDasharray="2 5" />
          <path d={smoothPath(CHAIN)} fill="none" stroke="url(#chain-g)" strokeWidth="1.8" />
          <path
            d={smoothPath(CHAIN)}
            fill="none"
            stroke="#d6f6fb"
            strokeWidth="2.2"
            strokeDasharray="6 34"
            strokeLinecap="round"
            style={{ animation: "dash-flow 1.6s linear infinite" }}
          />
          {CHAIN.map((p, i) => (
            <g key={p.label}>
              <circle
                cx={p.x}
                cy={p.y}
                r={i === CHAIN.length - 1 ? 6 : 4.5}
                fill={i === CHAIN.length - 1 ? "#5ad2e2" : "#000"}
                stroke={i === CHAIN.length - 1 ? "#5ad2e2" : "#8d928f"}
                strokeWidth="1.6"
              />
              <text x={p.x} y={p.y + 26} textAnchor="middle" fill="#8d928f" fontSize="11" fontFamily="var(--font-sans)">
                {p.label}
              </text>
            </g>
          ))}
        </svg>
        <div className={`${card} absolute left-[44%] top-[2%] w-[200px] p-3 text-[11.5px]`}>
          <div className="text-ash-2">Mine site → Beijing</div>
          <div className="mt-2 flex items-center justify-between border-t border-white/[0.06] pt-2">
            <span className="text-ash">Ownership</span>
            <span className="font-semibold text-fog">State-backed</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhoneMock({ chapters, domain }: { chapters: string[]; domain: string }) {
  return (
    <div className="absolute inset-x-0 top-8 flex justify-center">
      <IPhone17 domain={domain} className="w-[220px]">
        <ProductScreen chapters={chapters} variant="phone" interactive={false} initial={0} />
      </IPhone17>
    </div>
  );
}

/* ── Section ──────────────────────────────────────────────────────── */
export default function Bento({ project }: { project: Project }) {
  const details = useMemo(() => bentoDetails(project), [project]);
  const n = details.length;
  const [{ open, index }, setView] = useState({ open: false, index: 0 });

  const show = (i: number) => setView({ open: true, index: i });
  const close = useCallback(() => setView((v) => ({ ...v, open: false })), []);
  const prev = useCallback(() => setView((v) => ({ ...v, index: (v.index - 1 + n) % n })), [n]);
  const next = useCallback(() => setView((v) => ({ ...v, index: (v.index + 1) % n })), [n]);

  // each box's preview and grid size, by id; order and labels come from the project content
  const cells: Record<InsideItem["id"], { className?: string; mock: React.ReactNode }> = {
    timeline: { mock: <TimelineMock /> },
    periodic: { className: "lg:col-span-2", mock: <PeriodicMock /> },
    registry: { className: "min-h-[460px] lg:row-span-2", mock: <RegistryMock /> },
    sites: { mock: <StatMock value={project.stats[1]?.value ?? 0} word="projects" /> },
    live: { mock: <BrowserMock domain={project.product.domain} /> },
    chain: { className: "min-h-[420px] sm:col-span-2 lg:row-span-2", mock: <ChainMock stats={project.stats} /> },
    responsive: { className: "min-h-[420px]", mock: <PhoneMock chapters={project.chapters} domain={project.product.domain} /> },
  };
  const item = details[index];
  if (!item) return null;

  return (
    <section id="inside" className="relative pb-28 md:pb-40">
      <div className="container-x">
        <Reveal className="mb-12 md:mb-16">
          <h2 className="font-display text-[clamp(32px,4.4vw,64px)] font-semibold leading-[1] tracking-[-0.045em]">
            Inside <span className="text-ash-2">the product.</span>
          </h2>
        </Reveal>

        {/* phones: one column · tablets: two (dense, so no holes) · 1024px and up: three */}
        <Reveal y={40}>
          <div className="grid grid-cols-1 border-l border-t border-line sm:grid-flow-row-dense sm:grid-cols-2 lg:grid-flow-row lg:auto-rows-[248px] lg:grid-cols-3">
            {details.map((d, i) => (
              <Cell key={d.id} label={d.label} className={cells[d.id].className} onOpen={() => show(i)}>
                {cells[d.id].mock}
              </Cell>
            ))}
          </div>
        </Reveal>
      </div>

      <Modal
        open={open}
        onClose={close}
        onPrev={prev}
        onNext={next}
        contentKey={item.id}
        eyebrow={
          <>
            <span className="hidden sm:inline">Inside the product · </span>
            {String(index + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </>
        }
        title={item.label}
      >
        <BentoDetailBody item={item} />
      </Modal>
    </section>
  );
}
