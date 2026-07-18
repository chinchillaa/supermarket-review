create extension if not exists "pgcrypto";

create table public.stores (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  area text not null,
  address text,
  official_url text,
  source_url text,
  last_verified_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  jan text unique,
  name text not null,
  maker text,
  quantity text,
  category text,
  image_url text,
  source_url text,
  source_license text,
  last_verified_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  store_id uuid not null references public.stores(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  observed_at timestamptz not null,
  price integer check (price is null or price >= 0),
  stock_status text not null check (stock_status in ('in_stock', 'low_stock', 'sold_out', 'not_available', 'unknown')),
  comment text not null check (char_length(comment) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.stores enable row level security;
alter table public.products enable row level security;
alter table public.reviews enable row level security;

create policy "ログインユーザーは店舗を閲覧できる" on public.stores for select to authenticated using (true);
create policy "ログインユーザーは商品を閲覧できる" on public.products for select to authenticated using (true);
create policy "ログインユーザーは口コミを閲覧できる" on public.reviews for select to authenticated using (true);
create policy "ログインユーザーは口コミを投稿できる" on public.reviews for insert to authenticated with check (auth.uid() = user_id);
create policy "投稿者は自分の口コミを更新できる" on public.reviews for update to authenticated using (auth.uid() = user_id);
create policy "投稿者は自分の口コミを削除できる" on public.reviews for delete to authenticated using (auth.uid() = user_id);
