import type { FactIconName } from "@/content/projects";

/** Line icons for the fact cards. Editors pick one per card in the CMS. */
export const FACT_ICONS: Record<FactIconName, { label: string; svg: React.ReactNode }> = {
  document: {
    label: "Document",
    svg: (
      <>
        <path d="M5 3.5h9.5l4.5 4.5v12.5H5z" />
        <path d="M14.5 3.5V8H19M8.5 12h7M8.5 15.5h5" />
      </>
    ),
  },
  building: {
    label: "Organisation",
    svg: (
      <>
        <path d="M3.5 20.5h17M6 20.5V6.5L12 3.5l6 3v14" />
        <path d="M10 9.5h1M13 9.5h1M10 13h1M13 13h1M11 20.5v-3.5h2v3.5" />
      </>
    ),
  },
  gem: {
    label: "Topic",
    svg: (
      <>
        <path d="M6.5 4h11L21 9l-9 11.5L3 9z" />
        <path d="M3 9h18M9.5 4 12 20.5 14.5 4" />
      </>
    ),
  },
  globe: {
    label: "Region",
    svg: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.5 12h17M12 3.5c2.4 2.5 3.6 5.3 3.6 8.5s-1.2 6-3.6 8.5M12 3.5C9.6 6 8.4 8.8 8.4 12s1.2 6 3.6 8.5" />
      </>
    ),
  },
  pin: {
    label: "Location",
    svg: (
      <>
        <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
        <circle cx="12" cy="10" r="2.4" />
      </>
    ),
  },
  bars: { label: "Scale", svg: <path d="M5 20.5V13M10 20.5V8M15 20.5v-6M20 20.5V4" /> },
  trend: {
    label: "Growth",
    svg: (
      <>
        <path d="M3.5 17.5l6-6 4 4 7-8" />
        <path d="M15.5 7.5h5v5" />
      </>
    ),
  },
  calendar: {
    label: "Date",
    svg: (
      <>
        <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
        <path d="M3.5 9.5h17M8 3v4M16 3v4" />
      </>
    ),
  },
  clock: {
    label: "Duration",
    svg: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2" />
      </>
    ),
  },
  people: {
    label: "People",
    svg: (
      <>
        <circle cx="9" cy="8.5" r="3" />
        <path d="M3.5 19.5c.6-3 2.8-4.8 5.5-4.8s4.9 1.8 5.5 4.8" />
        <path d="M15.5 5.8a3 3 0 0 1 0 5.4M17.5 14.9c1.6.6 2.7 2.2 3 4.6" />
      </>
    ),
  },
  layers: {
    label: "Scope",
    svg: (
      <>
        <path d="M12 3.5 20.5 8 12 12.5 3.5 8z" />
        <path d="M3.5 12 12 16.5 20.5 12M3.5 16 12 20.5 20.5 16" />
      </>
    ),
  },
  database: {
    label: "Data",
    svg: (
      <>
        <ellipse cx="12" cy="6" rx="7.5" ry="2.5" />
        <path d="M4.5 6v12c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5V6M4.5 12c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5" />
      </>
    ),
  },
  monitor: {
    label: "Platform",
    svg: (
      <>
        <rect x="3" y="4.5" width="18" height="12" rx="1.5" />
        <path d="M9 20.5h6M12 16.5v4" />
      </>
    ),
  },
  award: {
    label: "Award",
    svg: (
      <>
        <circle cx="12" cy="9" r="5.5" />
        <path d="M8.5 13.5 7 21l5-2.5 5 2.5-1.5-7.5" />
      </>
    ),
  },
  tag: {
    label: "Category",
    svg: (
      <>
        <path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.3 7.3a1 1 0 0 1-1.4 0z" />
        <circle cx="8" cy="8" r="1.4" />
      </>
    ),
  },
  link: {
    label: "Link",
    svg: (
      <>
        <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
        <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
      </>
    ),
  },
};

export function FactIcon({ name, size = 20 }: { name?: string; size?: number }) {
  const icon = FACT_ICONS[name as FactIconName]?.svg ?? <circle cx="12" cy="12" r="3" />;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {icon}
    </svg>
  );
}
