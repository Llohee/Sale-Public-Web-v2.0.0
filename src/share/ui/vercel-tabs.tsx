"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/share/lib/utils";
import { buttonVariants } from "@/share/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/share/ui/tabs";
import { useFilter } from "@/providers/filter-provider";

interface TabData {
  label: string;
  value: string;
  content: React.ReactNode;
}

interface VercelTabsProps {
  tabs: TabData[];
  defaultTab?: string;
  className?: string;
}

export function VercelTabs({ tabs, defaultTab, className }: VercelTabsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.value);
  const [hoverStyle, setHoverStyle] = useState({});
  const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { updateParam } = useFilter();
  const activeIndex = tabs.findIndex((tab) => tab.value === activeTab);

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
    <Tabs
      defaultValue={activeTab}
      onValueChange={setActiveTab}
      className={cn("flex w-full flex-col items-start gap-4", className)}
    >
      <TabsList className="relative h-auto w-full max-w-max select-none gap-4 bg-transparent p-0">
        {/* Hover Highlight */}
        <div
          className="hidden"
          style={{
            ...hoverStyle,
            opacity: hoveredIndex !== null ? 1 : 0,
          }}
        />

        {/* Active Indicator */}
        <div
          className="hidden"
          style={activeStyle}
        />

        {tabs.map((tab, index) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            className={cn(
              buttonVariants({
                variant:
                  activeTab === tab.value ? "chocolate" : "chocolate-outline",
                size: "lg",
              }),
              "z-10 h-11 rounded-full px-6 text-base focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:bg-oregon-700 data-[state=active]:text-white data-[state=active]:border-oregon-700 data-[state=active]:shadow-[0_8px_18px_rgba(120,53,15,0.18)]",
              activeTab === tab.value
                ? "border-oregon-700 text-white hover:text-white"
                : "border-oregon-700/40 bg-white text-oregon-700 hover:bg-oregon-50 hover:text-oregon-700",
            )}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => updateParam('category', tab.value)}
          >
            <span className="whitespace-nowrap text-base font-medium leading-none">
              {tab.label}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Content Area */}
      <div className="w-full px-0">
        {tabs.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="fade-in-50 w-full animate-in duration-500"
          >
            {tab.content}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}
