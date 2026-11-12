"use client";

import { useInView } from "motion/react";
import { useRef } from "react";
import type { Project } from "@/content/projects";
import HeroMedia from "./HeroMedia";

/**
 * The page opens straight on the project view: the product video fills the first screen and its
 * bottom edge dissolves into the page. The project title stays in the document for screen readers
 * and search, but isn't shown.
 */
export default function Opening({ project }: { project: Project }) {
  const mediaRef = useRef<HTMLDivElement>(null);
  const mediaInView = useInView(mediaRef, { amount: 0.3 });

  return (
    <section aria-label="Project" className="relative bg-black">
      <h1 className="sr-only">{project.titleLines.join(" ")}</h1>

      {/* `isolate` keeps the video's blur layers under the fact cards that overlap its bottom edge */}
      <div ref={mediaRef} className="relative isolate h-svh min-h-[560px]">
        <HeroMedia project={project} play={mediaInView} />
      </div>
    </section>
  );
}
