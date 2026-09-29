import { createFileRoute } from "@tanstack/react-router";
import { AvisoLegal } from "@/components/site/legal";

export const Route = createFileRoute("/aviso-legal")({
  head: () => ({
    meta: [{ title: "Aviso Legal — Lya Market" }],
  }),
  component: AvisoLegal,
});
