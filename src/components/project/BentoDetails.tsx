"use client";

import { useState } from "react";
import { IconLock } from "@/components/site/icons";
import type { BuiltinVisual, FeaturePanel, Project } from "@/content/projects";
import { ProductPoster } from "./HeroMedia";
import {
  CHAIN,
  COUNTRIES,
  ELEMENTS,
  KEY,
  MINERALS,
  REGISTRY,
  SECONDARY,
  smoothPath,
} from "./mock/bentoData";
import { IPadPro, IPhone17, MacBookPro, NativeScreen } from "./mock/Devices";
import { ERAS, Machine } from "./mock/Machines";
import { ProductScreen } from "./mock/ProductScreen";

/**
 * The built-in visuals for "Inside the product": large live pieces of the product (animation or
 * interactive), and single pieces sized for boxes (one era, one device).
 */

/* ── media blocks ─────────────────────────────────────────────────── */

function WindowBar({ domain }: { domain: string }) {
  return (
    <div className="flex h-9 items-center gap-3 border-b border-white/[0.06] bg-[#101211] px-3.5">
      <span className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-2.5 w-2.5 rounded-full bg-white/10" />
        ))}
      </span>
      <span className="mx-auto flex min-w-0 max-w-[70%] items-center gap-1.5 rounded-md bg-white/[0.05] px-3 py-1 font-mono text-[10px] text-ash-2">
        <IconLock width={10} height={10} className="shrink-0 text-green" />
        <span className="truncate">{domain}</span>
      </span>
      <span className="w-[42px]" />
    </div>
  );
}

/** The live product: a desktop window on tablets and up, an iPhone on phones. */
function LiveScreens({ project, initial = 2 }: { project: Project; initial?: number }) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-white/10 bg-black md:block">
        <WindowBar domain={project.product.domain} />
        <div className="relative aspect-[1376/820]">
          <NativeScreen width={1376} height={820}>
            <ProductScreen chapters={project.chapters} variant="tablet" initial={initial} />
          </NativeScreen>
        </div>
      </div>
      <div className="flex justify-center py-2 md:hidden">
        <IPhone17 domain={project.product.domain} className="w-[62%] max-w-[260px]">
          <ProductScreen chapters={project.chapters} variant="phone" initial={0} />
        </IPhone17>
      </div>
    </>
  );
}

function PeriodicDetail() {
  const [sel, setSel] = useState("Co");
  const info = MINERALS[sel];
  const z = ELEMENTS.find((e) => e[1] === sel)?.[0];

  return (
    <div>
      {/* the table scrolls sideways on narrow screens */}
      <div data-lenis-prevent className="-mx-1 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]">
        <div className="grid min-w-[620px] grid-cols-[repeat(18,minmax(0,1fr))] gap-1">
          {ELEMENTS.map(([num, sym, col, row]) => {
            const key = KEY.has(sym);
            const sec = SECONDARY.has(sym);
            const pickable = key || sec;
            const on = sym === sel;
            const tile = `flex aspect-[10/11] flex-col justify-between rounded-md border p-1 text-left transition-colors duration-300 md:p-1.5 ${
              on
                ? "border-green bg-green/[0.16] text-green shadow-[0_0_24px_-6px_#5ad2e2]"
                : key
                  ? "border-green/40 bg-green/[0.07] text-green hover:bg-green/[0.14]"
                  : sec
                    ? "border-white/15 bg-white/[0.03] text-ash hover:bg-white/[0.08]"
                    : "border-white/[0.05] text-ash-4"
            }`;
            const inner = (
              <>
                <span className="font-mono text-[8px] opacity-70 md:text-[9px]">{num}</span>
                <span className="text-[13px] font-semibold leading-none md:text-[16px]">{sym}</span>
              </>
            );
            return pickable ? (
              <button
                key={sym}
                type="button"
                onClick={() => setSel(sym)}
                aria-pressed={on}
                aria-label={MINERALS[sym]?.name ?? sym}
                style={{ gridColumn: col, gridRow: row }}
                className={tile}
              >
                {inner}
              </button>
            ) : (
              <div key={sym} style={{ gridColumn: col, gridRow: row }} className={tile}>
                {inner}
              </div>
            );
          })}
        </div>
      </div>

      {/* selected mineral */}
      <div className="mt-5 flex items-center gap-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 md:p-5">
        <div className="flex h-[88px] w-[76px] shrink-0 flex-col justify-between rounded-lg border border-green/50 bg-green/[0.1] p-2 text-green">
          <span className="font-mono text-[10px]">{z}</span>
          <span className="text-[30px] font-semibold leading-none">{sel}</span>
          <span className="truncate text-[9px] text-green/80">{info?.name}</span>
        </div>
        <div className="min-w-0">
          <p className="text-[18px] font-semibold text-fog md:text-[20px]">{info?.name}</p>
          <p className="mt-1 text-[14px] text-ash-2">{KEY.has(sel) ? "Key transition mineral" : "Secondary mineral"}</p>
          <p className="mt-3 text-[14px] text-ash md:text-[15px]">
            <span className="text-ash-3">Used in&nbsp;&nbsp;</span>
            {info?.use}
          </p>
        </div>
      </div>
      <p className="mt-3 text-[12px] text-ash-3">Tap a highlighted element.</p>
    </div>
  );
}

