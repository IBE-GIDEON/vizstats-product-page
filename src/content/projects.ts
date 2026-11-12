// Case-study content. Each project page at /work/[slug] renders from one entry.

export type Project = {
  slug: string;
  titleLines: [string, string];
  summary: string;
  /** the fact cards under the welcome screen — as many as you like */
  meta: { label: string; value: string; icon: FactIconName }[];
  stats: { value: number; label: string }[];
  lede: string;
  /** words in the lede picked out in the accent colour */
  ledeAccents: string[];
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
  video: string;
  /** The welcome (first) screen image. Shown instead of the product's opening screen when set. */
  heroImage: HeroImage;
  /** Section headings, each as [first words, muted rest]. */
  headings: { inside: [string, string]; more: [string, string] };
  /** The iPad + iPhone section: heading, optional real screenshots, and the button under them. */
  showcase: {
    heading: [string, string];
    /** iPad Pro 13-inch screenshot, landscape 2752 × 2064 px (4:3); empty = the live product screen */
    tabletImage: string;
    /** iPhone 17 screenshot, 1206 × 2622 px; empty = the live product screen */
    phoneImage: string;
    /** the button under the devices (it opens the product address) */
    cta: string;
  };
  /** "Inside the product": the features shown one after another, each with its visual. */
  inside: InsideItem[];
  /** "More projects" boxes at the bottom of the page, in display order (a joined 2-column grid). */
  next: ProjectCard[];
};

/**
 * Any image fits: it fills the screen and is cropped to suit, keeping `focus` in view.
 * Best shapes: wide 16:9 (2560 × 1440 px) for desktop and tablet; optional tall 9:16 (1080 × 1920 px) for phones.
 */
export type HeroImage = {
  /** wide image (a link, or an image uploaded in the CMS); empty = show the product's opening screen */
  src: string;
  /** optional tall image for phones; empty = crop the wide one */
  mobileSrc: string;
  /** the point kept in view when the image is cropped, as "x% y%" */
  focus: string;
  /** what the image shows, for screen readers */
  alt: string;
};

/** The product visuals built into the site (live, interactive pieces of the product). */
export type BuiltinVisual =
  | "timeline"
  | "periodic"
  | "registry"
  | "sites"
  | "live"
  | "chain"
  | "responsive"
  // single pieces, made for boxes
  | "era-ancient"
  | "era-industrial"
  | "era-combustion"
  | "era-electric"
  | "device-laptop"
  | "device-tablet"
  | "device-phone";

/** One box in a feature: a built-in product visual, or your own image or video. */
export type FeaturePanel = {
  visual: BuiltinVisual | "image" | "video";
  /** the image or video (a link, or an image uploaded in the CMS) when `visual` is image / video */
  src: string;
  /** what the image shows, for screen readers */
  alt: string;
  /** a short line under the box (optional) */
  caption: string;
};

/**
 * How a feature's boxes are arranged: one big box under the text ("full"), beside the text
 * ("split"), or 2, 3 or 4 boxes side by side under the text.
 */
export type FeatureLayout = "full" | "split" | "half" | "third" | "quarter";

/** One feature in "Inside the product": its own text and its own boxes. Add as many as you like in the CMS. */
export type InsideItem = {
  /** unique per feature */
  id: string;
  label: string;
  layout: FeatureLayout;
  /** the feature's visuals; leave empty for a text-only feature */
  panels: FeaturePanel[];
  /** one short description (or two) */
  body: string[];
  /** label / value rows beside the text */
  facts?: [string, string][];
  /** short tags, e.g. the screens a view works on */
  chips?: string[];
  cta?: { href: string; label: string };
};

/** Icons available for the fact cards (drawn in components/project/factIcons.tsx). */
export type FactIconName =
  | "document"
  | "building"
  | "gem"
  | "globe"
  | "pin"
  | "bars"
  | "trend"
  | "calendar"
  | "clock"
  | "people"
  | "layers"
  | "database"
  | "monitor"
  | "award"
  | "tag"
  | "link";

