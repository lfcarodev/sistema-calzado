"use client";

import { FormEvent, useState } from "react";
import { type Product, type SupplierOption, updateProduct } from "@/features/products/products-api";

interface ProductEditFormProps {
  product: Product;
  suppliers: SupplierOption[];
  onCancel: () => void;
  onSaved: () => Promise<void>;
}

const inputClass = "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100";

export function ProductEditForm({ product, suppliers, onCancel, onSaved }: ProductEditFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setIsSaving(true);
    setError(null);

    try {
      await updateProduct(product.id, {
        color: String(data.get("color")).trim(),
        curveStart: Number(data.get("curveStart")),
        curveEnd: Number(data.get("curveEnd")),
        salePrice: data.get("salePrice") ? Number(data.get("salePrice")) : null,
        photoPath: String(data.get("photoPath")).trim() || null,
        supplierId: Number(data.get("supplierId")),
      });
      await onSaved();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No fue posible actualizar el producto.");
    } finally {
      setIsSaving(false);
    }
  }

  const [curveStart, curveEnd] = product.curve.split("-");

  return <section className="rounded-xl border border-amber-300 bg-amber-50 p-5 shadow-sm">
    <div className="flex items-start justify-between gap-4"><div><h3 className="font-semibold text-slate-900">Editar {product.reference}</h3><p className="mt-1 text-sm text-slate-600">La referencia no se modifica para conservar la identidad del producto.</p></div><button onClick={onCancel} className="text-sm font-medium text-slate-600 hover:text-slate-950">Cancelar</button></div>
    <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <label className="text-sm font-medium text-slate-700">Color<input required name="color" defaultValue={product.color} className={inputClass} /></label>
      <label className="text-sm font-medium text-slate-700">Curva inicial<input required min="1" name="curveStart" type="number" defaultValue={curveStart} className={inputClass} /></label>
      <label className="text-sm font-medium text-slate-700">Curva final<input required min="1" name="curveEnd" type="number" defaultValue={curveEnd} className={inputClass} /></label>
      <label className="text-sm font-medium text-slate-700">Precio de venta<input min="0" name="salePrice" type="number" defaultValue={product.salePrice ?? ""} className={inputClass} /></label>
      <label className="text-sm font-medium text-slate-700">Proveedor<select required name="supplierId" defaultValue={product.supplierId} className={inputClass}>{suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}</select></label>
      <label className="text-sm font-medium text-slate-700">Ruta de foto<input name="photoPath" defaultValue={product.photoPath ?? ""} className={inputClass} /></label>
      <button disabled={isSaving} className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{isSaving ? "Guardando..." : "Guardar cambios"}</button>
    </form>
    {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
  </section>;
}
