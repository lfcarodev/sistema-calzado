import { apiRequest } from "@/lib/api-client";
import { getSuppliers, type SupplierOption } from "@/features/suppliers/suppliers-api";

export interface Product {
  id: number;
  reference: string;
  color: string;
  curve: string;
  currentStock: number;
  salePrice: number | null;
  photoPath: string | null;
  supplierId: number;
  supplier: string;
}

export interface CreateProductInput {
  reference: string;
  color: string;
  curveStart: number;
  curveEnd: number;
  salePrice: number | null;
  photoPath: string | null;
  supplierId: number;
}

export function getProducts(reference?: string) {
  const normalizedReference = reference?.trim();
  const path = normalizedReference
    ? `/products/search?reference=${encodeURIComponent(normalizedReference)}`
    : "/products";

  return apiRequest<Product[]>(path, { cache: "no-store" });
}

export { getSuppliers, type SupplierOption };

export function createProduct(input: CreateProductInput) {
  return apiRequest<{ id: number }>("/products", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateProduct(id: number, input: Omit<CreateProductInput, "reference">) {
  return apiRequest<void>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify({ id, ...input }),
  });
}
