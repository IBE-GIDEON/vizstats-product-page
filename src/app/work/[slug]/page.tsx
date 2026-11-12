import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProjectSections from "@/components/project/ProjectSections";
import { getProject, projects } from "@/content/projects";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

// NOTE: metadata uses the default content; CMS edits reach it once the store is server-side (Convex).
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
  if (!getProject(slug)) notFound();

  return (
    <main>
      {/* every section reads live content (defaults + CMS edits) */}
      <ProjectSections slug={slug} />
    </main>
  );
}
