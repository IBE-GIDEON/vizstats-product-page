"use client";

/**
 * Form fields generated from the content itself: every string becomes an input, every list gets
 * add / move / remove controls, every object becomes a group. New content fields show up in the
 * editor automatically.
 */

import type { FactIconName, HeroImage } from "@/content/projects";
import { FACT_ICONS, FactIcon } from "@/components/project/factIcons";
import HeroImageField, { ImagePicker, VideoField } from "./HeroImageField";
import { IPadPro, IPhone17 } from "@/components/project/mock/Devices";
import { isWebAddress, screenshotOf } from "@/lib/screenshot";

export type Path = (string | number)[];
export type Edit = (path: Path, value: unknown) => void;

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** Friendly names for content keys. */
const LABELS: Record<string, string> = {
  name: "Studio name",
  tagline: "Tagline",
  email: "Email",
  nav: "Navigation",
  footer: "Footer",
  heading: "Heading",
  cta: "Button",
  navTitle: "Navigation title",
  contactTitle: "Contact title",
  label: "Label",
  href: "Link",
  titleLines: "Title",
  summary: "Summary (search results)",
  lede: "Intro statement",
  ledeAccents: "Highlighted words",
  meta: "Fact cards",
  value: "Value",
  stats: "Video stats",
  product: "Product",
  url: "Product address (URL)",
  domain: "Domain shown in the browser bar",
  eyebrow: "Small line above the headline",
  headline: "Headline",
  question: "Research question",
  chapters: "Chapters",
  video: "Video file",
  headings: "Section headings",
  inside: "Inside the product",
  showcase: "Devices section",
  more: "More projects",
  body: "Text",
  facts: "Facts",
  chips: "Tags",
  next: "More projects",
  meta_card: "Note",
  kicker: "Type",
  tabletImage: "iPad screen",
  phoneImage: "iPhone screen",
  imageAlt: "Describe the image (for screen readers)",
};

/** The built-in product visuals a feature can show. */
const BUILTIN: Record<string, string> = {
  timeline: "Kinetic timeline (live)",
  periodic: "Periodic table (interactive)",
  registry: "Company registry (interactive)",
  sites: "Project sites",
  live: "Product opening screen",
  chain: "Command chain",
  responsive: "Laptop, tablet and phone",
};

/** What the "Add" button says under each list. */
const ADD_LABELS: Record<string, string> = {
  meta: "Add fact card",
  inside: "Add feature",
  nav: "Add link",
  chapters: "Add chapter",
  next: "Add project",
  facts: "Add fact",
  chips: "Add tag",
  body: "Add paragraph",
  ledeAccents: "Add word",
};

/** Keys tied to code (visuals, routes, icons) — not shown in the editor. */
const HIDDEN = new Set(["id", "slug", "shot", "icon", "placeholder"]);
/** Lists whose length is fixed by the design (items can be edited and reordered, not added or removed). */
const FIXED = new Set(["stats"]);
/** Two-part texts: [first words, muted rest] and label / value pairs. */
const PAIR_HINTS: Record<string, [string, string]> = {
  titleLines: ["Line 1", "Line 2"],
  headline: ["White part", "Coloured part"],
  heading: ["First words", "Muted rest"],
  inside: ["First words", "Muted rest"],
  showcase: ["First words", "Muted rest"],
  more: ["First words", "Muted rest"],
  facts: ["Label", "Value"],
};

export const labelFor = (key: string | number) =>
  typeof key === "number" ? `Item ${key + 1}` : (LABELS[key] ?? key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()));

const input =
  "w-full rounded-[8px] border border-paper-line bg-white px-3.5 py-2.5 text-[15px] text-ink-1 outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-ash-2 focus:border-green-2 focus:ring-[3px] focus:ring-green/20";

function TextInput({ value, onChange, long, placeholder }: { value: string; onChange: (v: string) => void; long?: boolean; placeholder?: string }) {
  return long ? (
    <textarea
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      rows={Math.min(8, Math.max(2, Math.ceil(value.length / 70)))}
      className={`${input} resize-y leading-[1.55]`}
    />
  ) : (
    <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={input} />
  );
}

function IconButton({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ash-3 transition-colors hover:bg-black/[0.05] hover:text-ink-1 disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}

const Up = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </svg>
);
const Down = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </svg>
);
const Remove = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

