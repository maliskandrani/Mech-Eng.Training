import Image from "next/image";
import { getSiteSettings, getStoryImages } from "@/lib/queries";
import { updateLogo, addStoryImage, deleteStoryImage, updateCurrency } from "@/lib/actions/site-actions";
import LogoUploadForm from "@/components/dashboard/LogoUploadForm";
import CurrencyForm from "@/components/dashboard/CurrencyForm";
import StoryImageForm from "@/components/dashboard/StoryImageForm";
import { ConfirmDeleteButton } from "@/components/dashboard/ActionButtons";
import Logo from "@/components/site/Logo";

export default async function AdminSettingsPage() {
  const [settings, storyImages] = await Promise.all([getSiteSettings(), getStoryImages()]);

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">إعدادات الموقع</h1>
        <p className="mt-1 text-muted">شعار الأكاديمية، العملة الرئيسية، وصور القصة في الصفحة الرئيسية.</p>
      </div>

      <section className="rounded-2xl border border-border bg-background-card p-6">
        <h2 className="font-bold text-foreground">شعار الأكاديمية</h2>
        <p className="mt-1 text-sm text-muted">يظهر في الهيدر والفوتر ولوحة التحكم بجميع الصفحات.</p>
        <div className="mt-4 flex items-center gap-4">
          <Logo logoUrl={settings?.logoUrl} size={56} />
          <div className="flex-1">
            <LogoUploadForm action={updateLogo} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-background-card p-6">
        <h2 className="font-bold text-foreground">العملة الرئيسية</h2>
        <p className="mt-1 text-sm text-muted">تُستخدم في عرض أسعار جميع الدورات على الموقع ولوحة التحكم.</p>
        <div className="mt-4">
          <CurrencyForm action={updateCurrency} currentCurrency={settings?.currency ?? "LYD"} />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-background-card p-6">
        <h2 className="font-bold text-foreground">صور القصة في الصفحة الرئيسية</h2>
        <p className="mt-1 text-sm text-muted">
          سلسلة الصور المتتالية التي تروي قصة الأكاديمية أعلى الصفحة الرئيسية.
        </p>

        <div className="mt-4">
          <StoryImageForm action={addStoryImage} />
        </div>

        {storyImages.length > 0 && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {storyImages.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg bg-background-elevated">
                  <Image src={s.imageUrl} alt="" fill className="object-cover" />
                </div>
                <p className="flex-1 text-sm text-muted">صورة {i + 1}</p>
                <ConfirmDeleteButton onConfirm={deleteStoryImage.bind(null, s.id)} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
