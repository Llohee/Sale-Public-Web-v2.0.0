"use client";

import { ComponentProps } from "react";
import { useLocale, useTranslations } from "next-intl";

import { LOCALES_LIST_PLUS } from "@/constants/locales";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/share/lib/utils";
import { buttonVariants } from "@/share/ui/button";
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
          buttonVariants({
            variant: "chocolate-outline",
            size: "icon-lg",
          }),
          "rounded-full shadow-sm data-[state=open]:bg-oregon-100 dark:data-[state=open]:bg-oregon-900/40",
          className,
        )}
        aria-label={t("label")}
      >
        <span className="text-[11px] font-semibold uppercase tracking-wide text-inherit">
          {locale.toUpperCase()}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-28 rounded-2xl">
        {LOCALES_LIST_PLUS.map((item) => {
          const isActive = item.key === locale;

          return (
            <DropdownMenuItem key={item.key} asChild>
              <Link
                href={targetHref}
                locale={item.key}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-xl px-2 py-1.5 text-xs uppercase tracking-wide",
                  isActive
                    ? "bg-oregon-50 font-semibold text-oregon-700"
                    : "text-stone-600",
                )}
              >
                <span className="text-[11px]">{item.key}</span>
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
