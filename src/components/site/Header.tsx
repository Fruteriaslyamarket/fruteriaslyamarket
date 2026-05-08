import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBasket, X } from "lucide-react";
import * as React from "react";
import { Logo } from "./Logo";
import { useCart } from "@/lib/cart";

const NAV = [
  { to: "/", label: "Inicio" },
  { to: "/tienda", label: "Tienda" },
  { to: "/ofertas", label: "Ofertas" },
  { to: "/contacto", label: "Contacto" },
] as const;

export function Header() {
  const { totalQty, open } = useCart();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="flex h-16 w-full items-center px-4 md:px-6">
        {/* Izquierda: logo */}
        <div className="flex flex-1 items-center">
          <Logo />
        </div>

        {/* Centro: nav escritorio */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground hover:bg-accent/50"
              activeProps={{ className: "bg-accent text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Derecha: carrito + hamburger */}
        <div className="flex flex-1 items-center justify-end gap-1">
          <button
            type="button"
            onClick={open}
            className="relative inline-flex h-10 items-center gap-2 rounded-full bg-primary px-3 text-sm font-medium text-primary-foreground shadow-sm transition-transform hover:scale-[1.02] sm:px-4"
            aria-label={`Abrir carrito (${totalQty} artículos)`}
          >
            <ShoppingBasket className="h-4 w-4" />
            <span className="hidden sm:inline">Carrito</span>
            {totalQty > 0 && (
              <span className="ml-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-tomato px-1.5 text-[11px] font-bold text-tomato-foreground">
                {totalQty}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full text-foreground/80 hover:bg-accent/60 md:hidden"
            aria-label="Abrir menú"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-border/60 bg-background md:hidden">
          <ul className="flex flex-col p-2">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-foreground/80 hover:bg-accent/50"
                  activeProps={{ className: "bg-accent text-foreground" }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
