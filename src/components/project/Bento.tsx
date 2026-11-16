"use client";

import { IconArrowUpRight } from "@/components/site/icons";
import { Reveal } from "@/components/ui/motion";
import { ScaleToFit } from "@/components/ui/ScaleToFit";
import type { FeaturePanel, InsideItem, Project } from "@/content/projects";
import { builtinVisual } from "./BentoDetails";

function Check() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

const isMedia = (p: FeaturePanel) => p.visual === "image" || p.visual === "video";
/** single pieces (one era, one device) that shouldn't be blown up to the full page width */
const isPiece = (p: FeaturePanel) => p.visual.startsWith("era-") || p.visual.startsWith("device-");

/* ── text ─────────────────────────────────────────────────────────── */

function Num({ index }: { index: number }) {
  return <p className="font-mono text-[12.5px] tracking-[0.14em] text-ash-2">{String(index + 1).padStart(2, "0")}</p>;
}

function Body({ item, size = "lg" }: { item: InsideItem; size?: "lg" | "md" }) {
  return (
    <>
      {item.body.map((p, i) => (
        <p
          key={i}
          className={`leading-[1.6] text-ash-3 [&+p]:mt-4 ${size === "lg" ? "text-[18px] md:text-[20px]" : "text-[17px] md:text-[18px]"}`}
        >
          {p}
        </p>
      ))}
    </>
  );
}

