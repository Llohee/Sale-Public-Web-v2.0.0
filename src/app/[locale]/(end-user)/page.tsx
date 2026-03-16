import LandingPage from "@/components/landing-page";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("layout");
  return {
    title: t("header.landing_page"),
    description: "",
  };
}

export default function EndUserPage() {
  return <LandingPage />;
}
