"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LogoMark } from "@/components/site/Logo";
import type { Content } from "@/lib/cms/content";
import { STORE_NAME, resetContent, saveContent } from "@/lib/cms/store";
import { useContent } from "@/lib/cms/useContent";
import { Field, type Path } from "./fields";

type Section = { id: string; group: string; title: string; path: Path; keys?: string[] };

/** The editor's left-hand menu: one entry per part of the site. */
function sectionsFor(content: Content): Section[] {
  const out: Section[] = [
    { id: "studio", group: "Studio", title: "Studio & navigation", path: ["site"], keys: ["name", "tagline", "email", "nav"] },
    { id: "footer", group: "Studio", title: "Footer", path: ["site", "footer"] },
  ];
  content.projects.forEach((p, i) => {
    const group = p.titleLines.join(" ");
    const base: Path = ["projects", i];
    out.push(
      { id: `p${i}-intro`, group, title: "Title & intro", path: base, keys: ["titleLines", "summary", "lede", "ledeAccents"] },
      { id: `p${i}-meta`, group, title: "Fact cards", path: base, keys: ["meta"] },
      { id: `p${i}-video`, group, title: "Video", path: base, keys: ["stats", "video"] },
      { id: `p${i}-product`, group, title: "Product", path: [...base, "product"] },
      { id: `p${i}-headings`, group, title: "Section headings", path: [...base, "headings"] },
      { id: `p${i}-inside`, group, title: "Inside the product", path: base, keys: ["inside"] },
      { id: `p${i}-chapters`, group, title: "Chapters", path: base, keys: ["chapters"] },
      { id: `p${i}-more`, group, title: "More projects", path: base, keys: ["next"] },
    );
  });
  return out;
}

function getIn(obj: unknown, path: Path): unknown {
  return path.reduce<unknown>((o, k) => (o == null ? o : (o as Record<string | number, unknown>)[k]), obj);
}

function setIn<T>(obj: T, path: Path, value: unknown): T {
  if (path.length === 0) return value as T;
  const [k, ...rest] = path;
  const copy = (Array.isArray(obj) ? [...obj] : { ...(obj as object) }) as Record<string | number, unknown>;
  copy[k] = setIn(copy[k], rest, value);
  return copy as T;
}

/**
 * The CMS back page: pick a part of the site on the left, edit its text, save.
 * Saved edits show on the site straight away (in this browser while storage is local).
 */
