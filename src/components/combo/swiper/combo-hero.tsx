"use client";

import { Link } from "@/i18n/navigation";
import type { ComboDetail } from "@/services/combo/combo.schema";
import { Button } from "@/share/ui/button";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ImageOff } from "lucide-react";

type ComboHeroSlideProps = {
  combo: ComboDetail;
};

export function ComboHeroSlide({ combo }: ComboHeroSlideProps) {
  const t = useTranslations("combo");
  const [imageErrored, setImageErrored] = useState(false);
  const firstProductImage = combo.products[0]?.product.imageUrl?.trim() ?? "";
  const hasImage = !!firstProductImage;
  const imageAlt = useMemo(
    () => combo.name || t("banner.alt"),
    [combo.name, t],
  );

  const description = combo.description?.trim() ?? "";
  const detailHref = `/combo/${combo.id}`;

  return (
    <div className="relative flex h-[min(38vh,240px)] min-h-[200px] items-center sm:h-[min(42vh,320px)] sm:min-h-[260px] md:h-[380px] md:min-h-0 lg:h-[400px]">
      <div className="container mx-auto h-full max-md:px-0 px-4 sm:px-6">
        <div className="relative grid h-full md:grid-cols-2 md:items-center md:gap-8 lg:gap-12">
        <div
          className="relative h-full w-full min-h-0 overflow-hidden rounded-none shadow-none ring-0 max-md:w-screen max-md:max-w-none max-md:-translate-x-1/2 max-md:left-1/2 md:order-2 md:h-[calc(100%-24px)] md:rounded-2xl md:shadow-lg md:ring-1 md:ring-slate-200/90 md:ml-auto md:max-w-[360px] lg:max-w-[400px]"
        >
          {hasImage && !imageErrored ? (
            <Image
              src={firstProductImage}
              alt={imageAlt}
              fill
              className="object-cover object-center transition duration-300 max-md:scale-[1.01]"
              sizes="(max-width: 767px) 100vw, (max-width: 1024px) 360px, 400px"
              quality={85}
              priority={false}
              onError={() => setImageErrored(true)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-linear-to-br from-slate-100 to-slate-200 text-slate-500">
              <ImageOff className="size-12" />
              <span className="text-sm font-medium">{t("card.no_image")}</span>
            </div>
          )}

          <div
            className="pointer-events-none absolute inset-0 z-5 bg-linear-to-t from-black/80 via-black/35 to-black/25 md:hidden"
            aria-hidden
          />

          <Link
            href={detailHref}
            className="absolute inset-0 z-10 md:hidden"
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col gap-3 bg-transparent px-3 pb-7 pt-10 sm:px-4 sm:pb-8 sm:pt-12 md:hidden">
            <h2 className="text-xl font-bold leading-tight tracking-tight text-white drop-shadow-sm sm:text-2xl">
              {combo.name}
            </h2>
            {description ? (
              <p className="line-clamp-2 text-sm leading-snug text-white/95">
                {description}
              </p>
            ) : null}
            <Button
              asChild
              variant="default"
              size="lg"
              className="pointer-events-auto mt-0.5 w-fit min-w-34 shadow-md sm:min-w-36"
            >
              <Link href={detailHref}>{t("hero.cta")}</Link>
            </Button>
          </div>
        </div>

        <div className="hidden min-w-0 flex-col gap-4 md:order-1 md:flex md:max-w-xl md:gap-5 md:pt-1">
          <h2 className="text-2xl font-bold leading-tight tracking-tight text-slate-800 sm:text-3xl lg:text-4xl">
            {combo.name}
          </h2>
          {description ? (
            <p className="max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
              {description}
            </p>
          ) : null}
          <Button asChild variant="default" size="lg" className="shadow-md">
            <Link href={detailHref}>{t("hero.cta")}</Link>
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
}
