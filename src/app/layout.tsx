import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DartScore QuickPlay",
  description: "En snabb och enkel app för att räkna poäng i dart",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DartScore"
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/dartboard-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/dartboard-512.png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
