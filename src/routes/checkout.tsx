import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { CheckCircle2, ShoppingBasket } from "lucide-react";
import { z } from "zod";
import {
  buildWhatsAppMessage,
  formatEUR,
  useCart,
  whatsappLink,
} from "@/lib/cart";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Finalizar pedido — Lya Market" },
      {
        name: "description",
        content:
          "Completa tu pedido con reparto a domicilio en Getafe y Móstoles. Pago al recibir.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

const ZONES = [
  "Getafe centro",
  "Getafe — otros barrios",
  "Móstoles centro",
  "Móstoles — otros barrios",
  "Otra zona cercana",
] as const;

const SLOTS = ["10:00 – 13:00", "13:00 – 16:00", "16:00 – 19:00", "19:00 – 21:00"] as const;
const PAYMENT = ["Efectivo al recibir", "Tarjeta al recibir", "Pagar ahora online"] as const;

const schema = z.object({
  name: z.string().trim().min(2, "Indica tu nombre").max(80),
  phone: z
    .string()
    .trim()
    .min(9, "Teléfono no válido")
    .max(20)
    .regex(/^[+\d\s]+$/, "Solo números, espacios y +"),
  email: z.string().trim().email("Email no válido").max(120).optional().or(z.literal("")),
  address: z.string().trim().min(5, "Indica tu dirección completa").max(200),
  zone: z.enum(ZONES),
  slot: z.enum(SLOTS),
  payment: z.enum(PAYMENT),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

type FormErrors = Partial<Record<keyof z.infer<typeof schema>, string>>;

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [stripeLoading, setStripeLoading] = React.useState(false);
  const [stripeError, setStripeError] = React.useState<string | null>(null);

  if (submitted) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-semibold">¡Pedido recibido!</h1>
        <p className="mt-3 text-muted-foreground">
          Te llamaremos enseguida al teléfono indicado para confirmar disponibilidad y la hora del
          reparto. Gracias por confiar en Lya Market 🍃
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-accent text-primary">
          <ShoppingBasket className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-semibold">Tu cesta está vacía</h1>
        <p className="mt-3 text-muted-foreground">Añade productos antes de finalizar el pedido.</p>
        <Link
          to="/tienda"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground"
        >
          Ir a la tienda
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs: FormErrors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof FormErrors;
        if (!errs[k]) errs[k] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});

    if (parsed.data.payment === "Pagar ahora online") {
      setStripeLoading(true);
      setStripeError(null);
      try {
        const res = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((i) => ({
              name: i.product.name,
              unit: i.product.unit,
              price: i.product.price,
              qty: i.qty,
            })),
            customer: {
              name: parsed.data.name,
              phone: parsed.data.phone,
              email: parsed.data.email || "",
              address: parsed.data.address,
              zone: parsed.data.zone,
              slot: parsed.data.slot,
              notes: parsed.data.notes || "",
            },
          }),
        });
        if (!res.ok) throw new Error("Error al crear la sesión de pago");
        const { url } = await res.json();
        clear();
        window.location.href = url;
      } catch {
        setStripeLoading(false);
        setStripeError("No se pudo conectar con el sistema de pago. Inténtalo de nuevo.");
      }
      return;
    }

    const lines = [
      `Pedido nuevo — ${parsed.data.name}`,
      `Tel: ${parsed.data.phone}`,
      parsed.data.email ? `Email: ${parsed.data.email}` : "",
      `Dirección: ${parsed.data.address} (${parsed.data.zone})`,
      `Franja: ${parsed.data.slot}`,
      `Pago: ${parsed.data.payment}`,
      parsed.data.notes ? `Notas: ${parsed.data.notes}` : "",
      "",
      ...items.map(
        (i) =>
          `• ${i.qty} × ${i.product.name} (${i.product.unit}) — ${formatEUR(i.qty * i.product.price)}`,
      ),
      "",
      `Total estimado: ${formatEUR(subtotal)}`,
    ].filter(Boolean);
    const wa = whatsappLink(lines.join("\n"));
    window.open(wa, "_blank", "noopener");

    clear();
    setSubmitted(true);
    setTimeout(() => navigate({ to: "/" }), 8000);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">Finalizar pedido</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Sin pago online. Te llamaremos para confirmar y cobramos al entregar.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="order-2 space-y-6 rounded-3xl border border-border/60 bg-card p-6 lg:order-1 sm:p-8">
          <h2 className="font-display text-xl font-semibold">Datos de contacto</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre y apellidos" name="name" error={errors.name} />
            <Field label="Teléfono" name="phone" type="tel" error={errors.phone} placeholder="6XX XXX XXX" />
          </div>
          <Field label="Email (opcional)" name="email" type="email" error={errors.email} />

          <h2 className="pt-4 font-display text-xl font-semibold">Dirección de entrega</h2>
          <Field
            label="Dirección completa"
            name="address"
            error={errors.address}
            placeholder="Calle, número, piso, puerta…"
          />
          <Select label="Zona de reparto" name="zone" options={[...ZONES]} error={errors.zone} />

          <h2 className="pt-4 font-display text-xl font-semibold">Preferencias</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Franja horaria" name="slot" options={[...SLOTS]} error={errors.slot} />
            <Select
              label="Método de pago"
              name="payment"
              options={[...PAYMENT]}
              error={errors.payment}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Notas (opcional)</label>
            <textarea
              name="notes"
              rows={3}
              maxLength={500}
              placeholder="Indícanos preferencias de madurez, portal, instrucciones…"
              className="w-full resize-none rounded-2xl border border-border bg-background p-3 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="rounded-2xl bg-accent/40 p-4 text-sm text-foreground">
            🚚 Reparto local en Getafe, Móstoles y alrededores. Si tu zona queda fuera, te
            avisaremos por teléfono antes de cobrar.
          </div>
        </div>

        <aside className="order-1 space-y-4 lg:order-2">
          <div className="rounded-3xl border border-border/60 bg-card p-6">
            <h2 className="mb-4 font-display text-xl font-semibold">Tu pedido</h2>
            <ul className="divide-y divide-border">
              {items.map((i) => (
                <li key={i.product.id} className="flex items-center gap-3 py-3">
                  <img
                    src={i.product.image}
                    alt={i.product.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{i.product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {i.qty} × {formatEUR(i.product.price)} / {i.product.unit}
                    </p>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatEUR(i.qty * i.product.price)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">Subtotal estimado</span>
              <span className="font-display text-xl font-semibold">{formatEUR(subtotal)}</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Productos por peso: el precio final puede variar ligeramente.
            </p>
            {stripeError && (
              <p className="mt-3 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {stripeError}
              </p>
            )}
            <button
              type="submit"
              disabled={stripeLoading}
              className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow disabled:opacity-60"
            >
              {stripeLoading ? "Redirigiendo al pago…" : "Confirmar pedido"}
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className={`h-11 w-full rounded-full border bg-background px-4 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-primary/30 ${
          error ? "border-destructive" : "border-border focus:border-primary"
        }`}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Select({
  label,
  name,
  options,
  error,
}: {
  label: string;
  name: string;
  options: string[];
  error?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <select
        name={name}
        defaultValue=""
        className={`h-11 w-full rounded-full border bg-background px-4 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-primary/30 ${
          error ? "border-destructive" : "border-border focus:border-primary"
        }`}
      >
        <option value="" disabled>
          Selecciona…
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
