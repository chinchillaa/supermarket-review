import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "どこスーパー | 近くのスーパーの商品口コミ",
  description: "東京都23区外のスーパーで見つけた商品を共有するサービス",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <head>
        {/* Webフォントは実行時に読み込み、取得できない環境ではシステムフォントへフォールバックする */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700&family=Zen+Maru+Gothic:wght@700;900&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
