import { apiRequest } from "@/lib/api-client";
import {
  getSuppliers,
  type SupplierOption,
} from "@/features/suppliers/suppliers-api";

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
  photo: File | null;
  supplierId: number;
}

export interface UpdateProductInput {
  color: string;
  curveStart: number;
  curveEnd: number;
  salePrice: number | null;
  supplierId: number;
  photo: File | null;
}

export function getProducts(reference?: string) {
  const normalizedReference = reference?.trim();
  const path = normalizedReference
    ? `/products/search?reference=${encodeURIComponent(normalizedReference)}`
    : "/products";

  return apiRequest<Product[]>(path, { cache: "no-store" });
}

export { getSuppliers, type SupplierOption };

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5051/api";

export async function createProduct(input: CreateProductInput) {
  const formData = new FormData();

  formData.append("reference", input.reference);
  formData.append("color", input.color);
  formData.append("curveStart", input.curveStart.toString());
  formData.append("curveEnd", input.curveEnd.toString());

  if (input.salePrice !== null) {
    formData.append("salePrice", input.salePrice.toString());
  }

  formData.append("supplierId", input.supplierId.toString());

  if (input.photo) {
    formData.append("photo", input.photo);
  }

  const response = await fetch(`${apiUrl}/products`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let message = `La solicitud no pudo completarse (${response.status}).`;

    try {
      const error = await response.json();

      if (error?.message) {
        message = error.message;
      }
    } catch {}

    throw new Error(message);
  }

  return response.json();
}

export async function updateProduct(id: number, input: UpdateProductInput) {
  const formData = new FormData();

  formData.append("id", id.toString());
  formData.append("color", input.color);
  formData.append("curveStart", input.curveStart.toString());
  formData.append("curveEnd", input.curveEnd.toString());

  if (input.salePrice !== null) {
    formData.append("salePrice", input.salePrice.toString());
  }

  formData.append("supplierId", input.supplierId.toString());

  if (input.photo) {
    formData.append("photo", input.photo);
  }

  const response = await fetch(`${apiUrl}/products/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    let message = `La solicitud no pudo completarse (${response.status}).`;

    try {
      const error = await response.json();

      if (error?.message) {
        message = error.message;
      }
    } catch {}

    throw new Error(message);
  }
}
