import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { CookieConsent } from "@/components/CookieConsent";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: {
    default: "Boutique Bouquet - Изкуствени Цветя и Букети България",
    template: "%s | Boutique Bouquet",
  },
  description:
    "Магазин за изкуствени цветя и букети в България. Висококачествени изкуствени рози, лилии, орхидеи и други цветя за всеки повод. Декорация за сватби, събития и дома.",
  keywords: [
    "изкуствени цветя",
    "изкуствени букети",
    "изкуствени рози",
    "букети България",
    "сватбена декорация",
    "декорация за събития",
    "изкуствени божури",
    "декорация за дома",
    "изкуствени орхидеи",
    "изкуствени лилии",
  ],
  authors: [{ name: "Boutique Bouquet" }],
  creator: "Boutique Bouquet",
  publisher: "Boutique Bouquet",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://boutiquet-bouquet.vercel.app"
  ),
  openGraph: {
    type: "website",
    locale: "bg_BG",
    url: "/",
    title: "Boutique Bouquet - Изкуствени Цветя и Букети България",
    description:
      "Магазин за изкуствени цветя и букети в България. Висококачествени изкуствени рози, лилии, орхидеи и други цветя за всеки повод.",
    siteName: "Boutique Bouquet",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Boutique Bouquet - Изкуствени Цветя България",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Boutique Bouquet - Изкуствени Цветя и Букети България",
    description:
      "Висококачествени изкуствени цветя и букети за всеки повод в България.",
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
