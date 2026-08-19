type CategoryDatum = { label: string; value: number; color: string };

export default function CategoryBreakdown({ data }: { data: CategoryDatum[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (data.length === 0 || total === 0) return null;

  return (
    <div className="space-y-4">
      {data.map((d) => {
        const pct = Math.round((d.value / total) * 100);
        return (
          <div key={d.label} className="flex items-center gap-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: d.color }}
            >
              {d.value}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-semibold text-foreground">{d.label}</span>
                <span className="shrink-0 text-xs text-muted">{pct}%</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: d.color }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
