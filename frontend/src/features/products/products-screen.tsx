"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  createProduct,
  getProducts,
  type Product,
} from "@/features/products/products-api";
import { getSuppliers, type SupplierOption } from "@/features/suppliers/suppliers-api";
import { ProductEditForm } from "@/features/products/product-edit-form";

const money = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const inputClass =
  "mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100";

export function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [suppliers, setSuppliers] = useState<SupplierOption[]>([]);
  const [reference, setReference] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadProducts = useCallback(async (search?: string) => {
    setIsLoading(true);
    setMessage(null);

    try {
      setProducts(await getProducts(search));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No fue posible cargar los productos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.all([loadProducts(), getSuppliers().then(setSuppliers)]).catch(() => {
      setMessage("No fue posible cargar los proveedores.");
    });
  }, [loadProducts]);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await loadProducts(reference);
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsSaving(true);
    setMessage(null);

    try {
      await createProduct({
        reference: String(formData.get("reference")).trim(),
        color: String(formData.get("color")).trim(),
        curveStart: Number(formData.get("curveStart")),
        curveEnd: Number(formData.get("curveEnd")),
        salePrice: formData.get("salePrice") ? Number(formData.get("salePrice")) : null,
        photoPath: String(formData.get("photoPath")).trim() || null,
        supplierId: Number(formData.get("supplierId")),
      });

      form.reset();
      setMessage("Producto creado correctamente.");
      await loadProducts(reference);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No fue posible crear el producto.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-amber-700">Catálogo</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-900">Productos</h2>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">Registrar producto</h3>
        <form onSubmit={handleCreate} className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="text-sm font-medium text-slate-700">Referencia
            <input required name="reference" className={inputClass} />
          </label>
          <label className="text-sm font-medium text-slate-700">Color
            <input required name="color" className={inputClass} />
          </label>
          <label className="text-sm font-medium text-slate-700">Curva inicial
            <input required min="1" name="curveStart" type="number" className={inputClass} />
          </label>
          <label className="text-sm font-medium text-slate-700">Curva final
            <input required min="1" name="curveEnd" type="number" className={inputClass} />
          </label>
          <label className="text-sm font-medium text-slate-700">Precio de venta
            <input min="0" name="salePrice" type="number" className={inputClass} />
          </label>
          <label className="text-sm font-medium text-slate-700">Proveedor
            <select required name="supplierId" defaultValue="" className={inputClass}>
              <option value="" disabled>Selecciona un proveedor</option>
              {suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">Ruta de foto (opcional)
            <input name="photoPath" className={inputClass} />
          </label>
          <div className="flex items-end">
            <button disabled={isSaving || suppliers.length === 0} className="w-full rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50">
              {isSaving ? "Guardando..." : "Crear producto"}
            </button>
          </div>
        </form>
        {suppliers.length === 0 && !isLoading && <p className="mt-3 text-sm text-amber-700">Registra un proveedor antes de crear productos.</p>}
      </section>

      {editingProduct && <ProductEditForm product={editingProduct} suppliers={suppliers} onCancel={() => setEditingProduct(null)} onSaved={async () => { setEditingProduct(null); setMessage("Producto actualizado correctamente."); await loadProducts(reference); }} />}

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-base font-semibold text-slate-900">Listado</h3>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input value={reference} onChange={(event) => setReference(event.target.value)} placeholder="Buscar por referencia" className={inputClass.replace("mt-1 ", "")} />
            <button className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Buscar</button>
          </form>
        </div>
        {message && <p className="mx-5 mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">{message}</p>}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Referencia</th><th>Color</th><th>Curva</th><th>Proveedor</th><th>Stock</th><th>Precio</th><th className="px-5">Acción</th></tr></thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? <tr><td colSpan={7} className="px-5 py-8 text-center">Cargando productos...</td></tr> : products.length === 0 ? <tr><td colSpan={7} className="px-5 py-8 text-center">No hay productos para mostrar.</td></tr> : products.map((product) => <tr key={product.id}><td className="px-5 py-3 font-medium text-slate-900">{product.reference}</td><td>{product.color}</td><td>{product.curve}</td><td>{product.supplier}</td><td>{product.currentStock}</td><td>{product.salePrice === null ? "Sin definir" : money.format(product.salePrice)}</td><td className="px-5"><button onClick={() => setEditingProduct(product)} className="font-medium text-amber-700 hover:text-amber-900">Editar</button></td></tr>)}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
