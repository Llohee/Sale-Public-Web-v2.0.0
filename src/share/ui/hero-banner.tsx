"use client";

import { cn } from "@/share/lib/utils";
import Image from "next/image";

export type HeroBannerProps = {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  eyebrow?: string;
  className?: string;
};

export function HeroBanner({
  src,
  alt,
  title,
  subtitle,
  eyebrow,
  className,
}: HeroBannerProps) {
  return (
    <div
      className={cn(
        "relative flex h-[min(38vh,240px)] min-h-[200px] shrink-0 items-center justify-center overflow-hidden sm:h-[min(42vh,320px)] sm:min-h-[260px] md:h-[380px] md:min-h-0 lg:h-[400px]",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 backdrop-blur-xs bg-linear-to-t from-oregon-900/70 via-oregon-900/30 to-amber-50/0" />
      <div className="container relative mx-auto px-4 py-6 sm:py-10 md:py-12 lg:py-14">
        <div className="flex flex-col gap-2 sm:gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            {eyebrow ? (
              <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-50/80 sm:text-xs">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="text-2xl font-extrabold tracking-tight text-amber-50 sm:text-4xl md:text-5xl">
              {title}
            </h1>
            <p className="mt-1 text-xs text-amber-50/90 sm:mt-2 sm:text-sm md:text-base">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
