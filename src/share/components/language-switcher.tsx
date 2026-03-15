"use client";

import { ComponentProps } from "react";
import { useLocale, useTranslations } from "next-intl";

import { LOCALES_LIST_PLUS } from "@/constants/locales";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/share/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/share/ui/dropdown-menu";

type LanguageSwitcherProps = {
  href?: ComponentProps<typeof Link>["href"];
  className?: string;
};

export function LanguageSwitcher({ href, className }: LanguageSwitcherProps) {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const targetHref = href ?? pathname;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-700 shadow-sm outline-none transition-colors",
          "hover:bg-stone-50 data-[state=open]:bg-stone-50",
          className,
        )}
      >
        <span className="text-xs font-medium text-stone-500">{t("label")}</span>
        <span className="rounded-full bg-amber-600 px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
          {locale.toUpperCase()}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALES_LIST_PLUS.map((item) => {
          const isActive = item.key === locale;

          return (
            <DropdownMenuItem key={item.key} asChild>
              <Link
                href={targetHref}
                locale={item.key}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-sm px-1 py-0.5 text-xs",
                  isActive ? "text-amber-700" : "text-stone-600",
                )}
              >
                <span className="text-[11px] uppercase tracking-wide">
                  {item.key}
                </span>
                {isActive && (
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-amber-600"
                    aria-hidden="true"
                  />
                )}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
