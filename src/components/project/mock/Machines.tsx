import { useId } from "react";

/** The four machines from the product's kinetic timeline, drawn as small metallic illustrations. */
export const ERAS = [
  { key: "ancient", label: "Ancient", year: "50 AD", name: "Hero's Aeolipile" },
  { key: "industrial", label: "Industrial Revolution", year: "1769", name: "Watt Steam Engine" },
  { key: "combustion", label: "Combustion Age", year: "1876", name: "Otto Four-Stroke Engine" },
  { key: "electric", label: "Electric Future", year: "1888", name: "Induction Motor" },
] as const;

export type EraKey = (typeof ERAS)[number]["key"];

type Props = { era: EraKey; accent?: string; className?: string };

export function Machine({ era, accent = "#e0353c", className }: Props) {
  const id = useId().replace(/:/g, "");
  const metal = `m-${id}`;
  const dark = `d-${id}`;
  const sphere = `s-${id}`;
  const glow = `g-${id}`;

  return (
    <svg viewBox="0 0 160 160" className={className} aria-hidden>
      <defs>
        <linearGradient id={metal} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8a8f8c" />
          <stop offset="0.45" stopColor="#3b3f3d" />
          <stop offset="1" stopColor="#151716" />
        </linearGradient>
        <linearGradient id={dark} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c302e" />
          <stop offset="1" stopColor="#0c0d0d" />
        </linearGradient>
        <radialGradient id={sphere} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#b9beba" />
          <stop offset="0.35" stopColor="#4a4f4c" />
          <stop offset="1" stopColor="#101111" />
        </radialGradient>
        <radialGradient id={glow} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={accent} stopOpacity="0.85" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="80" cy="142" rx="62" ry="8" fill="#000" opacity="0.6" />

      {era === "ancient" && (
        <g>
          <ellipse cx="80" cy="122" rx="34" ry="10" fill={`url(#${glow})`} />
          <path d="M46 116h68l-7 22H53z" fill={`url(#${dark})`} stroke="#ffffff22" />
          <rect x="45" y="64" width="5" height="54" rx="1.5" fill={`url(#${metal})`} />
          <rect x="110" y="64" width="5" height="54" rx="1.5" fill={`url(#${metal})`} />
          <line x1="48" y1="70" x2="112" y2="70" stroke="#5c615e" strokeWidth="3" />
          <circle cx="80" cy="70" r="25" fill={`url(#${sphere})`} />
          <path d="M80 45v-7h15" stroke={`url(#${metal})`} strokeWidth="4.5" fill="none" strokeLinecap="round" />
          <path d="M80 95v7H65" stroke={`url(#${metal})`} strokeWidth="4.5" fill="none" strokeLinecap="round" />
          <circle cx="102" cy="34" r="5" fill="#fff" opacity="0.07" />
          <circle cx="110" cy="28" r="7" fill="#fff" opacity="0.05" />
        </g>
      )}

      {era === "industrial" && (
        <g>
          <rect x="16" y="128" width="128" height="10" rx="2" fill={`url(#${dark})`} stroke="#ffffff1a" />
          <rect x="26" y="70" width="28" height="58" rx="3" fill={`url(#${metal})`} />
          <path d="M26 86h28M26 112h28" stroke="#0008" />
          <rect x="74" y="44" width="10" height="84" rx="1.5" fill={`url(#${metal})`} />
          <g transform="rotate(-6 79 40)">
            <rect x="22" y="36" width="112" height="9" rx="4.5" fill={`url(#${metal})`} />
          </g>
          <line x1="40" y1="46" x2="40" y2="70" stroke="#8a8f8c" strokeWidth="3" />
          <line x1="128" y1="34" x2="120" y2="96" stroke="#6d726f" strokeWidth="3.5" />
          <circle cx="120" cy="98" r="26" fill="none" stroke={`url(#${metal})`} strokeWidth="5" />
          {[0, 45, 90, 135].map((a) => (
            <line
              key={a}
              x1="120"
              y1="72"
              x2="120"
              y2="124"
              stroke="#4a4f4c"
              strokeWidth="2"
              transform={`rotate(${a} 120 98)`}
            />
          ))}
          <circle cx="120" cy="98" r="4.5" fill="#9aa09d" />
          <ellipse cx="40" cy="128" rx="18" ry="4" fill={`url(#${glow})`} />
        </g>
      )}

      {era === "combustion" && (
        <g>
          <rect x="28" y="126" width="104" height="12" rx="2" fill={`url(#${dark})`} stroke="#ffffff1a" />
          <rect x="46" y="54" width="32" height="72" rx="4" fill={`url(#${metal})`} />
          {Array.from({ length: 8 }, (_, i) => (
            <line key={i} x1="44" x2="80" y1={62 + i * 7} y2={62 + i * 7} stroke="#0009" strokeWidth="2" />
          ))}
          <rect x="42" y="45" width="40" height="11" rx="2.5" fill={`url(#${metal})`} />
          <rect x="58" y="98" width="44" height="28" rx="5" fill={`url(#${dark})`} stroke="#ffffff14" />
          <circle cx="106" cy="94" r="30" fill="none" stroke={`url(#${metal})`} strokeWidth="6.5" />
          {[0, 60, 120].map((a) => (
            <line
              key={a}
              x1="106"
              y1="64"
              x2="106"
              y2="124"
              stroke="#4a4f4c"
              strokeWidth="2.5"
              transform={`rotate(${a} 106 94)`}
            />
          ))}
          <circle cx="106" cy="94" r="5" fill="#9aa09d" />
          <ellipse cx="62" cy="58" rx="14" ry="5" fill={`url(#${glow})`} opacity="0.7" />
        </g>
      )}

      {era === "electric" && (
        <g>
          <path d="M44 112h66l6 16H38z" fill={`url(#${dark})`} stroke="#ffffff1a" />
          <rect x="32" y="58" width="84" height="56" rx="12" fill={`url(#${metal})`} />
          {Array.from({ length: 9 }, (_, i) => (
            <line key={i} x1={42 + i * 8} x2={42 + i * 8} y1="62" y2="110" stroke="#0007" strokeWidth="2" />
          ))}
          <rect x="58" y="48" width="28" height="12" rx="2.5" fill={`url(#${dark})`} stroke="#ffffff1f" />
          <ellipse cx="116" cy="86" rx="9" ry="27" fill={`url(#${dark})`} stroke="#ffffff1f" />
          <rect x="122" y="82" width="20" height="8" rx="2" fill="#a9aeab" />
          <ellipse cx="130" cy="86" rx="22" ry="22" fill={`url(#${glow})`} opacity="0.55" />
        </g>
      )}
    </svg>
  );
}
