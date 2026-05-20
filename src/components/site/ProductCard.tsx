import * as React from "react";
import { Plus } from "lucide-react";
import type { Product } from "@/data/products";
import { formatEUR, useCart } from "@/lib/cart";

export function ProductCard({ product }: { product: Product }) {
  const { add, open } = useCart();
  const [option, setOption] = React.useState<string | undefined>(
    product.options?.values[0],
  );
  const [mode, setMode] = React.useState<"kg" | "ud">("kg");

  const hasUnitPrice = product.pricePerUnit !== undefined;
  const activePrice = mode === "ud" && hasUnitPrice ? product.pricePerUnit! : product.price;
  const activeUnit = mode === "ud" ? "ud" : product.unit;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-shadow hover:shadow-lg hover:shadow-primary/5">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.offer && (
          <span className="absolute left-3 top-3 rounded-full bg-tomato px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-tomato-foreground shadow">
            Oferta
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg font-semibold leading-tight">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>

        {product.options && (
          <div className="mt-3">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {product.options.label}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {product.options.values.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setOption(v)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    option === v
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        )}

        {hasUnitPrice && (
          <div className="mt-3 flex gap-1.5">
            <button
              type="button"
              onClick={() => setMode("kg")}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                mode === "kg"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              Por kilo · {formatEUR(product.price)}
            </button>
            <button
              type="button"
              onClick={() => setMode("ud")}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                mode === "ud"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              Por unidad · {formatEUR(product.pricePerUnit!)}
            </button>
          </div>
        )}

        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            {product.offer && product.oldPrice && (
              <div className="text-xs text-muted-foreground line-through">
                {formatEUR(product.oldPrice)}
              </div>
            )}
            <div className="font-semibold">
              <span className="text-lg">{formatEUR(activePrice)}</span>
              <span className="text-xs font-normal text-muted-foreground"> / {activeUnit}</span>
            </div>
          </div>
          <button
            onClick={() => {
              const note = mode === "ud" ? "Por unidad" : option;
              const ep = mode === "ud" ? product.pricePerUnit : undefined;
              const eu = mode === "ud" ? "ud" : undefined;
              add(product, 1, note, ep, eu);
              open();
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-[1.03] sm:h-10 sm:w-auto sm:gap-1 sm:px-4"
            aria-label={`Añadir ${product.name} a la cesta`}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline text-sm font-semibold">Añadir</span>
          </button>
        </div>
      </div>
    </article>
  );
}
