"use client";

import { CartProvider } from "@/providers/cart-provider";
import { Footer } from "@/share/layout/footer";
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
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto pb-24 md:pb-0">
          <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col">
            {children}
          </div>
        </div>
        <Footer />
      </div>
    </CartProvider>
  );
}
