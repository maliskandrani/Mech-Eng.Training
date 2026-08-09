import Link from "next/link";
import { getTrainers } from "@/lib/queries";
import { arabicCount } from "@/lib/utils";

export default async function TrainersPage() {
  const trainers = await getTrainers();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold text-foreground">المدربون</h1>
      <p className="mt-2 text-muted">تعرّف على فريق المدربين الذين يقدمون الدورات في الأكاديمية.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {trainers.map((trainer) => (
          <Link
            key={trainer.id}
            href={`/trainers/${trainer.id}`}
            className="flex flex-col items-center rounded-2xl border border-border bg-background-card p-6 text-center transition hover:border-accent/60"
          >
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full gold-gradient text-2xl font-bold text-accent-foreground">
              {trainer.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={trainer.avatarUrl} alt={trainer.name} className="h-full w-full object-cover" />
              ) : (
                trainer.name.charAt(0)
              )}
            </div>
            <h3 className="mt-4 font-bold text-foreground">{trainer.name}</h3>
            <p className="mt-1 text-sm text-muted">{trainer.title ?? "مدرب معتمد"}</p>
            <p className="mt-2 text-xs text-accent-soft">
              {arabicCount(trainer._count.coursesTaught, "دورة", "دورتان", "دورات")}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
