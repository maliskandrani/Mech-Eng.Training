type BarDatum = { label: string; value: number };

export default function BarChart({
  data,
  color = "#d4af37",
  valueFormatter,
}: {
  data: BarDatum[];
  color?: string;
  valueFormatter?: (v: number) => string;
}) {
  if (data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.label}>
          <div className="mb-1 flex items-center justify-between gap-3 text-xs">
            <span className="font-medium text-foreground">{d.label}</span>
            <span className="text-muted">{valueFormatter ? valueFormatter(d.value) : d.value}</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(d.value / max) * 100}%`, backgroundColor: color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
