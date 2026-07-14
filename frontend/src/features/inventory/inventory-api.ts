import { apiRequest } from "@/lib/api-client";

export type MovementKind = "entry" | "exit";

export interface StockMovementInput {
  productId: number;
  quantity: number;
  observation: string | null;
}

export function registerStockMovement(kind: MovementKind, input: StockMovementInput) {
  return apiRequest<void>(`/stockmovements/${kind}`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export interface StockMovement { id: number; date: string; type: string; quantity: number; reference: string; color: string; observation: string | null; }
export function getStockMovements() { return apiRequest<StockMovement[]>("/stockmovements", { cache: "no-store" }); }
