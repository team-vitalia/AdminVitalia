"use client";

import React, { useEffect, useState } from "react";
import { getPlanes, PlanSuperadmin } from "@/services/superadmin";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function PlanesPage() {
  const [planes, setPlanes] = useState<PlanSuperadmin[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarPlanes = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await getPlanes();
      setPlanes(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al obtener los planes");
      }
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPlanes();
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950/60"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700 dark:border-rose-500/30 dark:bg-rose-950/30 dark:text-rose-300">
        <p className="text-base font-semibold mb-2">Error de comunicación</p>
        <p className="text-xs text-rose-600 dark:text-rose-400 mb-4">{error}</p>
        <button
          type="button"
          onClick={cargarPlanes}
          className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-500"
        >
          Reintentar Carga
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Catálogo de Suscripciones
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Estructura de precios, límites operativos e identificadores de planes vinculados en PayPal
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {planes.map((plan) => (
          <Card
            key={plan.id}
            className="flex flex-col justify-between p-6 relative"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  {plan.nombre}
                </span>
                <Badge variant="success">
                  {plan.clinicas_activas_count} suscriptores
                </Badge>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {formatDinero(plan.precio_mensual)}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium"> / mes</span>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  Anual: {formatDinero(plan.precio_anual)}
                </div>
              </div>

              <div className="space-y-3 border-t border-slate-100 pt-4 text-xs text-slate-700 dark:border-slate-800/80 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Límite de Personal:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{plan.limite_personal} cuentas</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Límite Pacientes:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{plan.limite_pacientes} expedientes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Google Calendar:</span>
                  <span className={plan.incluye_calendar ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-slate-400 dark:text-slate-500"}>
                    {plan.incluye_calendar ? "Habilitado" : "No incluido"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Notificaciones Correo:</span>
                  <span className={plan.incluye_correos ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-slate-400 dark:text-slate-500"}>
                    {plan.incluye_correos ? "Habilitado" : "No incluido"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Asistente IA:</span>
                  <span className={plan.limite_ia_mensual > 0 ? "text-cyan-600 dark:text-cyan-400 font-semibold" : "text-slate-400 dark:text-slate-500"}>
                    {plan.limite_ia_mensual > 0 ? `${plan.limite_ia_mensual} req/mes` : "No incluido"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800/80">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                PayPal Plan ID
              </span>
              <code className="block truncate rounded-lg bg-slate-100 px-2.5 py-1.5 font-mono text-[11px] text-slate-700 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800">
                {plan.paypal_plan_id || "No asignado"}
              </code>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
