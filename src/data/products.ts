import * as React from "react";
import productsData from "./products.json";

export type ProductCategory =
  | "verduras"
  | "ensaladas"
  | "tomates"
  | "tuberculos"
  | "legumbres"
  | "temporada"
  | "manzanas-peras"
  | "exoticas"
  | "citricos"
  | "melones"
  | "ofertas";

export type Product = {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  unit: string;
  image: string;
  featured?: boolean;
  offer?: boolean;
  oldPrice?: number;
  hidden?: boolean;
  options?: { label: string; values: string[] };
};

export const ALL_PRODUCTS: Product[] = productsData as Product[];

export const PRODUCTS: Product[] = ALL_PRODUCTS.filter((p) => !p.hidden);

export const CATEGORIES: { value: ProductCategory | "todas"; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "verduras", label: "Verduras" },
  { value: "ensaladas", label: "Ensaladas y setas" },
  { value: "tomates", label: "Tomates" },
  { value: "tuberculos", label: "Cebollas y tubérculos" },
  { value: "legumbres", label: "Legumbres" },
  { value: "temporada", label: "Fruta de temporada" },
  { value: "manzanas-peras", label: "Manzanas y peras" },
  { value: "exoticas", label: "Exóticas y tropicales" },
  { value: "citricos", label: "Cítricos" },
  { value: "melones", label: "Melones y sandías" },
  { value: "ofertas", label: "Ofertas" },
];

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
export const featuredProducts = () => PRODUCTS.filter((p) => p.featured).slice(0, 6);
export const offerProducts = () => PRODUCTS.filter((p) => p.offer);

// ─── Runtime fetch (siempre actualizado desde GitHub) ─────────────────────────

const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO as string | undefined;
const GITHUB_BRANCH = (import.meta.env.VITE_GITHUB_BRANCH as string | undefined) ?? "main";

let _cache: Product[] | null = null;
let _promise: Promise<Product[]> | null = null;

export function loadProducts(): Promise<Product[]> {
  if (_cache) return Promise.resolve(_cache);
  if (!_promise) {
    if (!GITHUB_REPO) return Promise.resolve(ALL_PRODUCTS);
    const url = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/src/data/products.json`;
    _promise = fetch(url)
      .then((r) => r.json())
      .then((data) => { _cache = data as Product[]; return _cache; })
      .catch(() => ALL_PRODUCTS);
  }
  return _promise;
}

export function useProducts() {
  const [products, setProducts] = React.useState<Product[]>(ALL_PRODUCTS);
  React.useEffect(() => {
    loadProducts().then(setProducts).catch(() => {});
  }, []);
  const visible = products.filter((p) => !p.hidden);
  return {
    all: products,
    products: visible,
    featured: visible.filter((p) => p.featured).slice(0, 6),
    offers: visible.filter((p) => p.offer),
    getProduct: (id: string) => visible.find((p) => p.id === id),
  };
}
