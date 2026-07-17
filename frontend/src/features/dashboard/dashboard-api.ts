import { apiRequest } from "@/lib/api-client";

export interface DashboardSummary {
  totalProducts: number;
  totalSuppliers: number;
  totalCustomers: number;
  salesToday: number;
  lowStockProducts: number;
}

export function getDashboardSummary() {
  return apiRequest<DashboardSummary>("/dashboard", {
    cache: "no-store",
  });
}

export interface RecentSale {
  number: string;
  date: string;
  customer: string;
  total: number;
}

export function getRecentSales() {
  return apiRequest<RecentSale[]>("/dashboard/recent-sales", {
    cache: "no-store",
  });
}