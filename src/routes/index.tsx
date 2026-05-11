import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useEffect } from "react";
import { Leaf, MapPin, Truck, Clock, ArrowRight, ChevronDown } from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import { featuredProducts } from "@/data/products";
import { whatsappLink } from "@/lib/cart";
import heroImage from "@/assets/hero.png";
import vanVideo from "@/assets/van.mp4";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "GroceryStore",
  "name": "Lya Market",
  "description": "Frutería online con reparto a domicilio en Getafe y Móstoles. Fruta y verdura fresca de mercado, fruta de temporada, verdura variada y cesta de la compra semanal.",
  "url": "https://fruteriaslyamarket.com",
  "telephone": "+34674559853",
  "email": "fruteriaslyamarket@gmail.com",
  "image": "https://fruteriaslyamarket.com/favicon.png",
  "priceRange": "€",
  "currenciesAccepted": "EUR",
  "paymentAccepted": "Cash, Credit Card",
  "openingHours": "Mo-Su 09:00-21:00",
  "servesCuisine": "Frutas y verduras frescas",
  "hasMap": "https://www.google.com/maps?q=Calle+Catalu%C3%B1a+1,+Getafe",
  "areaServed": [
    { "@type": "City", "name": "Getafe" },
    { "@type": "City", "name": "Móstoles" },
    { "@type": "City", "name": "Madrid" }
  ],
  "location": [
    {
      "@type": "GroceryStore",
      "name": "Lya Market Getafe",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Calle Cataluña 1",
        "addressLocality": "Getafe",
        "addressRegion": "Madrid",
        "postalCode": "28903",
        "addressCountry": "ES"
      },
      "telephone": "+34674559853",
      "openingHours": "Mo-Su 09:00-21:00",
      "geo": { "@type": "GeoCoordinates", "latitude": "40.3050", "longitude": "-3.7310" }
    },
    {
      "@type": "GroceryStore",
      "name": "Lya Market Móstoles",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Calle Joaquín Blume 23",
        "addressLocality": "Móstoles",
        "addressRegion": "Madrid",
        "postalCode": "28933",
        "addressCountry": "ES"
      },
      "telephone": "+34674559853",
      "openingHours": "Mo-Su 09:00-21:00",
      "geo": { "@type": "GeoCoordinates", "latitude": "40.3222", "longitude": "-3.8645" }
    }
  ],
  "sameAs": [
    "https://www.instagram.com/fruteriaslyamarket"
  ]
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Lya Market",
  "url": "https://fruteriaslyamarket.com",
  "description": "Frutería online con reparto a domicilio en Getafe y Móstoles",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://fruteriaslyamarket.com/tienda?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lya Market | Frutería Online con Reparto a Domicilio en Getafe y Móstoles" },
      {
        name: "description",
        content:
          "Frutería online con reparto a domicilio en Getafe y Móstoles. Fruta fresca, verdura variada, fruta de temporada y cesta semanal. Paga al recibir. Envío a domicilio en Madrid.",
      },
      { property: "og:title", content: "Lya Market | Frutería Online - Fruta Fresca a Domicilio en Getafe y Móstoles" },
      {
        property: "og:description",
        content: "Fruta y verdura fresca con reparto a domicilio en Getafe y Móstoles. Pedido online, paga al recibir.",
      },
      { property: "og:url", content: "https://fruteriaslyamarket.com/" },
      { name: "twitter:title", content: "Lya Market | Frutería Online - Fruta Fresca a Domicilio" },
      { name: "twitter:description", content: "Fruta y verdura fresca con reparto a domicilio en Getafe y Móstoles." },
    ],
    links: [
      { rel: "canonical", href: "https://fruteriaslyamarket.com/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(localBusinessSchema),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(websiteSchema),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const featured = featuredProducts();
const wa = whatsappLink("¡Hola Lya Market! Quería preguntaros por un pedido.");

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative h-screen overflow-hidden">

        {/* Imagen — fondo completo */}
        <img
          src={heroImage}
          alt="Fruta y verdura fresca Lya Market - frutería online en Getafe y Móstoles"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover [object-position:80%_50%] md:object-center"
        />

        {/* Overlay móvil: de arriba (sólido) a abajo (transparente) para que el texto sea legible */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/65 via-background/35 to-transparent md:hidden" />


        {/* Contenido — arriba en móvil, centrado en escritorio */}
        <div className="relative z-10 flex flex-col justify-start px-6 pt-4 pb-8 md:h-full md:w-[55%] md:justify-center md:px-16 md:pt-0 md:pb-0">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Leaf className="h-3.5 w-3.5" /> De mercado a tu mesa
            </span>
            <h1 className="mt-4 font-display text-3xl font-semibold leading-[1.1] text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
              Fruta y verdura fresca,{" "}
              <span className="text-primary">cada día</span> en Getafe y Móstoles.
            </h1>
            <p className="mt-4 text-sm text-muted-foreground sm:mt-5 sm:text-base md:text-lg">
              Seleccionamos lo mejor del mercado y te lo llevamos a casa. Haz tu pedido online y
              paga al recibir, en efectivo o con tarjeta.
            </p>
            <div className="mt-20 flex flex-wrap gap-2 sm:gap-3">
              <Link
                to="/tienda"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-md transition-transform hover:scale-[1.02] sm:h-12 sm:px-6"
              >
                Ver tienda <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground hover:bg-muted sm:h-12 sm:px-6"
              >
                Pedir por WhatsApp
              </a>
            </div>
            <ul className="mt-[160px] grid grid-cols-3 gap-1.5 sm:mt-10 sm:gap-3">
              <li className="flex flex-col items-start gap-1 rounded-xl border border-white/30 bg-white/20 p-2 text-foreground shadow-sm backdrop-blur-md sm:gap-1.5 sm:rounded-2xl sm:p-4">
                <Truck className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" />
                <span className="text-[10px] font-semibold leading-tight sm:text-sm">Reparto local</span>
                <span className="hidden text-[10px] text-foreground/60 sm:block sm:text-xs">Getafe y Móstoles</span>
              </li>
              <li className="flex flex-col items-start gap-1 rounded-xl border border-white/30 bg-white/20 p-2 text-foreground shadow-sm backdrop-blur-md sm:gap-1.5 sm:rounded-2xl sm:p-4">
                <Clock className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" />
                <span className="text-[10px] font-semibold leading-tight sm:text-sm">9:00 – 21:00</span>
                <span className="hidden text-[10px] text-foreground/60 sm:block sm:text-xs">Todos los días</span>
              </li>
              <li className="flex flex-col items-start gap-1 rounded-xl border border-white/30 bg-white/20 p-2 text-foreground shadow-sm backdrop-blur-md sm:gap-1.5 sm:rounded-2xl sm:p-4">
                <Leaf className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" />
                <span className="text-[10px] font-semibold leading-tight sm:text-sm">Producto fresco</span>
                <span className="hidden text-[10px] text-foreground/60 sm:block sm:text-xs">De mercado</span>
              </li>
            </ul>
          </div>

        {/* Blend hero → destacados */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ── Destacados ─────────────────────────────────────── */}
      <section className="relative z-10 bg-background px-4 pb-16 pt-8 md:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">Lo más fresco hoy</h2>
            <p className="mt-1 text-muted-foreground">Selección recién traída del mercado.</p>
          </div>
          <Link
            to="/tienda"
            className="hidden text-sm font-semibold text-primary hover:underline sm:inline-flex sm:items-center sm:gap-1"
          >
            Ver todo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Blend destacados → vídeo */}
      <div className="pointer-events-none relative z-10 -mt-16 h-16 bg-gradient-to-b from-background to-transparent" />

      {/* ── Vídeo van ──────────────────────────────────────── */}
      <VanSection />

      {/* ── Zonas de reparto ───────────────────────────────── */}
      <section className="relative z-10 bg-gradient-to-b from-transparent via-background to-background px-4 pb-12 pt-16 md:pb-20 md:pt-36">

        {/* Carreteritas — conector visual del recuadro verde a cada ciudad */}
        <div className="mx-auto -mt-16 mb-2 max-w-6xl overflow-visible" aria-hidden="true">
          <svg viewBox="0 0 800 120" className="w-full overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="arr-l" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
                <path d="M0,0.5 L6,3.5 L0,6.5 Z" fill="#3A7A45" opacity="0.45" />
              </marker>
              <marker id="arr-r" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
                <path d="M0,0.5 L6,3.5 L0,6.5 Z" fill="#3A7A45" opacity="0.45" />
              </marker>
            </defs>
            {/* Carretera izquierda → Getafe */}
            <path
              d="M 400 0 C 400 50, 200 75, 200 120"
              stroke="#3A7A45" strokeWidth="2" strokeDasharray="7 5"
              strokeLinecap="round" opacity="0.3" markerEnd="url(#arr-l)"
            />
            {/* Carretera derecha → Móstoles */}
            <path
              d="M 400 0 C 400 50, 600 75, 600 120"
              stroke="#3A7A45" strokeWidth="2" strokeDasharray="7 5"
              strokeLinecap="round" opacity="0.3" markerEnd="url(#arr-r)"
            />
          </svg>
        </div>

        <div className="mx-auto max-w-6xl grid gap-6 md:grid-cols-2">
          {[
            { city: "Getafe", address: "Calle Cataluña 1" },
            { city: "Móstoles", address: "Calle Joaquín Blume 23" },
          ].map((loc) => (
            <div
              key={loc.city}
              className="rounded-3xl border border-border bg-card p-8 text-foreground transition-shadow hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-semibold">{loc.city}</h3>
                  <p className="text-sm text-muted-foreground">{loc.address}</p>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">
                Reparto a domicilio en {loc.city} y alrededores. También puedes recoger tu pedido en
                tienda.
              </p>
              <Link
                to="/contacto"
                className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                Cómo llegar <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function VanSection() {
  const wrapperRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let rafId: number;
    let smoothP = 0;

    const getP = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper || !video.duration) return smoothP;
      const { top, height } = wrapper.getBoundingClientRect();
      const scrollable = height - window.innerHeight;
      return Math.min(Math.max(-top / scrollable, 0), 1);
    };

    const loop = () => {
      const targetP = getP();
      smoothP += (targetP - smoothP) * 0.15;

      video.currentTime = Math.min(smoothP * video.duration, video.duration - 0.04);

      if (indicatorRef.current) {
        indicatorRef.current.style.opacity = String(Math.max(0, 1 - smoothP * 6));
      }

      if (ctaRef.current) {
        const show = smoothP > 0.88;
        ctaRef.current.style.opacity = show ? "1" : "0";
        ctaRef.current.style.transform = `translateX(-50%) translateY(${show ? "0px" : "100px"})`;
      }

      rafId = requestAnimationFrame(loop);
    };

    // iOS Safari no carga datos de vídeo sin autoplay ni interacción del usuario.
    // play() + pause() inmediato desbloquea el buffer para poder hacer scrubbing.
    const unlock = () =>
      video.play().then(() => { video.pause(); loop(); }).catch(() => loop());

    if (video.readyState >= 1) {
      unlock();
    } else {
      video.addEventListener("loadedmetadata", unlock, { once: true });
    }

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section ref={wrapperRef} className="relative h-[200vh] md:h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden" style={{ zIndex: 1 }}>
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover [object-position:25%_50%] md:object-center"
          src={vanVideo}
          muted
          autoPlay
          playsInline
          preload="auto"
        />

        {/* Blend top — fusión con sección superior */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent" />

        {/* Blend bottom — fusión con sección inferior */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

        {/* Blend laterales — solo móvil */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent md:hidden" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent md:hidden" />

        {/* Scroll down indicator */}
        <div
          ref={indicatorRef}
          className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] drop-shadow">Scroll</span>
          <ChevronDown className="h-5 w-5 animate-bounce drop-shadow" />
        </div>

        {/* Caja verde — sube del maletero al final del vídeo */}
        <div
          ref={ctaRef}
          className="absolute bottom-0 left-1/2 w-full max-w-2xl px-6 pb-10"
          style={{
            opacity: 0,
            transform: "translateX(-50%) translateY(100px)",
            transition: "opacity 0.6s ease, transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <div className="overflow-hidden rounded-3xl bg-primary p-8 text-center text-primary-foreground">
            <span className="inline-block rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              Cesta semanal
            </span>
            <h3 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">
              Fruta y verdura para toda la semana, de Lya a tu hogar.
            </h3>
            <div className="mt-5 flex justify-center">
              <Link
                to="/tienda"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white/90 px-6 text-sm font-semibold text-foreground shadow"
              >
                Ver tienda <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
