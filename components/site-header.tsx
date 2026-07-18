import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="logo" href="/">どこスーパー</Link>
      <nav>
        <Link href="/stores">店舗を探す</Link>
        <Link href="/products">商品から探す</Link>
        <Link href="/#how">使い方</Link>
        <Link className="login" href="/login">ログイン</Link>
      </nav>
    </header>
  );
}
