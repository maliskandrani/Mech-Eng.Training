"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/lib/actions/auth-actions";

type Trainer = { id: string; name: string };
type Category = { id: string; name: string };

type InitialCourse = {
  title: string;
  subtitle: string | null;
  description: string | null;
  price: number;
  level: string;
  categoryId: string | null;
  trainerId: string;
  introVideoUrl: string | null;
};

const CURRENCY_LABELS: Record<string, string> = {
  LYD: "د.ل",
  EGP: "ج.م",
  USD: "$",
};

export default function CourseForm({
  action,
  trainers,
  categories,
  initial,
  showTrainerSelect,
  currency = "LYD",
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  trainers: Trainer[];
  categories: Category[];
  initial?: InitialCourse;
  currency?: string;
  showTrainerSelect: boolean;
}) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    async (_prev, formData) => action(formData),
    null
  );

  return (
    <form action={formAction} className="space-y-5 rounded-2xl border border-border bg-background-card p-6">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted">عنوان الدورة</label>
        <input
          name="title"
          required
          defaultValue={initial?.title}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted">وصف مختصر (Subtitle)</label>
        <input
          name="subtitle"
          defaultValue={initial?.subtitle ?? ""}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted">الوصف التفصيلي</label>
        <textarea
          name="description"
          rows={5}
          defaultValue={initial?.description ?? ""}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-muted">
            السعر ({CURRENCY_LABELS[currency] ?? currency})
          </label>
          <input
            name="price"
            type="number"
            min={0}
            step="0.01"
            defaultValue={initial?.price ?? 0}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-muted">المستوى</label>
          <select
            name="level"
            defaultValue={initial?.level ?? "BEGINNER"}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
          >
            <option value="BEGINNER">مبتدئ</option>
            <option value="INTERMEDIATE">متوسط</option>
            <option value="ADVANCED">متقدم</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-muted">التصنيف</label>
          <select
            name="categoryId"
            defaultValue={initial?.categoryId ?? ""}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
          >
            <option value="">بدون تصنيف</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {showTrainerSelect && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-muted">المدرب</label>
            <select
              name="trainerId"
              required
              defaultValue={initial?.trainerId}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
            >
              {trainers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted">
          رابط الفيديو التقديمي (YouTube / Vimeo / رابط ملف مباشر)
        </label>
        <input
          name="introVideoUrl"
          defaultValue={initial?.introVideoUrl ?? ""}
          placeholder="https://youtube.com/watch?v=..."
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted">صورة الغلاف (Poster)</label>
        <input
          name="poster"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
        />
        <p className="mt-1.5 text-xs text-muted">
          تُعرض الصورة كاملة دون أي قص في كل الصفحات، بحجم مصغّر ومناسب لكل مكان تلقائيًا.
        </p>
      </div>

      {state && !state.ok && (
        <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p className="rounded-lg border border-green-400/30 bg-green-400/10 px-4 py-2 text-sm text-green-300">
          تم الحفظ بنجاح.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-xl gold-gradient px-6 py-2.5 font-bold text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "جاري الحفظ..." : "حفظ"}
      </button>
    </form>
  );
}