const FILTERS = ["All", "State-backed", "Hybrid"] as const;

function RegistryDetail() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const rows = REGISTRY.filter((r) =>
    filter === "All" ? true : filter === "State-backed" ? r.own === "State" : r.own === "Hybrid",
  );

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#0b0c0c]">
      <div className="flex flex-wrap gap-2 border-b border-white/[0.06] p-4">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`rounded-full px-3.5 py-1.5 text-[13px] transition-colors duration-300 ${
              filter === f ? "bg-fog text-black" : "border border-white/10 text-ash-2 hover:text-fog"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-[1fr_76px_minmax(0,90px)] gap-x-3 px-4 py-2.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-ash-3 sm:grid-cols-[1fr_84px_110px_120px]">
        <span>Company</span>
        <span>Owner</span>
        <span>Country</span>
        <span className="hidden sm:block">Mineral</span>
      </div>
      {rows.map((r, i) => (
        <div
          key={`${filter}-${i}`}
          className="grid grid-cols-[1fr_76px_minmax(0,90px)] items-center gap-x-3 border-t border-white/[0.04] px-4 py-3 sm:grid-cols-[1fr_84px_110px_120px]"
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="h-6 w-6 shrink-0 rounded-md bg-gradient-to-br from-white/15 to-white/[0.04]" />
            <span className="h-2 rounded-full bg-white/[0.13]" style={{ width: `${r.w}%` }} />
          </span>
          <span
            className={`rounded-full border py-0.5 text-center text-[11px] ${
              r.own === "State" ? "border-green/40 text-green" : "border-white/15 text-ash-2"
            }`}
          >
            {r.own}
          </span>
          <span className="truncate text-[13px] text-ash">{COUNTRIES[r.c]}</span>
          <span className="hidden text-[13px] text-ash-2 sm:block">
            <span className="font-mono text-ash">{r.m}</span>
            {MINERALS[r.m] ? ` · ${MINERALS[r.m].name}` : r.m === "U" ? " · Uranium" : ""}
          </span>
        </div>
      ))}
      <p className="border-t border-white/[0.06] px-4 py-3 text-[12px] text-ash-3">
        Sample rows — company names are hidden in this preview.
      </p>
    </div>
  );
}

function SitesDetail({ value }: { value: number }) {
  const minerals = [...new Set(REGISTRY.map((r) => r.m))];
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-black px-5 py-12 md:py-16">
      <div className="pointer-events-none absolute -right-32 -top-40 h-[420px] w-[420px] rounded-full border-[36px] border-white/[0.05] blur-[3px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_100%_0%,rgba(195,199,196,0.14),transparent_65%)]" />
      <div className="relative flex flex-col items-center text-center">
        <span className="font-display text-[clamp(84px,14vw,160px)] font-bold leading-[0.85] tracking-[-0.05em] text-fog tabular-nums">
          {value}
        </span>
        <span className="bg-gradient-to-b from-ash-2 via-ash-3/50 to-transparent bg-clip-text font-display text-[clamp(56px,9vw,110px)] font-bold leading-[0.95] tracking-[-0.05em] text-transparent">
          projects
        </span>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {Object.entries(COUNTRIES).map(([code, name]) => (
            <span key={code} className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[13px] text-ash">
              <span className="mr-2 font-mono text-[11px] text-ash-3">{code}</span>
              {name}
            </span>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {minerals.map((m) => (
            <span key={m} className="rounded-full border border-green/30 px-3 py-1 font-mono text-[11px] text-green">
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function LiveDetail({ project }: { project: Project }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black">
      <WindowBar domain={project.product.domain} />
      <div className="relative aspect-[4/5] sm:aspect-video">
        <ProductPoster product={project.product} stats={project.stats} play />
      </div>
    </div>
  );
}

function ChainDetail({ stats }: { stats: Project["stats"] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#0b0c0c]">
      <div className="grid grid-cols-3 gap-4 border-b border-white/[0.06] px-5 py-5 md:max-w-[560px] md:px-6">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="text-[12px] text-ash-2">{s.label}</div>
            <div className="mt-1 text-[22px] font-semibold tracking-[-0.02em] text-fog">{s.value}</div>
          </div>
        ))}
      </div>
      <div data-lenis-prevent className="overflow-x-auto [scrollbar-width:thin]">
        <svg viewBox="0 0 700 250" className="block w-full min-w-[560px]" aria-hidden>
          <defs>
            <linearGradient id="chain-detail-g" x1="0" x2="1">
              <stop offset="0" stopColor="#8d928f" stopOpacity="0.5" />
              <stop offset="1" stopColor="#5ad2e2" />
            </linearGradient>
          </defs>
          {[60, 110, 160, 210].map((y) => (
            <line key={y} x1="0" x2="700" y1={y} y2={y} stroke="#ffffff08" />
          ))}
          <path d={smoothPath(CHAIN, 34)} fill="none" stroke="#5c615e" strokeWidth="1.4" strokeDasharray="2 5" />
          <path d={smoothPath(CHAIN)} fill="none" stroke="url(#chain-detail-g)" strokeWidth="1.8" />
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
              <text x={p.x} y={p.y + 26} textAnchor="middle" fill="#8d928f" fontSize="12" fontFamily="var(--font-sans)">
                {p.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <ol className="grid border-t border-white/[0.06] sm:grid-cols-2 lg:grid-cols-5">
        {CHAIN.map((p, i) => (
          <li key={p.label} className="border-b border-white/[0.06] px-5 py-4 sm:border-r lg:border-b-0">
            <span className="font-mono text-[10px] text-ash-3">{String(i + 1).padStart(2, "0")}</span>
            <p className={`mt-1 text-[15px] font-semibold ${i === CHAIN.length - 1 ? "text-green" : "text-fog"}`}>{p.label}</p>
            <p className="mt-1 text-[13px] leading-snug text-ash-2">{p.note}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** One story on every screen: laptop at the back, iPad and iPhone in front, all running the product. */
function ResponsiveDetail({ project }: { project: Project }) {
  const domain = project.product.domain;
  const { chapters } = project;
  return (
    <div className="relative overflow-hidden rounded-xl bg-[radial-gradient(75%_65%_at_50%_0%,rgba(255,255,255,0.07),transparent_70%)] px-[3%] pt-[3%]">
      {/* the surface they stand on */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-t from-white/[0.035] to-transparent" />
      <div className="pointer-events-none absolute inset-x-[10%] bottom-[2%] h-[10%] rounded-[50%] bg-black blur-2xl" />

      <div className="relative mx-auto aspect-[16/8] w-full max-w-[940px]">
        {/* desktop, at the back */}
        <div className="absolute bottom-[5%] left-1/2 w-[62%] -translate-x-1/2">
          <MacBookPro domain={domain}>
            <ProductScreen chapters={chapters} variant="tablet" initial={2} />
          </MacBookPro>
        </div>
        {/* tablet, front left */}
        <div className="absolute bottom-[1%] left-[5%] z-10 w-[25%] sm:w-[22%]">
          <IPadPro domain={domain} orientation="portrait">
            <ProductScreen chapters={chapters} variant="tablet" initial={1} />
          </IPadPro>
        </div>
        {/* phone, front right */}
        <div className="absolute bottom-[1%] right-[9%] z-10 w-[12.5%] sm:w-[10.5%]">
          <IPhone17 domain={domain}>
            <ProductScreen chapters={chapters} variant="phone" initial={3} />
          </IPhone17>
        </div>
      </div>
    </div>
  );
}

/* ── single pieces, made for boxes ─────────────────────────────────── */

const ERA_OF: Partial<Record<BuiltinVisual, (typeof ERAS)[number]["key"]>> = {
  "era-ancient": "ancient",
  "era-industrial": "industrial",
  "era-combustion": "combustion",
  "era-electric": "electric",
};

/** One machine from the timeline, with its year and name, as in the product. */
function EraBox({ era }: { era: (typeof ERAS)[number]["key"] }) {
  const e = ERAS.find((x) => x.key === era) ?? ERAS[0];
  return (
    <div className="relative flex flex-col items-center px-6 pb-8 pt-8 text-center">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-[radial-gradient(50%_55%_at_50%_70%,rgba(224,53,60,0.22),transparent)]" />
      <Machine era={e.key} className="relative w-[64%] drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]" />
      <p className="relative mt-7 font-display text-[46px] font-bold leading-none tabular-nums tracking-[-0.03em] text-signal">{e.year}</p>
      <p className="relative mt-2 text-[17px] text-white/70">{e.name}</p>
    </div>
  );
}

/** One device running the product. */
function DeviceBox({ kind, project }: { kind: "device-laptop" | "device-tablet" | "device-phone"; project: Project }) {
  const { chapters } = project;
  const domain = project.product.domain;
  if (kind === "device-laptop") {
    return (
      <div className="px-8 py-10">
        <MacBookPro domain={domain}>
          <ProductScreen chapters={chapters} variant="tablet" initial={2} />
        </MacBookPro>
      </div>
    );
  }
  if (kind === "device-tablet") {
    return (
      <div className="mx-auto w-[82%] py-8">
        <IPadPro domain={domain} orientation="portrait">
          <ProductScreen chapters={chapters} variant="tablet" initial={1} />
        </IPadPro>
      </div>
    );
  }
  return (
    <div className="mx-auto w-[62%] py-8">
      <IPhone17 domain={domain}>
        <ProductScreen chapters={chapters} variant="phone" initial={3} />
      </IPhone17>
    </div>
  );
}

/* ── which built-in visual a box shows ───────────────────────────────── */

/**
 * The built-in visual for a box, and the width it's laid out at before being scaled into a box.
 * Images and videos are drawn by the section itself (they fill boxes differently), so they return null.
 */
export function builtinVisual(panel: FeaturePanel, project: Project): { node: React.ReactNode; design: number } | null {
  const era = ERA_OF[panel.visual as BuiltinVisual];
  if (era) return { node: <EraBox era={era} />, design: 360 };
  switch (panel.visual) {
    case "timeline":
      return { node: <LiveScreens project={project} />, design: 980 };
    case "periodic":
      return { node: <PeriodicDetail />, design: 900 };
    case "registry":
      return { node: <RegistryDetail />, design: 900 };
    case "sites":
      return { node: <SitesDetail value={project.stats[1]?.value ?? 0} />, design: 900 };
    case "live":
      return { node: <LiveDetail project={project} />, design: 900 };
    case "chain":
      return { node: <ChainDetail stats={project.stats} />, design: 980 };
    case "responsive":
      return { node: <ResponsiveDetail project={project} />, design: 980 };
    case "device-laptop":
      return { node: <DeviceBox kind="device-laptop" project={project} />, design: 900 };
    case "device-tablet":
      return { node: <DeviceBox kind="device-tablet" project={project} />, design: 520 };
    case "device-phone":
      return { node: <DeviceBox kind="device-phone" project={project} />, design: 360 };
    default:
      return null;
  }
}
