"use client";

import { useEffect, useRef, useState } from "react";
import ProgressiveBlur from "@/components/fx/ProgressiveBlur";
import { Counter } from "@/components/ui/motion";
import type { Project } from "@/content/projects";

const CORNERS = [
  "left-0 top-0 border-l border-t",
  "right-0 top-0 border-r border-t",
  "bottom-0 left-0 border-b border-l",
  "bottom-0 right-0 border-b border-r",
];

/** The product's opening screen — shown until a screen recording is supplied. */
export function ProductPoster({
  product,
  stats,
  play,
}: {
  product: Project["product"];
  stats: Project["stats"];
  play: boolean;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#060303]">
      {/* slow push-in, like a camera move */}
      <div className="absolute inset-0 [animation:reel_26s_ease-in-out_infinite_alternate]">
        <div className="absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_40%,rgba(140,16,24,0.38),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(60%_50%_at_50%_40%,black,transparent)]" />
      </div>

      <div className="absolute inset-x-[5%] top-[12%] h-[54%] md:inset-x-[8%]">
        {CORNERS.map((c) => (
          <span key={c} className={`absolute h-7 w-7 border-signal/60 ${c}`} />
        ))}
        <span className="absolute left-0 top-1/2 h-28 w-[3px] -translate-y-1/2 bg-signal" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/45">{product.eyebrow}</p>
          <h2 className="mt-5 font-display text-[clamp(34px,5.2vw,78px)] font-bold leading-[1] tracking-[-0.035em]">
            <span className="text-white">{product.headline[0]}</span>
            <br />
            <span className="text-signal">{product.headline[1]}</span>
          </h2>
          <span className="mt-8 h-[2px] w-12 bg-signal" />
          <dl className="mt-10 flex divide-x divide-white/10">
            {stats.map((s, i) => (
              <div key={s.label} className="px-4 sm:px-7 md:px-10">
                <dd
                  className={`font-display text-[clamp(28px,3.2vw,46px)] font-bold leading-none tabular-nums tracking-[-0.03em] ${
                    i === 0 ? "text-signal" : "text-white"
                  }`}
                >
                  <Counter to={s.value} start={play} />
                </dd>
                <dt className="mt-2 text-[11px] text-white/45">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

/**
 * The welcome screen, sized to fill its parent: the video if one is set, else the welcome image
 * (any shape — it is cropped to fill, keeping its focus point in view; phones get the tall image
 * when there is one), else the product's opening screen. The bottom edge dissolves through a
 * progressive blur and a fade to black instead of ending on a hard line.
 */
export default function HeroMedia({ project, play }: { project: Project; play: boolean }) {
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const showVideo = Boolean(project.video) && !videoFailed;
  const image = project.heroImage;
  const showImage = !showVideo && Boolean(image?.src);

  // start the reel only once it has come out
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (play) v.play().catch(() => {});
    else v.pause();
  }, [play]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {showVideo ? (
        <video
          ref={videoRef}
          src={project.video}
          muted
          loop
          playsInline
          preload="auto"
          onError={() => setVideoFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : showImage ? (
        <picture className="absolute inset-0">
          {image.mobileSrc && <source media="(max-width: 767px)" srcSet={image.mobileSrc} />}
          {/* a plain <img>: CMS images can be any link or an uploaded file, so next/image can't know them ahead of time */}
          <img
            src={image.src}
            alt={image.alt}
            fetchPriority="high"
            className="h-full w-full object-cover"
            style={{ objectPosition: image.focus || "50% 50%" }}
          />
        </picture>
      ) : (
        <ProductPoster product={project.product} stats={project.stats} play={play} />
      )}

      {/* soft blend into the page: blur ramps up while the picture fades to black — no clouds */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[42%]">
        <ProgressiveBlur className="absolute inset-0" maxBlur={32} />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.25)_35%,rgba(0,0,0,0.7)_70%,#000_100%)]" />
      </div>
    </div>
  );
}
