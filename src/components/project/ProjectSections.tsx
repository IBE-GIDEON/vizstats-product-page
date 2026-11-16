"use client";

import Footer from "@/components/site/Footer";
import SectionIndex from "@/components/site/SectionIndex";
import { useContent } from "@/lib/cms/useContent";
import Bento from "./Bento";
import NextProject from "./NextProject";
import Opening from "./Opening";
import Overview from "./Overview";
import Showcase from "./Showcase";

/** The whole project page, rendered from live content (defaults + CMS edits). */
export default function ProjectSections({ slug }: { slug: string }) {
  const content = useContent();
  const project = content.projects.find((p) => p.slug === slug) ?? content.projects[0];

  return (
    <>
      {/* the section index floats over the page: always open on large screens, a slim bar on phones */}
      <SectionIndex names={project.sectionNames} />

      {/* the page fills the full width; text starts clear of the floating index (see --nav-clear) */}
      <div>
        {/* opening: straight onto the project video — plain page flow */}
        <Opening project={project} />
        <Overview project={project} />
        <Bento project={project} />
        <Showcase project={project} />
        <NextProject next={project.next} heading={project.headings.more} />
        <Footer site={content.site} />
      </div>
    </>
  );
}
