"use client";

import { useState } from "react";

export default function Tabs({
  tabs,
}: {
  tabs: { key: string; label: string; content: React.ReactNode }[];
}) {
  const [active, setActive] = useState(tabs[0]?.key);

  return (
    <div>
      <div className="flex flex-wrap gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key)}
            className={`rounded-t-lg px-4 py-2.5 text-sm font-semibold transition ${
              active === tab.key
                ? "border-b-2 border-accent text-accent"
                : "text-muted hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-5">{tabs.find((t) => t.key === active)?.content}</div>
    </div>
  );
}
