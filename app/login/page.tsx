"use client";

import { FormEvent, useState } from "react";
import { createClient } from "../../lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setMessage(""); setError("");
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } });
      if (authError) throw authError;
      setMessage("ログイン用リンクをメールで送信しました。メールをご確認ください。");
    } catch (authError) { setError(authError instanceof Error ? authError.message : "ログインに失敗しました。"); }
    finally { setLoading(false); }
  }

  async function loginWithGoogle() {
    setError("");
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth/callback` } });
      if (authError) throw authError;
    } catch (authError) { setError(authError instanceof Error ? authError.message : "Googleログインに失敗しました。"); }
  }

  return <main className="auth-page"><a className="logo auth-logo" href="/">どこスーパー</a><section className="auth-card"><p className="eyebrow">WELCOME BACK</p><h1>ログインして<br />買い物情報を探す</h1><p className="auth-copy">投稿と店舗・商品の詳細情報を見るにはログインが必要です。</p><button className="google-button" onClick={loginWithGoogle} type="button">Googleでログイン</button><div className="divider"><span>またはメールアドレスで</span></div><form onSubmit={sendMagicLink}><label htmlFor="email">メールアドレス</label><input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /><button className="primary-button" disabled={loading} type="submit">{loading ? "送信中…" : "ログインリンクを送る"}</button></form>{message && <p className="success-message">{message}</p>}{error && <p className="error-message">{error}</p>}<p className="auth-footnote">ログインすることで、利用規約とプライバシーポリシーに同意したものとみなされます。</p></section></main>;
}
