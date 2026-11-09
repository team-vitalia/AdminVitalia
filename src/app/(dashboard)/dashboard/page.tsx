"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getMetricas, MetricasSuperadmin } from "@/services/superadmin";
import CrecimientoChart from "@/components/CrecimientoChart";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

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
        setError("Error al cargar las métricas del sistema");
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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950/60"
            />
          ))}
        </div>
        <div className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/60" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-500/30 bg-rose-50 p-8 text-center text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">
        <p className="text-base font-semibold mb-2">Error de comunicación</p>
        <p className="text-xs text-rose-600 dark:text-rose-400 mb-4">{error}</p>
        <button
          type="button"
          onClick={cargarMetricas}
          className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-500"
        >
          Reintentar Carga
        </button>
      </div>
    );
  }

  const mrr = metricas?.ingresos_mensuales || 0;
  const arr = metricas?.proyeccion_anual || mrr * 12;
  const totalClinicas = metricas?.total_clinicas || 0;
  const activas = metricas?.clinicas_activas || 0;
  const inactivas = metricas?.clinicas_inactivas || 0;
  const totalUsuarios = metricas?.total_usuarios || 0;
  const nuevosUsuarios = metricas?.usuarios_nuevos_mes || 0;
  const tasaCrecimiento = metricas?.tasa_crecimiento_usuarios || 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Ingreso Recurrente (MRR)
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {formatDinero(mrr)}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">/ mes</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Suscripciones activas</span>
            <Badge variant="success" dot>En tiempo real</Badge>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Proyección Anual (ARR)
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {formatDinero(arr)}
            </span>
            <span className="text-xs text-sky-600 dark:text-sky-400 font-medium">/ año</span>
          </div>
          <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
            Estimación anualizada de ingresos SaaS
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total de Clínicas
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalClinicas}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">registradas</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Badge variant="success">{activas} activas</Badge>
            {inactivas > 0 && <Badge variant="danger">{inactivas} suspendidas</Badge>}
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Cuentas de Usuarios
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalUsuarios}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">usuarios</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px]">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              +{nuevosUsuarios} este mes
            </span>
            <span className="text-slate-500">
              ({tasaCrecimiento >= 0 ? `+${tasaCrecimiento}%` : `${tasaCrecimiento}%`})
            </span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <CrecimientoChart data={metricas?.historico_6_meses || []} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Métricas de Eficiencia SaaS</CardTitle>
              <CardDescription>
                Indicadores clave de retención y monetización
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs dark:border-slate-800/80">
                  <span className="text-slate-500 dark:text-slate-400">Tasa de Operatividad</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {totalClinicas > 0 ? Math.round((activas / totalClinicas) * 100) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs dark:border-slate-800/80">
                  <span className="text-slate-500 dark:text-slate-400">Ingreso Promedio (ARPU)</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {activas > 0 ? formatDinero(mrr / activas) : "$0"}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs dark:border-slate-800/80">
                  <span className="text-slate-500 dark:text-slate-400">Planes Activos en Catálogo</span>
                  <span className="font-bold text-sky-600 dark:text-sky-400">
                    {metricas?.total_planes || 4}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Usuarios Activos</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {metricas?.usuarios_activos || totalUsuarios}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/clinicas"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                >
                  <span>Explorar Directorio de Clínicas</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-xs">
                <p className="font-semibold text-slate-900 dark:text-white">Sincronización de Cobros</p>
                <p className="mt-1 text-slate-500 dark:text-slate-400 leading-relaxed">
                  Las facturaciones recurrentes y cambios de estado se gestionan de forma centralizada con la API de PayPal.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
