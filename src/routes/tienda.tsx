import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import * as React from "react";
import { ProductCard } from "@/components/site/ProductCard";
import { CATEGORIES, PRODUCTS, type ProductCategory } from "@/data/products";

export const Route = createFileRoute("/tienda")({
  head: () => ({
    meta: [
      { title: "Comprar Fruta y Verdura Online | Frutería Lya Market - Getafe y Móstoles" },
      {
        name: "description",
        content:
          "Compra fruta fresca y verdura variada online con envío a domicilio en Getafe y Móstoles. Fruta de temporada, cesta de la compra semanal y más. Pago al recibir.",
      },
      { property: "og:title", content: "Comprar Fruta y Verdura Online | Lya Market" },
      {
        property: "og:description",
        content: "Catálogo completo de fruta fresca y verdura variada con reparto a domicilio en Getafe y Móstoles.",
      },
      { property: "og:url", content: "https://fruteriaslyamarket.com/tienda" },
    ],
    links: [
      { rel: "canonical", href: "https://fruteriaslyamarket.com/tienda" },
    ],
  }),
  component: TiendaPage,
});

function TiendaPage() {
  const [cat, setCat] = React.useState<ProductCategory | "todas">("todas");
  const [q, setQ] = React.useState("");

  const filtered = PRODUCTS.filter((p) => {
    if (cat === "ofertas") {
      if (!p.offer) return false;
    } else if (cat !== "todas") {
      if (p.category !== cat) return false;
    }
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      if (!p.name.toLowerCase().includes(needle) && !p.description.toLowerCase().includes(needle))
        return false;
    }
    return true;
  });

  return (
    <div className="px-4 py-10 md:px-8 md:py-14">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Catálogo online
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">
          Comprar Fruta y Verdura Fresca Online
        </h1>
        <p className="mt-3 text-muted-foreground">
          Elige tus frutas y verduras favoritas con envío a domicilio en Getafe y Móstoles. Fruta de temporada, verdura variada y cesta de la compra semanal. Confirmaremos por teléfono el peso final antes del reparto.
        </p>
      </header>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar producto…"
            className="h-11 w-full rounded-full border border-border bg-card pl-9 pr-4 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCat(c.value)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                cat === c.value
                  ? "border-primary bg-primary text-primary-foreground shadow"
                  : "border-border bg-card hover:border-primary/40 hover:bg-accent/40"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
          <p className="text-muted-foreground">Sin resultados. Prueba con otro término.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
