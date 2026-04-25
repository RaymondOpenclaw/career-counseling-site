import type { Metadata } from "next";
import "./globals.css";
import DataInitializer from "@/components/DataInitializer";

export const metadata: Metadata = {
  title: "职引未来 - 专业职业生涯咨询平台",
  description: "提供职业规划、求职辅导、心理支持等专业服务",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-background font-sans antialiased">
        <DataInitializer />
        {children}
      </body>
    </html>
  );
}
