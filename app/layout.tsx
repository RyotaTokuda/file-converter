import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import PwaRegister from "@/components/PwaRegister";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ローカルファイル変換 | Mankai Software",
  description: "HEIC・WebP・動画などをブラウザ内だけで変換。ファイルはサーバーに送られません。",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ファイル変換",
  },
};

export const viewport: Viewport = {
  themeColor: "#059669",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className={`${geist.className} bg-gray-50 text-gray-900 antialiased`}>
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
