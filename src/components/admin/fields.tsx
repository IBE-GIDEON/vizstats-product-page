"use client";

/**
 * Form fields generated from the content itself: every string becomes an input, every list gets
 * add / move / remove controls, every object becomes a group. New content fields show up in the
 * editor automatically.
 */

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
  lede: "Intro line",
  ledeAccents: "Highlighted words in the intro",
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
};

/** Keys tied to code (visuals, routes, icons) — not shown in the editor. */
const HIDDEN = new Set(["id", "slug", "shot", "icon", "placeholder"]);
/** Lists whose length is fixed by the design (items can be edited and reordered, not added or removed). */
const FIXED = new Set(["inside", "stats"]);
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
  if (typeof v === "string") return key === "id" || key === "shot" || key === "icon" ? v : key === "href" ? "#" : "";
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
  bare,
}: {
  name: string | number;
  value: unknown;
  path: Path;
  onEdit: Edit;
  parent?: string | number;
  /** render without its own label (inside list items) */
  bare?: boolean;
}) {
  if (typeof name === "string" && HIDDEN.has(name)) return null;
  const key = typeof name === "string" ? name : String(parent ?? "");

  let control: React.ReactNode;

  if (typeof value === "string") {
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
          <Field key={k} name={k} value={v} path={[...path, k]} onEdit={onEdit} parent={name} />
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
              <Field name={i} value={item} path={[...path, i]} onEdit={onEdit} parent={name} bare />
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
              <Field name={i} value={item} path={[...path, i]} onEdit={onEdit} parent={name} bare />
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
          <span className="text-[16px] leading-none">+</span> Add {simple ? "line" : "item"}
        </button>
      )}
    </div>
  );
}
