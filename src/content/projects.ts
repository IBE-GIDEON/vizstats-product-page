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
  /** Section headings, each as [first words, muted rest]. */
  headings: { inside: [string, string]; more: [string, string] };
  /** "Inside the product": the features shown one after another, each with its visual. */
  inside: InsideItem[];
  /** "More projects" boxes at the bottom of the page, in display order (a joined 2-column grid). */
  next: ProjectCard[];
};

/** Each box's visual is tied to its `id`; everything written here is editable text. */
export type InsideItem = {
  id: "timeline" | "periodic" | "registry" | "sites" | "live" | "chain" | "responsive";
  label: string;
  /** one short sentence (or two) under the visual */
  body: string[];
  /** label / value rows beside the text */
  facts?: [string, string][];
  /** short tags instead of facts, e.g. the screens a view works on */
  chips?: string[];
  cta?: { href: string; label: string };
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
    headings: {
      inside: ["Inside", "the product."],
      more: ["More", "projects."],
    },
    inside: [
      {
        id: "timeline",
        label: "Kinetic timeline",
        body: ["Four machines, from Hero's aeolipile to the induction motor, show how energy systems evolved. Tap an era to jump."],
        facts: [
          ["Chapter", "Energy Transition"],
          ["Eras", "4"],
          ["Span", "50 AD – 1888"],
        ],
      },
      {
        id: "periodic",
        label: "Periodic table",
        body: ["The minerals the energy transition depends on, picked out on the periodic table. Tap one to see what it's used for."],
        facts: [
          ["Key minerals", "8"],
          ["Secondary", "5"],
        ],
      },
      {
        id: "registry",
        label: "Company registry",
        body: ["The 29 companies behind the projects, tagged state-backed or hybrid and filterable in one tap."],
        facts: [
          ["Companies", "29"],
          ["Ownership", "State-backed · Hybrid"],
          ["Countries", "5"],
        ],
      },
      {
        id: "sites",
        label: "Project sites",
        body: ["38 mining projects across five countries, each linked to its operator and mineral."],
        facts: [
          ["Projects", "38"],
          ["Countries", "5"],
          ["Minerals", "Co · Cu · Al · U · Li · Fe"],
        ],
      },
      {
        id: "live",
        label: "Live product",
        body: ["The full story is live: nine chapters, built for any screen."],
        facts: [
          ["Address", "miningafrica.chinaglobalsouth.com"],
          ["Chapters", "9"],
          ["Format", "Interactive data story"],
        ],
        cta: { href: "https://miningafrica.chinaglobalsouth.com", label: "Open product" },
      },
      {
        id: "chain",
        label: "Command chain",
        body: ["Who really controls a mine, traced from the site through the operator and parent group to the state and Beijing."],
        facts: [
          ["From", "Mine site"],
          ["To", "Beijing"],
          ["Links", "5"],
        ],
      },
      {
        id: "responsive",
        label: "Responsive",
        body: ["One story, re-laid out for every screen."],
        chips: ["Desktop", "Tablet", "Phone"],
      },
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
