"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";
import { SiteHeader } from "../../components/site-header";
import type { Product } from "../../lib/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]); const [query, setQuery] = useState(""); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { async function loadProducts() { try { const supabase = createClient(); const { data, error: queryError } = await supabase.from("products").select("id,name,jan,maker,quantity").order("name"); if (queryError) throw queryError; setProducts(data ?? []); } catch (loadError) { setError(loadError instanceof Error ? loadError.message : "商品情報を取得できませんでした。"); } finally { setLoading(false); } } void loadProducts(); }, []);
  const filtered = useMemo(() => products.filter((product) => `${product.name}${product.jan ?? ""}${product.maker ?? ""}`.toLowerCase().includes(query.toLowerCase())), [products, query]);
  return (
    <>
      <SiteHeader />
      <main className="content page-shell">
        <Link className="breadcrumb" href="/">← トップへ戻る</Link>
        <p className="eyebrow">PRODUCT CATALOG</p>
        <h1>商品から探す</h1>
        <p className="page-lead">JANや商品名から、見つかった店舗と口コミを確認できます。</p>
        <div className="list-search"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="商品名・JAN・メーカーで検索" aria-label="商品名・JAN・メーカーで検索" /></div>
        {loading && <p className="empty">商品情報を読み込んでいます…</p>}
        {error && <div className="notice">{error}<br /><Link href="/login">ログイン画面へ</Link></div>}
        {!loading && !error && (
          <div className="product-list">
            {filtered.map((product) => (
              <Link className="product-row" href={`/products/${product.id}`} key={product.id}>
                <div>
                  <h2>{product.name}</h2>
                  <p>{[product.maker, product.quantity, product.jan ? `JAN ${product.jan}` : ""].filter(Boolean).join(" ・ ") || "商品情報を確認"}</p>
                </div>
                <span className="row-link">詳細 →</span>
              </Link>
            ))}
            {filtered.length === 0 && <p className="empty">商品が見つかりません。</p>}
          </div>
        )}
      </main>
    </>
  );
}
