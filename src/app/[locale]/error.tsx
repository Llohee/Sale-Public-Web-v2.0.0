"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

type Props = {
  error: Error;
  reset(): void;
};

export default function ErrorPage({ error, reset }: Props) {
  const t = useTranslations("common");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      {t.rich("error.description", {
        p: (chunks) => <p className="mt-4">{chunks}</p>,
        retry: (chunks) => (
          <button
            className="text-white underline underline-offset-2"
            onClick={reset}
            type="button"
          >
            {chunks}
          </button>
        ),
      })}
    </div>
  );
}
