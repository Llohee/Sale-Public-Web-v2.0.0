"use client";

import { ComboDetailView } from "@/components/combo/detail/view";
import { useGetComboById } from "@/services/combo/combo.query-options";
import { notFound } from "next/navigation";
import { LoadingPage } from "@/share/components/full-page/loading";

export function ComboDetailPageClient({ comboId }: { comboId: string }) {
  const { data, isLoading, isError } = useGetComboById(comboId);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingPage />
      </div>
    );
  }

  if (isError || !data?.data) {
    notFound();
  }

  return <ComboDetailView combo={data.data} />;
}
