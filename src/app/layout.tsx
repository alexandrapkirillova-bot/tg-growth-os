import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TG Growth OS",
  description: "Аналитика Telegram-каналов для роста вашей аудитории",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full">
      <body className="min-h-full bg-[#0a0a0a] text-white font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
