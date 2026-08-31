import { apiBlob, apiRequest } from "@/lib/api-client";

export interface SaleInput {
  customerName: string;
  phone: string | null;
  observation: string | null;
  totalPaid: number;
  items: { productId: number; quantity: number }[];
}

export function createSale(input: SaleInput) {
  return apiRequest<{ number: string }>("/sales", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export interface Sale {
  id: number;
  number: string;
  date: string;
  customer: string;
  total: number;
}
export function getSales() {
  return apiRequest<Sale[]>("/sales", { cache: "no-store" });
}

export interface AccountReceivable {
  saleId: number;
  saleNumber: string;
  date: string;
  customerName: string;
  total: number;
  totalPaid: number;
  balance: number;
  isPaid: boolean;
}

export function getAccountsReceivable() {
  return apiRequest<AccountReceivable[]>("/sales/accounts-receivable", {
    cache: "no-store",
  });
}

export type SaleDocumentType = "remission" | "invoice";

export function getSalePdf(id: number, documentType: SaleDocumentType) {
  return apiBlob(`/sales/${id}/pdf?documentType=${documentType}`);
}

export function addSalePayment(saleId: number, amount: number) {
  return apiRequest<void>(`/sales/${saleId}/payments`, {
    method: "POST",
    body: JSON.stringify({
      saleId,
      amount,
    }),
  });
}
