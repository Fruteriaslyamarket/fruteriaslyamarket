import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import {
  Pencil, Trash2, Plus, LogOut, Send, Eye, EyeOff,
  Star, Tag, Loader2, CheckCircle2, AlertCircle, X,
} from "lucide-react";
import { ALL_PRODUCTS, CATEGORIES } from "@/data/products";
import type { Product, ProductCategory } from "@/data/products";
import { getFileSha, updateFile } from "@/lib/github";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as string;
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN as string;
const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO as string;
const GITHUB_BRANCH = (import.meta.env.VITE_GITHUB_BRANCH as string) || "main";
const PRODUCTS_PATH = "src/data/products.json";

const CATEGORY_OPTIONS = CATEGORIES.filter((c) => c.value !== "todas");

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel — Lya Market" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

// ─── Types ────────────────────────────────────────────────────────────────────

type SaveState = "idle" | "saving" | "saved" | "error";

// ─── Main page ────────────────────────────────────────────────────────────────

function AdminPage() {
  const notConfigured = !ADMIN_PASSWORD || !GITHUB_TOKEN || !GITHUB_REPO;
  const [loggedIn, setLoggedIn] = React.useState(
    () => sessionStorage.getItem("lya-admin") === "true",
  );

  if (notConfigured) return <ConfigError />;
  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  return <Dashboard onLogout={() => { sessionStorage.removeItem("lya-admin"); setLoggedIn(false); }} />;
}

// ─── Config error ─────────────────────────────────────────────────────────────

