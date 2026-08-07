"use client";

import { useEffect, useState } from "react";
import {
  getDashboardSummary,
  type DashboardSummary,
} from "./dashboard-api";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  Package,
  Truck,
  Users,
  ShoppingCart,
  TriangleAlert,
} from "lucide-react";
import { RecentSales } from "./recent-sales";

export function DashboardScreen() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void getDashboardSummary()
      .then(setSummary)
      .catch((error) => setMessage(error.message));
  }, []);

  if (message) {
    return (
      <p className="rounded-lg bg-red-50 p-4 text-red-700">
        {message}
      </p>
    );
  }

  if (!summary) {
    return <p>Cargando dashboard...</p>;
  }

  return (
    <div className="space-y-6">
  <div>
    <p className="text-sm font-medium text-amber-700">
      Resumen
    </p>

    <h2 className="mt-1 text-2xl font-semibold text-slate-900">
      Dashboard
    </h2>
  </div>

  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
    <StatCard
      title="Productos"
      value={summary.totalProducts}
      description="Registrados en el sistema"
      icon={Package}
    />

    <StatCard
      title="Proveedores"
      value={summary.totalSuppliers}
      description="Proveedores activos"
      icon={Truck}
    />

    <StatCard
      title="Clientes"
      value={summary.totalCustomers}
      description="Clientes registrados"
      icon={Users}
    />

    <StatCard
      title="Ventas hoy"
      value={summary.salesToday}
      description="Ventas realizadas hoy"
      icon={ShoppingCart}
    />

    <StatCard
      title="Stock bajo"
      value={summary.lowStockProducts}
      description="Productos con poco inventario"
      icon={TriangleAlert}
    />
  </div>
  <RecentSales />
</div>
  );
}