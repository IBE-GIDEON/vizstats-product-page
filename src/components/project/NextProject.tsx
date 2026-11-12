import { Reveal } from "@/components/ui/motion";
import type { ProjectCard } from "@/content/projects";
import { ProjectShot } from "./mock/ProjectShots";

/** One project: a desktop screenshot in a window, with its title underneath, all in one box. */
function Box({ card }: { card: ProjectCard }) {
  return (
    <a
      href="#"
      className="group flex flex-col rounded-[22px] border border-white/[0.08] bg-ink-1 p-2.5 transition-colors duration-500 hover:border-white/[0.16] hover:bg-ink-2 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-green/50"
    >
      {/* the screenshot */}
      <div className="overflow-hidden rounded-[14px] border border-white/[0.06] bg-black">
        <div className="flex h-7 items-center gap-1.5 border-b border-white/[0.06] bg-[#121414] px-3">
          {[0, 1, 2].map((k) => (
            <span key={k} className="h-2 w-2 rounded-full bg-white/15" />
          ))}
        </div>
        <div className="@container relative aspect-[16/11] overflow-hidden">
          <div className="absolute inset-0 transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.04]">
            <ProjectShot shot={card.shot} />
          </div>
        </div>
      </div>

      {/* the label */}
      <div className="px-2.5 pb-3 pt-5 md:px-3">
        <p className="eyebrow text-ash-3">{card.kicker}</p>
        <h3 className="mt-2.5 font-display text-[clamp(22px,1.9vw,28px)] font-semibold leading-[1.04] tracking-[-0.035em] text-fog">
          {card.titleLines[0]} <span className="text-ash-2">{card.titleLines[1]}</span>
        </h3>
        <p className="mt-2.5 text-[13px] text-ash-3">{card.meta}</p>
      </div>
    </a>
  );
}

/**
 * More of the studio's projects, as big boxes side by side: four across on desktop, two on
 * tablets, one on phones. Adding a project to `project.next` adds a box; extra ones wrap to a new row.
 */
export default function NextProject({ next: cards }: { next: ProjectCard[] }) {
  if (cards.length === 0) return null;

  return (
    <section aria-label="More projects" className="relative pb-24 md:pb-32">
      <div className="container-x">
        <Reveal className="mb-10 md:mb-14">
          <h2 className="font-display text-[clamp(32px,4.4vw,64px)] font-semibold leading-[1] tracking-[-0.045em]">
            More <span className="text-ash-2">projects.</span>
          </h2>
        </Reveal>

        <Reveal y={40}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {cards.map((c) => (
              <Box key={c.slug} card={c} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
