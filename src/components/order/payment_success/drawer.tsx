"use client";

import { Button } from "@/share/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/share/ui/drawer";
import { useTranslations } from "next-intl";

interface PaymentSuccessOrderDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function PaymentSuccessOrderDrawer({
  open,
  onOpenChange,
  children,
}: PaymentSuccessOrderDrawerProps) {
  const t = useTranslations("order.success");

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
      <DrawerContent className="rounded-t-3xl bg-background">
        <DrawerHeader>
          <DrawerTitle className="text-center text-2xl font-extrabold text-oregon-900">
            {t("review_title")}
          </DrawerTitle>
          <p className="text-center text-sm text-oregon-700/70">
            {t("review_description")}
          </p>
        </DrawerHeader>
        <div className="max-h-[70vh] overflow-y-auto px-4 pb-2">{children}</div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button
              type="button"
              variant="chocolate-outline"
              size="lg"
              className="w-full rounded-full"
            >
              {t("close")}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
