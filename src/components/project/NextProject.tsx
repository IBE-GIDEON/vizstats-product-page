import { Reveal } from "@/components/ui/motion";
import type { ProjectCard } from "@/content/projects";
import { ProjectShot } from "./mock/ProjectShots";

/** One project: a large screenshot with its title underneath. Square edges; the grid shares hairlines. */
function Box({ card }: { card: ProjectCard }) {
  return (
    <a
      href="#"
      className="group relative flex flex-col border-b border-r border-line bg-black p-4 transition-colors duration-500 hover:bg-ink-1 focus-visible:z-10 focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-green/50 sm:p-6 lg:p-8"
    >
      {/* the screenshot */}
      <div className="@container relative aspect-[16/10] overflow-hidden rounded-[4px] border border-white/[0.06] bg-ink-2">
        <div className="absolute inset-0 transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.03]">
          <ProjectShot shot={card.shot} />
        </div>
      </div>

      {/* the label */}
      <div className="flex items-end justify-between gap-6 pt-6 lg:pt-8">
        <div className="min-w-0">
          <p className="eyebrow text-ash-3">{card.kicker}</p>
          <h3 className="mt-3 font-display text-[clamp(24px,2.4vw,36px)] font-semibold leading-[1.02] tracking-[-0.04em] text-fog">
            {card.titleLines[0]} <span className="text-ash-2">{card.titleLines[1]}</span>
          </h3>
        </div>
        <p className="hidden shrink-0 pb-1 text-right text-[13px] text-ash-3 sm:block">{card.meta}</p>
      </div>
    </a>
  );
}

/**
 * More of the studio's projects as big boxes joined into one grid: two up, two down on tablets and
 * desktop, one column on phones. Adding a project to `project.next` adds a box; extras form new rows.
 */
export default function NextProject({ next: cards, heading }: { next: ProjectCard[]; heading: [string, string] }) {
  if (cards.length === 0) return null;

  return (
    <section aria-label="More projects" className="relative pb-24 md:pb-32">
      <div className="container-x">
        <Reveal className="mb-10 md:mb-14">
          <h2 className="font-display text-[clamp(32px,4.4vw,64px)] font-semibold leading-[1] tracking-[-0.045em]">
            {heading[0]} <span className="text-ash-2">{heading[1]}</span>
          </h2>
        </Reveal>

        <Reveal y={40}>
          <div className="grid border-l border-t border-line sm:grid-cols-2">
            {cards.map((c) => (
              <Box key={c.slug} card={c} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
