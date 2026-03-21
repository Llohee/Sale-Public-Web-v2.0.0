import LandingPage from "@/components/landing-page";
import { PaymentWrapper } from "@/components/payment/view";
import { PAYMENT_STATUS } from "@/constants/payment";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("layout");
  return {
    title: t("header.landing_page"),
    description: "",
  };
}

export default async function EndUserPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{
    status: (typeof PAYMENT_STATUS)[number];
    orderCode: string;
    message: string;
    amount: string;
    currency: string;
  }>;
}>) {
  const { status, orderCode, message, amount, currency } = await searchParams;

  if (status && orderCode && message && amount && currency) {
    return (
      <PaymentWrapper
        status={status}
        orderCode={orderCode}
        message={message}
        amount={amount}
        currency={currency}
      />
    );
  }

  return <LandingPage />;
}
