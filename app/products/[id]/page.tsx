"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "../../../lib/supabase/client";
import type { Product } from "../../../lib/types";

type Review = { id: string; observed_at: string; price: number | null; stock_status: string; comment: string; stores: { name: string; area: string }[] | null };
const stockLabels: Record<string, string> = { in_stock: "在庫あり", low_stock: "残りわずか", sold_out: "売り切れ", not_available: "取り扱いなし", unknown: "不明" };

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>(); const [product, setProduct] = useState<Product | null>(null); const [reviews, setReviews] = useState<Review[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { async function loadProduct() { try { const supabase = createClient(); const [{ data: productData, error: productError }, { data: reviewData, error: reviewError }] = await Promise.all([supabase.from("products").select("id,name,jan,maker,quantity").eq("id", params.id).single(), supabase.from("reviews").select("id,observed_at,price,stock_status,comment,stores(name,area)").eq("product_id", params.id).order("observed_at", { ascending: false })]); if (productError) throw productError; if (reviewError) throw reviewError; setProduct(productData); setReviews((reviewData as Review[]) ?? []); } catch (loadError) { setError(loadError instanceof Error ? loadError.message : "商品情報を取得できませんでした。"); } finally { setLoading(false); } } void loadProduct(); }, [params.id]);
  if (loading) return <main className="content page-shell"><p className="empty">商品情報を読み込んでいます…</p></main>;
  if (error || !product) return <main className="content page-shell"><Link href="/products">← 商品一覧へ戻る</Link><div className="notice">{error || "商品が見つかりません。"}</div></main>;
  return <main className="content page-shell"><div className="page-top"><Link href="/products">← 商品一覧へ戻る</Link><Link className="login" href="/login">ログイン</Link></div><p className="eyebrow">PRODUCT DETAIL</p><section className="product-summary"><h1>{product.name}</h1><p>{[product.maker, product.quantity].filter(Boolean).join(" ・ ") || ""}</p>{product.jan && <small>JAN {product.jan}</small>}</section><div className="section-heading review-heading"><div><p className="eyebrow">LATEST REVIEWS</p><h2>見つかった店舗</h2></div><Link className="row-link" href={`/submit?product=${product.id}`}>この商品を投稿 →</Link></div>{reviews.length === 0 ? <p className="empty">まだ口コミがありません。</p> : <div className="review-list">{reviews.map((review) => <article className="review-card" key={review.id}><div className="review-card-top"><h3>{review.stores?.[0]?.name ?? "店舗不明"}</h3><span>{review.stores?.[0]?.area}</span></div><p className="review-meta">確認日 {new Date(review.observed_at).toLocaleString("ja-JP")} ・ {stockLabels[review.stock_status] ?? "不明"}{review.price !== null ? ` ・ ${review.price.toLocaleString("ja-JP")}円` : ""}</p><p className="review-comment">{review.comment}</p></article>)}</div>}</main>;
}
