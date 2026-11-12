// Case-study content. Each project page at /work/[slug] renders from one entry.

export type Project = {
  slug: string;
  titleLines: [string, string];
  summary: string;
  meta: { label: string; value: string }[];
  stats: { value: number; label: string }[];
  lede: string;
  product: {
    url: string;
    domain: string;
    eyebrow: string;
    headline: [string, string];
    question: string;
  };
  chapters: string[];
  /**
   * Product screen recording for the video section (e.g. "/media/asian-mining-giants.mp4"
   * placed in /public/media). Until it's set, the section shows the product's opening screen.
   */
  video?: string;
  /** "More projects" boxes at the bottom of the page, in display order (4 per row on desktop). */
  next: ProjectCard[];
};

export type ProjectCard = {
  slug: string;
  titleLines: [string, string];
  meta: string;
  kicker: string;
  /** which desktop screenshot the card shows (see components/project/mock/ProjectShots.tsx) */
  shot: "marble" | "pulse" | "ledger" | "network";
  /** a stand-in until the real project's details are supplied */
  placeholder?: boolean;
};

export const projects: Project[] = [
  {
    slug: "asian-mining-giants-in-africa",
    titleLines: ["Asian Mining Giants", "in Africa"],
    summary:
      "A long-form investigation into how 29 Chinese state-backed and hybrid enterprises came to dominate Africa's critical-minerals supply chain.",
    meta: [
      { label: "Form", value: "Data story" },
      { label: "Client", value: "The China–Global South Project" },
      { label: "Subject", value: "Critical minerals · Geopolitics" },
      { label: "Region", value: "Africa" },
      { label: "Scale", value: "29 companies · 38 projects · 5 countries" },
    ],
    stats: [
      { value: 29, label: "Companies" },
      { value: 38, label: "Projects" },
      { value: 5, label: "Countries" },
    ],
    lede: "A long-form investigation into how 29 Chinese state-backed and hybrid enterprises came to dominate Africa's critical-minerals supply chain.",
    product: {
      url: "https://miningafrica.chinaglobalsouth.com",
      domain: "miningafrica.chinaglobalsouth.com",
      eyebrow: "Asian mining giants in Africa",
      headline: ["China's footprint", "in critical minerals."],
      question: "Who are the actors and stakeholders of China's engagement in critical minerals in Africa?",
    },
    chapters: [
      "Energy Transition",
      "Transition Minerals",
      "Geography",
      "China's Presence",
      "The Footprint",
      "The Ecosystem",
      "Power Structure",
      "The Tensions",
      "The Verdict",
    ],
    next: [
      {
        slug: "africa-mining-presence",
        titleLines: ["Africa Mining", "Presence"],
        meta: "30+ projects · 5 countries",
        kicker: "Interactive explorer",
        shot: "marble",
      },
      // ↓ stand-ins: replace with the studio's real projects
      {
        slug: "energy-transition-atlas",
        titleLines: ["Energy Transition", "Atlas"],
        meta: "Data dashboard",
        kicker: "Dashboard",
        shot: "pulse",
        placeholder: true,
      },
      {
        slug: "debt-and-infrastructure",
        titleLines: ["Debt &", "Infrastructure"],
        meta: "Long-form data story",
        kicker: "Data story",
        shot: "ledger",
        placeholder: true,
      },
      {
        slug: "ownership-networks",
        titleLines: ["Ownership", "Networks"],
        meta: "Interactive network",
        kicker: "Network explorer",
        shot: "network",
        placeholder: true,
      },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