export type ProjectCard = {
  slug: string;
  titleLines: [string, string];
  meta: string;
  kicker: string;
  /** the live project's address — its screenshot is captured automatically for the box */
  url: string;
  /** your own image for the box instead of the capture (16:10, 2560 × 1600 px) */
  image: string;
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
      { label: "Form", value: "Data story", icon: "document" },
      { label: "Client", value: "The China–Global South Project", icon: "building" },
      { label: "Subject", value: "Critical minerals · Geopolitics", icon: "gem" },
      { label: "Region", value: "Africa", icon: "globe" },
      { label: "Scale", value: "29 companies · 38 projects · 5 countries", icon: "bars" },
    ],
    stats: [
      { value: 29, label: "Companies" },
      { value: 38, label: "Projects" },
      { value: 5, label: "Countries" },
    ],
    lede: "A long-form investigation into how 29 Chinese state-backed and hybrid enterprises came to dominate Africa's critical-minerals supply chain.",
    ledeAccents: ["29"],
    video: "",
    heroImage: { src: "", mobileSrc: "", focus: "50% 50%", alt: "" },
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
    showcase: {
      heading: ["A kinetic timeline", "of energy machines."],
      tabletImage: "",
      phoneImage: "",
      cta: "Open product",
    },
    inside: [
      {
        id: "timeline",
        label: "Kinetic timeline",
        layout: "quarter",
        panels: [
          { visual: "era-ancient", src: "", alt: "", caption: "" },
          { visual: "era-industrial", src: "", alt: "", caption: "" },
          { visual: "era-combustion", src: "", alt: "", caption: "" },
          { visual: "era-electric", src: "", alt: "", caption: "" },
        ],
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
        layout: "split",
        panels: [
          { visual: "periodic", src: "", alt: "", caption: "" },
        ],
        body: ["The minerals the energy transition depends on, picked out on the periodic table. Tap one to see what it's used for."],
        facts: [
          ["Key minerals", "8"],
          ["Secondary", "5"],
        ],
      },
      {
        id: "registry",
        label: "Company registry",
        layout: "full",
        panels: [
          { visual: "registry", src: "", alt: "", caption: "" },
        ],
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
        layout: "split",
        panels: [
          { visual: "sites", src: "", alt: "", caption: "" },
        ],
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
        layout: "half",
        panels: [
          { visual: "live", src: "", alt: "", caption: "Desktop" },
          { visual: "device-phone", src: "", alt: "", caption: "Phone" },
        ],
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
        layout: "full",
        panels: [
          { visual: "chain", src: "", alt: "", caption: "" },
        ],
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
        layout: "third",
        panels: [
          { visual: "device-laptop", src: "", alt: "", caption: "Desktop" },
          { visual: "device-tablet", src: "", alt: "", caption: "Tablet" },
          { visual: "device-phone", src: "", alt: "", caption: "Phone" },
        ],
        body: ["One story, re-laid out for every screen."],
      },
    ],
    next: [
      {
        slug: "africa-mining-presence",
        url: "",
        image: "",
        titleLines: ["Africa Mining", "Presence"],
        meta: "30+ projects · 5 countries",
        kicker: "Interactive explorer",
        shot: "marble",
      },
      // ↓ stand-ins: replace with the studio's real projects
      {
        slug: "energy-transition-atlas",
        url: "",
        image: "",
        titleLines: ["Energy Transition", "Atlas"],
        meta: "Data dashboard",
        kicker: "Dashboard",
        shot: "pulse",
        placeholder: true,
      },
      {
        slug: "debt-and-infrastructure",
        url: "",
        image: "",
        titleLines: ["Debt &", "Infrastructure"],
        meta: "Long-form data story",
        kicker: "Data story",
        shot: "ledger",
        placeholder: true,
      },
      {
        slug: "ownership-networks",
        url: "",
        image: "",
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
