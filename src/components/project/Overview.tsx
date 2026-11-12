import type { Project } from "@/content/projects";
import MetaCards from "./MetaCards";

/** The lede as plain text, with the listed words picked out in the accent. */
function Lede({ text, accents = [], className }: { text: string; accents?: string[]; className?: string }) {
  return (
    <p className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className={accents.includes(w) ? "text-green" : undefined}>
          {w}{" "}
        </span>
      ))}
    </p>
  );
}

export default function Overview({ project }: { project: Project }) {
  return (
    // pulled up over the video's soft bottom edge, so the fact cards sit on the same screen as the project
    <section id="overview" className="relative z-10 -mt-[22svh] pb-28 md:pb-40">
      <MetaCards items={project.meta} />

      <div className="container-x">
        <div className="mt-20 md:mt-28 md:pl-[25%]">
          <Lede
            text={project.lede}
            accents={project.ledeAccents}
            className="font-display text-[clamp(28px,3.7vw,54px)] font-medium leading-[1.08] tracking-[-0.032em] text-fog"
          />
        </div>
      </div>
    </section>
  );
}
