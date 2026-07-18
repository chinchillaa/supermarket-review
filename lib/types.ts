export type Store = {
  id: string;
  name: string;
  area: string;
  address?: string | null;
  official_url?: string | null;
};

export type Product = {
  id: string;
  jan?: string | null;
  name: string;
  maker?: string | null;
  quantity?: string | null;
};
