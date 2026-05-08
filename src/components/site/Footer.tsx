import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, Phone, Clock } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo />
          <p className="mt-4 text-sm text-muted-foreground">
            Fruta y verdura fresca de mercado. Reparto a domicilio en Getafe, Móstoles y alrededores.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
            Navegación
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">Inicio</Link></li>
            <li><Link to="/tienda" className="hover:text-foreground">Tienda</Link></li>
            <li><Link to="/ofertas" className="hover:text-foreground">Ofertas</Link></li>
            <li><Link to="/contacto" className="hover:text-foreground">Contacto</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
            Contacto
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 text-primary" />
              <a href="tel:+34674559853" className="hover:text-foreground">674 559 853</a>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 text-primary" />
              <a href="mailto:fruteriaslyamarket@gmail.com" className="break-all hover:text-foreground">
                fruteriaslyamarket@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Instagram className="mt-0.5 h-4 w-4 text-primary" />
              <a
                href="https://instagram.com/fruteriaslyamarket"
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground"
              >
                @fruteriaslyamarket
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 text-primary" />
              <span>Lun – Dom · 9:00 – 21:00</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
            Tiendas
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <div className="font-medium text-foreground">Getafe</div>
                Calle Cataluña 1
              </div>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <div className="font-medium text-foreground">Móstoles</div>
                Calle Joaquín Blume 23
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Fruterías Lya SL · CIF B26988139 · Calle Cataluña 1, Getafe</p>
          <p>Hecho con cariño para nuestros vecinos 🍃</p>
        </div>
      </div>
    </footer>
  );
}
