import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState } from "@tanstack/react-router";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/site/CartDrawer";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lya Market | Frutería Online con Reparto en Getafe y Móstoles" },
      {
        name: "description",
        content:
          "Frutería online con reparto a domicilio en Getafe y Móstoles. Fruta y verdura fresca de mercado, pedido online y paga al recibir. Envío a domicilio en Madrid.",
      },
      { name: "author", content: "Lya Market" },
      { name: "robots", content: "index, follow" },
      { name: "google-site-verification", content: "UXvRjEiuFQq_9_SO6v2QL71_ue0kwUSYVcbgEAusCB4" },
      { name: "geo.region", content: "ES-MD" },
      { name: "geo.placename", content: "Getafe, Móstoles, Madrid" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Lya Market" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:image", content: "https://fruteriaslyamarket.com/favicon.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@fruteriaslyamarket" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const isAdmin = useRouterState({ select: (s) => s.location.pathname.startsWith("/admin") });

  if (isAdmin) {
    return <Outlet />;
  }

  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
