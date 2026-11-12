"use client";

/**
 * Where CMS edits are kept.
 *
 * TODAY — this browser's localStorage, for testing: edits show on this computer only.
 * CONVEX — swap the bodies of the three exports below for Convex calls
 *   (`useQuery(api.content.get)`, `useMutation(api.content.save)`, `useMutation(api.content.reset)`)
 *   and wrap the app in `ConvexProvider`. Nothing else in the app needs to change.
 */

import { useMemo, useSyncExternalStore } from "react";

const KEY = "vizstats-cms:v1";
const CHANGE = "vizstats-cms:change"; // same-tab notification; other tabs get the "storage" event

export const STORE_NAME = "This browser (testing)";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE, onChange);
  };
}

function read() {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null; // storage blocked (private mode, settings)
  }
}

/** The saved edits, or `null` when nothing has been saved yet. */
export function useSavedContent(): unknown {
  const raw = useSyncExternalStore(subscribe, read, () => null);
  return useMemo(() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as unknown;
    } catch {
      return null;
    }
  }, [raw]);
}

/** Save the whole content tree. */
export async function saveContent(content: unknown): Promise<void> {
  window.localStorage.setItem(KEY, JSON.stringify(content));
  window.dispatchEvent(new Event(CHANGE));
}

/** Drop all edits and go back to the defaults in src/content. */
export async function resetContent(): Promise<void> {
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(CHANGE));
}
