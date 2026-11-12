"use client";

import { useState } from "react";
import { IconArrowUpRight, IconLock } from "@/components/site/icons";
import type { Project } from "@/content/projects";
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
import { IPadPro, IPhone17, NativeScreen } from "./mock/Devices";
import { ProductScreen } from "./mock/ProductScreen";

/**
 * The expanded view behind each "Inside the product" box: a large live piece of the product
 * (animation, image or interactive), a short description and a few facts.
 */
export type BentoDetail = {
  id: string;
  label: string;
  media: React.ReactNode;
  body: string[];
  facts: [string, string][];
  cta?: { href: string; label: string };
};

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

function ResponsiveDetail({ project }: { project: Project }) {
  const domain = project.product.domain;
  return (
    <div className="relative px-1 pb-10 pt-2 md:px-6 md:pb-14 md:pt-4">
      <div className="pointer-events-none absolute inset-x-[10%] bottom-0 top-1/3 bg-[radial-gradient(50%_50%_at_50%_60%,rgba(224,53,60,0.12),transparent)] blur-2xl" />
      <div className="relative mr-[14%] md:mr-[12%]">
        <IPadPro domain={domain}>
          <ProductScreen chapters={project.chapters} variant="tablet" initial={3} />
        </IPadPro>
      </div>
      <div className="absolute bottom-0 right-1 z-10 w-[30%] max-w-[230px] md:right-6 md:w-[21%]">
        <IPhone17 domain={domain}>
          <ProductScreen chapters={project.chapters} variant="phone" initial={1} />
        </IPhone17>
      </div>
    </div>
  );
}

/* ── content ──────────────────────────────────────────────────────── */

export function bentoDetails(project: Project): BentoDetail[] {
  const [companies, sites, countries] = project.stats.map((s) => s.value);
  return [
    {
      id: "timeline",
      label: "Kinetic timeline",
      media: <LiveScreens project={project} />,
      body: [
        "The story opens on a kinetic timeline: four machines — from Hero's aeolipile to the induction motor — play in sequence to show how energy systems evolved before the minerals story begins.",
        "Each era can be picked from the axis at the bottom; the stage animates the machine in and out and the copy changes with it.",
      ],
      facts: [
        ["Chapter", "Energy Transition"],
        ["Eras", "4"],
        ["Span", "50 AD – 1888"],
        ["Interaction", "Auto-play, tap to jump"],
      ],
    },
    {
      id: "periodic",
      label: "Periodic table",
      media: <PeriodicDetail />,
      body: [
        "Transition minerals are picked out on the periodic table itself, so readers can see at a glance which elements the energy transition depends on.",
        "Selecting an element shows what it is used for — from cobalt in battery cathodes to copper in grids and motors.",
      ],
      facts: [
        ["Key minerals", String(KEY.size)],
        ["Secondary", String(SECONDARY.size)],
        ["Shown", "Periods 1–4"],
      ],
    },
    {
      id: "registry",
      label: "Company registry",
      media: <RegistryDetail />,
      body: [
        `A registry of the ${companies} companies behind the projects, each tagged by ownership — state-backed or hybrid — with the country and mineral it works in.`,
        "Filters narrow the list in one tap, and every row links through to the company's profile in the product.",
      ],
      facts: [
        ["Companies", String(companies)],
        ["Ownership", "State-backed · Hybrid"],
        ["Countries", String(countries)],
      ],
    },
    {
      id: "sites",
      label: "Project sites",
      media: <SitesDetail value={sites} />,
      body: [
        `${sites} mining projects across ${countries} countries, each linked to the company that runs it and the mineral it produces.`,
      ],
      facts: [
        ["Projects", String(sites)],
        ["Countries", String(countries)],
        ["Minerals", [...new Set(REGISTRY.map((r) => r.m))].join(" · ")],
      ],
    },
    {
      id: "live",
      label: "Live product",
      media: <LiveDetail project={project} />,
      body: [
        "The full data story is live — nine chapters, from the energy transition to the verdict, built to read on any screen.",
      ],
      facts: [
        ["Address", project.product.domain],
        ["Chapters", String(project.chapters.length)],
        ["Format", "Interactive data story"],
      ],
      cta: { href: project.product.url, label: "Open product" },
    },
    {
      id: "chain",
      label: "Command chain",
      media: <ChainDetail stats={project.stats} />,
      body: [
        "The command chain traces who really controls a mine: from the site itself, through the operator and its parent group, to the state shareholder and, finally, Beijing.",
        "Following one chain end to end turns a list of companies into a picture of state influence.",
      ],
      facts: [
        ["Links", String(CHAIN.length)],
        ["From", "Mine site"],
        ["To", "Beijing"],
      ],
    },
    {
      id: "responsive",
      label: "Responsive",
      media: <ResponsiveDetail project={project} />,
      body: [
        "Every chapter is designed for phone, tablet and desktop — the same story re-laid out for each screen, not shrunk to fit.",
      ],
      facts: [
        ["Phone", "Single column, swipeable tabs"],
        ["Tablet", "Full stage, side machines"],
        ["Desktop", "Full layout"],
      ],
    },
  ];
}

export function BentoDetailBody({ item }: { item: BentoDetail }) {
  return (
    <div>
      <div className="rounded-2xl border border-white/[0.06] bg-[radial-gradient(80%_60%_at_50%_0%,rgba(255,255,255,0.03),transparent)] p-3 sm:p-5 md:p-7">
        {item.media}
      </div>

      <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-[1.5fr_1fr] md:gap-14">
        <div className="space-y-4">
          {item.body.map((p, i) => (
            <p key={i} className="text-[16px] leading-[1.6] text-ash md:text-[18px]">
              {p}
            </p>
          ))}
          {item.cta && (
            <a
              href={item.cta.href}
              target="_blank"
              rel="noreferrer"
              className="group mt-4 inline-flex items-center gap-3 rounded-full bg-green py-2 pl-6 pr-2 text-[15px] font-medium text-black transition-colors hover:bg-fog"
            >
              {item.cta.label}
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-green transition-transform duration-500 group-hover:rotate-45">
                <IconArrowUpRight />
              </span>
            </a>
          )}
        </div>
        <dl className="h-fit border-t border-white/[0.07]">
          {item.facts.map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-6 border-b border-white/[0.07] py-3.5">
              <dt className="shrink-0 text-[13px] text-ash-3">{k}</dt>
              <dd className="min-w-0 break-words text-right text-[14px] font-medium text-fog">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
