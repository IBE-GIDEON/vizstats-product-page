"use client";

import { useMemo } from "react";
import { type Content, withSaved } from "./content";
import { useSavedContent } from "./store";

/** The site's content: the defaults with any CMS edits laid over them. Updates live when edits are saved. */
export function useContent(): Content {
  const saved = useSavedContent();
  return useMemo(() => withSaved(saved), [saved]);
}
