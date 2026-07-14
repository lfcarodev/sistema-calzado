"use client";

import { FormEvent, useEffect, useState } from "react";
import { getProducts, type Product } from "@/features/products/products-api";
import { registerStockMovement, type MovementKind } from "@/features/inventory/inventory-api";
import { InventoryHistory } from "@/features/inventory/inventory-history";

const inputClass = "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100";

export function InventoryScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [kind, setKind] = useState<MovementKind>("entry");
  const [unit, setUnit] = useState<"pair" | "dozen">("pair");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  async function loadProducts() {
    setIsLoading(true);
    try { setProducts(await getProducts()); }
    catch (error) { setMessage(error instanceof Error ? error.message : "No fue posible cargar el inventario."); }
    finally { setIsLoading(false); }
  }

  useEffect(() => { void loadProducts(); }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setIsSaving(true);
    setMessage(null);

    try {
      const enteredQuantity = Number(data.get("quantity"));
      const quantityInPairs = unit === "dozen" ? enteredQuantity * 12 : enteredQuantity;

      await registerStockMovement(kind, {
        productId: Number(data.get("productId")),
        quantity: quantityInPairs,
        observation: String(data.get("observation")).trim() || null,
      });
      form.reset();
      const unitLabel = unit === "dozen" ? "docena(s)" : "par(es)";
      setMessage(`${kind === "entry" ? "Entrada" : "Salida"} de ${enteredQuantity} ${unitLabel} registrada correctamente.`);
      await loadProducts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No fue posible registrar el movimiento.");
    } finally { setIsSaving(false); }
  }

  return <div className="space-y-6">
    <div><p className="text-sm font-medium text-amber-700">Operación</p><h2 className="mt-1 text-2xl font-semibold text-slate-900">Inventario</h2></div>
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-slate-900">Registrar movimiento</h3>
      <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <label className="text-sm font-medium text-slate-700">Tipo<select value={kind} onChange={(event) => setKind(event.target.value as MovementKind)} className={inputClass}><option value="entry">Entrada</option><option value="exit">Salida</option></select></label>
        <label className="text-sm font-medium text-slate-700">Producto<select required name="productId" defaultValue="" className={inputClass}><option value="" disabled>Selecciona un producto</option>{products.map((product) => <option key={product.id} value={product.id}>{product.reference} · {product.color} · Stock: {product.currentStock}</option>)}</select></label>
        <label className="text-sm font-medium text-slate-700">Cantidad<input required min="1" name="quantity" type="number" className={inputClass} /></label>
        <label className="text-sm font-medium text-slate-700">Unidad<select value={unit} onChange={(event) => setUnit(event.target.value as "pair" | "dozen")} className={inputClass}><option value="pair">Pares</option><option value="dozen">Docenas</option></select></label>
        <label className="text-sm font-medium text-slate-700">Observación<input name="observation" className={inputClass} /></label>
        <button disabled={isSaving || products.length === 0} className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{isSaving ? "Guardando..." : "Registrar movimiento"}</button>
      </form>
      {message && <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">{message}</p>}
    </section>
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-200 p-5"><h3 className="font-semibold text-slate-900">Existencias actuales</h3></div><div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">Referencia</th><th>Color</th><th>Curva</th><th className="px-5">Stock</th></tr></thead><tbody className="divide-y divide-slate-100 text-slate-700">{isLoading ? <tr><td colSpan={4} className="px-5 py-8 text-center">Cargando inventario...</td></tr> : products.map((product) => <tr key={product.id}><td className="px-5 py-3 font-medium text-slate-900">{product.reference}</td><td>{product.color}</td><td>{product.curve}</td><td className="px-5 font-semibold">{product.currentStock}</td></tr>)}</tbody></table></div></section>
    <InventoryHistory />
  </div>;
}
