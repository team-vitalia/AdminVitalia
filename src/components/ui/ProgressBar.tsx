import React from "react";

interface ProgressBarProps {
  label: string;
  actual: number;
  limite: number;
  porcentaje: number;
  unidad?: string;
  className?: string;
  mostrarAlerta?: boolean;
}

export function ProgressBar({
  label,
  actual,
  limite,
  porcentaje,
  unidad = "",
  className = "",
  mostrarAlerta = true,
}: ProgressBarProps) {
  const pctNormalizado = Math.min(100, Math.max(0, porcentaje));

  let colorBarra = "bg-emerald-500";
  let colorTexto = "text-slate-900 dark:text-white";
  let badgeTexto = null;

  if (pctNormalizado >= 95) {
    colorBarra = "bg-rose-500";
    colorTexto = "text-rose-600 dark:text-rose-400";
    badgeTexto = "Crítico";
  } else if (pctNormalizado >= 80) {
    colorBarra = "bg-amber-500";
    colorTexto = "text-amber-600 dark:text-amber-400";
    badgeTexto = "Atención (Upsell)";
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {label}
        </span>
        <div className="flex items-center gap-2">
          {mostrarAlerta && badgeTexto && (
            <span
              className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                pctNormalizado >= 95
                  ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
              }`}
            >
              {badgeTexto}
            </span>
          )}
          <span className={`font-semibold ${colorTexto}`}>
            {actual} / {limite} {unidad} ({pctNormalizado}%)
          </span>
        </div>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorBarra}`}
          style={{ width: `${pctNormalizado}%` }}
        />
      </div>
    </div>
  );
}