/** An empty copy of a list item, to add a new one. Code-tied values (ids, visuals, icons) are kept. */
function blank(v: unknown, key?: string): unknown {
  if (typeof v === "string") {
    if (key === "id") return `item-${Date.now().toString(36)}`;
    if (key === "visual") return "image";
    if (key === "shot" || key === "icon") return v;
    return key === "href" ? "#" : "";
  }
  if (typeof v === "number") return 0;
  if (typeof v === "boolean") return v;
  if (Array.isArray(v)) return v.every((x) => typeof x === "string") && v.length !== 2 ? [] : v.map((x) => blank(x));
  if (isObject(v)) {
    const out: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v)) out[k] = k === "slug" ? `${String(x)}-${Date.now().toString(36)}` : blank(x, k);
    return out;
  }
  return v;
}

function itemTitle(v: unknown, i: number): string {
  if (typeof v === "string") return v || `Item ${i + 1}`;
  if (Array.isArray(v)) return v.filter((x) => typeof x === "string" && x).join(" — ") || `Item ${i + 1}`;
  if (isObject(v)) {
    if (typeof v.label === "string" && v.label) return v.label;
    if (Array.isArray(v.titleLines)) return v.titleLines.join(" ");
    if (typeof v.value === "string" && v.value) return v.value;
  }
  return `Item ${i + 1}`;
}

function isPair(value: unknown, name: string | number, parent?: string | number) {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every((x) => typeof x === "string") &&
    ((typeof name === "string" && name in PAIR_HINTS) || parent === "facts")
  );
}

