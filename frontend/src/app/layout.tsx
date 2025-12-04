import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Boutique Bouquet - Изкуствени Букети",
  description: "Магазин за изкуствени цветя и букети в България. Висококачествени изкуствени рози, лилии, орхидеи и други цветя за всеки повод.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg">
      <body className={inter.className}>
        <Header />
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
