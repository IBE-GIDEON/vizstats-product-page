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

        {/* open the live product — a pale, matte frosted-green pill under the devices (no shine) */}
        <div className="mt-24 flex justify-center md:mt-32">
          <a
            href={project.product.url}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-4 rounded-full border border-green/20 bg-green/[0.07] py-2 pl-7 pr-2 text-[16px] font-medium text-[#cfeff3] backdrop-blur-md transition-colors duration-500 hover:border-green/30 hover:bg-green/[0.12] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-green/50"
          >
            Open product
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-green/[0.14] text-green transition-transform duration-500 group-hover:rotate-45">
              <IconArrowUpRight />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