function ConfigError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
        <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
        <h1 className="mt-4 text-xl font-semibold text-gray-900">Panel no configurado</h1>
        <p className="mt-2 text-sm text-gray-600">
          Añade estas variables de entorno en Vercel (Settings → Environment Variables):
        </p>
        <ul className="mt-4 space-y-1 text-left font-mono text-xs text-gray-700">
          <li className="rounded bg-gray-100 px-3 py-1">VITE_ADMIN_PASSWORD</li>
          <li className="rounded bg-gray-100 px-3 py-1">VITE_GITHUB_TOKEN</li>
          <li className="rounded bg-gray-100 px-3 py-1">VITE_GITHUB_REPO (ej: usuario/lyamarket)</li>
          <li className="rounded bg-gray-100 px-3 py-1">VITE_GITHUB_BRANCH (por defecto: main)</li>
        </ul>
      </div>
    </div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = React.useState("");
  const [error, setError] = React.useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem("lya-admin", "true");
      onLogin();
    } else {
      setError("Contraseña incorrecta");
      setPw("");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-center font-display text-2xl font-semibold text-gray-900">
          Lya Market
        </h1>
        <p className="mt-1 text-center text-sm text-gray-500">Panel de administración</p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              value={pw}
              onChange={(e) => { setPw(e.target.value); setError(""); }}
              autoFocus
              className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              placeholder="••••••••"
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
          </div>
          <button
            type="submit"
            className="h-11 w-full rounded-xl bg-green-600 text-sm font-semibold text-white hover:bg-green-700"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [products, setProducts] = React.useState<Product[]>(() =>
    JSON.parse(JSON.stringify(ALL_PRODUCTS)),
  );
  const [saveState, setSaveState] = React.useState<SaveState>("idle");
  const [saveError, setSaveError] = React.useState("");
  const [editing, setEditing] = React.useState<Product | null>(null);
  const [isNew, setIsNew] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [catFilter, setCatFilter] = React.useState<ProductCategory | "todas">("todas");

  const dirty = JSON.stringify(products) !== JSON.stringify(ALL_PRODUCTS);

  const filtered = products.filter((p) => {
    const matchesCat = catFilter === "todas" || p.category === catFilter;
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const publish = async () => {
    setSaveState("saving");
    setSaveError("");
    try {
      const sha = await getFileSha(GITHUB_TOKEN, GITHUB_REPO, PRODUCTS_PATH, GITHUB_BRANCH);
      const content = JSON.stringify(products, null, 2);
      await updateFile(GITHUB_TOKEN, GITHUB_REPO, PRODUCTS_PATH, content, sha, "admin: actualizar productos", GITHUB_BRANCH);
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 5000);
    } catch (e) {
      setSaveState("error");
      setSaveError(e instanceof Error ? e.message : "Error desconocido");
    }
  };

  const saveProduct = (p: Product) => {
    setProducts((prev) =>
      isNew ? [...prev, p] : prev.map((x) => (x.id === p.id ? p : x)),
    );
    setEditing(null);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
  };

  const toggle = (id: string, field: "hidden" | "featured" | "offer") => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: !p[field] } : p)),
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto max-w-6xl">
          {/* Una fila en escritorio, dos filas en móvil */}
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="font-display text-base font-semibold text-gray-900 md:text-lg">Panel de administración</h1>
              <p className="text-xs text-gray-500">Lya Market — {products.length} productos</p>
            </div>
            {/* Botones escritorio */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              {saveState === "saved" && (
                <span className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Publicado — la web se actualiza en ~1 min
                </span>
              )}
              {saveState === "error" && (
                <span className="flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {saveError}
                </span>
              )}
              <button
                onClick={publish}
                disabled={saveState === "saving" || !dirty}
                className="flex h-9 items-center gap-2 rounded-lg bg-green-600 px-4 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
              >
                {saveState === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {saveState === "saving" ? "Publicando…" : "Publicar cambios"}
              </button>
              <button
                onClick={onLogout}
                className="flex h-9 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm text-gray-600 hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4" />
                Salir
              </button>
            </div>
            {/* Botón salir móvil */}
            <button
              onClick={onLogout}
              className="md:hidden flex h-9 items-center gap-1 rounded-lg border border-gray-200 px-3 text-sm text-gray-600 shrink-0"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
          {/* Botón desplegar — solo móvil */}
          <div className="mt-2 md:hidden">
            {saveState === "saved" && (
              <p className="mb-1.5 flex items-center gap-1 text-xs text-green-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Publicado — la web se actualiza en ~1 min
              </p>
            )}
            {saveState === "error" && (
              <p className="mb-1.5 flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3.5 w-3.5" />
                {saveError}
              </p>
            )}
            <button
              onClick={publish}
              disabled={saveState === "saving" || !dirty}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-green-600 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saveState === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {saveState === "saving" ? "Desplegando…" : "Desplegar cambios"}
            </button>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            placeholder="Buscar producto…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full md:w-56 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
          />
          <div className="flex w-full md:w-auto items-center gap-3">
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value as ProductCategory | "todas")}
              className="h-9 flex-1 md:flex-none rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-green-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <span className="text-sm text-gray-500 whitespace-nowrap">{filtered.length} productos</span>
            <button
              onClick={() => { setEditing({ id: "", name: "", description: "", category: "verduras", price: 0, unit: "kg", image: "" }); setIsNew(true); }}
              className="flex h-9 items-center gap-2 rounded-lg bg-gray-900 px-4 text-sm font-semibold text-white hover:bg-gray-700"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Añadir producto</span>
              <span className="sm:hidden">Añadir</span>
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-yellow-500" /> Destacado en inicio</span>
          <span className="flex items-center gap-1"><Tag className="h-3.5 w-3.5 text-orange-500" /> En oferta</span>
          <span className="flex items-center gap-1"><EyeOff className="h-3.5 w-3.5 text-gray-400" /> Oculto en la tienda</span>
        </div>
      </div>

      {/* Product list */}
      <div className="mx-auto max-w-6xl px-4 pb-10">
        {!dirty && (
          <p className="mb-3 text-xs text-gray-400">
            Sin cambios pendientes. Edita productos y pulsa "Publicar cambios" cuando termines.
          </p>
        )}
        {dirty && (
          <p className="mb-3 text-xs font-medium text-amber-600">
            Tienes cambios sin publicar. Pulsa "Publicar cambios" para actualizarlos en la web.
          </p>
        )}

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs font-medium uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3 text-left">Producto</th>
                <th className="hidden px-4 py-3 text-left md:table-cell">Categoría</th>
                <th className="px-4 py-3 text-right">Precio</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p.id} className={p.hidden ? "opacity-40" : ""}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-10 w-10 shrink-0 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{p.name}</p>
                        <p className="line-clamp-1 text-xs text-gray-400">{p.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      {CATEGORY_OPTIONS.find((c) => c.value === p.category)?.label ?? p.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-semibold text-gray-900">
                      {p.price.toFixed(2).replace(".", ",")} €
                    </span>
                    <span className="text-xs text-gray-400"> / {p.unit}</span>
                    {p.offer && p.oldPrice && (
                      <p className="text-xs text-gray-400 line-through">
                        {p.oldPrice.toFixed(2).replace(".", ",")} €
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => toggle(p.id, "featured")}
                        title={p.featured ? "Quitar de destacados" : "Marcar como destacado"}
                        className={`rounded p-1 ${p.featured ? "text-yellow-500" : "text-gray-300 hover:text-yellow-400"}`}
                      >
                        <Star className="h-4 w-4" fill={p.featured ? "currentColor" : "none"} />
                      </button>
                      <button
                        onClick={() => toggle(p.id, "offer")}
                        title={p.offer ? "Quitar oferta" : "Poner en oferta"}
                        className={`rounded p-1 ${p.offer ? "text-orange-500" : "text-gray-300 hover:text-orange-400"}`}
                      >
                        <Tag className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggle(p.id, "hidden")}
                        title={p.hidden ? "Mostrar en tienda" : "Ocultar de tienda"}
                        className={`rounded p-1 ${p.hidden ? "text-gray-500" : "text-gray-300 hover:text-gray-500"}`}
                      >
                        {p.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => { setEditing({ ...p }); setIsNew(false); }}
                        className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        className="rounded-lg border border-red-100 p-2 text-red-400 hover:bg-red-50"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm text-gray-400">
                    No hay productos que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


      </div>

      {/* Edit / Add modal */}
      {editing && (
        <ProductModal
          product={editing}
          isNew={isNew}
          onSave={saveProduct}
          onClose={() => setEditing(null)}
        />
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="font-semibold text-gray-900">¿Eliminar producto?</h2>
            <p className="mt-1 text-sm text-gray-500">
              Esta acción no se puede deshacer. El producto desaparecerá de la tienda tras publicar.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => deleteProduct(deleteId)}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                Eliminar
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Product modal ─────────────────────────────────────────────────────────────

function ProductModal({
  product,
  isNew,
  onSave,
  onClose,
}: {
  product: Product;
  isNew: boolean;
  onSave: (p: Product) => void;
  onClose: () => void;
}) {
  const [form, setForm] = React.useState<Product>({ ...product });
  const [errors, setErrors] = React.useState<Partial<Record<keyof Product, string>>>({});

  const set = <K extends keyof Product>(key: K, value: Product[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = "El nombre es obligatorio";
    if (!form.price || form.price <= 0) e.price = "El precio debe ser mayor que 0";
    if (!form.unit.trim()) e.unit = "La unidad es obligatoria";
    return e;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const id = isNew ? slugify(form.name) || crypto.randomUUID() : form.id;
    onSave({ ...form, id, offer: form.offer ?? false, oldPrice: form.offer ? (form.oldPrice ?? 0) : undefined });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 py-10">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="font-semibold text-gray-900">
            {isNew ? "Añadir producto" : "Editar producto"}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4 px-6 py-5">
          {/* Name */}
          <Field label="Nombre" error={errors.name}>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className={input(!!errors.name)}
              placeholder="Ej: Manzana Fuji"
            />
          </Field>

          {/* Description */}
          <Field label="Descripción">
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={2}
              className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              placeholder="Breve descripción del producto…"
            />
          </Field>

          {/* Category */}
          <Field label="Categoría">
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value as ProductCategory)}
              className={input(false)}
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </Field>

          {/* Price + Unit */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Precio (€)" error={errors.price}>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price || ""}
                onChange={(e) => set("price", parseFloat(e.target.value) || 0)}
                className={input(!!errors.price)}
                placeholder="0.00"
              />
            </Field>
            <Field label="Unidad" error={errors.unit}>
              <input
                type="text"
                value={form.unit}
                onChange={(e) => set("unit", e.target.value)}
                className={input(!!errors.unit)}
                placeholder="kg, ud, manojo…"
              />
            </Field>
          </div>

          {/* Image URL */}
          <Field label="URL de imagen">
            <input
              type="url"
              value={form.image}
              onChange={(e) => set("image", e.target.value)}
              className={input(false)}
              placeholder="https://images.unsplash.com/…"
            />
            {form.image && (
              <img
                src={form.image}
                alt=""
                className="mt-2 h-24 w-full rounded-lg object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            )}
          </Field>

          {/* Toggles */}
          <div className="space-y-2 rounded-xl bg-gray-50 p-4">
            <Toggle
              label="Producto destacado en la página de inicio"
              checked={form.featured ?? false}
              onChange={(v) => set("featured", v)}
            />
            <Toggle
              label="En oferta (precio rebajado)"
              checked={form.offer ?? false}
              onChange={(v) => set("offer", v)}
            />
            {form.offer && (
              <div className="pt-1 pl-8">
                <label className="mb-1 block text-xs text-gray-500">Precio anterior (€)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.oldPrice ?? ""}
                  onChange={(e) => set("oldPrice", parseFloat(e.target.value) || undefined)}
                  className="h-8 w-32 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-green-500"
                  placeholder="0.00"
                />
              </div>
            )}
            <Toggle
              label="Ocultar en la tienda (sin eliminar)"
              checked={form.hidden ?? false}
              onChange={(v) => set("hidden", v)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
            >
              {isNew ? "Añadir producto" : "Guardar cambios"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Small helpers ─────────────────────────────────────────────────────────────

function input(hasError: boolean) {
  return `h-10 w-full rounded-xl border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-green-500/20 ${
    hasError ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-green-500"
  }`;
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <div
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 rounded-full transition-colors ${checked ? "bg-green-500" : "bg-gray-300"}`}
      >
        <div
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`}
        />
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}
