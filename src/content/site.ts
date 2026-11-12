// Studio-wide details used by the sidebar and footer.
// NOTE: the email was read off a low-resolution screenshot — confirm it.
export const site = {
  name: "VizStats",
  tagline: "Data experience design",
  email: "ubachi@vizstats.com",
  nav: [
    { label: "Work", href: "/work/asian-mining-giants-in-africa", icon: "grid" },
    { label: "What we make", href: "#", icon: "cube" },
    { label: "Studio", href: "#", icon: "studio" },
    { label: "Contact", href: "#contact", icon: "mail" },
  ],
} as const;

export type NavIcon = (typeof site.nav)[number]["icon"];