/** A labelled field for any content value. */
export function Field({
  name,
  value,
  path,
  onEdit,
  parent,
  listKey,
  siblings,
  bare,
}: {
  name: string | number;
  value: unknown;
  path: Path;
  onEdit: Edit;
  parent?: string | number;
  /** the nearest list this field sits in */
  listKey?: string | number;
  /** the other fields next to this one (e.g. the intro text, for picking its highlighted words) */
  siblings?: Record<string, unknown>;
  /** render without its own label (inside list items) */
  bare?: boolean;
}) {
  // intro statement: click words to highlight them
  if (name === "ledeAccents" && Array.isArray(value) && typeof siblings?.lede === "string") {
    return (
      <div>
        <p className="mb-1 text-[13px] font-medium text-ash-3">{labelFor(name)}</p>
        <p className="mb-3 text-[12.5px] text-ash-2">Click a word to show it in the accent colour; click it again to turn it off.</p>
        <AccentPicker text={siblings.lede} value={value as string[]} onChange={(v) => onEdit(path, v)} />
      </div>
    );
  }

  // features: what shows under the text, and the image / video itself
  if (name === "visual" && typeof value === "string") {
    return (
      <div>
        <p className="mb-2 text-[13px] font-medium text-ash-3">Shows</p>
        <select value={value} onChange={(e) => onEdit(path, e.target.value)} className={`${input} max-w-[360px]`}>
          <optgroup label="Your media">
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="none">Text only</option>
          </optgroup>
          <optgroup label="Built-in product visuals">
            {Object.entries(BUILTIN).map(([k, l]) => (
              <option key={k} value={k}>
                {l}
              </option>
            ))}
          </optgroup>
        </select>
      </div>
    );
  }
  if (siblings && "visual" in siblings && (name === "src" || name === "alt")) {
    const kind = siblings.visual;
    if (name === "alt") return kind === "image" ? <Field name="imageAlt" value={value} path={path} onEdit={onEdit} /> : null;
    if (kind === "image")
      return <ImagePicker title="Image" hint="Any shape — shown in full at the width of the page." src={String(value)} onSrc={(v) => onEdit(path, v)} />;
    if (kind === "video") return <VideoField title="Video" src={String(value)} onSrc={(v) => onEdit(path, v)} />;
    return null;
  }
  // devices section: real screenshots, previewed in the actual frames
  if ((name === "tabletImage" || name === "phoneImage") && typeof value === "string") {
    const tablet = name === "tabletImage";
    return (
      <div className="rounded-[10px] border border-paper-line bg-white/60 p-4 sm:p-5">
        <ImagePicker
          title={tablet ? "iPad screen" : "iPhone screen"}
          hint={
            tablet
              ? "A screenshot taken on an iPad Pro 13-inch, held sideways: 2752 × 2064 px (4:3). Leave empty to show the live product."
              : "A screenshot taken on an iPhone 17: 1206 × 2622 px. Leave empty to show the live product."
          }
          spec={tablet ? { ratio: 4 / 3, label: "4:3", w: 2752, h: 2064 } : { ratio: 1206 / 2622, label: "iPhone 17", w: 1206, h: 2622 }}
          src={value}
          onSrc={(v) => onEdit(path, v)}
        />
        {value && (
          <div className="mt-5">
            <p className="mb-3 text-[13px] font-medium text-ash-3">Preview</p>
            <div className="rounded-[8px] bg-ink-2 p-6">
              <div className={tablet ? "mx-auto max-w-[420px]" : "mx-auto max-w-[150px]"}>
                {tablet ? (
                  <IPadPro domain="" screenshot={value}>
                    {null}
                  </IPadPro>
                ) : (
                  <IPhone17 domain="" screenshot={value}>
                    {null}
                  </IPhone17>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // more projects: a link (captured automatically) and an optional own image
  if (listKey === "next" && name === "url" && typeof value === "string") {
    const live = isWebAddress(value);
    return (
      <div>
        <p className="mb-1 text-[13px] font-medium text-ash-3">Project link</p>
        <p className="mb-3 text-[12.5px] text-ash-2">Paste the live project&rsquo;s address; its screenshot is captured automatically at the box&rsquo;s 16:10 shape.</p>
        <TextInput value={value} placeholder="https://…" onChange={(v) => onEdit(path, v.trim())} />
        {live && !siblings?.image && (
          <div className="mt-3">
            <div className="relative aspect-[16/10] max-w-[420px] overflow-hidden rounded-[8px] bg-ink-2 ring-1 ring-black/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={screenshotOf(value)} alt="" className="h-full w-full object-cover object-top" />
            </div>
            <p className="mt-2 text-[12px] text-ash-2">Captured from the live page (it can take a few seconds the first time).</p>
          </div>
        )}
      </div>
    );
  }
  if (listKey === "next" && name === "image" && typeof value === "string") {
    return (
      <ImagePicker
        title="Your own image (optional)"
        hint="Replaces the captured screenshot. Best 16:10, 2560 × 1600 px."
        spec={{ ratio: 16 / 10, label: "16:10", w: 2560, h: 1600 }}
        src={value}
        onSrc={(v) => onEdit(path, v)}
      />
    );
  }

  // welcome screen video
  if (name === "video" && typeof value === "string") {
    return (
      <VideoField
        title="Welcome video (optional)"
        hint="Shown instead of the image when set. Best 16:9, 1920 × 1080 px or larger, MP4."
        src={value}
        onSrc={(v) => onEdit(path, v)}
      />
    );
  }

  // fact cards: pick the icon
  if (name === "icon" && listKey === "meta" && typeof value === "string") {
    return (
      <div>
        <p className="mb-2 text-[13px] font-medium text-ash-3">Icon</p>
        <IconPicker value={value} onChange={(v) => onEdit(path, v)} />
      </div>
    );
  }
  if (typeof name === "string" && HIDDEN.has(name)) return null;
  const key = typeof name === "string" ? name : String(parent ?? "");

  let control: React.ReactNode;

  if (name === "heroImage" && isObject(value)) {
    control = <HeroImageField value={value as HeroImage} path={path} onEdit={onEdit} />;
  } else if (typeof value === "string") {
    control = (
      <TextInput
        value={value}
        onChange={(v) => onEdit(path, v)}
        long={value.length > 70 || ["summary", "lede", "body", "question"].includes(key)}
      />
    );
  } else if (typeof value === "number") {
    control = <input type="number" value={value} onChange={(e) => onEdit(path, Number(e.target.value))} className={`${input} max-w-[180px]`} />;
  } else if (isPair(value, name, parent)) {
    const pair = value as [string, string];
    const hints = PAIR_HINTS[typeof name === "string" && name in PAIR_HINTS ? name : "facts"];
    control = (
      <div className="grid gap-2 sm:grid-cols-2">
        {pair.map((part, i) => (
          <TextInput key={i} value={part} placeholder={hints[i]} onChange={(v) => onEdit([...path, i], v)} />
        ))}
      </div>
    );
  } else if (Array.isArray(value)) {
    control = <List name={name} items={value} path={path} onEdit={onEdit} />;
  } else if (isObject(value)) {
    control = (
      <div className="space-y-5 rounded-[10px] border border-paper-line bg-white/60 p-4 sm:p-5">
        {Object.entries(value).map(([k, v]) => (
          <Field key={k} name={k} value={v} path={[...path, k]} onEdit={onEdit} parent={name} listKey={listKey} siblings={value} />
        ))}
      </div>
    );
  } else {
    return null;
  }

  if (bare) return <>{control}</>;
  return (
    <div>
      <p className="mb-2 text-[13px] font-medium text-ash-3">
        {labelFor(name === "meta" && typeof value === "string" ? "meta_card" : name)}
      </p>
      {control}
    </div>
  );
}

function List({ name, items, path, onEdit }: { name: string | number; items: unknown[]; path: Path; onEdit: Edit }) {
  const fixed = typeof name === "string" && FIXED.has(name);
  const simple = items.length === 0 || items.every((x) => typeof x === "string");

  const move = (from: number, to: number) => {
    const next = [...items];
    const [x] = next.splice(from, 1);
    next.splice(to, 0, x);
    onEdit(path, next);
  };
  const remove = (i: number) => onEdit(path, items.filter((_, k) => k !== i));
  const add = () => onEdit(path, [...items, items.length ? blank(items[items.length - 1]) : ""]);

  const controls = (i: number) => (
    <div className="flex shrink-0 items-center">
      <IconButton label="Move up" disabled={i === 0} onClick={() => move(i, i - 1)}>
        <Up />
      </IconButton>
      <IconButton label="Move down" disabled={i === items.length - 1} onClick={() => move(i, i + 1)}>
        <Down />
      </IconButton>
      {!fixed && (
        <IconButton label="Remove" onClick={() => remove(i)}>
          <Remove />
        </IconButton>
      )}
    </div>
  );

  return (
    <div className="space-y-2">
      {items.map((item, i) =>
        simple ? (
          <div key={i} className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <Field name={i} value={item} path={[...path, i]} onEdit={onEdit} parent={name} listKey={name} bare />
            </div>
            <div className="pt-1.5">{controls(i)}</div>
          </div>
        ) : (
          <details key={i} className="group rounded-[10px] border border-paper-line bg-white" open={items.length <= 3}>
            <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="shrink-0 text-ash-2 transition-transform group-open:rotate-90" aria-hidden>
                <path d="M9 6l6 6-6 6" />
              </svg>
              <span className="min-w-0 flex-1 truncate text-[14.5px] font-semibold text-ink-1">{itemTitle(item, i)}</span>
              <span onClick={(e) => e.preventDefault()}>{controls(i)}</span>
            </summary>
            <div className="border-t border-paper-line p-4 sm:p-5">
              <Field name={i} value={item} path={[...path, i]} onEdit={onEdit} parent={name} listKey={name} bare />
            </div>
          </details>
        ),
      )}
      {!fixed && (
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-2 rounded-[8px] border border-dashed border-black/20 px-3.5 py-2 text-[13.5px] font-medium text-ash-3 transition-colors hover:border-black/40 hover:text-ink-1"
        >
          <span className="text-[16px] leading-none">+</span>{" "}
          {(typeof name === "string" && ADD_LABELS[name]) || `Add ${simple ? "line" : "item"}`}
        </button>
      )}
    </div>
  );
}

/** A grid of the fact-card icons; the chosen one is outlined. */
function IconPicker({ value, onChange }: { value: string; onChange: (v: FactIconName) => void }) {
  return (
    <div role="radiogroup" aria-label="Icon" className="flex flex-wrap gap-1.5">
      {(Object.keys(FACT_ICONS) as FactIconName[]).map((name) => {
        const on = name === value;
        return (
          <button
            key={name}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={FACT_ICONS[name].label}
            title={FACT_ICONS[name].label}
            onClick={() => onChange(name)}
            className={`flex h-10 w-10 items-center justify-center rounded-[8px] border transition-colors ${
              on ? "border-green-2 bg-green/10 text-ink-1 ring-[3px] ring-green/15" : "border-paper-line bg-white text-ash-3 hover:border-black/25 hover:text-ink-1"
            }`}
          >
            <FactIcon name={name} size={18} />
          </button>
        );
      })}
    </div>
  );
}

/** The intro as it appears on the site; each word toggles its highlight. */
function AccentPicker({ text, value, onChange }: { text: string; value: string[]; onChange: (v: string[]) => void }) {
  const words = text.split(" ").filter(Boolean);
  const toggle = (w: string) => onChange(value.includes(w) ? value.filter((x) => x !== w) : [...value, w]);
  return (
    <div className="rounded-[10px] bg-ink-2 px-5 py-5 font-display text-[clamp(19px,2vw,24px)] font-medium leading-[1.25] tracking-[-0.02em] text-fog sm:px-7 sm:py-6">
      {words.map((w, i) => {
        const on = value.includes(w);
        return (
          <button
            key={i}
            type="button"
            aria-pressed={on}
            onClick={() => toggle(w)}
            className={`mr-[0.25em] rounded-[4px] px-[0.08em] transition-colors hover:bg-white/10 ${on ? "text-green" : ""}`}
          >
            {w}
          </button>
        );
      })}
    </div>
  );
}
