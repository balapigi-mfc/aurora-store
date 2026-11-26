import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { StoreProvider } from "@/components/store-provider";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aurora-store.example.com"),
  title: {
    default: "Aurora — Objects for everyday rituals",
    template: "%s · Aurora",
  },
  description:
    "Aurora is a small-batch design store for audio, wearables and workspace objects made to last.",
  openGraph: {
    title: "Aurora — Objects for everyday rituals",
    description:
      "A small-batch design store for audio, wearables and workspace objects made to last.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
