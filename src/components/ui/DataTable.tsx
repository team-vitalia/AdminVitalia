"use client";

import React, { useState, useMemo } from "react";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  className?: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  onRowClick?: (item: T) => void;
  pageSize?: number;
  cargando?: boolean;
  emptyMessage?: string;
  headerAction?: React.ReactNode;
}

export function DataTable<T extends { id?: number | string }>({
  data,
  columns,
  searchPlaceholder = "Buscar...",
  searchFilter,
  onRowClick,
  pageSize = 8,
  cargando = false,
  emptyMessage = "No se encontraron registros.",
  headerAction,
}: DataTableProps<T>) {
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const datosFiltrados = useMemo(() => {
    if (!busqueda.trim() || !searchFilter) return data;
    return data.filter((item) => searchFilter(item, busqueda.toLowerCase().trim()));
  }, [data, busqueda, searchFilter]);

  const totalPaginas = Math.max(1, Math.ceil(datosFiltrados.length / pageSize));
  const indiceInicio = (paginaActual - 1) * pageSize;
  const itemsVisibles = datosFiltrados.slice(indiceInicio, indiceInicio + pageSize);

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-slate-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
          />
        </div>
        {headerAction && <div className="flex items-center gap-2">{headerAction}</div>}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm dark:border-slate-800/80 dark:bg-slate-900/90">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200/80 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800/80 dark:bg-slate-950/60 dark:text-slate-400">
              <tr>
                {columns.map((col, index) => (
                  <th key={index} className={`px-5 py-3.5 ${col.className || ""}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 dark:divide-slate-800/60 dark:text-slate-200">
              {cargando ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2.5">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-transparent dark:border-slate-300" />
                      <span>Cargando información...</span>
                    </div>
                  </td>
                </tr>
              ) : itemsVisibles.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                itemsVisibles.map((item, rowIdx) => {
                  const key = item.id !== undefined ? String(item.id) : rowIdx;
                  return (
                    <tr
                      key={key}
                      onClick={() => onRowClick && onRowClick(item)}
                      className={`transition-colors ${
                        onRowClick
                          ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40"
                          : "hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
                      }`}
                    >
                      {columns.map((col, colIdx) => (
                        <td key={colIdx} className={`px-5 py-3.5 ${col.className || ""}`}>
                          {col.render
                            ? col.render(item)
                            : col.accessorKey
                            ? String(item[col.accessorKey] ?? "")
                            : null}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!cargando && datosFiltrados.length > 0 && (
          <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800/80">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Mostrando {indiceInicio + 1} a {Math.min(indiceInicio + pageSize, datosFiltrados.length)} de {datosFiltrados.length} registros
            </span>

            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
                className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Anterior
              </button>
              <span className="px-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                {paginaActual} / {totalPaginas}
              </span>
              <button
                type="button"
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
                className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
