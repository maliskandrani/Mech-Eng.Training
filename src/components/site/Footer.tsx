import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background-elevated">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg gold-gradient text-accent-foreground font-bold">
                م
              </span>
              <span className="font-bold text-foreground">أكاديمية الهندسة الميكانيكية وهندسة الأنابيب</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">
              محتوى علمي متكامل بخبرة ميدانية حقيقية في هندسة الأنابيب والمعدات الميكانيكية،
              التكييف المركزي، وبرمجيات التصميم الهندسي.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground">روابط سريعة</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li><Link href="/courses" className="hover:text-accent">الدورات التدريبية</Link></li>
              <li><Link href="/trainers" className="hover:text-accent">المدربون</Link></li>
              <li><Link href="/login" className="hover:text-accent">تسجيل الدخول</Link></li>
              <li><Link href="/register" className="hover:text-accent">إنشاء حساب متدرب</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground">تواصل معنا</h4>
            <p className="mt-3 text-sm text-muted">
              للاستفسارات حول الدورات والتسجيل، يرجى التواصل عبر البريد الإلكتروني الخاص بالأكاديمية.
            </p>
          </div>
        </div>

        <p className="mt-8 border-t border-border pt-6 text-center text-xs text-muted">
          © {new Date().getFullYear()} أكاديمية الهندسة الميكانيكية وهندسة الأنابيب. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}
