import { OrderWrapper } from "@/components/order";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("layout");
  return {
    title: t("header.order") ?? "Order",
    description: "Đơn hàng của bạn",
  };
}

export default function OrderPage() {
  return <OrderWrapper />;
}
