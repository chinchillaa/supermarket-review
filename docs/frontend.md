# フロントエンド設計

現在の画面は方向性を確認するためのたたき台です。ページ固有のHTMLにデザインを埋め込まず、変更しやすい場所を分けています。

## 変更箇所

- `app/globals.css`：色、余白、文字、レスポンシブ、共通部品
- `components/site-header.tsx`：ヘッダーとナビゲーション
- `components/store-card.tsx`：店舗カード
- `lib/demo-data.ts`：開発用の表示データ
- `app/page.tsx`：トップページの構成とデータの流れ

配色や全体の雰囲気を変える場合は、まず`globals.css`冒頭のCSS変数を変更します。カードやヘッダーの構造を変える場合は、対応する`components`だけを修正します。
