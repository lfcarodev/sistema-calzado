"use client";

import { FormEvent, useEffect, useState } from "react";
import { createSupplier, getSuppliers, type SupplierOption } from "@/features/suppliers/suppliers-api";

const inputClass = "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100";

export function SuppliersScreen() {
  const [suppliers, setSuppliers] = useState<SupplierOption[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  async function loadSuppliers() {
    setIsLoading(true);
    try {
      setSuppliers(await getSuppliers());
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No fue posible cargar los proveedores.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { void loadSuppliers(); }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setIsSaving(true);
    setMessage(null);

    try {
      await createSupplier({
        name: String(formData.get("name")).trim(),
        phone: String(formData.get("phone")).trim() || null,
        address: String(formData.get("address")).trim() || null,
      });
      form.reset();
      setMessage("Proveedor creado correctamente.");
      await loadSuppliers();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No fue posible crear el proveedor.");
    } finally {
      setIsSaving(false);
    }
  }

  return <div className="space-y-6">
    <div><p className="text-sm font-medium text-amber-700">Catálogo</p><h2 className="mt-1 text-2xl font-semibold text-slate-900">Proveedores</h2></div>
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-slate-900">Registrar proveedor</h3>
      <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-3">
        <label className="text-sm font-medium text-slate-700">Nombre<input required name="name" className={inputClass} /></label>
        <label className="text-sm font-medium text-slate-700">Teléfono<input name="phone" className={inputClass} /></label>
        <label className="text-sm font-medium text-slate-700">Dirección<input name="address" className={inputClass} /></label>
        <button disabled={isSaving} className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 md:col-start-3">{isSaving ? "Guardando..." : "Crear proveedor"}</button>
      </form>
    </section>
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {message && <p className="m-5 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">{message}</p>}
      <ul className="divide-y divide-slate-100">
        {isLoading ? <li className="p-5 text-sm text-slate-600">Cargando proveedores...</li> : suppliers.length === 0 ? <li className="p-5 text-sm text-slate-600">Aún no hay proveedores registrados.</li> : suppliers.map((supplier) => <li key={supplier.id} className="flex items-center justify-between px-5 py-3"><span className="font-medium text-slate-900">{supplier.name}</span><span className="text-xs text-slate-500">ID {supplier.id}</span></li>)}
      </ul>
    </section>
  </div>;
}
