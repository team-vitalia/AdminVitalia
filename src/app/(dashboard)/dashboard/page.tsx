"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getMetricas, MetricasSuperadmin } from "@/services/superadmin";

export default function DashboardPage() {
  const [metricas, setMetricas] = useState<MetricasSuperadmin | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarMetricas = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await getMetricas();
      setMetricas(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al cargar las métricas");
      }
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarMetricas();
  }, []);

  const formatDinero = (monto: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(monto);
  };

  if (cargando) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-2xl border border-slate-800 bg-slate-950/60 p-6"
            />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-2xl border border-slate-800 bg-slate-950/60" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-500/30 bg-rose-950/30 p-8 text-center text-rose-300">
        <p className="text-base font-semibold mb-2">Error de comunicación</p>
        <p className="text-sm text-rose-400 mb-4">{error}</p>
        <button
          onClick={cargarMetricas}
          className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-500"
        >
          Reintentar Carga
        </button>
      </div>
    );
  }

  const mrr = metricas?.ingresos_mensuales || 0;
  const arr = mrr * 12;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Ingresos Mensuales (MRR)
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {formatDinero(mrr)}
            </span>
            <span className="text-xs text-emerald-400 font-medium">/ mes</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Suma neta de suscripciones activas
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-cyan-500/10 blur-xl pointer-events-none" />
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Proyección Anual (ARR)
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {formatDinero(arr)}
            </span>
            <span className="text-xs text-cyan-400 font-medium">/ año</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Estimación proyectada a 12 meses
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total de Clínicas
          </p>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-white">
              {metricas?.total_clinicas || 0}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
              {metricas?.clinicas_activas || 0} activas
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {metricas?.clinicas_inactivas || 0} suspendidas o en espera
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Usuarios en Plataforma
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {metricas?.total_usuarios || 0}
            </span>
            <span className="text-xs text-slate-400 font-medium">cuentas</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Doctores, recepcionistas y administradores
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">
                Resumen de Operación SaaS
              </h3>
              <p className="text-xs text-slate-400">
                Estado general del ecosistema VITALIA
              </p>
            </div>
            <Link
              href="/clinicas"
              className="rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700"
            >
              Administrar Clínicas &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
              <span className="text-xs font-medium text-slate-400 block mb-1">
                Tasa de Clínicas Activas
              </span>
              <span className="text-2xl font-bold text-emerald-400">
                {metricas && metricas.total_clinicas > 0
                  ? Math.round(
                      (metricas.clinicas_activas / metricas.total_clinicas) *
                        100
                    )
                  : 0}
                %
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">
                Operatividad continua
              </span>
            </div>

            <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
              <span className="text-xs font-medium text-slate-400 block mb-1">
                Planes Disponibles
              </span>
              <span className="text-2xl font-bold text-cyan-400">
                {metricas?.total_planes || 4}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">
                Básico, Clínica, Pro, Corp
              </span>
            </div>

            <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
              <span className="text-xs font-medium text-slate-400 block mb-1">
                Promedio por Clínica
              </span>
              <span className="text-2xl font-bold text-indigo-400">
                {metricas && metricas.clinicas_activas > 0
                  ? formatDinero(
                      metricas.ingresos_mensuales / metricas.clinicas_activas
                    )
                  : "$0"}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">
                ARPU mensual estimado
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1">
              Accesos Directos
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Navegación administrativa rápida
            </p>

            <div className="space-y-3">
              <Link
                href="/clinicas"
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 transition hover:border-slate-700 hover:bg-slate-850"
              >
                <div>
                  <p className="text-sm font-semibold text-white">
                    Ver Directorio de Clínicas
                  </p>
                  <p className="text-xs text-slate-400">
                    Suspender o reactivar accesos
                  </p>
                </div>
                <span className="text-emerald-400 text-sm font-bold">&rarr;</span>
              </Link>

              <Link
                href="/planes"
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 transition hover:border-slate-700 hover:bg-slate-850"
              >
                <div>
                  <p className="text-sm font-semibold text-white">
                    Supervisión de Tarifas
                  </p>
                  <p className="text-xs text-slate-400">
                    Precios y enlaces con PayPal
                  </p>
                </div>
                <span className="text-cyan-400 text-sm font-bold">&rarr;</span>
              </Link>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3.5 text-xs text-emerald-300">
            Los cobros e ingresos se actualizan en tiempo real mediante los webhooks de PayPal REST API.
          </div>
        </div>
      </div>
    </div>
  );
}
