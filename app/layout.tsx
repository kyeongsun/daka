import type { Metadata } from "next";
import "./globals.css";
import { ErrorReporter } from "@/lib/error-reporter";

export const metadata: Metadata = {
  title: "煜安 · 每日修行",
  description: "汉语、满文、韩语三语每日打卡看板",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ErrorReporter />
        {children}
      </body>
    </html>
  );
}
