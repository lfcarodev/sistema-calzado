"use client";

import { useEffect, useState } from "react";
import { getStockMovements, type StockMovement } from "@/features/inventory/inventory-api";

export function InventoryHistory() {
  const [items, setItems] = useState<StockMovement[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  });
  useEffect(() => { void getStockMovements().then(setItems).catch((error) => setMessage(error.message)); }, []);
  return <section className="rounded-xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-200 p-5"><h3 className="font-semibold text-slate-900">Movimientos recientes</h3></div>{message ? <p className="p-5 text-sm text-red-700">{message}</p> : <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">Fecha</th><th>Producto</th><th>Tipo</th><th>Cantidad</th><th className="px-5">Observación</th></tr></thead><tbody className="divide-y divide-slate-100">{items.map((item) => <tr key={item.id}><td className="px-5 py-3">{dateFormatter.format(new Date(item.date))}</td><td>{item.reference} · {item.color}</td><td>{item.type === "Entry" ? "Entrada" : "Salida"}</td><td>{item.quantity} pares</td><td className="px-5">{item.observation ?? "—"}</td></tr>)}</tbody></table></div>}</section>;
}
