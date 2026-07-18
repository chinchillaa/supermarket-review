"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";
import type { Store } from "../../lib/types";

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStores() {
      try {
        const supabase = createClient();
        const { data, error: queryError } = await supabase.from("stores").select("id,name,area,address,official_url").order("name");
        if (queryError) throw queryError;
        setStores(data ?? []);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "店舗情報を取得できませんでした。");
      } finally { setLoading(false); }
    }
    void loadStores();
  }, []);

  const filteredStores = useMemo(() => stores.filter((store) => `${store.name}${store.area}${store.address ?? ""}`.includes(query)), [stores, query]);

  return <main className="content page-shell"><div className="page-top"><Link href="/">← トップへ戻る</Link><Link className="login" href="/login">ログイン</Link></div><p className="eyebrow">STORES IN TOKYO OUTSIDE 23 WARDS</p><h1>店舗を探す</h1><p className="page-lead">多摩地域を中心に、商品情報が投稿された店舗を探せます。</p><div className="list-search"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="店舗名・市区町村で検索" aria-label="店舗名・市区町村で検索" /></div>{loading && <p className="empty">店舗情報を読み込んでいます…</p>}{error && <div className="notice">{error}<br /><Link href="/login">ログイン画面へ</Link></div>}{!loading && !error && <div className="store-list">{filteredStores.map((store) => <article className="store-row" key={store.id}><div><h2>{store.name}</h2><p>{store.area}{store.address ? ` ・ ${store.address}` : ""}</p></div><Link className="row-link" href={`/submit?store=${store.id}`}>口コミを投稿 →</Link></article>)}{filteredStores.length === 0 && <p className="empty">店舗が見つかりません。</p>}</div>}</main>;
}
