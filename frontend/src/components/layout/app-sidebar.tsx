"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/", label: "Inicio", icon: "⌂" },
  { href: "/productos", label: "Productos", icon: "◫" },
  { href: "/proveedores", label: "Proveedores", icon: "♧" },
  { href: "/ventas", label: "Ventas", icon: "◷" },
  { href: "/inventario", label: "Inventario", icon: "▤" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col bg-slate-950 px-4 py-6 text-slate-100">
      <Link href="/" className="mb-10 px-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
          Distribuidora
        </p>
        <p className="mt-1 text-xl font-semibold">Los Socios</p>
      </Link>

      <nav aria-label="Navegación principal" className="space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-amber-400 text-slate-950"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span aria-hidden="true" className="w-4 text-center text-base">
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <p className="mt-auto px-3 text-xs text-slate-500">Versión inicial</p>
    </aside>
  );
}
