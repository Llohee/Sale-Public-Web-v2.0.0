"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/share/components/language-switcher";
import { TypewriterText } from "@/share/components/typewriter-text";
import { Button } from "@/share/ui/button";
import { AnimatedThemeToggle } from "@/share/ui/animated-theme-toggle";
import { useRouter } from "@/i18n/navigation";

export default function LandingPage() {
  const t = useTranslations("LandingPage");
  const router = useRouter();
  const headingTexts = t.raw("headingTexts") as string[];

  return (
    <div className="relative flex h-screen flex-col bg-background text-foreground">
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="flex w-full max-w-3xl flex-col items-center gap-5 px-4 py-10">
          <div className="absolute right-4 top-4 flex items-center gap-2">
            <AnimatedThemeToggle />
            <LanguageSwitcher href="/" className="shrink-0" />
          </div>
          <Image
            src="/images/icon-langdingpage.svg"
            alt="App logo"
            width={350}
            height={350}
            priority
          />
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="w-full">
              <p className="mx-auto text-3xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-5xl">
                {headingTexts[0]}
              </p>
            </div>
            <div className="flex flex-col items-center gap-6">
              <p className="mx-auto max-w-xl text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
                <TypewriterText
                  text={t("description")}
                  speed={25}
                  cursorClassName="ml-0.5"
                />
              </p>
              <Button
                variant="dive"
                size="xl"
                className="px-10 text-sm font-medium tracking-wide"
                onClick={() => router.push("/product")}
              >
                {t("continue")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
