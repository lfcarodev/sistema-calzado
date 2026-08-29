"use client";

import { FormEvent, useEffect, useMemo, useState, useRef } from "react";
import { getProducts, type Product } from "@/features/products/products-api";
import { createSale } from "@/features/sales/sales-api";
import { SalesHistory } from "@/features/sales/sales-history";
import { ProductCombobox } from "@/components/products/product-combobox";

type SaleUnit = "pair" | "dozen";
interface SaleLine {
  product: Product;
  quantity: number;
  quantityInPairs: number;
  unit: SaleUnit;
}
const money = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5051/api";
const inputClass =
  "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100";

export function SalesScreen() {
  const quantityInputRef = useRef<HTMLInputElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [lines, setLines] = useState<SaleLine[]>([]);
  const [productId, setProductId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState<SaleUnit>("pair");
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  useEffect(() => {
    void getProducts()
      .then(setProducts)
      .catch((error) => setMessage(error.message));
  }, []);
  const total = useMemo(
    () =>
      lines.reduce(
        (sum, line) =>
          sum + (line.product.salePrice ?? 0) * line.quantityInPairs,
        0,
      ),
    [lines],
  );

  const quantityInPairs = unit === "dozen" ? quantity * 12 : quantity;

  const hasEnoughStock =
    !selectedProduct || quantityInPairs <= selectedProduct.currentStock;

  function addLine() {
    const product = products.find((item) => item.id === Number(productId));
    if (!product) return;
    const quantityInPairs = unit === "dozen" ? quantity * 12 : quantity;
    if (quantityInPairs > product.currentStock) {
      setMessage("La cantidad supera el stock disponible.");
      return;
    }
    setLines((current) => [
      ...current.filter((line) => line.product.id !== product.id),
      { product, quantity, quantityInPairs, unit },
    ]);
    setProductId("");
    setSelectedProduct(null);
    setQuantity(1);
    setMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lines.length === 0) {
      setMessage("Agrega al menos un producto a la venta.");
      return;
    }
    const form = event.currentTarget;
    const data = new FormData(form);
    setIsSaving(true);
    setMessage(null);
    try {
      const result = await createSale({
        customerName: String(data.get("customerName")).trim(),
        phone: String(data.get("phone")).trim() || null,
        observation: String(data.get("observation")).trim() || null,
        items: lines.map((line) => ({
          productId: line.product.id,
          quantity: line.quantityInPairs,
        })),
      });

      form.reset();
      setLines([]);
      setMessage(`Venta ${result.number} registrada correctamente.`);
      setProducts(await getProducts());

      setHistoryRefreshKey((current) => current + 1);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "No fue posible registrar la venta.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-amber-700">Operación</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-900">Ventas</h2>
      </div>
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900">Agregar producto</h3>

        <div className="mt-4 grid gap-4">
          <ProductCombobox
            products={products}
            value={productId ? Number(productId) : null}
            onChange={(product) => {
              setSelectedProduct(product);

              if (product) {
                setProductId(String(product.id));
              } else {
                setProductId("");
              }
            }}
            onProductSelected={() => {
              quantityInputRef.current?.focus();
            }}
          />

          {selectedProduct && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-4">
                {selectedProduct.photoPath ? (
                  <img
                    src={`${API_URL.replace("/api", "")}/${selectedProduct.photoPath}`}
                    alt={selectedProduct.reference}
                    className="h-36 w-36 rounded-lg border object-cover"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-md border bg-white text-sm text-slate-400">
                    Sin foto
                  </div>
                )}

                <div className="space-y-1">
                  <p>
                    <span className="font-semibold">Referencia:</span>{" "}
                    {selectedProduct.reference}
                  </p>

                  <p>
                    <span className="font-semibold">Color:</span>{" "}
                    {selectedProduct.color}
                  </p>

                  <p>
                    <span className="font-semibold">Curva:</span>{" "}
                    {selectedProduct.curve}
                  </p>

                  <p>
                    <span className="font-semibold">Stock:</span>{" "}
                    {selectedProduct.currentStock} pares
                  </p>

                  <p>
                    <span className="font-semibold">Precio:</span>{" "}
                    {money.format(selectedProduct.salePrice ?? 0)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-3 md:grid-cols-[120px_140px_auto]">
            <input
              ref={quantityInputRef}
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              min="1"
              type="number"
              className={`${inputClass.replace("mt-1 ", "")} ${
                !hasEnoughStock
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : ""
              }`}
            />

            <select
              value={unit}
              onChange={(event) => setUnit(event.target.value as SaleUnit)}
              className={inputClass.replace("mt-1 ", "")}
            >
              <option value="pair">Pares</option>
              <option value="dozen">Docenas</option>
            </select>

            <button
              type="button"
              onClick={addLine}
              disabled={!hasEnoughStock}
              className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                hasEnoughStock
                  ? "border border-slate-300 text-slate-700 hover:bg-slate-50"
                  : "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400"
              }`}
            >
              Agregar
            </button>
          </div>
          {!hasEnoughStock && selectedProduct && (
            <p className="text-sm font-medium text-red-600">
              Stock insuficiente. Solo hay{" "}
              <strong>{selectedProduct.currentStock}</strong>{" "}
              {selectedProduct.currentStock === 1
                ? "par disponible."
                : "pares disponibles."}
            </p>
          )}
        </div>
      </section>
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <label className="text-sm font-medium text-slate-700">
            Cliente
            <input required name="customerName" className={inputClass} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Teléfono
            <input name="phone" className={inputClass} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Observación
            <input name="observation" className={inputClass} />
          </label>
        </div>
        <div className="mt-5">
          {lines.length === 0 ? (
            <p className="py-4 text-sm text-slate-500">
              Aún no agregas productos.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-3 text-left font-semibold">Foto</th>
                    <th className="px-3 py-3 text-left font-semibold">
                      Producto
                    </th>
                    <th className="px-3 py-3 text-center font-semibold">
                      Cantidad
                    </th>
                    <th className="px-3 py-3 text-right font-semibold">
                      Precio Unit.
                    </th>
                    <th className="px-3 py-3 text-right font-semibold">
                      Subtotal
                    </th>
                    <th className="px-3 py-3"></th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 bg-white">
                  {lines.map((line) => (
                    <tr key={line.product.id}>
                      <td className="px-3 py-3">
                        {line.product.photoPath ? (
                          <img
                            src={`${API_URL.replace("/api", "")}/${line.product.photoPath}`}
                            alt={line.product.reference}
                            className="h-12 w-12 rounded-md border object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-md border bg-slate-100 text-xs text-slate-400">
                            Sin foto
                          </div>
                        )}
                      </td>

                      <td className="px-3 py-3">
                        <div className="font-medium">
                          {line.product.reference}
                        </div>

                        <div className="text-xs text-slate-500">
                          {line.product.color} · {line.product.curve}
                        </div>
                      </td>

                      <td className="px-3 py-3 text-center">
                        {line.quantity}{" "}
                        {line.unit === "pair"
                          ? line.quantity === 1
                            ? "par"
                            : "pares"
                          : line.quantity === 1
                            ? "docena"
                            : "docenas"}
                      </td>

                      <td className="px-3 py-3 text-right">
                        {money.format(line.product.salePrice ?? 0)}
                      </td>

                      <td className="px-3 py-3 text-right font-semibold">
                        {money.format(
                          (line.product.salePrice ?? 0) * line.quantityInPairs,
                        )}
                      </td>

                      <td className="px-3 py-3 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            setLines((current) =>
                              current.filter(
                                (item) => item.product.id !== line.product.id,
                              ),
                            )
                          }
                          className="rounded-md px-2 py-1 text-red-600 hover:bg-red-50"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
          <span className="text-lg font-semibold text-slate-900">
            Total: {money.format(total)}
          </span>
          <button
            disabled={isSaving || lines.length === 0}
            className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isSaving ? "Registrando..." : "Confirmar venta"}
          </button>
        </div>
        {message && (
          <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
            {message}
          </p>
        )}
      </form>
      <SalesHistory refreshKey={historyRefreshKey} />
    </div>
  );
}
