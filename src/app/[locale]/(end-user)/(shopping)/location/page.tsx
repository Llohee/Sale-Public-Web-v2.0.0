import { LocationWrapper } from "@/components/location";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("layout");
  return {
    title: t("header.location") ?? "Location",
    description: "Store locations and directions",
  };
}

export default function LocationPage() {
  return <LocationWrapper />;
}
