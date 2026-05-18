"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";

type Tab = { value: string; label: string };

type Props = {
  tabs: Tab[];
  defaultValue?: string;
  children?: React.ReactNode;
};

export function Tabs({ tabs, defaultValue, children }: Props) {
  return (
    <TabsPrimitive.Root defaultValue={defaultValue ?? tabs[0]?.value}>
      <TabsPrimitive.List className="relative flex border-b border-ink/15">
        {tabs.map((tab) => (
          <TabsPrimitive.Trigger
            key={tab.value}
            value={tab.value}
            className="px-5 pb-3 pt-1 text-sm text-ink/45 font-medium cursor-pointer
              data-[state=active]:text-ink data-[state=active]:font-black
              relative focus:outline-none transition-colors
              after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5
              after:bg-terracotta after:scale-x-0 data-[state=active]:after:scale-x-100
              after:transition-transform after:origin-left"
          >
            {tab.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {children}
    </TabsPrimitive.Root>
  );
}
