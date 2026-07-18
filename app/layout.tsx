import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "どこスーパー | 近くのスーパーの商品口コミ",
  description: "東京都23区外のスーパーで見つけた商品を共有するサービス",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
