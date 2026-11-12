import { IconArrowUpRight } from "@/components/site/icons";
import { Reveal } from "@/components/ui/motion";
import type { Project } from "@/content/projects";
import { IPadPro, IPhone17 } from "./mock/Devices";
import { ProductScreen } from "./mock/ProductScreen";

/** The product's opening chapter, live on an iPad Pro 13″, with an iPhone 17 resting over its corner. */
export default function Showcase({ project }: { project: Project }) {
  const { chapters } = project;
  const domain = project.product.domain;

  return (
    <section id="showcase" className="relative overflow-hidden pb-28 md:pb-44">
      <div className="container-x">
        <Reveal>
          <h2 className="font-display text-[clamp(32px,4.4vw,64px)] font-semibold leading-[1] tracking-[-0.045em]">
            A kinetic timeline <span className="text-ash-2">of energy machines.</span>
          </h2>
        </Reveal>

        <div className="relative mt-16 md:mt-24">
          <div className="pointer-events-none absolute inset-x-[10%] -bottom-24 top-1/3 -z-10 bg-[radial-gradient(50%_50%_at_50%_60%,rgba(224,53,60,0.14),transparent)] blur-2xl" />
          <div className="mr-[12%] md:mr-[9%]">
            <IPadPro domain={domain}>
              <ProductScreen chapters={chapters} variant="tablet" />
            </IPadPro>
          </div>
          {/* the phone sits over the iPad's lower-right corner, close to their real relative size */}
          <div className="absolute -bottom-10 right-0 z-10 w-[30%] max-w-[250px] md:-bottom-14 md:w-[21%]">
            <IPhone17 domain={domain}>
              <ProductScreen chapters={chapters} variant="phone" initial={0} />
            </IPhone17>
          </div>
        </div>

        {/* open the live product — a green glass pill under the devices */}
        <div className="relative mt-24 flex justify-center md:mt-32">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-72 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(90,210,226,0.28),transparent)] blur-xl"
          />
          <a
            href={project.product.url}
            target="_blank"
            rel="noreferrer"
            className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full border border-green/30 bg-green/[0.09] py-2 pl-7 pr-2 text-[16px] font-medium text-fog shadow-[inset_0_1px_0_rgba(255,255,255,0.16),inset_0_-1px_0_rgba(90,210,226,0.18),0_24px_60px_-24px_rgba(90,210,226,0.55)] backdrop-blur-xl backdrop-saturate-150 transition-colors duration-500 hover:border-green/55 hover:bg-green/[0.16] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-green/60"
          >
            {/* glass sheen */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-5 top-0 h-1/2 rounded-b-full bg-gradient-to-b from-white/[0.14] to-transparent"
            />
            <span className="relative">Open product</span>
            <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-green text-black shadow-[0_0_24px_-4px_rgba(90,210,226,0.8)] transition-transform duration-500 group-hover:rotate-45">
              <IconArrowUpRight />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
