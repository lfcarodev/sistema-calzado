import { apiBlob, apiRequest } from "@/lib/api-client";

export interface SaleInput {
  customerName: string;
  phone: string | null;
  observation: string | null;
  items: { productId: number; quantity: number }[];
}

export function createSale(input: SaleInput) {
  return apiRequest<{ number: string }>("/sales", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export interface Sale { id: number; number: string; date: string; customer: string; total: number; }
export function getSales() { return apiRequest<Sale[]>("/sales", { cache: "no-store" }); }
export function getSalePdf(id: number) { return apiBlob(`/sales/${id}/pdf`); }
