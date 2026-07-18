"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Product } from "@/features/products/products-api";

interface ProductComboboxProps {
  products: Product[];
  value: number | null;
  onChange: (product: Product | null) => void;
  onProductSelected?: () => void;
}

export function ProductCombobox({
  products,
  value,
  onChange,
  onProductSelected,
}: ProductComboboxProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const filteredProducts = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return products;
    }

    return products
       .filter(
         (product) =>
           product.currentStock > 0 &&
           product.salePrice !== null
        )
          .filter((product) =>
            `${product.reference} ${product.color}`
               .toLowerCase()
               .includes(search)
     );
  }, [products, query]);

  useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };
}, []);

const selectProduct = (product: Product) => {
  onChange(product);

  setQuery(`${product.reference} · ${product.color}`);
  setIsOpen(false);
  setHighlightedIndex(-1);

  onProductSelected?.();
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <input
        type="text"
        placeholder="Buscar referencia..."
        value={query}
        onFocus={() => {
          setIsOpen(true);
          setHighlightedIndex(-1);
        }}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
          setHighlightedIndex(-1);
        }}
        onKeyDown={(event) => {
  if (!isOpen) return;

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();

      setHighlightedIndex((current) =>
        Math.min(current + 1, filteredProducts.length - 1)
      );
      break;

    case "ArrowUp":
      event.preventDefault();

      setHighlightedIndex((current) =>
        Math.max(current - 1, 0)
      );
      break;
    
    case "Enter":
  event.preventDefault();

  if (highlightedIndex >= 0) {
    selectProduct(filteredProducts[highlightedIndex]);
  }

  break;

    case "Escape":
      setIsOpen(false);
      setHighlightedIndex(-1);
      break;
  }
}}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
      />

      {isOpen && query !== "" && (
        <div className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-md border border-slate-200 bg-white shadow-lg">
          {filteredProducts.length === 0 ? (
            <p className="p-3 text-sm text-slate-500">
              Sin resultados.
            </p>
          ) : (
            filteredProducts.map((product, index) => (
              <button
                key={product.id}
                type="button"
                onClick={() => selectProduct(product)}
                className={`block w-full border-b border-slate-100 px-3 py-3 text-left transition-colors ${
                  highlightedIndex === index
                    ? "bg-amber-50"
                    : "hover:bg-amber-50"
                }`}
              >
                <div className="font-medium">
                  {product.reference} · {product.color}
                </div>

                <div className="mt-1 text-xs text-slate-500">
                  <p>Stock: {product.currentStock} pares</p>

                  <p>Precio: {formatPrice(product.salePrice!)}</p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}