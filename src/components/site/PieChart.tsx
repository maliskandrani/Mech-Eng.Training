type PieDatum = { label: string; value: number; color: string };

export default function PieChart({ data }: { data: PieDatum[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (data.length === 0 || total === 0) return null;

  let acc = 0;
  const stops = data
    .map((d) => {
      const start = (acc / total) * 360;
      acc += d.value;
      const end = (acc / total) * 360;
      return `${d.color} ${start}deg ${end}deg`;
    })
    .join(", ");

  return (
    <div className="flex flex-wrap items-center gap-6">
      <div
        className="relative h-32 w-32 shrink-0 rounded-full"
        style={{ background: `conic-gradient(${stops})` }}
      >
        <div className="absolute inset-3 flex items-center justify-center rounded-full bg-background-card text-sm font-bold text-foreground">
          {total}
        </div>
      </div>
      <ul className="space-y-1.5 text-sm">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-foreground">{d.label}</span>
            <span className="text-muted">({d.value})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
