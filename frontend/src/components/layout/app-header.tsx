export function AppHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
          Gestión empresarial
        </p>
        <h1 className="text-lg font-semibold text-slate-900">Panel de control</h1>
      </div>

      <div className="text-right">
        <p className="text-sm font-medium text-slate-900">Calzado Los Socios</p>
        <p className="text-xs text-slate-500">Administración</p>
      </div>
    </header>
  );
}
