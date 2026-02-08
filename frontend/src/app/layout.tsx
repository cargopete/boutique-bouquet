import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { CookieConsent } from "@/components/CookieConsent";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: {
    default: "Studio Zemya — Полимерна Глина | Скулптури и Бижута",
    template: "%s | Studio Zemya",
  },
  description:
    "Ръчно изработени скулптури, фигурки и бижута от полимерна глина. Уникално изкуство за вашия дом и подаръци с душа. Авторски творби от България.",
  keywords: [
    "полимерна глина",
    "ръчна изработка",
    "скулптури",
    "фигурки",
    "бижута",
    "арт",
    "авторски бижута",
    "миниатюри",
    "handmade България",
    "уникални подаръци",
  ],
  authors: [{ name: "Studio Zemya" }],
  creator: "Studio Zemya",
  publisher: "Studio Zemya",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://studiozemya.com"
  ),
  openGraph: {
    type: "website",
    locale: "bg_BG",
    url: "/",
    title: "Studio Zemya — Полимерна Глина | Скулптури и Бижута",
    description:
      "Ръчно изработени скулптури, фигурки и бижута от полимерна глина. Уникално изкуство за вашия дом и подаръци с душа.",
    siteName: "Studio Zemya",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Studio Zemya — Ръчна Изработка от Полимерна Глина",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio Zemya — Полимерна Глина | Скулптури и Бижута",
    description:
      "Ръчно изработени скулптури, фигурки и бижута от полимерна глина. Уникално изкуство за вашия дом.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code-here",
  },
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
        <CookieConsent />
      </body>
    </html>
  );
}
