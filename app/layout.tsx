import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://bursa-en-yakin-eczane.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Bursa Nöbetçi Eczane | En Yakın Nöbetçi Eczaneler",
    template: "%s | Bursa Nöbetçi Eczane",
  },
  description:
    "Bursa'da bugün nöbetçi eczaneleri harita ve konumuna göre en yakından başlayarak bul. Resmi Bursa Eczacı Odası verileriyle güncel liste.",
  applicationName: "Bursa Nöbetçi Eczane",
  keywords: [
    "bursa nöbetçi eczane",
    "nöbetçi eczane bursa",
    "en yakın nöbetçi eczane",
    "açık eczane bursa",
  ],
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      {
        url: "/favicon/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#dc2626",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-50 text-zinc-900">
        <SiteHeader />
        <main className="mx-auto max-w-6xl px-4 py-4 md:py-8">{children}</main>
        <footer className="hidden border-t border-zinc-200 bg-white py-6 text-center text-sm text-zinc-500 md:block">
          Veriler{" "}
          <a
            href="https://www.beo.org.tr/nobetci-eczaneler"
            className="font-medium text-emerald-700 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Bursa Eczacı Odası
          </a>{" "}
          resmi yayınından alınır ve her gün güncellenir.
        </footer>
      </body>
    </html>
  );
}
