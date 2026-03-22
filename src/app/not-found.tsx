import "./globals.css";

import NextLink from "next/link";
import { Home } from "lucide-react";

import { Button } from "@/share/ui/button";

export default function NotFound404() {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased text-oregon-900">
        <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-16">
          <main className="w-full max-w-md text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-oregon-600/85">
              Not found
            </p>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-oregon-900 sm:text-[2rem] sm:leading-tight">
              404 — Page not found
            </h1>
            <p className="mt-4 text-pretty text-sm leading-relaxed text-oregon-700/78 sm:text-base">
              The page you are looking for does not exist.
            </p>
            <div className="mt-9 flex justify-center">
              <Button variant="default" size="lg" className="min-w-48" asChild>
                <NextLink href="/" className="gap-2">
                  <Home className="size-4 shrink-0" aria-hidden />
                  Go to Home
                </NextLink>
              </Button>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
