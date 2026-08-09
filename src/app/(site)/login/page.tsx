import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-extrabold text-foreground">تسجيل الدخول</h1>
      <p className="mt-2 text-muted">سجّل دخولك للوصول إلى لوحة التحكم ودوراتك.</p>

      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
