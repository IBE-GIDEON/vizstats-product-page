"use client";

import { IconArrowUpRight } from "@/components/site/icons";
import { Reveal } from "@/components/ui/motion";
import type { Project } from "@/content/projects";
import { bentoDetails, type BentoDetail } from "./BentoDetails";

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

/** One feature: title on the left, a short line and its facts on the right, then its visual (if any) at full width. */
function Feature({ item, index }: { item: BentoDetail; index: number }) {
  return (
    <article>
      <Reveal y={20}>
        <div className="grid gap-6 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <p className="font-mono text-[11px] tracking-[0.14em] text-ash-2">{String(index + 1).padStart(2, "0")}</p>
            <h3 className="mt-3 font-display text-[clamp(28px,3vw,44px)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink-1">
              {item.label}
            </h3>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            {item.body.map((p, i) => (
              <p key={i} className="text-[17px] leading-[1.6] text-ash-3 md:text-[19px] [&+p]:mt-4">
                {p}
              </p>
            ))}

            {item.facts && item.facts.length > 0 && (
              <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-paper-line pt-6 sm:grid-cols-3">
                {item.facts.map(([k, v]) => (
                  <div key={k} className="min-w-0">
                    <dt className="text-[12.5px] text-ash-2">{k}</dt>
                    <dd className="mt-1 break-words text-[15px] font-semibold text-ink-1">{v}</dd>
                  </div>
                ))}
              </dl>
            )}

            {item.chips && item.chips.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-2">
                {item.chips.map((c) => (
                  <li
                    key={c}
                    className="inline-flex items-center gap-2 rounded-full border border-paper-line py-1.5 pl-3 pr-4 text-[14px] font-medium text-ink-1"
                  >
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
                className="group mt-8 inline-flex items-center gap-3 rounded-full bg-ink-1 py-3 pl-5 pr-6 text-[15px] font-semibold text-white transition-colors duration-300 hover:bg-ink-3"
              >
                <IconArrowUpRight
                  width={17}
                  height={17}
                  className="text-green transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
                {item.cta.label}
              </a>
            )}
          </div>
        </div>
      </Reveal>

      {/* the visual, big: built-in product pieces on a dark screen panel, images and videos edge to edge */}
      {item.media != null && (
        <div
          className={`mt-10 overflow-hidden rounded-[6px] md:mt-14 ${
            item.visual === "image" || item.visual === "video" ? "bg-ink-2" : "bg-ink-2 p-3 sm:p-6 md:p-10 lg:p-12"
          }`}
        >
          {item.media}
        </div>
      )}
    </article>
  );
}

/**
 * "Inside the product" on a light section: every feature laid out one after another, big and
 * visible as you scroll — nothing to click open. Text comes from `project.inside`.
 */
export default function Bento({ project }: { project: Project }) {
  const features = bentoDetails(project);
  const [lead, rest] = project.headings.inside;

  return (
    <section id="inside" className="relative bg-paper py-24 text-ink-1 md:py-36">
      <div className="container-x">
        <Reveal className="mb-16 md:mb-24">
          <h2 className="font-display text-[clamp(32px,4.4vw,64px)] font-semibold leading-[1] tracking-[-0.045em]">
            {lead} <span className="text-ash-2">{rest}</span>
          </h2>
        </Reveal>

        <div className="space-y-24 md:space-y-36">
          {features.map((f, i) => (
            <Feature key={f.id} item={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
