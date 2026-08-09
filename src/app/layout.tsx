import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: "أكاديمية الهندسة الميكانيكية وهندسة الأنابيب",
  description:
    "دورات تدريبية متخصصة في هندسة الأنابيب والمعدات الميكانيكية، التكييف المركزي، وبرمجيات التصميم الهندسي.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
