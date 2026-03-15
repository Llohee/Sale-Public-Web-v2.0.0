"use client";

import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/share/components/language-switcher";
import { GooeyText } from "@/share/components/gooey-text-morphing";
import { TypewriterText } from "@/share/components/typewriter-text";
import { Button } from "@/share/ui/button";
import { AnimatedThemeToggle } from "@/share/ui/animated-theme-toggle";
import { useRouter } from "@/i18n/navigation";
import { LandingIcon } from "@/share/icons";

export default function LandingPage() {
  const t = useTranslations("LandingPage");
  const router = useRouter();
  const headingTexts = t.raw("headingTexts") as string[];

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="flex w-full max-w-3xl flex-col items-center gap-4 px-4 py-8">
          {/* <LandingIcon className="size-52" /> */}
          <div className="flex flex-col items-center gap-2 text-center">
            <GooeyText
              texts={headingTexts}
              morphTime={1}
              cooldownTime={1.5}
              className="h-10 w-full sm:h-12"
              textClassName="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl"
            />
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
              <div className="flex items-center gap-2">
                <AnimatedThemeToggle />
                <LanguageSwitcher href="/" className="shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
