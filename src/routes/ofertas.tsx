import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import { offerProducts } from "@/data/products";
import { buildWhatsAppMessage, whatsappLink } from "@/lib/cart";

export const Route = createFileRoute("/ofertas")({
  head: () => ({
    meta: [
      { title: "Ofertas de Fruta y Verdura | Cesta Semanal a Domicilio - Lya Market" },
      {
        name: "description",
        content:
          "Las mejores ofertas de fruta fresca y verdura variada de la semana. Cesta de la compra semanal con envío a domicilio en Getafe y Móstoles. Fruta de temporada al mejor precio.",
      },
      { property: "og:title", content: "Ofertas de Fruta y Verdura | Cesta Semanal - Lya Market" },
      { property: "og:description", content: "Cesta semanal de fruta fresca y verdura variada con reparto a domicilio en Getafe y Móstoles." },
      { property: "og:url", content: "https://fruteriaslyamarket.com/ofertas" },
    ],
    links: [
      { rel: "canonical", href: "https://fruteriaslyamarket.com/ofertas" },
    ],
  }),
  component: OfertasPage,
});

function OfertasPage() {
  const offers = offerProducts();
  const wa = whatsappLink(
    buildWhatsAppMessage(
      [],
      0,
    ).replace("Quiero hacer este pedido:", "Me interesa la cesta semanal."),
  );

  return (
    <div className="px-4 py-10 md:px-8 md:py-14">
      <header className="mb-10 mx-auto max-w-6xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-tomato/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-tomato">
          <Sparkles className="h-3.5 w-3.5" /> Esta semana
        </span>
        <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
          Ofertas de Fruta y Verdura Fresca
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Aprovecha los mejores precios de la semana en fruta de temporada y verdura variada. Cesta de la compra con envío a domicilio en Getafe y Móstoles.
        </p>
      </header>

      {/* Cesta semanal */}
      <section className="mx-auto max-w-6xl mb-12 overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-citrus/40 via-card to-accent/40 p-5 sm:p-8 md:p-10">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Cesta de la semana
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl md:text-4xl">
              Fruta y verdura para toda la familia
            </h2>
            <p className="mt-3 text-muted-foreground">
              Una selección variada de temporada por solo{" "}
              <span className="font-bold text-foreground">19,90 €</span>. Ideal para 4 personas.
            </p>
            <ul className="mt-5 grid grid-cols-2 gap-2 text-sm text-foreground">
              {[
                "1 kg Manzana",
                "1 kg Naranja",
                "1 kg Plátano",
                "1 kg Tomate",
                "1 kg Patata",
                "1 lechuga",
                "1 kg Zanahoria",
                "1 manojo cebolla",
              ].map((it) => (
                <li key={it} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {it}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-3 sm:mt-7">
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow"
              >
                Pedir cesta semanal
              </a>
              <Link
                to="/tienda"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-semibold hover:bg-accent/40"
              >
                Personalizar cesta <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=900&q=70"
              alt="Cesta semanal de fruta y verdura"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Productos en oferta */}
      <h2 className="mx-auto max-w-6xl mb-6 font-display text-2xl font-semibold sm:text-3xl">Promociones</h2>
      {offers.length === 0 ? (
        <p className="text-muted-foreground">No hay ofertas activas ahora mismo.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {offers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
