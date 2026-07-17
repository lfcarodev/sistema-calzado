"use client";

import { useEffect, useState } from "react";
import {
  getRecentSales,
  type RecentSale,
} from "./dashboard-api";

export function RecentSales() {
  const [sales, setSales] = useState<RecentSale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void getRecentSales()
      .then(setSales)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Cargando últimas ventas...</p>;
  }

  return (
  <div className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="mb-6 flex items-center justify-between">
      <h3 className="text-lg font-semibold text-slate-900">
        Últimas ventas
      </h3>

      <span className="text-sm text-slate-500">
        Últimos {sales.length} registros
      </span>
    </div>

    <table className="min-w-full table-auto">
      <thead>
        <tr className="border-b border-slate-200 text-left text-sm font-semibold text-slate-500">
          <th className="w-1/4">Número</th>
          <th className="w-1/4">Cliente</th>
          <th className="w-1/4">Fecha</th>
          <th className="w-1/4 text-right">Total</th>
        </tr>
      </thead>

      <tbody>
        {sales.map((sale) => (
          <tr
            key={sale.number}
            className="border-b border-slate-100 transition-colors hover:bg-slate-50"
          >
            <td className="py-3 font-medium whitespace-nowrap">
              {sale.number}
            </td>

            <td className="py-3">
              {sale.customer}
            </td>

            <td className="py-3 whitespace-nowrap">
              {new Date(sale.date).toLocaleDateString("es-CO")}
            </td>

            <td className="py-3 text-right font-semibold whitespace-nowrap">
              {sale.total.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
              })}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
}