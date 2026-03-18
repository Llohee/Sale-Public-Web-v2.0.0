"use client";

import { CartProvider } from "@/providers/cart-provider";
import Header from "@/share/layout/header";

export function EndUserLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="relative flex h-screen flex-col">
        <Header />
        <div className="mt-[82px] min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </div>
    </CartProvider>
  );
}
