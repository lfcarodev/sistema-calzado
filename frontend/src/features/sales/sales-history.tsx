"use client";

import { useEffect, useState } from "react";
import { getSalePdf, getSales, type Sale } from "@/features/sales/sales-api";

const money = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
export function SalesHistory() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => { void getSales().then(setSales).catch((error) => setMessage(error.message)); }, []);
  async function download(sale: Sale) { try { const blob = await getSalePdf(sale.id); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `Remision-${sale.number}.pdf`; link.click(); URL.revokeObjectURL(url); } catch (error) { setMessage(error instanceof Error ? error.message : "No fue posible descargar la remisión."); } }
  return <section className="rounded-xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-200 p-5"><h3 className="font-semibold text-slate-900">Ventas registradas</h3></div>{message && <p className="p-5 text-sm text-red-700">{message}</p>}<div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">Número</th><th>Fecha</th><th>Cliente</th><th>Total</th><th className="px-5">Remisión</th></tr></thead><tbody className="divide-y divide-slate-100">{sales.map((sale) => <tr key={sale.id}><td className="px-5 py-3 font-medium">{sale.number}</td><td>{new Date(sale.date).toLocaleDateString("es-CO")}</td><td>{sale.customer}</td><td>{money.format(sale.total)}</td><td className="px-5"><button onClick={() => void download(sale)} className="font-medium text-amber-700 hover:text-amber-900">Descargar PDF</button></td></tr>)}</tbody></table></div></section>;
}
