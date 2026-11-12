// Studio-wide details used by the sidebar and footer. Editable in the CMS (/admin).
// NOTE: the email was read off a low-resolution screenshot — confirm it.

export type NavIcon = "grid" | "cube" | "studio" | "mail";

export type SiteContent = {
  name: string;
  tagline: string;
  email: string;
  nav: { label: string; href: string; icon: NavIcon }[];
  footer: {
    /** [first words, muted rest] */
    heading: [string, string];
    cta: string;
    navTitle: string;
    contactTitle: string;
  };
};

export const site: SiteContent = {
  name: "VizStats",
  tagline: "Data experience design",
  email: "ubachi@vizstats.com",
  nav: [
    { label: "Work", href: "/work/asian-mining-giants-in-africa", icon: "grid" },
    { label: "What we make", href: "#", icon: "cube" },
    { label: "Studio", href: "#", icon: "studio" },
    { label: "Contact", href: "#contact", icon: "mail" },
  ],
  footer: {
    heading: ["Have a story hiding", "in your data?"],
    cta: "Let's talk",
    navTitle: "Navigate",
    contactTitle: "Contact",
  },
};
