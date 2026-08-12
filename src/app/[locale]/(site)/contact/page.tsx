import { getTranslations } from "next-intl/server";
import ContactForm from "./ContactForm";

export default async function ContactPage() {
  const t = await getTranslations("contact");

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold text-foreground">{t("pageTitle")}</h1>
      <p className="mt-2 text-muted">{t("pageSubtitle")}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-background-card p-6">
            <h2 className="font-bold text-foreground">{t("phonesTitle")}</h2>
            <ul className="mt-4 space-y-3 text-sm" dir="ltr">
              <li className="flex items-center gap-2 text-end text-foreground">
                <span aria-hidden>📞</span>
                <a href="tel:+201115248882" className="hover:text-accent">+20 111 524 8882</a>
              </li>
              <li className="flex items-center gap-2 text-end text-foreground">
                <span aria-hidden>💬</span>
                <a
                  href="https://wa.me/218916290814"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent"
                >
                  +218 91 629 0814
                </a>
                <span className="text-xs text-muted">({t("whatsappNote")})</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-background-card p-6">
            <h2 className="font-bold text-foreground">{t("emailTitle")}</h2>
            <a
              href="mailto:albarasi37@gmail.com"
              dir="ltr"
              className="mt-3 block text-end text-sm text-foreground hover:text-accent"
            >
              albarasi37@gmail.com
            </a>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
