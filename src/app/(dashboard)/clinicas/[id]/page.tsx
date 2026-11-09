"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  getMetricasClinica,
  getPlanes,
  updateEstadoClinica,
  updatePlanClinica,
  MetricasClinicaIndividual,
  PlanSuperadmin,
} from "@/services/superadmin";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ClinicaDetallePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const clinicaId = parseInt(resolvedParams.id, 10);

  const [metricas, setMetricas] = useState<MetricasClinicaIndividual | null>(null);
  const [planes, setPlanes] = useState<PlanSuperadmin[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalPlanAbierto, setModalPlanAbierto] = useState(false);
  const [planSeleccionadoId, setPlanSeleccionadoId] = useState<number | null>(null);
  const [guardandoPlan, setGuardandoPlan] = useState(false);
  const [cambiandoEstado, setCambiandoEstado] = useState(false);

  const cargarDatos = async () => {
    setCargando(true);
    setError(null);
    try {
      const [metrData, planesData] = await Promise.all([
        getMetricasClinica(clinicaId),
        getPlanes(),
      ]);
      setMetricas(metrData);
      setPlanes(planesData);
      if (metrData.plan) {
        setPlanSeleccionadoId(metrData.plan.id);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al cargar los datos de la clínica");
      }
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [clinicaId]);

  const handleToggleEstado = async () => {
    if (!metricas) return;
    const nuevoEstado = !metricas.activa;
    const accion = nuevoEstado ? "activar" : "suspender";
    const confirmacion = window.confirm(
      `¿Confirmar que desea ${accion} el acceso de "${metricas.nombre_comercial}"?`
    );
    if (!confirmacion) return;

    setCambiandoEstado(true);
    try {
      await updateEstadoClinica(metricas.clinica_id, nuevoEstado);
      await cargarDatos();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error al actualizar estado");
    } finally {
      setCambiandoEstado(false);
    }
  };

  const handleGuardarPlan = async () => {
    if (!metricas || !planSeleccionadoId) return;
    setGuardandoPlan(true);
    try {
      await updatePlanClinica(metricas.clinica_id, planSeleccionadoId);
      setModalPlanAbierto(false);
      await cargarDatos();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error al actualizar el plan");
    } finally {
      setGuardandoPlan(false);
    }
  };

  if (cargando) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-850" />
          <div className="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-850" />
          <div className="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-850" />
        </div>
      </div>
    );
  }

  if (error || !metricas) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700 dark:border-rose-500/30 dark:bg-rose-950/30 dark:text-rose-300">
        <p className="text-base font-semibold mb-2">Error de consulta</p>
        <p className="text-xs text-rose-600 dark:text-rose-400 mb-4">{error || "Clínica no disponible"}</p>
        <div className="flex justify-center gap-3">
          <Link
            href="/clinicas"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            Volver al Directorio
          </Link>
          <button
            type="button"
            onClick={cargarDatos}
            className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-500"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
            <Link href="/clinicas" className="hover:text-slate-900 dark:hover:text-white transition">
              Clínicas
            </Link>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200">ID #{metricas.clinica_id}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {metricas.nombre_comercial}
            </h1>
            {metricas.activa ? (
              <Badge variant="success" dot>Activa</Badge>
            ) : (
              <Badge variant="danger" dot>Suspendida</Badge>
            )}
            {metricas.candidato_upsell && (
              <Badge variant="warning">Candidato a Upsell</Badge>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Registrada el{" "}
            {metricas.fecha_registro
              ? new Date(metricas.fecha_registro).toLocaleDateString("es-MX", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "N/D"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setModalPlanAbierto(true)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
          >
            Forzar Actualización de Plan
          </button>
          <button
            type="button"
            onClick={handleToggleEstado}
            disabled={cambiandoEstado}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
              metricas.activa
                ? "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-950/30 dark:text-rose-300 dark:hover:bg-rose-900/50"
                : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-950/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
            }`}
          >
            {cambiandoEstado
              ? "Actualizando..."
              : metricas.activa
              ? "Suspender Clínica"
              : "Activar Clínica"}
          </button>
        </div>
      </div>

      {metricas.candidato_upsell && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-950/20">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                Oportunidad Comercial: Clínica cerca de su límite operativo
              </p>
              <ul className="mt-1 list-disc list-inside text-[11px] text-amber-800/90 dark:text-amber-300/80 space-y-0.5">
                {metricas.motivos_upsell.map((m, idx) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setModalPlanAbierto(true)}
                className="mt-2 text-xs font-semibold text-amber-800 underline underline-offset-2 hover:text-amber-950 dark:text-amber-300 dark:hover:text-white"
              >
                Actualizar a un plan superior ahora &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Suscripción y Facturación</CardTitle>
              <Badge variant="purple">{metricas.plan?.nombre || "Sin Plan"}</Badge>
            </div>
            <CardDescription>
              Control administrativo de tarifas y pasarela de pago
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 pt-1">
              <div className="flex items-baseline justify-between border-b border-slate-100 pb-3 text-xs dark:border-slate-800/80">
                <span className="text-slate-500 dark:text-slate-400">Tarifa Mensual</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  ${metricas.plan?.precio_mensual || 0} MXN
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs dark:border-slate-800/80">
                <span className="text-slate-500 dark:text-slate-400">Estado de PayPal</span>
                <Badge variant={metricas.paypal_subscription_id ? "success" : "neutral"} dot>
                  {metricas.estado_suscripcion}
                </Badge>
              </div>

              <div className="space-y-1 border-b border-slate-100 pb-3 text-xs dark:border-slate-800/80">
                <span className="text-slate-500 dark:text-slate-400 block">ID de Suscripción PayPal</span>
                <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 break-all">
                  {metricas.paypal_subscription_id || "No vinculado a PayPal"}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Próximo Ciclo de Cobro</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {metricas.proximo_ciclo_facturacion
                    ? new Date(metricas.proximo_ciclo_facturacion).toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "No programado"}
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setModalPlanAbierto(true)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Modificar Plan de Suscripción
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <CardHeader>
            <CardTitle>Consumo de Recursos del Plan</CardTitle>
            <CardDescription>
              Límites asignados y porcentaje de utilización actual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 pt-2">
              <ProgressBar
                label="Personal y Doctores Habilitados"
                actual={metricas.uso_personal.actual}
                limite={metricas.uso_personal.limite}
                porcentaje={metricas.uso_personal.porcentaje}
                unidad={metricas.uso_personal.unidad}
              />

              <ProgressBar
                label="Pacientes Activos en Base de Datos"
                actual={metricas.uso_pacientes.actual}
                limite={metricas.uso_pacientes.limite}
                porcentaje={metricas.uso_pacientes.porcentaje}
                unidad={metricas.uso_pacientes.unidad}
              />

              <ProgressBar
                label="Almacenamiento de Expedientes y Archivos"
                actual={metricas.uso_almacenamiento.actual}
                limite={metricas.uso_almacenamiento.limite}
                porcentaje={metricas.uso_almacenamiento.porcentaje}
                unidad={metricas.uso_almacenamiento.unidad}
              />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                  Citas Agendadas este Mes
                </span>
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  {metricas.citas_mes_actual} citas
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1">
                  Mes anterior: {metricas.citas_mes_anterior} citas
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                  Administradores de la Clínica
                </span>
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  {metricas.administradores.length} cuentas
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1">
                  {metricas.administradores[0]?.correo_electronico || "Sin correo"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Últimos Accesos de Personal</CardTitle>
            <CardDescription>
              Actividad reciente de los usuarios vinculados a esta clínica
            </CardDescription>
          </CardHeader>
          <CardContent>
            {metricas.ultimos_accesos.length === 0 ? (
              <p className="text-xs text-slate-500">No hay registros de accesos recientes.</p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {metricas.ultimos_accesos.map((u) => (
                  <div key={u.usuario_id} className="flex items-center justify-between py-3 text-xs">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{u.nombre_usuario}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{u.correo}</div>
                    </div>
                    <div className="text-right">
                      <Badge variant="neutral">{u.rol}</Badge>
                      <div className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                        {u.ultimo_acceso
                          ? new Date(u.ultimo_acceso).toLocaleString("es-MX", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })
                          : "Sin acceso"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader>
            <CardTitle>Bitácora de Auditoría Reciente</CardTitle>
            <CardDescription>
              Movimientos del sistema y operaciones efectuadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {metricas.actividades_recientes.length === 0 ? (
              <p className="text-xs text-slate-500">No hay eventos de auditoría registrados para esta clínica.</p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {metricas.actividades_recientes.map((act) => (
                  <div key={act.id} className="py-3 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="info">{act.accion}</Badge>
                        <span className="font-medium text-slate-800 dark:text-slate-200">{act.usuario}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {new Date(act.marca_tiempo).toLocaleString("es-MX", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                    {act.descripcion && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">{act.descripcion}</p>
                    )}
                    {act.nombre_tabla && (
                      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block">
                        Entidad: {act.nombre_tabla}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {modalPlanAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Forzar Actualización de Plan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Selecciona el nuevo nivel de suscripción para {metricas.nombre_comercial}. Esta acción sobreescribe las cuotas operativas inmediatamente.
            </p>

            <div className="space-y-3 mb-6 max-h-72 overflow-y-auto">
              {planes.map((plan) => {
                const seleccionado = planSeleccionadoId === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setPlanSeleccionadoId(plan.id)}
                    className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer transition ${
                      seleccionado
                        ? "border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950/20"
                        : "border-slate-200 bg-slate-50/50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {plan.nombre}
                        </span>
                        {plan.id === metricas.plan?.id && (
                          <Badge variant="neutral">Actual</Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Hasta {plan.limite_pacientes} pacientes &bull; {plan.limite_personal} miembros de personal
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        ${plan.precio_mensual} MXN
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block">/ mes</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800/80">
              <button
                type="button"
                onClick={() => setModalPlanAbierto(false)}
                disabled={guardandoPlan}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleGuardarPlan}
                disabled={guardandoPlan || !planSeleccionadoId}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
              >
                {guardandoPlan ? "Aplicando..." : "Confirmar Cambio de Plan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
