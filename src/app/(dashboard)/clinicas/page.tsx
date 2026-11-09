"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getClinicas,
  updateEstadoClinica,
  ClinicaSuperadmin,
} from "@/services/superadmin";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { confirmModal, toast } from "@/lib/alerts";

export default function ClinicasPage() {
  const router = useRouter();
  const [clinicas, setClinicas] = useState<ClinicaSuperadmin[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [procesandoId, setProcesandoId] = useState<number | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<"todas" | "activas" | "inactivas">("todas");

  const cargarClinicas = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await getClinicas();
      setClinicas(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al obtener la lista de clínicas");
      }
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarClinicas();
  }, []);

  const handleToggleEstado = async (e: React.MouseEvent, clinica: ClinicaSuperadmin) => {
    e.stopPropagation();
    const nuevoEstado = !clinica.activa;
    const accion = nuevoEstado ? "activar" : "suspender";
    const confirmado = await confirmModal({
      title: nuevoEstado ? "¿Activar clínica?" : "¿Suspender clínica?",
      text: `¿Confirmar cambio de estado a ${accion} para "${clinica.nombre_comercial}"?`,
      confirmButtonText: nuevoEstado ? "Sí, activar" : "Sí, suspender",
      cancelButtonText: "Cancelar",
      isDanger: !nuevoEstado,
    });

    if (!confirmado) return;

    setProcesandoId(clinica.id);
    try {
      const clinicaActualizada = await updateEstadoClinica(clinica.id, nuevoEstado);
      setClinicas((prev) =>
        prev.map((c) => (c.id === clinica.id ? clinicaActualizada : c))
      );
      toast.success(
        nuevoEstado
          ? `Clínica "${clinica.nombre_comercial}" activada con éxito`
          : `Clínica "${clinica.nombre_comercial}" suspendida con éxito`
      );
    } catch (err: unknown) {
      const mensaje = err instanceof Error ? err.message : "Ocurrió un error inesperado";
      toast.error(`Error al actualizar estado: ${mensaje}`);
    } finally {
      setProcesandoId(null);
    }
  };

  const clinicasFiltradas = clinicas.filter((c) => {
    if (filtroEstado === "activas") return c.activa;
    if (filtroEstado === "inactivas") return !c.activa;
    return true;
  });

  const columns: Column<ClinicaSuperadmin>[] = [
    {
      header: "Clínica",
      render: (clinica) => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-white text-sm">
            {clinica.nombre_comercial}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            ID: #{clinica.id} &bull; {clinica.total_usuarios} usuarios &bull; {clinica.total_pacientes} pacientes
          </div>
        </div>
      ),
    },
    {
      header: "Plan Contratado",
      render: (clinica) => (
        <div>
          {clinica.plan ? (
            <div>
              <Badge variant="purple">{clinica.plan.nombre}</Badge>
              <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                ${clinica.plan.precio_mensual} MXN / mes
              </div>
            </div>
          ) : (
            <span className="text-slate-400 dark:text-slate-500">Sin plan asignado</span>
          )}
        </div>
      ),
    },
    {
      header: "Administrador",
      render: (clinica) => {
        const admin = clinica.administradores[0];
        if (!admin) {
          return <span className="text-slate-400 dark:text-slate-500">Sin administrador</span>;
        }
        return (
          <div>
            <div className="font-medium text-slate-800 dark:text-slate-200">
              {admin.nombre_completo}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {admin.correo_electronico}
            </div>
          </div>
        );
      },
    },
    {
      header: "Registro",
      render: (clinica) => (
        <span className="text-slate-500 dark:text-slate-400 text-xs">
          {clinica.fecha_registro
            ? new Date(clinica.fecha_registro).toLocaleDateString("es-MX", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "N/D"}
        </span>
      ),
    },
    {
      header: "Estado",
      render: (clinica) => (
        clinica.activa ? (
          <Badge variant="success" dot>Activa</Badge>
        ) : (
          <Badge variant="danger" dot>Suspendida</Badge>
        )
      ),
    },
    {
      header: "Acciones",
      className: "text-right",
      render: (clinica) => {
        const estaProcesando = procesandoId === clinica.id;
        return (
          <div className="flex items-center justify-end gap-2">
            <Link
              href={`/clinicas/${clinica.id}`}
              onClick={(e) => e.stopPropagation()}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white"
            >
              Ver Detalles
            </Link>

            <button
              type="button"
              onClick={(e) => handleToggleEstado(e, clinica)}
              disabled={estaProcesando}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                clinica.activa
                  ? "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-950/30 dark:text-rose-300 dark:hover:bg-rose-900/50"
                  : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-950/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
              }`}
            >
              {estaProcesando
                ? "..."
                : clinica.activa
                ? "Suspender"
                : "Activar"}
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Directorio de Clínicas
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Supervisión integral de clientes SaaS, planes y auditoría de accesos
          </p>
        </div>

        <button
          type="button"
          onClick={cargarClinicas}
          disabled={cargando}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <svg
            className={`h-3.5 w-3.5 ${cargando ? "animate-spin" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Actualizar Lista</span>
        </button>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFiltroEstado("todas")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
              filtroEstado === "todas"
                ? "bg-emerald-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Todas ({clinicas.length})
          </button>
          <button
            type="button"
            onClick={() => setFiltroEstado("activas")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
              filtroEstado === "activas"
                ? "bg-emerald-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Activas ({clinicas.filter((c) => c.activa).length})
          </button>
          <button
            type="button"
            onClick={() => setFiltroEstado("inactivas")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
              filtroEstado === "inactivas"
                ? "bg-emerald-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Inactivas ({clinicas.filter((c) => !c.activa).length})
          </button>
        </div>
      </Card>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700 dark:border-rose-500/30 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </div>
      )}

      <DataTable
        data={clinicasFiltradas}
        columns={columns}
        cargando={cargando}
        searchPlaceholder="Buscar por clínica, administrador o plan..."
        searchFilter={(clinica, query) =>
          clinica.nombre_comercial.toLowerCase().includes(query) ||
          (clinica.plan?.nombre || "").toLowerCase().includes(query) ||
          clinica.administradores.some(
            (a) =>
              a.nombre_completo.toLowerCase().includes(query) ||
              a.correo_electronico.toLowerCase().includes(query)
          )
        }
        onRowClick={(clinica) => router.push(`/clinicas/${clinica.id}`)}
        emptyMessage="No se encontraron clínicas registradas con ese criterio."
      />
    </div>
  );
}
