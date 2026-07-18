"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";
import { SiteHeader } from "../../components/site-header";
import type { Product, Store } from "../../lib/types";

const initialForm = { storeId: "", productId: "", observedAt: new Date().toISOString().slice(0, 16), price: "", stockStatus: "in_stock", comment: "" };

export default function SubmitPage() {
  const [stores, setStores] = useState<Store[]>([]); const [products, setProducts] = useState<Product[]>([]); const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [message, setMessage] = useState(""); const [error, setError] = useState("");

  useEffect(() => { async function loadOptions() { try { const supabase = createClient(); const [{ data: storeData, error: storeError }, { data: productData, error: productError }] = await Promise.all([supabase.from("stores").select("id,name,area").order("name"), supabase.from("products").select("id,name,jan,maker,quantity").order("name")]); if (storeError) throw storeError; if (productError) throw productError; setStores(storeData ?? []); setProducts(productData ?? []); } catch (loadError) { setError(loadError instanceof Error ? loadError.message : "選択肢を取得できませんでした。"); } finally { setLoading(false); } } void loadOptions(); }, []);

  async function submitReview(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSaving(true); setMessage(""); setError(""); try { const supabase = createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) throw new Error("口コミを投稿するにはログインが必要です。"); const { error: insertError } = await supabase.from("reviews").insert({ user_id: user.id, store_id: form.storeId, product_id: form.productId, observed_at: new Date(form.observedAt).toISOString(), price: form.price ? Number(form.price) : null, stock_status: form.stockStatus, comment: form.comment }); if (insertError) throw insertError; setMessage("口コミを投稿しました。ありがとうございます！"); setForm(initialForm); } catch (submitError) { setError(submitError instanceof Error ? submitError.message : "口コミを投稿できませんでした。"); } finally { setSaving(false); } }

  return (
    <>
      <SiteHeader />
      <main className="content page-shell">
        <Link className="breadcrumb" href="/">← トップへ戻る</Link>
        <p className="eyebrow">SHARE WHAT YOU FOUND</p>
        <h1>見つけた商品を投稿</h1>
        <p className="page-lead">確認した日時と在庫状況を添えると、他の人にも役立つ情報になります。</p>
        {loading ? <p className="empty">投稿フォームを準備しています…</p> : (
          <form className="review-form" onSubmit={submitReview}>
            <label>店舗
              <select value={form.storeId} onChange={(event) => setForm({ ...form, storeId: event.target.value })} required>
                <option value="">店舗を選択</option>
                {stores.map((store) => <option value={store.id} key={store.id}>{store.name}（{store.area}）</option>)}
              </select>
            </label>
            <label>商品
              <select value={form.productId} onChange={(event) => setForm({ ...form, productId: event.target.value })} required>
                <option value="">商品を選択</option>
                {products.map((product) => <option value={product.id} key={product.id}>{product.name}{product.jan ? `（JAN: ${product.jan}）` : ""}</option>)}
              </select>
            </label>
            <div className="form-grid">
              <label>確認日時
                <input type="datetime-local" value={form.observedAt} onChange={(event) => setForm({ ...form, observedAt: event.target.value })} required />
              </label>
              <label>価格（円）
                <input type="number" min="0" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="任意" />
              </label>
            </div>
            <label>在庫状況
              <select value={form.stockStatus} onChange={(event) => setForm({ ...form, stockStatus: event.target.value })}>
                <option value="in_stock">在庫あり</option>
                <option value="low_stock">残りわずか</option>
                <option value="sold_out">売り切れ</option>
                <option value="not_available">取り扱いなし</option>
                <option value="unknown">不明</option>
              </select>
            </label>
            <label>コメント
              <textarea value={form.comment} onChange={(event) => setForm({ ...form, comment: event.target.value })} maxLength={2000} rows={6} placeholder="売り場の場所や、見つけたときの状況など" required />
            </label>
            <button className="primary-button" type="submit" disabled={saving}>{saving ? "投稿中…" : "口コミを投稿する"}</button>
          </form>
        )}
        {message && <p className="success-message">{message}</p>}
        {error && <div className="notice error-message">{error}<br /><Link href="/login">ログインする</Link></div>}
      </main>
    </>
  );
}
