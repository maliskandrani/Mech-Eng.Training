import { notFound, redirect } from "next/navigation";
import { getLocale, getTranslations, getFormatter } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { localizedHref } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { getCourseBySlug, getSiteSettings, getMyPurchaseRequest } from "@/lib/queries";
import { localizedTitle } from "@/lib/utils";
import PurchaseForm from "./PurchaseForm";

export default async function PurchasePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ materialId?: string }>;
}) {
  const { slug } = await params;
  const { materialId } = await searchParams;
  const [course, settings, session, locale, t, format] = await Promise.all([
    getCourseBySlug(slug),
    getSiteSettings(),
    auth(),
    getLocale(),
    getTranslations("courses"),
    getFormatter(),
  ]);
  if (!course) notFound();

  const loginHref = `${localizedHref(locale, "/login")}?callbackUrl=${encodeURIComponent(
    localizedHref(locale, `/courses/${course.slug}/purchase${materialId ? `?materialId=${materialId}` : ""}`)
  )}`;
  if (!session?.user) redirect(loginHref);
  if (session.user.role !== "STUDENT") {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <p className="text-muted">{t("studentsOnly")}</p>
      </div>
    );
  }

  const currency = settings?.currency ?? "LYD";
  const courseTitle = localizedTitle(course.title, course.titleEn, locale);

  let amount: number;
  let label: string;
  let available: boolean;
  if (materialId) {
    const material = course.sections
      .flatMap((s) => s.lessons)
      .flatMap((l) => l.materials)
      .find((m) => m.id === materialId);
    available = Boolean(material && material.price != null && material.price > 0);
    amount = material?.price ?? 0;
    label = material?.title ?? "";
  } else {
    available = course.price > 0;
    amount = course.price;
    label = courseTitle;
  }

  if (!available) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <p className="text-muted">{t("notAvailableForPurchase")}</p>
      </div>
    );
  }

  const existing = await getMyPurchaseRequest(session.user.id, materialId ? { materialId } : { courseId: course.id });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link href={`/courses/${course.slug}`} className="text-sm font-semibold text-accent-soft hover:underline">
        ← {courseTitle}
      </Link>

      <h1 className="mt-3 text-2xl font-extrabold text-foreground sm:text-3xl">{t("purchasePageTitle")}</h1>

      <div className="mt-6 rounded-2xl border border-border bg-background-card p-5">
        <p className="text-sm text-muted">{t("purchasingLabel")}</p>
        <p className="mt-1 font-bold text-foreground">{label}</p>
        <p className="mt-3 text-2xl font-extrabold text-accent">
          {format.number(amount, { style: "currency", currency, maximumFractionDigits: 0 })}
        </p>
      </div>

      {existing && existing.status !== "REJECTED" ? (
        <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/10 p-5 text-center">
          <p className="font-semibold text-accent-soft">
            {existing.status === "APPROVED"
              ? t("alreadyPurchased")
              : existing.status === "RECEIVED"
                ? t("purchaseStatusReceived")
                : t("purchaseStatusPending")}
          </p>
        </div>
      ) : (
        <>
          {existing?.status === "REJECTED" && (
            <p className="mt-6 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-700">
              {t("purchaseStatusRejected")}
              {existing.rejectionReason ? `: ${existing.rejectionReason}` : ""}
            </p>
          )}
          <div className="mt-6 rounded-2xl border border-border bg-background-card p-5">
            <h2 className="font-bold text-foreground">{t("paymentInfoTitle")}</h2>
            <dl className="mt-3 space-y-3 text-sm">
              {settings?.paymentBankDetails && (
                <div>
                  <dt className="font-semibold text-foreground">{t("method.BANK_TRANSFER")}</dt>
                  <dd className="mt-1 whitespace-pre-line text-muted">{settings.paymentBankDetails}</dd>
                </div>
              )}
              {settings?.paymentLibyanaInfo && (
                <div>
                  <dt className="font-semibold text-foreground">{t("method.LIBYANA_CARD")}</dt>
                  <dd className="mt-1 whitespace-pre-line text-muted">{settings.paymentLibyanaInfo}</dd>
                </div>
              )}
              {settings?.paymentMadarInfo && (
                <div>
                  <dt className="font-semibold text-foreground">{t("method.MADAR_CARD")}</dt>
                  <dd className="mt-1 whitespace-pre-line text-muted">{settings.paymentMadarInfo}</dd>
                </div>
              )}
              {settings?.paymentLttInfo && (
                <div>
                  <dt className="font-semibold text-foreground">{t("method.LTT_CARD")}</dt>
                  <dd className="mt-1 whitespace-pre-line text-muted">{settings.paymentLttInfo}</dd>
                </div>
              )}
              {settings?.paymentCashOfficeInfo && (
                <div>
                  <dt className="font-semibold text-foreground">{t("method.CASH_OFFICE")}</dt>
                  <dd className="mt-1 whitespace-pre-line text-muted">{settings.paymentCashOfficeInfo}</dd>
                </div>
              )}
              {!settings?.paymentBankDetails &&
                !settings?.paymentLibyanaInfo &&
                !settings?.paymentMadarInfo &&
                !settings?.paymentLttInfo &&
                !settings?.paymentCashOfficeInfo && <p className="text-muted">{t("noPaymentInfoYet")}</p>}
            </dl>
          </div>

          <div className="mt-6">
            <PurchaseForm kind={materialId ? "material" : "course"} targetId={materialId ?? course.id} />
          </div>
        </>
      )}
    </div>
  );
}
