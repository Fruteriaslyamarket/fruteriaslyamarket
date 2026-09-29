import { createFileRoute } from "@tanstack/react-router";
import { Cookies } from "@/components/site/legal";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [{ title: "Política de Cookies — Lya Market" }],
  }),
  component: Cookies,
});
