import { apiRequest } from "@/lib/api-client";

export interface SupplierOption {
  id: number;
  name: string;
}

export interface CreateSupplierInput {
  name: string;
  phone: string | null;
  address: string | null;
}

export function getSuppliers() {
  return apiRequest<SupplierOption[]>("/suppliers", { cache: "no-store" });
}

export function createSupplier(input: CreateSupplierInput) {
  return apiRequest<{ id: number }>("/suppliers", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
