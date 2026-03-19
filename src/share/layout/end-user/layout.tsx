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
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-24 md:pb-0">
          {children}
        </div>
      </div>
    </CartProvider>
  );
}
