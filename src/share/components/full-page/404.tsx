"use client";

import Image from "next/image";
import { TypewriterText } from "@/share/components/typewriter-text";
import { Button } from "@/share/ui/button";
import Link from "next/link";
import { useState } from "react";

type NotFound404Props = {
  line1?: string;
  line2?: string;
  imageAlt?: string;
  homeLabel?: string;
};

export default function NotFound404({
  line1 = "Something went wrong while loading this page.",
  line2 = "Please try again or come back later.",
  imageAlt = "Coffee cup and intro message",
  homeLabel = "Home",
}: NotFound404Props) {
  const [isFirstLineDone, setIsFirstLineDone] = useState(false);

  return (
    <div className="min-h-dvh bg-[#D7A15B] px-6 py-10">
      <div className="mx-auto flex min-h-[calc(90dvh-5rem)] w-full max-w-sm flex-col items-center justify-center gap-4 text-center">
        <div className="flex w-full flex-col items-center gap-2">
          <div className="flex w-full justify-center">
            <Image
              src="/images/error.svg"
              alt={imageAlt}
              width={340}
              height={440}
              priority
              className="h-auto w-full max-w-[330px] object-contain"
            />
          </div>
          <div className="flex min-h-16 flex-col gap-2 text-center text-base leading-relaxed font-medium text-stone-900/90">
            <p>
              <TypewriterText
                text={line1}
                speed={25}
                cursorClassName="ml-0.5"
                onComplete={() => setIsFirstLineDone(true)}
              />
            </p>
            <p>
              {isFirstLineDone ? (
                <TypewriterText text={line2} speed={25} cursorClassName="ml-0.5" />
              ) : null}
            </p>
          </div>
        </div>
        <Button type="button" variant="chocolate" size="lg" className="w-full" asChild>
          <Link href="/">{homeLabel}</Link>
        </Button>
      </div>
    </div>
  );
}
