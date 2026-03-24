"use client";

import { headerTabs } from "@/constants/layout";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useCart } from "@/providers/cart-provider";
import { cn } from "@/share/lib/utils";
import { Dock, DockIcon, DockItem, DockLabel } from "@/share/ui/dock";

export function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems } = useCart();

  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 md:hidden">
      <div className="container mx-auto py-4 flex items-center justify-center ">
        <div className="flex gap-2 items-center justify-between p-1 rounded-full bg-oregon-800/85 backdrop-blur-sm shadow-xl">
          {headerTabs.map((tab) => (
            <div
              key={tab.value}
              onClick={() => router.push(`/${tab.value}`)}
              className={cn(
                "flex items-center justify-center p-3 text-white [&>svg]:size-6",
                tab.value === pathname.split("/")[1] &&
                  "bg-white text-oregon-700 rounded-full [&_svg]:stroke-[2.5]",
              )}
            >
              <span className="whitespace-nowrap font-medium text-sm leading-5 relative">
                {tab.icon}
                {tab.value === "order" && totalItems > 0 && (
                  <span
                    className={cn(
                      "absolute flex items-center justify-center w-2 h-2 -top-0.5 -right-1.5 rounded-full text-xs",
                      tab.value === pathname.split("/")[1]
                        ? "bg-oregon-700"
                        : "bg-white",
                    )}
                  />
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
