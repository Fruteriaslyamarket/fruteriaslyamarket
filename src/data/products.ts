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
