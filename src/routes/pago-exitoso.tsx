import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import * as z from "zod";

export const Route = createFileRoute("/pago-exitoso")({
  validateSearch: z.object({
    session_id: z.string().optional(),
  }),
  head: () => ({
    meta: [
      { title: "Pago completado — Lya Market" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PagoExitosoPage,
});

function PagoExitosoPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <h1 className="mt-6 font-display text-3xl font-semibold">¡Pago completado!</h1>
      <p className="mt-3 text-muted-foreground">
        Tu pedido está confirmado. Te llamaremos al teléfono indicado para coordinar la entrega.
        ¡Gracias por confiar en Lya Market! 🍃
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
