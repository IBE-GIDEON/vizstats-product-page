"use client";

import { useInView } from "motion/react";
import { useRef } from "react";
import CloudShader from "@/components/fx/CloudShader";
import type { Project } from "@/content/projects";
import HeroMedia from "./HeroMedia";

/**
 * Project opening, in plain page flow — nothing pins and nothing follows the scroll.
 *  1. the title, full size and staying put, on deep black with soft smoke;
 *  2. the project video right underneath: it rises out of the black at the top
 *     and dissolves into the page at the bottom.
 */
export default function Opening({ project }: { project: Project }) {
  const mediaRef = useRef<HTMLDivElement>(null);
  const mediaInView = useInView(mediaRef, { amount: 0.3 });

  return (
    <section aria-label="Project opening" className="relative bg-black">
      {/* title on smoke */}
      <div className="relative overflow-hidden">
        {/* the smoke thins out well before the video, so there's no edge and no cloud under the project */}
        <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,#000_26%,rgba(0,0,0,0.45)_48%,rgba(0,0,0,0.12)_62%,transparent_74%)]">
          <CloudShader variant="frame" resolution={0.45} className="absolute inset-0 h-full w-full" />
          {/* keeps the centre dark so the title reads */}
          <div className="absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_50%,rgba(0,0,0,0.92),rgba(0,0,0,0.35)_70%,transparent)]" />
        </div>

        <div className="relative flex min-h-[84svh] items-center justify-center px-5 pb-10 pt-24 md:pl-[112px] md:pr-10 md:pt-16">
          <h1
            className="font-display text-[10.6vw] font-semibold md:text-[clamp(34px,9vw,150px)] leading-[0.94] tracking-[-0.045em]"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.55)" }}
          >
            {project.titleLines.map((line, i) => (
              <span
                key={line}
                className={`block whitespace-nowrap [animation:rise_1.4s_var(--ease-out-expo)_both] ${
                  i === 0 ? "text-fog" : "text-ash-2"
                }`}
                style={{ animationDelay: `${200 + i * 140}ms` }}
              >
                {line}
              </span>
            ))}
          </h1>
        </div>
      </div>

      {/* the project video */}
      {/* `isolate` keeps the video's blur layers under the fact cards that overlap its bottom edge */}
      <div ref={mediaRef} className="relative isolate h-[78svh] md:h-[92svh]">
        <HeroMedia project={project} play={mediaInView} />
        {/* top edge rises out of the black — no hard line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[16%] bg-gradient-to-b from-black to-transparent" />
      </div>
    </section>
  );
}
