import { createFileRoute } from "@tanstack/react-router";
import { Terminos } from "@/components/site/legal";

export const Route = createFileRoute("/terminos")({
  head: () => ({
    meta: [{ title: "Condiciones de Compra — Lya Market" }],
  }),
  component: Terminos,
});