function Facts({ item, cols = 3 }: { item: InsideItem; cols?: 2 | 3 }) {
  if (!item.facts || item.facts.length === 0) return null;
  return (
    <dl className={`mt-7 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-paper-line pt-6 ${cols === 3 ? "sm:grid-cols-3" : ""}`}>
      {item.facts.map(([k, v], i) => (
        <div key={i} className="min-w-0">
          <dt className="text-[13.5px] text-ash-2">{k}</dt>
          <dd className="mt-1 break-words text-[16px] font-semibold text-ink-1">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Extras({ item }: { item: InsideItem }) {
  return (
    <>
      {item.chips && item.chips.length > 0 && (
        <ul className="mt-7 flex flex-wrap gap-2">
          {item.chips.map((c, i) => (
            <li key={i} className="inline-flex items-center gap-2 rounded-full border border-paper-line py-1.5 pl-3 pr-4 text-[15px] font-medium text-ink-1">
              <span className="text-green-2">
                <Check />
              </span>
              {c}
            </li>
          ))}
        </ul>
      )}
      {item.cta && (
        <a
          href={item.cta.href}
          target="_blank"
          rel="noreferrer"
          className="group mt-7 inline-flex items-center gap-3 rounded-full bg-ink-1 py-3 pl-5 pr-6 text-[15.5px] font-semibold text-white transition-colors duration-300 hover:bg-ink-3"
        >
          <IconArrowUpRight
            width={17}
            height={17}
            className="text-green transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
          {item.cta.label}
        </a>
      )}
    </>
  );
}

/** Title on the left, description, facts and extras on the right. */
function TextRow({ item, index }: { item: InsideItem; index: number }) {
  return (
    <Reveal y={20}>
      <div className="grid gap-6 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <Num index={index} />
          <h3 className="mt-3 font-display text-[clamp(28px,3vw,44px)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink-1">
            {item.label}
          </h3>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <Body item={item} />
          <Facts item={item} />
          <Extras item={item} />
        </div>
      </div>
    </Reveal>
  );
}

function Caption({ text }: { text: string }) {
  return text ? <p className="mt-3 text-[14.5px] text-ash-3">{text}</p> : null;
}

/* ── boxes ────────────────────────────────────────────────────────── */

/** A box at its natural size: built-in visuals on a padded dark panel, images and videos edge to edge. */
function BigPanel({ panel, project }: { panel: FeaturePanel; project: Project }) {
  if (isMedia(panel)) {
    if (!panel.src) return null;
    return (
      <figure>
        <div className="overflow-hidden rounded-[6px] bg-ink-2">
          {panel.visual === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={panel.src} alt={panel.alt} loading="lazy" className="block h-auto w-full" />
          ) : (
            <video src={panel.src} autoPlay muted loop playsInline className="block h-auto w-full" />
          )}
        </div>
        <Caption text={panel.caption} />
      </figure>
    );
  }
  const v = builtinVisual(panel, project);
  if (!v) return null;
  return (
    <figure>
      <div className="overflow-hidden rounded-[6px] bg-ink-2 p-3 sm:p-6 md:p-10">
        <div className="mx-auto" style={isPiece(panel) ? { maxWidth: v.design } : undefined}>
          {v.node}
        </div>
      </div>
      <Caption text={panel.caption} />
    </figure>
  );
}

/** A box of fixed shape in a row: images and videos fill it; built-in visuals are scaled to fit whole. */
function Box({ panel, project, aspect }: { panel: FeaturePanel; project: Project; aspect: string }) {
  const v = isMedia(panel) ? null : builtinVisual(panel, project);
  return (
    <figure className="min-w-0">
      <div className={`relative overflow-hidden rounded-[6px] bg-ink-2 ${aspect}`}>
        {panel.visual === "image" && panel.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={panel.src} alt={panel.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        ) : panel.visual === "video" && panel.src ? (
          <video src={panel.src} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
        ) : v ? (
          <div className="absolute inset-2 sm:inset-4">
            <ScaleToFit width={v.design}>{v.node}</ScaleToFit>
          </div>
        ) : null}
      </div>
      <Caption text={panel.caption} />
    </figure>
  );
}

/** Columns and box shape for each row layout (phones always get one column). */
const ROW: Record<"half" | "third" | "quarter", { grid: string; aspect: string }> = {
  half: { grid: "sm:grid-cols-2", aspect: "aspect-[16/11]" },
  third: { grid: "sm:grid-cols-2 lg:grid-cols-3", aspect: "aspect-[4/5]" },
  quarter: { grid: "grid-cols-2 lg:grid-cols-4", aspect: "aspect-[3/4]" },
};

/* ── one feature ──────────────────────────────────────────────────── */

function Feature({ item, index, project, flip }: { item: InsideItem; index: number; project: Project; flip: boolean }) {
  const panels = item.panels ?? [];

  // beside the text: the boxes in a column next to the description; the side alternates down the page
  if (item.layout === "split" && panels.length > 0) {
    return (
      <article className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
        {/* min-w-0: wide visuals (the periodic table) scroll inside their box instead of widening the page */}
        <div className={`min-w-0 space-y-6 md:col-span-7 ${flip ? "md:order-2" : ""}`}>
          {panels.map((p, i) => (
            <BigPanel key={i} panel={p} project={project} />
          ))}
        </div>
        <Reveal y={20} className={`min-w-0 md:col-span-5 ${flip ? "md:order-1" : ""}`}>
          <Num index={index} />
          <h3 className="mt-3 font-display text-[clamp(28px,2.8vw,40px)] font-semibold leading-[1.04] tracking-[-0.035em] text-ink-1">
            {item.label}
          </h3>
          <div className="mt-5">
            <Body item={item} size="md" />
          </div>
          <Facts item={item} cols={2} />
          <Extras item={item} />
        </Reveal>
      </article>
    );
  }

  // 2, 3 or 4 boxes side by side under one description
  if ((item.layout === "half" || item.layout === "third" || item.layout === "quarter") && panels.length > 0) {
    const row = ROW[item.layout];
    return (
      <article>
        <TextRow item={item} index={index} />
        <div className={`mt-10 grid gap-x-4 gap-y-8 md:mt-14 md:gap-x-6 ${row.grid}`}>
          {panels.map((p, i) => (
            <Box key={i} panel={p} project={project} aspect={row.aspect} />
          ))}
        </div>
      </article>
    );
  }

  // one big box (or several, one under another) across the page
  return (
    <article>
      <TextRow item={item} index={index} />
      {panels.length > 0 && (
        <div className="mt-10 space-y-6 md:mt-14">
          {panels.map((p, i) => (
            <BigPanel key={i} panel={p} project={project} />
          ))}
        </div>
      )}
    </article>
  );
}

/**
 * "Inside the product" on a light section: every feature visible as you scroll, nothing to click
 * open. Each feature has its own description and its own boxes, laid out the way the editor picks:
 * one big, beside the text, or 2 / 3 / 4 side by side.
 */
export default function Bento({ project }: { project: Project }) {
  const [lead, rest] = project.headings.inside;
  let splits = 0;

  return (
    <section id="inside" data-surface="light" className="relative bg-paper py-24 text-ink-1 md:py-36">
      <div className="container-x">
        <Reveal className="mb-16 md:mb-24">
          <h2 className="font-display text-[clamp(32px,4.4vw,64px)] font-semibold leading-[1] tracking-[-0.045em]">
            {lead} <span className="text-ash-2">{rest}</span>
          </h2>
        </Reveal>

        <div className="space-y-24 md:space-y-36">
          {project.inside.map((item, i) => {
            const flip = item.layout === "split" ? splits++ % 2 === 1 : false;
            return <Feature key={item.id} item={item} index={i} project={project} flip={flip} />;
          })}
        </div>
      </div>
    </section>
  );
}
