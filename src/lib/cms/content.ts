// The whole editable content tree, its defaults (the files in src/content), and how saved edits
// are laid over those defaults.

import { projects, type Project } from "@/content/projects";
import { site, type SiteContent } from "@/content/site";

export type Content = { site: SiteContent; projects: Project[] };

export const defaultContent: Content = { site, projects };

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * Lay saved content over the defaults. Objects merge key by key; a saved list replaces the
 * default list (so added / removed / reordered items stick) while each item still picks up any
 * fields the defaults have gained since it was saved. Values of the wrong type are ignored.
 */
function merge(base: unknown, saved: unknown): unknown {
  if (saved === undefined || saved === null) return base;
  if (Array.isArray(base)) {
    if (!Array.isArray(saved)) return base;
    return saved.map((item, i) => (i < base.length ? merge(base[i], item) : item));
  }
  if (isObject(base)) {
    if (!isObject(saved)) return base;
    const out: Record<string, unknown> = { ...base };
    for (const key of Object.keys(saved)) out[key] = key in base ? merge(base[key], saved[key]) : saved[key];
    return out;
  }
  return typeof saved === typeof base ? saved : base;
}

export function withSaved(saved: unknown): Content {
  return saved ? (merge(defaultContent, saved) as Content) : defaultContent;
}
