import { createFileRoute } from "@tanstack/react-router";
import { Privacidad } from "@/components/site/legal";

export const Route = createFileRoute("/privacidad")({
  head: () => ({
    meta: [{ title: "Política de Privacidad — Lya Market" }],
  }),
  component: Privacidad,
});
