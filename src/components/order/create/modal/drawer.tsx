"use client";

import type { ReactNode } from "react";
import { Button } from "@/share/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/share/ui/drawer";

export type OrderCheckoutDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  confirmDisabled: boolean;
  confirmLabel: string;
  onCheckout: () => void;
  children: ReactNode;
};

export function OrderCheckoutDrawer({
  open,
  onOpenChange,
  title,
  confirmDisabled,
  confirmLabel,
  onCheckout,
  children,
}: OrderCheckoutDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
      <DrawerContent className="rounded-t-3xl bg-background before:border-0">
        <DrawerHeader className="space-y-0 text-left md:text-left">
          <DrawerTitle className="text-left text-xl font-semibold">
            {title}
          </DrawerTitle>
        </DrawerHeader>
        <div className="max-h-[min(60vh,calc(100dvh-12rem))] overflow-y-auto px-4 pb-2">
          {children}
        </div>
        <DrawerFooter className="pt-2">
          <Button
            type="button"
            variant="default"
            size="lg"
            className="w-full"
            disabled={confirmDisabled}
            onClick={onCheckout}
          >
            {confirmLabel}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
