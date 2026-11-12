"use client";

import { useEffect, useRef, useState } from "react";
import type { HeroImage } from "@/content/projects";
import type { Edit, Path } from "./fields";

type Spec = { ratio: number; label: string; w: number; h: number };
const WIDE: Spec = { ratio: 16 / 9, label: "16:9", w: 2560, h: 1440 };
const TALL: Spec = { ratio: 9 / 16, label: "9:16", w: 1080, h: 1920 };

const COMMON: [number, string][] = [
  [21 / 9, "21:9"],
  [16 / 9, "16:9"],
  [16 / 10, "16:10"],
  [3 / 2, "3:2"],
  [4 / 3, "4:3"],
  [1, "1:1"],
  [4 / 5, "4:5"],
  [3 / 4, "3:4"],
  [2 / 3, "2:3"],
  [9 / 16, "9:16"],
];

function ratioName(w: number, h: number) {
  const r = w / h;
  const hit = COMMON.find(([v]) => Math.abs(r / v - 1) < 0.02);
  return hit ? hit[1] : `${r.toFixed(2)}:1`;
}

/** Shrink an uploaded image so it stays light enough for storage (long edge capped), as a JPEG data URL. */
async function compress(file: File, maxEdge: number): Promise<string> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, maxEdge / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d")?.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  bmp.close();
  return canvas.toDataURL("image/jpeg", 0.85);
}

/** Natural size of an image source, once it has loaded. */
function useNaturalSize(src: string) {
  const [size, setSize] = useState<{ src: string; w: number; h: number } | null>(null);
  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.onload = () => setSize({ src, w: img.naturalWidth, h: img.naturalHeight });
    img.src = src;
  }, [src]);
  return size && size.src === src ? size : null;
}

/** How the chosen image compares with the shape the screen wants (or just its size, when any shape works). */
function FitNote({ src, spec }: { src: string; spec?: Spec }) {
  const size = useNaturalSize(src);
  if (!src) return null;
  if (!size) return <p className="text-[13px] text-ash-3">Checking the image…</p>;

  if (!spec) {
    return (
      <div className="space-y-1 text-[13px] leading-snug">
        <p className="text-ash-3">
          This image: <span className="font-medium text-ink-1">{size.w} × {size.h} px</span> · {ratioName(size.w, size.h)}
        </p>
        <p className="text-[#1d7f5a]">Any shape works: it&rsquo;s shown in full, at the width of the page.</p>
        {size.w < 1600 && <p className="text-[#9a6a12]">It&rsquo;s small, so it may look soft. 2400 px wide or more is ideal.</p>}
      </div>
    );
  }

  const diff = size.w / size.h / spec.ratio;
  const matches = Math.abs(diff - 1) < 0.04;
  const shape = matches
    ? `Matches ${spec.label}: it fits the screen with almost no cropping.`
    : diff < 1
      ? `Taller than ${spec.label}: some of the top and bottom will be cropped.`
      : `Wider than ${spec.label}: some of the sides will be cropped.`;
  const small = size.w < spec.w * 0.75 && size.h < spec.h * 0.75;

  return (
    <div className="space-y-1 text-[13px] leading-snug">
      <p className="text-ash-3">
        This image: <span className="font-medium text-ink-1">{size.w} × {size.h} px</span> · {ratioName(size.w, size.h)}
      </p>
      <p className={matches ? "text-[#1d7f5a]" : "text-[#9a6a12]"}>{shape}</p>
      {small && (
        <p className="text-[#9a6a12]">
          It&rsquo;s small, so it may look soft on large screens. {spec.w} × {spec.h} px is ideal.
        </p>
      )}
    </div>
  );
}

const btn =
  "rounded-[8px] border border-paper-line bg-white px-3.5 py-2 text-[13.5px] font-medium text-ink-1 transition-colors hover:border-black/25";
