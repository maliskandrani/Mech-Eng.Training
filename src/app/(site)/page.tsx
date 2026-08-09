import Link from "next/link";
import { getPublishedCourses, getTrainers } from "@/lib/queries";
import CourseCard from "@/components/site/CourseCard";
import { arabicCount } from "@/lib/utils";

const FEATURES = [
  { icon: "🎓", title: "محتوى علمي متكامل", desc: "من الأساسيات النظرية إلى التطبيقات العملية والمشاريع الحقيقية." },
  { icon: "🛠️", title: "تطبيقات عملية مبسطة", desc: "حسابات يدوية، برمجيات هندسية، ونمذجة ثلاثية الأبعاد." },
  { icon: "🎯", title: "مهارات مؤهِّلة لسوق العمل", desc: "خبرة ميدانية حقيقية في قطاع النفط والغاز والبتروكيماويات." },
  { icon: "📈", title: "من المبتدئ إلى الاحترافي", desc: "مسار تدريبي متدرج يواكب تطور مستواك خطوة بخطوة." },
];

export default async function HomePage() {
  const [courses, trainers] = await Promise.all([getPublishedCourses(), getTrainers()]);
  const featured = courses.slice(0, 6);

  return (
    <div>
      <section className="section-glow relative overflow-hidden border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-4 py-1 text-sm text-accent-soft">
              أكاديمية تدريب هندسي متخصصة
            </span>
            <h1 className="mt-5 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl lg:text-5xl">
              اخترق حاجز التردد، <span className="gold-text-gradient">والخبرة تأتي مع الوقت</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
              دورات تدريبية متخصصة في هندسة الأنابيب والمعدات الميكانيكية الثابتة والدوارة، التكييف
              المركزي، وبرمجيات التصميم الهندسي — يقدمها المهندس محمد رجب بخبرة عملية حقيقية في قطاع
              النفط والغاز والبتروكيماويات.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/courses"
                className="rounded-xl gold-gradient px-6 py-3 font-bold text-accent-foreground transition hover:opacity-90"
              >
                استكشف الدورات
              </Link>
              <Link
                href="/register"
                className="rounded-xl border border-border px-6 py-3 font-semibold text-foreground transition hover:border-accent hover:text-accent"
              >
                سجّل كمتدرب
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-background-card p-5">
                <div className="text-2xl">{f.icon}</div>
                <h3 className="mt-3 font-bold text-foreground">{f.title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">الدورات التدريبية</h2>
            <p className="mt-1 text-muted">الدورة الشاملة الحالية، والمزيد قريبًا.</p>
          </div>
          <Link href="/courses" className="text-sm font-semibold text-accent hover:underline">
            عرض جميع الدورات ←
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-muted">لا توجد دورات منشورة حاليًا.</p>
        )}
      </section>

      {trainers.length > 0 && (
        <section className="border-t border-border bg-background-elevated">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-2xl font-bold text-foreground">مدربونا</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {trainers.map((trainer) => (
                <Link
                  key={trainer.id}
                  href={`/trainers/${trainer.id}`}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-background-card p-5 transition hover:border-accent/60"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full gold-gradient text-xl font-bold text-accent-foreground">
                    {trainer.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={trainer.avatarUrl} alt={trainer.name} className="h-full w-full object-cover" />
                    ) : (
                      trainer.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{trainer.name}</h3>
                    <p className="text-sm text-muted">{trainer.title ?? "مدرب معتمد"}</p>
                    <p className="mt-1 text-xs text-accent-soft">
                      {arabicCount(trainer._count.coursesTaught, "دورة", "دورتان", "دورات")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