export default function AdminApp() {
  const live = useContent();
  const [draft, setDraft] = useState<Content | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const current = draft ?? live;
  const dirty = draft !== null && JSON.stringify(draft) !== JSON.stringify(live);

  const sections = useMemo(() => sectionsFor(current), [current]);
  const [activeId, setActiveId] = useState(sections[0].id);
  const active = sections.find((s) => s.id === activeId) ?? sections[0];

  const edit = useCallback((path: Path, value: unknown) => setDraft((d) => setIn(d ?? live, path, value)), [live]);

  const save = useCallback(async () => {
    if (!draft) return;
    await saveContent(draft);
    setDraft(null);
    setSavedAt(new Date());
  }, [draft]);

  const reset = async () => {
    if (!window.confirm("Reset every text on the site to the original content? This removes all saved edits.")) return;
    await resetContent();
    setDraft(null);
    setSavedAt(null);
  };

  // Ctrl/Cmd + S saves; leaving with unsaved edits asks first
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void save();
      }
    };
    const onLeave = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", onLeave);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", onLeave);
    };
  }, [save, dirty]);

  const target = getIn(current, active.path);
  const fields =
    active.keys && target && typeof target === "object"
      ? active.keys.map((k) => [k, (target as Record<string, unknown>)[k]] as const)
      : target && typeof target === "object"
        ? Object.entries(target as Record<string, unknown>)
        : [];

  const groups = [...new Set(sections.map((s) => s.group))];
  const siteHref = `/work/${current.projects[0]?.slug ?? ""}`;

  return (
    <div data-admin className="min-h-svh bg-paper font-sans text-ink-1">
      {/* top bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-paper-line bg-paper/85 px-4 backdrop-blur-md md:px-6">
        <div className="flex items-center gap-3">
          <LogoMark size={26} className="!text-green-2" />
          <span className="font-display text-[17px] font-semibold tracking-[-0.02em]">VizStats</span>
          <span className="rounded-md border border-paper-line bg-white px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ash-3">
            CMS
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <span className="hidden text-[13px] text-ash-3 sm:block" aria-live="polite">
            {dirty ? "Unsaved changes" : savedAt ? `Saved at ${savedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "All changes saved"}
          </span>
          <Link
            href={siteHref}
            target="_blank"
            className="rounded-[8px] px-3 py-2 text-[14px] font-medium text-ash-3 transition-colors hover:bg-black/[0.05] hover:text-ink-1"
          >
            View site ↗
          </Link>
          {dirty && (
            <button
              type="button"
              onClick={() => setDraft(null)}
              className="rounded-[8px] px-3 py-2 text-[14px] font-medium text-ash-3 transition-colors hover:bg-black/[0.05] hover:text-ink-1"
            >
              Discard
            </button>
          )}
          <button
            type="button"
            onClick={() => void save()}
            disabled={!dirty}
            className="rounded-[8px] bg-ink-1 px-4 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-ink-3 disabled:bg-black/15 disabled:text-white"
          >
            Save
          </button>
        </div>
      </header>

      <div className="md:flex">
        {/* menu: a list on desktop, a dropdown on phones */}
        <nav
          data-lenis-prevent
          className="sticky top-16 hidden h-[calc(100svh-4rem)] w-[270px] shrink-0 flex-col overflow-y-auto border-r border-paper-line px-3 py-6 md:flex"
        >
          {groups.map((g) => (
            <div key={g} className="mb-6">
              <p className="mb-2 px-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ash-2">{g}</p>
              {sections
                .filter((s) => s.group === g)
                .map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveId(s.id)}
                    className={`block w-full rounded-[8px] px-3 py-2 text-left text-[14.5px] transition-colors ${
                      s.id === active.id ? "bg-white font-semibold text-ink-1 shadow-[0_0_0_1px_rgba(11,12,12,0.08)]" : "text-ash-3 hover:bg-black/[0.04] hover:text-ink-1"
                    }`}
                  >
                    {s.title}
                  </button>
                ))}
            </div>
          ))}
          <button
            type="button"
            onClick={() => void reset()}
            className="mt-auto rounded-[8px] px-3 py-2 text-left text-[13px] text-ash-3 transition-colors hover:bg-black/[0.04] hover:text-ink-1"
          >
            Reset all to original
          </button>
        </nav>

        <main className="mx-auto w-full max-w-[860px] px-4 pb-24 pt-6 md:px-10 md:pt-10">
          <label className="mb-6 block md:hidden">
            <span className="sr-only">Section</span>
            <select
              value={active.id}
              onChange={(e) => setActiveId(e.target.value)}
              className="w-full rounded-[8px] border border-paper-line bg-white px-3 py-2.5 text-[15px]"
            >
              {groups.map((g) => (
                <optgroup key={g} label={g}>
                  {sections
                    .filter((s) => s.group === g)
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </label>

          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ash-2">{active.group}</p>
          <h1 className="mt-2 font-display text-[clamp(26px,3vw,34px)] font-semibold tracking-[-0.03em]">{active.title}</h1>
          <p className="mt-2 text-[13.5px] text-ash-3">
            Saved to: {STORE_NAME}. Press Save (or Ctrl + S) to publish your edits.
          </p>

          <div className="mt-8 space-y-7">
            {fields.map(([k, v]) => (
              <Field key={k} name={k} value={v} path={[...active.path, k]} onEdit={edit} />
            ))}
            {fields.length === 0 && <p className="text-[14px] text-ash-3">Nothing to edit here.</p>}
          </div>
        </main>
      </div>
    </div>
  );
}

