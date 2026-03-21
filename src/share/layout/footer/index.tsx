"use client";

import { headerTabs } from "@/constants/layout";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useCart } from "@/providers/cart-provider";
import { Dock, DockIcon, DockItem, DockLabel } from "@/share/ui/dock";

export function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const { items } = useCart();

  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 md:hidden">
      <Dock>
        {headerTabs.map((tab) => {
          const isActive =
            pathname === `/${tab.value}` ||
            pathname.startsWith(`/${tab.value}/`);
          return (
            <DockItem
              key={tab.value}
              onClick={() => router.push(`/${tab.value}`)}
              active={isActive}
            >
              <DockIcon>
                <span
                  className={`relative inline-flex ${isActive ? "text-white [&>svg]:size-6" : ""}`}
                >
                  {tab.icon}
                  {tab.value === "order" && items.length > 0 && (
                    <span className="absolute -top-2 -right-2 rounded-full bg-oregon-50 px-1 text-[10px] font-semibold text-oregon-900">
                      {items.length}
                    </span>
                  )}
                </span>
              </DockIcon>
              <DockLabel>{tab.label}</DockLabel>
            </DockItem>
          );
        })}
      </Dock>
    </footer>
  );
}
