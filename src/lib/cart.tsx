import * as React from "react";
import type { Product } from "@/data/products";

export type CartItem = {
  product: Product;
  qty: number;
  note?: string;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
};

type CartContextValue = CartState & {
  add: (product: Product, qty?: number, note?: string) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  totalQty: number;
  subtotal: number;
};

const CartContext = React.createContext<CartContextValue | null>(null);

const STORAGE_KEY = "lya-cart-v2";

export const itemKey = (i: { product: { id: string }; note?: string }) =>
  i.note ? `${i.product.id}::${i.note}` : i.product.id;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

  const add = React.useCallback((product: Product, qty = 1, note?: string) => {
    setItems((prev) => {
      const key = note ? `${product.id}::${note}` : product.id;
      const existing = prev.find((i) => itemKey(i) === key);
      if (existing) {
        return prev.map((i) =>
          itemKey(i) === key ? { ...i, qty: i.qty + qty } : i,
        );
      }
      return [...prev, { product, qty, note }];
    });
  }, []);

  const remove = React.useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => itemKey(i) !== key));
  }, []);

  const setQty = React.useCallback((key: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => itemKey(i) !== key)
        : prev.map((i) => (itemKey(i) === key ? { ...i, qty } : i)),
    );
  }, []);

  const clear = React.useCallback(() => setItems([]), []);
  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = React.useCallback(() => setIsOpen((v) => !v), []);

  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.qty * i.product.price, 0);

  const value: CartContextValue = {
    items,
    isOpen,
    add,
    remove,
    setQty,
    clear,
    open,
    close,
    toggle,
    totalQty,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export const formatEUR = (n: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);

export const WHATSAPP_NUMBER = "34674559853";

export function buildWhatsAppMessage(items: CartItem[], subtotal: number) {
  const lines = items.map(
    (i) =>
      `• ${i.qty} × ${i.product.name}${i.note ? ` (${i.note})` : ""} (${i.product.unit}) — ${formatEUR(i.qty * i.product.price)}`,
  );
  return [
    "¡Hola Lya Market! Quiero hacer este pedido:",
    "",
    ...lines,
    "",
    `Total estimado: ${formatEUR(subtotal)}`,
  ].join("\n");
}

export function whatsappLink(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
