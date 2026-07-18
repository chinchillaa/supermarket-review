"use client";

import { useMemo, useState } from "react";
import { SiteHeader } from "../components/site-header";
import { demoStores } from "../lib/demo-data";


export default function Home() {
  const [query, setQuery] = useState("");
  const filteredStores = useMemo(
    () => demoStores.filter((store) => `${store.name}${store.area}`.includes(query)),
    [query],
  );

  return (
    <main>
      <SiteHeader />

      <section className="hero">
        <p className="eyebrow">東京23区外のスーパー情報</p>
        <h1>今日、どこで<br /><span>何が買える？</span></h1>
        <p className="hero-copy">近くのスーパーで見つけた商品を、みんなで共有する口コミサービスです。</p>
        <div className="search-box">
          <span aria-hidden="true">⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="商品名・店舗名・市区町村で検索" aria-label="商品名・店舗名・市区町村で検索" />
          <button type="button">検索</button>
        </div>
        <p className="login-note">投稿と詳細情報の閲覧にはログインが必要です。</p>
      </section>

      <section className="content" id="stores">
        <div className="section-heading"><div><p className="eyebrow">LATEST UPDATES</p><h2>近くの店舗から探す</h2></div><span className="count">{filteredStores.length}店舗</span></div>
        <div className="store-grid">
          {filteredStores.map((store) => <article className="store-card" key={store.name}><div className="store-icon">🛒</div><div><h3>{store.name}</h3><p>{store.area} ・ {store.distance}</p><small>最新の投稿 {store.lastUpdate}</small></div><span className="arrow">→</span></article>)}
        </div>
        {filteredStores.length === 0 && <p className="empty">一致する店舗がありません。商品名や市区町村を変えてお試しください。</p>}
      </section>

      <section className="how" id="how"><p className="eyebrow">HOW IT WORKS</p><h2>知りたい情報を、<br />知っている人から。</h2><div className="steps"><div><b>01</b><h3>見つける</h3><p>店舗や商品を検索して、最新の投稿を確認します。</p></div><div><b>02</b><h3>投稿する</h3><p>見つけた商品、価格、在庫、確認日時を投稿します。</p></div><div><b>03</b><h3>つながる</h3><p>役に立った投稿を評価して、地域の買い物を助けます。</p></div></div></section>

      <footer><span>どこスーパー</span><small>東京都23区外から、買い物をもっと確かに。</small></footer>
    </main>
  );
}
