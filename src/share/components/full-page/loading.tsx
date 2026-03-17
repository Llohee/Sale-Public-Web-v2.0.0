"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/share/lib/utils";

interface LoadingPageProps {
  message?: string;
  className?: string;
}

export function LoadingPage({ className }: LoadingPageProps) {
  const t = useTranslations("LoadingPage");

  return (
    <div
      className={cn(
        "flex min-h-screen flex-col items-center justify-center bg-amber-50 text-foreground",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <div className="-mb-5 h-28 w-36">
          <svg
            viewBox="0 0 120 120"
            className="h-full w-full text-amber-900"
            aria-hidden="true"
          >
            <defs>
              <clipPath id="coffee-cup-clip">
                <path
                  d="M30 30
                     H72
                     Q84 30 84 42
                     V66
                     Q84 84 66 84
                     H36
                     Q20 84 20 66
                     V42
                     Q20 30 30 30
                     Z"
                />
              </clipPath>
            </defs>
            <style>{`
              @keyframes coffeeSurface {
                0% { transform: translateX(0px); }
                50% { transform: translateX(-6px); }
                100% { transform: translateX(0px); }
              }
              .coffee-surface {
                animation: coffeeSurface 1.8s ease-in-out infinite;
              }
            `}</style>
            <g>
              <g clipPath="url(#coffee-cup-clip)">
                <path
                  d="M19 56
                     C28 51, 38 58, 48 55
                     C58 52, 67 57, 84 54
                     L84 86
                     L19 86
                     Z"
                  fill="#8b4513"
                  opacity="0.95"
                />
                <g className="coffee-surface">
                  <path
                    d="M14 52
                       C24 47, 34 54, 44 51
                       C54 48, 64 55, 74 50
                       C84 45, 92 53, 102 49
                       L102 58
                       C90 62, 80 56, 70 59
                       C60 62, 50 56, 40 59
                       C30 62, 22 57, 14 60
                       Z"
                    fill="#b77945"
                    opacity="0.85"
                  />
                </g>
              </g>
              <path
                d="M30 30
                   H72
                   Q84 30 84 42
                   V66
                   Q84 84 66 84
                   H36
                   Q20 84 20 66
                   V42
                   Q20 30 30 30
                   Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M84 40
                   H92
                   Q102 40 102 50
                   V54
                   Q102 64 92 64
                   H84"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M86 44
                   H91
                   Q97 44 97 50
                   V54
                   Q97 60 91 60
                   H86"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.55"
              />
            </g>
          </svg>
        </div>

        <div className="flex items-center gap-1 text-amber-900">
          <span className="text-base font-semibold tracking-[0.2em]">
            {t("loading")}
          </span>
          <span className="flex gap-1">
            <span className="h-2 w-2 animate-bounce rounded-full bg-amber-900 [animation-duration:0.5s] [animation-delay:0ms]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-amber-900 [animation-duration:0.5s] [animation-delay:150ms]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-amber-900 [animation-duration:0.5s] [animation-delay:300ms]" />
          </span>
        </div>
      </div>
    </div>
  );
}
