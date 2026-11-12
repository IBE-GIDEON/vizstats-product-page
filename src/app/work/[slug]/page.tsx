import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Bento from "@/components/project/Bento";
import NextProject from "@/components/project/NextProject";
import Opening from "@/components/project/Opening";
import Overview from "@/components/project/Overview";
import Showcase from "@/components/project/Showcase";
import Footer from "@/components/site/Footer";
import { getProject, projects } from "@/content/projects";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.titleLines.join(" "), description: project.summary };
}

// Params are read inside Suspense so client navigations get an instant (black) shell.
export default function ProjectPage({ params }: Params) {
  return (
    <Suspense fallback={<div className="h-svh bg-black" />}>
      <ProjectView params={params} />
    </Suspense>
  );
}

async function ProjectView({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <main>
      {/* opening: straight onto the project video — plain page flow */}
      <Opening project={project} />

      {/* content clears the icon rail on desktop */}
      <div className="md:pl-[72px]">
        <Overview project={project} />
        <Bento project={project} />
        <Showcase project={project} />
        <NextProject next={project.next} />
        <Footer />
      </div>
    </main>
  );
}
