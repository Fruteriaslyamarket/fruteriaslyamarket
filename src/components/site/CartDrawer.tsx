import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBasket, Trash2, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { buildWhatsAppMessage, formatEUR, itemKey, useCart, whatsappLink } from "@/lib/cart";

export function CartDrawer() {
  const { items, isOpen, close, setQty, remove, subtotal, clear } = useCart();
  const wa = whatsappLink(buildWhatsAppMessage(items, subtotal));

  return (
    <Sheet open={isOpen} onOpenChange={(v) => (v ? null : close())}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border/60 p-5 text-left">
          <SheetTitle className="font-display text-2xl">Tu cesta</SheetTitle>
          <SheetDescription>
            Pago al recibir. Reparto a domicilio en Getafe y Móstoles.
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-accent">
              <ShoppingBasket className="h-7 w-7 text-primary" />
            </div>
            <p className="text-muted-foreground">
              Tu cesta está vacía. ¡Añade algo de fresco!
            </p>
            <Link
              to="/tienda"
              onClick={close}
              className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground"
            >
              Ir a la tienda
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-2 py-2">
              {items.map((i) => {
                const key = itemKey(i);
                return (
                <li key={key} className="flex gap-3 p-3">
                  <img
                    src={i.product.image}
                    alt={i.product.name}
                    loading="lazy"
                    className="h-16 w-16 shrink-0 rounded-lg object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium leading-tight">{i.product.name}</p>
                        {i.note && (
                          <p className="text-xs font-medium text-primary">{i.note}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {formatEUR(i.effectivePrice ?? i.product.price)} / {i.effectiveUnit ?? i.product.unit}
                        </p>
                      </div>
                      <button
                        onClick={() => remove(key)}
                        className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Quitar ${i.product.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-border bg-card">
                        <button
                          onClick={() => setQty(key, i.qty - 1)}
                          className="grid h-8 w-8 place-items-center text-muted-foreground hover:text-foreground"
                          aria-label="Disminuir"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{i.qty}</span>
                        <button
                          onClick={() => setQty(key, i.qty + 1)}
                          className="grid h-8 w-8 place-items-center text-muted-foreground hover:text-foreground"
                          aria-label="Aumentar"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold">
                        {formatEUR(i.qty * (i.effectivePrice ?? i.product.price))}
                      </span>
                    </div>
                  </div>
                </li>
                );
              })}
            </ul>

            <div className="border-t border-border/60 bg-card/50 p-5">
              <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
                <span>Subtotal estimado</span>
                <span className="text-base font-semibold text-foreground">{formatEUR(subtotal)}</span>
              </div>
              <p className="mb-4 text-xs text-muted-foreground">
                Confirmaremos disponibilidad y precio final (productos por peso) antes del reparto.
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  to="/checkout"
                  onClick={close}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:scale-[1.01]"
                >
                  Finalizar pedido
                </Link>
                <a
                  href={wa}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-semibold text-white shadow-sm hover:opacity-95"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                    <path d="M20.5 3.5A11.5 11.5 0 0 0 3.6 18.7L2 22l3.4-1.5A11.5 11.5 0 1 0 20.5 3.5Zm-8.5 18a9.5 9.5 0 0 1-4.8-1.3l-.3-.2-2 .9.9-2-.2-.3A9.5 9.5 0 1 1 12 21.5Zm5.4-7.1c-.3-.2-1.7-.9-2-1s-.5-.1-.7.2-.8 1-.9 1.2-.3.2-.6.1a7.7 7.7 0 0 1-2.3-1.4 8.6 8.6 0 0 1-1.6-2c-.2-.3 0-.4.1-.5l.4-.5a2 2 0 0 0 .3-.5.5.5 0 0 0 0-.5l-.7-1.7c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7c.1.2 1.9 2.9 4.6 4 .6.3 1.1.4 1.5.5a3.6 3.6 0 0 0 1.6.1 2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .1-1.2l-.5-.3Z" />
                  </svg>
                  Pedir por WhatsApp
                </a>
                <button
                  onClick={clear}
                  className="mt-1 text-xs text-muted-foreground hover:text-destructive"
                >
                  Vaciar cesta
                </button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
