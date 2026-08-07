import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: StatCardProps) {
  return (
  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        <h3 className="mt-3 text-5xl font-extrabold text-slate-900">
          {value}
        </h3>
      </div>

      <div className="rounded-lg bg-amber-100 p-3">
        <Icon className="h-6 w-6 text-amber-700" />
      </div>
    </div>

    <p className="mt-5 text-sm text-slate-500">
      {description}
    </p>
  </div>
);
}