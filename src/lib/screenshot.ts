/**
 * A live screenshot of a web page, at the "More projects" boxes' 16:10 shape (1440 × 900 view).
 * Uses microlink.io's screenshot API (free tier, cached on their side). To change provider, change
 * this one function — e.g. to a Convex action that stores the capture once.
 */
export function screenshotOf(url: string): string {
  const q = new URLSearchParams({
    url,
    screenshot: "true",
    meta: "false",
    embed: "screenshot.url",
    "viewport.width": "1440",
    "viewport.height": "900",
    // let intro animations and loading screens settle before the capture
    waitForTimeout: "4000",
  });
  return `https://api.microlink.io/?${q.toString()}`;
}

/** True when the text looks like a full web address we can capture. */
export const isWebAddress = (v: string) => /^https?:\/\/[^\s.]+\.[^\s]+$/i.test(v.trim());
