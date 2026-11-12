import Link from "next/link";
import CloudShader from "@/components/fx/CloudShader";
import type { SiteContent } from "@/content/site";
import { IconArrowUpRight } from "./icons";

export default function Footer({ site }: { site: SiteContent }) {
  const [lead, rest] = site.footer.heading;
  return (
    <footer id="contact" className="relative overflow-hidden border-t border-line">
      <div className="container-x pt-24 md:pt-32">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-7">
            <h2 className="font-display text-[clamp(38px,5.4vw,84px)] font-semibold leading-[0.96] tracking-[-0.045em]">
              {lead} <span className="text-ash-2">{rest}</span>
            </h2>
            <a
              href={`mailto:${site.email}`}
              className="group mt-10 inline-flex items-center gap-3 rounded-full bg-green py-2 pl-6 pr-2 text-[15px] font-medium text-black transition-colors hover:bg-fog"
            >
              {site.footer.cta}
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-green transition-transform duration-500 group-hover:rotate-45">
                <IconArrowUpRight />
              </span>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-5 md:pt-10">
            <div>
              <p className="eyebrow text-ash-3">{site.footer.navTitle}</p>
              <ul className="mt-4 space-y-2.5 text-[15px]">
                {site.nav.map((n) => (
                  <li key={n.label}>
                    <Link href={n.href} className="text-ash transition-colors hover:text-green">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow text-ash-3">{site.footer.contactTitle}</p>
              <a href={`mailto:${site.email}`} className="mt-4 block break-all text-[15px] text-ash transition-colors hover:text-green">
                {site.email}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-20 md:mt-28">
        <CloudShader variant="bank" resolution={0.35} intensity={0.75} className="absolute inset-0 h-full w-full" />
        <div className="container-x relative">
          <span
            aria-hidden
            className="block -skew-x-[11deg] select-none whitespace-nowrap bg-gradient-to-b from-white/[0.2] via-white/[0.06] to-transparent bg-clip-text pb-2 font-logo text-[clamp(44px,16vw,270px)] leading-[0.9] tracking-[0.005em] text-transparent"
          >
            {site.name}
          </span>
        </div>
      </div>
    </footer>
  );
}
