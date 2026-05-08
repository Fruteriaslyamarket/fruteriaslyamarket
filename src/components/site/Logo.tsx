import { Link } from "@tanstack/react-router";
import logoImg from "@/assets/logo.png";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      to="/"
      className={`group flex items-center gap-3 ${className}`}
      aria-label="Lya Market — Inicio"
    >
      <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-background ring-1 ring-border shadow-sm transition-transform group-hover:-rotate-3">
        <img
          src={logoImg}
          alt="Lya Market"
          className="h-full w-full object-cover"
          loading="eager"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-semibold tracking-tight">
          Lya Market
        </span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Fresco cada día
        </span>
      </span>
    </Link>
  );
}