const input =
  "w-full rounded-[8px] border border-paper-line bg-white px-3.5 py-2.5 text-[14px] text-ink-1 outline-none placeholder:text-ash-2 focus:border-green-2 focus:ring-[3px] focus:ring-green/20";

/** Upload (button or drop), paste a link, or remove — plus the fit check. */
export function ImagePicker({
  title,
  hint,
  spec,
  src,
  focus,
  onSrc,
  onFocus,
}: {
  title: string;
  hint: string;
  /** the shape the image should have; leave out when any shape works */
  spec?: Spec;
  src: string;
  focus?: string;
  onSrc: (v: string) => void;
  /** when given, clicking the picture sets the focus point */
  onFocus?: (v: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);

  const take = async (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    setBusy(true);
    try {
      onSrc(await compress(file, spec ? Math.max(spec.w, spec.h) : 2400));
    } finally {
      setBusy(false);
    }
  };

  const [fx, fy] = (focus ?? "50% 50%").split(" ").map((v) => parseFloat(v));
  const isLink = src && !src.startsWith("data:");

  return (
    <div>
      <p className="text-[13px] font-medium text-ash-3">{title}</p>
      <p className="mt-0.5 text-[12.5px] text-ash-2">{hint}</p>

      <div className="mt-3 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* the picture (click = focus point), or a drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            void take(e.dataTransfer.files[0]);
          }}
          className={`relative overflow-hidden rounded-[10px] border bg-[repeating-conic-gradient(#e6e8e5_0%_25%,#f3f4f2_0%_50%)] bg-[length:16px_16px] ${
            drag ? "border-green-2 ring-[3px] ring-green/20" : "border-paper-line"
          }`}
          style={{ aspectRatio: !spec || spec.ratio > 1 ? "16 / 10" : "3 / 4" }}
        >
          {src ? (
            <button
              type="button"
              disabled={!onFocus}
              aria-label="Set the focus point"
              onClick={(e) => {
                if (!onFocus) return;
                const r = e.currentTarget.getBoundingClientRect();
                const x = Math.round(((e.clientX - r.left) / r.width) * 100);
                const y = Math.round(((e.clientY - r.top) / r.height) * 100);
                onFocus(`${x}% ${y}%`);
              }}
              className={`absolute inset-0 ${onFocus ? "cursor-crosshair" : "cursor-default"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-contain" />
              {onFocus && (
                <span
                  className="pointer-events-none absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.5),0_2px_8px_rgba(0,0,0,0.4)]"
                  style={{ left: `${fx}%`, top: `${fy}%` }}
                />
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center text-[13px] text-ash-3"
            >
              <span className="text-[22px] leading-none text-ash-2">+</span>
              {busy ? "Preparing…" : "Drop an image here or click to upload"}
              <span className="text-[12px] text-ash-2">
                {spec ? `Best ${spec.label}, ${spec.w} × ${spec.h} px` : "Any shape · 2400 px wide or more"}
              </span>
            </button>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <button type="button" className={btn} onClick={() => fileRef.current?.click()} disabled={busy}>
              {busy ? "Preparing…" : src ? "Replace image" : "Upload image"}
            </button>
            {src && (
              <button type="button" className={btn} onClick={() => onSrc("")}>
                Remove
              </button>
            )}
          </div>
          <input
            className={input}
            placeholder="…or paste an image link (https://…)"
            value={isLink ? src : ""}
            onChange={(e) => onSrc(e.target.value.trim())}
          />
          <FitNote src={src} spec={spec} />
          {src && onFocus && <p className="text-[12.5px] text-ash-2">Click the picture to choose what stays in view when it&rsquo;s cropped.</p>}
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          void take(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}

/** How the welcome screen will crop on a desktop and on a phone. */
function Previews({ image }: { image: HeroImage }) {
  if (!image.src) return null;
  const phoneSrc = image.mobileSrc || image.src;
  const fade = (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.7)_70%,#000)]" />
  );
  return (
    <div>
      <p className="text-[13px] font-medium text-ash-3">How it will look</p>
      <div className="mt-3 flex items-end gap-4">
        <figure className="min-w-0 flex-1">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[8px] bg-black ring-1 ring-black/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.src} alt="" className="h-full w-full object-cover" style={{ objectPosition: image.focus }} />
            {fade}
          </div>
          <figcaption className="mt-2 text-[12px] text-ash-2">Desktop</figcaption>
        </figure>
        <figure className="w-[22%] max-w-[130px] shrink-0">
          <div className="relative aspect-[9/19.5] overflow-hidden rounded-[14px] bg-black ring-1 ring-black/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={phoneSrc} alt="" className="h-full w-full object-cover" style={{ objectPosition: image.focus }} />
            {fade}
          </div>
          <figcaption className="mt-2 text-[12px] text-ash-2">Phone</figcaption>
        </figure>
      </div>
      <p className="mt-3 text-[12.5px] text-ash-2">The bottom of the screen fades into the page, so keep the subject in the top two-thirds.</p>
    </div>
  );
}

/** CMS editor for the welcome screen image. */
export default function HeroImageField({ value, path, onEdit }: { value: HeroImage; path: Path; onEdit: Edit }) {
  const set = (key: keyof HeroImage) => (v: string) => onEdit([...path, key], v);

  return (
    <div className="space-y-7 rounded-[10px] border border-paper-line bg-white/60 p-4 sm:p-5">
      <div className="rounded-[8px] bg-black/[0.035] px-4 py-3 text-[13px] leading-relaxed text-ash-3">
        <p className="font-semibold text-ink-1">Any image fits</p>
        <p>
          It fills the whole first screen and is cropped to suit each device. For the best result use a{" "}
          <span className="font-medium text-ink-1">16:9</span> image of <span className="font-medium text-ink-1">2560 × 1440 px</span>{" "}
          (JPG or WebP). Add a <span className="font-medium text-ink-1">9:16</span> one (1080 × 1920 px) to control what phones show. Leave
          it empty to show the product&rsquo;s opening screen.
        </p>
      </div>

      <ImagePicker
        title="Wide image (desktop & tablet)"
        hint="Best 16:9 · 2560 × 1440 px"
        spec={WIDE}
        src={value.src}
        focus={value.focus}
        onSrc={set("src")}
        onFocus={set("focus")}
      />

      <ImagePicker
        title="Phone image (optional)"
        hint="Best 9:16 · 1080 × 1920 px. Without one, phones crop the wide image around its focus point."
        spec={TALL}
        src={value.mobileSrc}
        onSrc={set("mobileSrc")}
      />

      <Previews image={value} />

      <div>
        <p className="mb-2 text-[13px] font-medium text-ash-3">Describe the image (for screen readers)</p>
        <input className={input} value={value.alt} onChange={(e) => set("alt")(e.target.value)} />
      </div>
    </div>
  );
}

/** A video by link, with a preview. (Uploading video files needs real file storage — it comes with Convex.) */
export function VideoField({ title, hint, src, onSrc }: { title: string; hint?: string; src: string; onSrc: (v: string) => void }) {
  return (
    <div>
      <p className="text-[13px] font-medium text-ash-3">{title}</p>
      <p className="mt-0.5 text-[12.5px] text-ash-2">
        {hint ?? "Paste a link to an MP4 or WebM file. It plays silently on a loop."} Uploading video files arrives with Convex.
      </p>
      <input
        className={`${input} mt-3`}
        placeholder="https://…/video.mp4"
        value={src}
        onChange={(e) => onSrc(e.target.value.trim())}
      />
      {src && (
        <video src={src} muted loop playsInline autoPlay className="mt-3 block max-h-[320px] w-full rounded-[8px] bg-black object-contain" />
      )}
    </div>
  );
}
