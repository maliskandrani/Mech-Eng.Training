"use client";

import { useState } from "react";

export default function PasswordInput({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input {...props} type={visible ? "text" : "password"} className={`pe-11 ${className}`} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        aria-label={visible ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
        className="absolute inset-y-0 end-2 flex items-center px-1 text-muted transition hover:text-accent"
      >
        {visible ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 3l18 18" strokeLinecap="round" />
            <path d="M10.6 10.6a2 2 0 002.8 2.8" strokeLinecap="round" />
            <path d="M6.6 6.7C4.5 8 3 9.9 2 12c1.6 3.4 5 6.5 10 6.5 1.8 0 3.4-.4 4.8-1.1M9.4 5.6C10.2 5.4 11.1 5.3 12 5.5c5 0 8.4 3.1 10 6.5-.5 1-1.1 2-2 2.9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M2 12c1.6-3.4 5-6.5 10-6.5s8.4 3.1 10 6.5c-1.6 3.4-5 6.5-10 6.5S3.6 15.4 2 12z" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}
