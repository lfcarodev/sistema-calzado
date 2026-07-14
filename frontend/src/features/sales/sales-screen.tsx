"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { getProducts, type Product } from "@/features/products/products-api";
import { createSale } from "@/features/sales/sales-api";
import { SalesHistory } from "@/features/sales/sales-history";

type SaleUnit = "pair" | "dozen";
interface SaleLine { product: Product; quantity: number; unit: SaleUnit; }
const money = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
const inputClass = "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100";

export function SalesScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [lines, setLines] = useState<SaleLine[]>([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState<SaleUnit>("pair");
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { void getProducts().then(setProducts).catch((error) => setMessage(error.message)); }, []);
  const total = useMemo(() => lines.reduce((sum, line) => sum + (line.product.salePrice ?? 0) * line.quantity, 0), [lines]);

  function addLine() {
    const product = products.find((item) => item.id === Number(productId));
    if (!product) return;
    const quantityInPairs = unit === "dozen" ? quantity * 12 : quantity;
    if (quantityInPairs > product.currentStock) { setMessage("La cantidad supera el stock disponible."); return; }
    setLines((current) => [...current.filter((line) => line.product.id !== product.id), { product, quantity: quantityInPairs, unit }]);
    setProductId(""); setQuantity(1); setMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lines.length === 0) { setMessage("Agrega al menos un producto a la venta."); return; }
    const form = event.currentTarget;
    const data = new FormData(form);
    setIsSaving(true); setMessage(null);
    try {
      const result = await createSale({ customerName: String(data.get("customerName")).trim(), phone: String(data.get("phone")).trim() || null, observation: String(data.get("observation")).trim() || null, items: lines.map((line) => ({ productId: line.product.id, quantity: line.quantity })) });
      form.reset(); setLines([]); setMessage(`Venta ${result.number} registrada correctamente.`); setProducts(await getProducts());
    } catch (error) { setMessage(error instanceof Error ? error.message : "No fue posible registrar la venta."); }
    finally { setIsSaving(false); }
  }

  return <div className="space-y-6"><div><p className="text-sm font-medium text-amber-700">Operación</p><h2 className="mt-1 text-2xl font-semibold text-slate-900">Ventas</h2></div>
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-semibold text-slate-900">Agregar producto</h3><div className="mt-4 grid gap-3 md:grid-cols-[1fr_120px_140px_auto]"><select value={productId} onChange={(event) => setProductId(event.target.value)} className={inputClass.replace("mt-1 ", "")}><option value="">Selecciona un producto</option>{products.filter((product) => product.currentStock > 0 && product.salePrice !== null).map((product) => <option key={product.id} value={product.id}>{product.reference} · {product.color} · {product.currentStock} pares disponibles</option>)}</select><input value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} min="1" type="number" className={inputClass.replace("mt-1 ", "")} /><select value={unit} onChange={(event) => setUnit(event.target.value as SaleUnit)} className={inputClass.replace("mt-1 ", "")}><option value="pair">Pares</option><option value="dozen">Docenas</option></select><button type="button" onClick={addLine} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Agregar</button></div></section>
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="grid gap-4 md:grid-cols-3"><label className="text-sm font-medium text-slate-700">Cliente<input required name="customerName" className={inputClass} /></label><label className="text-sm font-medium text-slate-700">Teléfono<input name="phone" className={inputClass} /></label><label className="text-sm font-medium text-slate-700">Observación<input name="observation" className={inputClass} /></label></div><div className="mt-5 divide-y divide-slate-100">{lines.length === 0 ? <p className="py-4 text-sm text-slate-500">Aún no agregas productos.</p> : lines.map((line) => <div key={line.product.id} className="flex items-center justify-between py-3 text-sm"><span>{line.product.reference} · {line.product.color} × {line.unit === "dozen" ? `${line.quantity / 12} docena(s)` : `${line.quantity} par(es)`}</span><span className="flex items-center gap-4 font-medium">{money.format((line.product.salePrice ?? 0) * line.quantity)}<button type="button" onClick={() => setLines((current) => current.filter((item) => item.product.id !== line.product.id))} className="text-red-700">Quitar</button></span></div>)}</div><div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4"><span className="text-lg font-semibold text-slate-900">Total: {money.format(total)}</span><button disabled={isSaving || lines.length === 0} className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{isSaving ? "Registrando..." : "Confirmar venta"}</button></div>{message && <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">{message}</p>}</form><SalesHistory /></div>;
}
