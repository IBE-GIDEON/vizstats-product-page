import { IconArrowUpRight } from "@/components/site/icons";
import { Reveal } from "@/components/ui/motion";
import type { Project } from "@/content/projects";
import DevicePair from "./DevicePair";
import { IPadPro, IPhone17 } from "./mock/Devices";
import { ProductScreen } from "./mock/ProductScreen";

/** The product's opening chapter, live on an iPad Pro 13″, with an iPhone 17 resting over its corner. */
export default function Showcase({ project }: { project: Project }) {
  const { chapters } = project;
  const domain = project.product.domain;

  return (
    <section id="showcase" className="relative overflow-hidden pb-28 pt-24 md:pb-44 md:pt-36">
      <div className="container-x">
        <Reveal>
          <h2 className="font-display text-[clamp(32px,4.4vw,64px)] font-semibold leading-[1] tracking-[-0.045em]">
            {project.showcase.heading[0]} <span className="text-ash-2">{project.showcase.heading[1]}</span>
          </h2>
        </Reveal>

        {/* iPad from the left, iPhone from the right — the phone rests over the iPad's lower-right corner,
            close to their real relative size */}
        <DevicePair
          tabletSlot={
            <IPadPro domain={domain} screenshot={project.showcase.tabletImage || undefined}>
              <ProductScreen chapters={chapters} variant="tablet" />
            </IPadPro>
          }
          phoneSlot={
            <IPhone17 domain={domain} screenshot={project.showcase.phoneImage || undefined}>
              <ProductScreen chapters={chapters} variant="phone" initial={0} />
            </IPhone17>
          }
        />

        {/* open the live product — a pale, soft store-badge style pill under the devices: matte, no shine */}
        <div className="mt-24 flex justify-center md:mt-32">
          <a
            href={project.product.url}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-3 rounded-full bg-[#e7f0f1] py-3.5 pl-5 pr-6 text-[16px] font-semibold tracking-[-0.01em] text-[#151a1b] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.7),0_0_0_5px_rgba(231,240,241,0.07),0_16px_34px_-18px_rgba(0,0,0,0.9)] transition-colors duration-300 hover:bg-[#f1f7f8] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[7px] focus-visible:outline-green/60 md:py-4 md:pl-6 md:pr-7 md:text-[17px]"
          >
            <IconArrowUpRight
              width={18}
              height={18}
              className="text-green-2 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
            {project.showcase.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
