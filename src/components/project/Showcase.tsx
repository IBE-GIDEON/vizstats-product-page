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
            Open product
            <span className="text-[12px] font-semibold text-[#151a1b]/40">Live</span>
          </a>
        </div>
      </div>
    </section>
  );
}
