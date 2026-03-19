"use client";

import { Link, useRouter } from "@/i18n/navigation";
import { useCart } from "@/providers/cart-provider";
import { Button } from "@/share/ui/button";
import { ChevronLeft, Receipt } from "lucide-react";
import { useTranslations } from "next-intl";
import OrderForm from "./create";
import OrderListItem from "./list_item";

export function OrderWrapper() {
  const router = useRouter();
  const t = useTranslations("order");

  const { items } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-5 px-4 py-16 text-center">
        <div className="rounded-full bg-oregon-50 p-4 text-oregon-700 shadow-sm ring-1 ring-oregon-700/10">
          <Receipt className="size-7" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-oregon-900">
            {t("empty.title")}
          </h1>
          <p className="text-center text-muted-foreground">
            {t("empty.description")}
          </p>
        </div>
        <p className="max-w-md text-sm text-oregon-700/70">{t("empty.hint")}</p>
        <Link href="/product">
          <Button variant="dive" size="lg" className="rounded-full px-8">
            {t("empty.browse_products")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col gap-8 pt-28">
      <div className="relative flex flex-col flex-1 items-center justify-center gap-8 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="hidden md:inline-flex absolute left-0 top-0"
        >
          <ChevronLeft className="size-5" />
          <span className="text-sm font-semibold">{t("btn.back")}</span>
        </Button>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-extrabold text-oregon-900 sm:text-3xl">
            {t("title")}
          </h1>
          <p className="text-sm text-oregon-700/70">{t("subtitle")}</p>
        </div>
      </div>

      <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
          <OrderListItem />
        </div>
        <div className="relative col-span-12 lg:col-span-4 lg:sticky lg:top-28 lg:z-10 lg:self-start">
          <OrderForm />
        </div>
      </div>
    </div>
  );
}
