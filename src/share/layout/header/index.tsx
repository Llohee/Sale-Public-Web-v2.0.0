"use client";

import { Tabs, TabsList, TabsTrigger } from "@/share/ui/tabs";
import { useState, useRef, useEffect } from "react";
import { headerTabs } from "@/constants/layout";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useCart } from "@/providers/cart-provider";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { items } = useCart();
  const tabFromPath =
    headerTabs.find(
      (tab) => pathname === `/${tab.value}` || pathname.startsWith(`/${tab.value}/`),
    )?.value ?? "home";
  const [activeTab, setActiveTab] = useState(tabFromPath);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoverStyle, setHoverStyle] = useState({});
  const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    setActiveTab(tabFromPath);
  }, [tabFromPath]);

  const activeIndex = headerTabs.findIndex(
    (tab: { value: string }) => tab.value === activeTab,
  );

  useEffect(() => {
    if (hoveredIndex !== null) {
      const hoveredElement = tabRefs.current[hoveredIndex];
      if (hoveredElement) {
        const { offsetLeft, offsetWidth } = hoveredElement;
        setHoverStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    }
  }, [hoveredIndex]);

  useEffect(() => {
    const activeElement = tabRefs.current[activeIndex];
    if (activeElement) {
      const { offsetLeft, offsetWidth } = activeElement;
      setActiveStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
      });
    }
  }, [activeIndex]);

  useEffect(() => {
    requestAnimationFrame(() => {
      const activeElement = tabRefs.current[activeIndex];
      if (activeElement) {
        const { offsetLeft, offsetWidth } = activeElement;
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    });
  }, [activeIndex]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent!">
      <div className="container mx-auto py-4 flex items-center justify-between ">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex w-full flex-col items-center py-2 bg-oregon-700/85 backdrop-blur-sm rounded-xl shadow-md border border-oregon-50"
        >
          <TabsList className="relative h-8! select-none gap-[6px] bg-transparent p-0">
            <div
              className="absolute top-0 left-0 flex h-8 items-center rounded-[6px] bg-oregon-50/50 transition-all duration-300 ease-out dark:bg-[#ffffff1a]"
              style={{
                ...hoverStyle,
                opacity: hoveredIndex !== null ? 1 : 0,
              }}
            />
            <div
              className="absolute bottom-[-6px] h-[2px] bg-oregon-50 transition-all duration-300 ease-out dark:bg-black"
              style={activeStyle}
            />
            {headerTabs.map(
              (
                tab: { label: string; value: string; icon: React.ReactNode },
                index: number,
              ) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  className={`z-10 h-[30px] text-white cursor-pointer rounded-md border-0 bg-transparent px-3 py-2 outline-none transition-colors duration-300 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none ${
                    activeTab === tab.value
                      ? "text-oregon-50 dark:text-white"
                      : "text-oregon-50 dark:text-[#ffffff99]"
                  }`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => router.push(`/${tab.value}`)}
                >
                  <span className="whitespace-nowrap font-medium text-sm leading-5 relative">
                    {tab.icon}
                    {tab.value === "order" && (
                      <span className="absolute -top-2 -right-2 bg-oregon-50 text-oregon-900 rounded-full px-1 text-xs">
                        {items.length}
                      </span>
                    )}
                  </span>
                  <span className="whitespace-nowrap font-medium text-sm leading-5">
                    {tab.label}
                  </span>
                </TabsTrigger>
              ),
            )}
          </TabsList>
        </Tabs>
      </div>
    </header>
  );
}
