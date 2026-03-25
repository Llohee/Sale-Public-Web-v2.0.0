"use client";

import { ComponentProps, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";

import { LOCALES_LIST_PLUS } from "@/constants/locales";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/share/lib/utils";
import { Button } from "@/share/ui/button";

type LanguageSwitcherProps = {
  href?: ComponentProps<typeof Link>["href"];
  className?: string;
};

export function LanguageSwitcher({ href, className }: LanguageSwitcherProps) {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const targetHref = href ?? pathname;
  const nextLocale = useMemo(() => {
    if (LOCALES_LIST_PLUS.length < 2) return locale;
    const currentIndex = LOCALES_LIST_PLUS.findIndex((item) => item.key === locale);
    const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % LOCALES_LIST_PLUS.length : 0;
    return LOCALES_LIST_PLUS[nextIndex].key;
  }, [locale]);

  return (
    <Button
      type="button"
      variant="chocolate-outline"
      size="icon-lg"
      className={cn("rounded-full shadow-sm", className)}
      onClick={() => {
        router.replace(targetHref as Parameters<typeof router.replace>[0], {
          locale: nextLocale,
        });
      }}
    >
      <span className="block text-xs leading-none font-semibold uppercase text-inherit">
        {locale.toUpperCase()}
      </span>
    </Button>
  );
}
