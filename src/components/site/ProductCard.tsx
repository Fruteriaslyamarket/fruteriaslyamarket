import * as React from "react";
import { Plus } from "lucide-react";
import type { Product } from "@/data/products";
import { formatEUR, useCart } from "@/lib/cart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ProductCard({ product }: { product: Product }) {
  const { add, open: openCart } = useCart();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [mode, setMode] = React.useState<"kg" | "medio-kg" | "ud">("kg");
  const [option, setOption] = React.useState<string | undefined>(
    product.options?.values[0],
  );

  const hasKgPricing = product.unit === "kg";
  const hasUnitPrice = product.pricePerUnit !== undefined;
  const hasOptions = !!product.options;
  const needsDialog = hasKgPricing || hasUnitPrice || hasOptions;

  const weightOptions = !hasOptions && hasKgPricing
    ? [
        { id: "kg" as const, label: "Por kilo", price: product.price, unit: "kg" },
        { id: "medio-kg" as const, label: "Medio kilo", price: product.pricePerHalfKg ?? product.price / 2, unit: "500g" },
        ...(hasUnitPrice
          ? [{ id: "ud" as const, label: "Por unidad", price: product.pricePerUnit!, unit: "ud" }]
          : []),
      ]
    : [];

  function handleAdd() {
    if (needsDialog) {
      setMode("kg");
      setDialogOpen(true);
    } else {
      add(product, 1);
      openCart();
    }
  }

  function handleConfirm() {
    let note: string | undefined;
    let ep: number | undefined;
    let eu: string | undefined;

    if (mode === "ud") {
      note = "Por unidad";
      ep = product.pricePerUnit;
      eu = "ud";
    } else if (mode === "medio-kg") {
      note = "Medio kilo";
      ep = product.pricePerHalfKg ?? product.price / 2;
      eu = "500g";
    } else {
      note = option;
    }

    add(product, 1, note, ep, eu);
    setDialogOpen(false);
    openCart();
  }

  return (
    <>
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

          <div className="mt-auto flex items-end justify-between pt-4">
            <div>
              {product.offer && product.oldPrice && (
                <div className="text-xs text-muted-foreground line-through">
                  {formatEUR(product.oldPrice)}
                </div>
              )}
              <div className="font-semibold">
                <span className="text-lg">{formatEUR(product.price)}</span>
                <span className="text-xs font-normal text-muted-foreground"> / {product.unit}</span>
              </div>
              {hasUnitPrice && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  o {formatEUR(product.pricePerUnit!)} / ud
                </p>
              )}
            </div>
            <button
              onClick={handleAdd}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-[1.03] sm:h-10 sm:w-auto sm:gap-1 sm:px-4"
              aria-label={`Añadir ${product.name} a la cesta`}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline text-sm font-semibold">Añadir</span>
            </button>
          </div>
        </div>
      </article>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">{product.name}</DialogTitle>
          </DialogHeader>

          <div className="mt-2 space-y-4">
            {weightOptions.length > 0 && (
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  ¿Cuánto quieres?
                </p>
                <div className={`grid gap-2 ${weightOptions.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
                  {weightOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setMode(opt.id)}
                      className={`flex flex-col items-center gap-0.5 rounded-2xl border-2 px-2 py-4 transition ${
                        mode === opt.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <span className="text-xs font-semibold text-center leading-tight">{opt.label}</span>
                      <span className={`text-lg font-bold ${mode === opt.id ? "text-primary" : ""}`}>
                        {formatEUR(opt.price)}
                      </span>
                      <span className="text-xs text-muted-foreground">/ {opt.unit}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {hasOptions && (
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {product.options!.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.options!.values.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setOption(v)}
                      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
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

            <button
              onClick={handleConfirm}
              className="mt-2 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:scale-[1.01]"
            >
              Añadir a la cesta
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
