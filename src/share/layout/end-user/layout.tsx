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
        <div className="mt-16 flex-1 overflow-hidden">{children}</div>
      </div>
    </CartProvider>
  );
}
