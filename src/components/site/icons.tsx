import type { SVGProps } from "react";
import type { NavIcon } from "@/content/site";

type P = SVGProps<SVGSVGElement>;

const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const IconGrid = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" />
  </svg>
);

export const IconCube = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 2.8 20.2 7.4v9.2L12 21.2l-8.2-4.6V7.4z" />
    <path d="M3.8 7.4 12 12l8.2-4.6M12 12v9.2" />
  </svg>
);

export const IconStudio = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="9" cy="9" r="5.2" />
    <circle cx="15" cy="15" r="5.2" />
  </svg>
);

export const IconMail = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

export const IconPanelOpen = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <path d="M9 4v16M13.5 10l2 2-2 2" />
  </svg>
);

export const IconClose = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const IconArrowRight = (p: P) => (
  <svg {...base} width={16} height={16} {...p}>
    <path d="M4.5 12h15M13.5 6l6 6-6 6" />
  </svg>
);

export const IconArrowUpRight = (p: P) => (
  <svg {...base} width={14} height={14} {...p}>
    <path d="M7 17 17 7M8.5 7H17v8.5" />
  </svg>
);

export const IconLock = (p: P) => (
  <svg {...base} width={14} height={14} {...p}>
    <rect x="5" y="10.5" width="14" height="10" rx="2.4" fill="currentColor" stroke="none" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
  </svg>
);

export const IconPlus = (p: P) => (
  <svg {...base} width={14} height={14} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const NAV_ICONS: Record<NavIcon, (p: P) => React.JSX.Element> = {
  grid: IconGrid,
  cube: IconCube,
  studio: IconStudio,
  mail: IconMail,
};

export function NavGlyph({ name, ...p }: { name: NavIcon } & P) {
  const Icon = NAV_ICONS[name];
  return <Icon {...p} />;
}
