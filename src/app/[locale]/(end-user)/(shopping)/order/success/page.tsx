import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PaymentSuccessView } from "@/components/order/payment_success/success";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("order.success");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    amount?: string;
    paidAt?: string;
    paymentMethod?: string;
    location?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <PaymentSuccessView
      amount={params.amount}
      paidAt={params.paidAt}
      paymentMethod={params.paymentMethod}
      location={params.location}
    />
  );
}
