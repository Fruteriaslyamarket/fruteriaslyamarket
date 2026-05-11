import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, Instagram, Clock, MapPin } from "lucide-react";

const contactSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "GroceryStore",
    "name": "Lya Market Getafe",
    "description": "Frutería en Getafe con reparto a domicilio. Fruta fresca, verdura variada y fruta de temporada. Envío a domicilio en Getafe y alrededores.",
    "url": "https://fruteriaslyamarket.com/contacto",
    "telephone": "+34674559853",
    "email": "fruteriaslyamarket@gmail.com",
    "image": "https://fruteriaslyamarket.com/favicon.png",
    "priceRange": "€",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        "opens": "09:00",
        "closes": "21:00"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Calle Cataluña 1",
      "addressLocality": "Getafe",
      "addressRegion": "Madrid",
      "postalCode": "28903",
      "addressCountry": "ES"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "40.3050",
      "longitude": "-3.7310"
    },
    "hasMap": "https://www.google.com/maps?q=Calle+Catalu%C3%B1a+1,+Getafe",
    "sameAs": ["https://www.instagram.com/fruteriaslyamarket"]
  },
  {
    "@context": "https://schema.org",
    "@type": "GroceryStore",
    "name": "Lya Market Móstoles",
    "description": "Frutería en Móstoles con reparto a domicilio. Fruta fresca, verdura variada y fruta de temporada. Envío a domicilio en Móstoles y alrededores.",
    "url": "https://fruteriaslyamarket.com/contacto",
    "telephone": "+34674559853",
    "email": "fruteriaslyamarket@gmail.com",
    "image": "https://fruteriaslyamarket.com/favicon.png",
    "priceRange": "€",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        "opens": "09:00",
        "closes": "21:00"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Calle Joaquín Blume 23",
      "addressLocality": "Móstoles",
      "addressRegion": "Madrid",
      "postalCode": "28933",
      "addressCountry": "ES"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "40.3222",
      "longitude": "-3.8645"
    },
    "hasMap": "https://www.google.com/maps?q=Calle+Joaqu%C3%ADn+Blume+23,+M%C3%B3stoles",
    "sameAs": ["https://www.instagram.com/fruteriaslyamarket"]
  }
];

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Frutería en Getafe y Móstoles | Contacto Lya Market" },
      {
        name: "description",
        content:
          "Frutería online en Getafe (Calle Cataluña 1) y Móstoles (Calle Joaquín Blume 23). Reparto a domicilio todos los días de 9:00 a 21:00. Llámanos: 674 559 853.",
      },
      { property: "og:title", content: "Frutería en Getafe y Móstoles | Lya Market" },
      { property: "og:description", content: "Tiendas en Getafe y Móstoles con reparto a domicilio. Abierto todos los días de 9:00 a 21:00." },
      { property: "og:url", content: "https://fruteriaslyamarket.com/contacto" },
    ],
    links: [
      { rel: "canonical", href: "https://fruteriaslyamarket.com/contacto" },
    ],
    scripts: contactSchemas.map((schema) => ({
      type: "application/ld+json",
      children: JSON.stringify(schema),
    })),
  }),
  component: ContactoPage,
});

const stores = [
  {
    city: "Getafe",
    address: "Calle Cataluña 1, Getafe",
    map: "https://www.google.com/maps?q=Calle%20Catalu%C3%B1a%201%2C%20Getafe&output=embed",
  },
  {
    city: "Móstoles",
    address: "Calle Joaquín Blume 23, Móstoles",
    map: "https://www.google.com/maps?q=Calle%20Joaqu%C3%ADn%20Blume%2023%2C%20M%C3%B3stoles&output=embed",
  },
];

function ContactoPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <header className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Estamos cerca
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">Frutería en Getafe y Móstoles</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Llámanos, escríbenos o pásate por una de nuestras tiendas. Fruta fresca y verdura variada con reparto a domicilio en Getafe y Móstoles. Abiertos todos los días de 9:00 a 21:00.
        </p>
      </header>

      <section className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: Phone,
            label: "Teléfono",
            value: "674 559 853",
            href: "tel:+34674559853",
          },
          {
            icon: Mail,
            label: "Email",
            value: "fruteriaslyamarket@gmail.com",
            href: "mailto:fruteriaslyamarket@gmail.com",
          },
          {
            icon: Instagram,
            label: "Instagram",
            value: "@fruteriaslyamarket",
            href: "https://instagram.com/fruteriaslyamarket",
          },
          {
            icon: Clock,
            label: "Horario",
            value: "Lun – Dom · 9:00 – 21:00",
          },
        ].map((c) => {
          const Icon = c.icon;
          const Inner = (
            <>
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {c.label}
                </p>
                <p className="mt-0.5 truncate font-semibold">{c.value}</p>
              </div>
            </>
          );
          return c.href ? (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 transition-shadow hover:shadow-md"
            >
              {Inner}
            </a>
          ) : (
            <div
              key={c.label}
              className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4"
            >
              {Inner}
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {stores.map((s) => (
          <article
            key={s.city}
            className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm"
          >
            <div className="aspect-[16/10] w-full bg-muted">
              <iframe
                src={s.map}
                title={`Mapa Lya Market ${s.city}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-primary">
                <MapPin className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Tienda</span>
              </div>
              <h2 className="mt-1 font-display text-2xl font-semibold">{s.city}</h2>
              <p className="mt-1 text-muted-foreground">{s.address}</p>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(s.address)}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
              >
                Cómo llegar
              </a>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
