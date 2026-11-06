"use client";

import React, { useEffect, useState } from "react";
import {
  getClinicas,
  updateEstadoClinica,
  ClinicaSuperadmin,
} from "@/services/superadmin";

export default function ClinicasPage() {
  const [clinicas, setClinicas] = useState<ClinicaSuperadmin[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [procesandoId, setProcesandoId] = useState<number | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<"todas" | "activas" | "inactivas">("todas");
  const [busqueda, setBusqueda] = useState("");

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

  const handleToggleEstado = async (clinica: ClinicaSuperadmin) => {
    const nuevoEstado = !clinica.activa;
    const accion = nuevoEstado ? "activar" : "suspender";
    const confirmacion = window.confirm(
      `¿Está seguro de que desea ${accion} el acceso de "${clinica.nombre_comercial}"?`
    );

    if (!confirmacion) return;

    setProcesandoId(clinica.id);
    try {
      const clinicaActualizada = await updateEstadoClinica(clinica.id, nuevoEstado);
      setClinicas((prev) =>
        prev.map((c) => (c.id === clinica.id ? clinicaActualizada : c))
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`No se pudo actualizar el estado: ${err.message}`);
      } else {
        alert("Ocurrió un error inesperado al actualizar el estado");
      }
    } finally {
      setProcesandoId(null);
    }
  };

  const clinicasFiltradas = clinicas.filter((c) => {
    const coincideEstado =
      filtroEstado === "todas" ||
      (filtroEstado === "activas" && c.activa) ||
      (filtroEstado === "inactivas" && !c.activa);

    const termino = busqueda.toLowerCase().trim();
    const coincideTexto =
      !termino ||
      c.nombre_comercial.toLowerCase().includes(termino) ||
      c.administradores.some((a) =>
        a.nombre_completo.toLowerCase().includes(termino) ||
        a.correo_electronico.toLowerCase().includes(termino)
      ) ||
      (c.plan?.nombre || "").toLowerCase().includes(termino);

    return coincideEstado && coincideTexto;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Directorio de Clientes</h3>
          <p className="text-xs text-slate-400">
            Total registradas: {clinicas.length} clínicas
          </p>
        </div>

        <button
          onClick={cargarClinicas}
          disabled={cargando}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 disabled:opacity-50"
        >
          <svg
            className={`h-4 w-4 ${cargando ? "animate-spin" : ""}`}
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

      <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por clínica, administrador o correo..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder-slate-500 transition focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFiltroEstado("todas")}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
              filtroEstado === "todas"
                ? "bg-emerald-600 text-white"
                : "border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            Todas ({clinicas.length})
          </button>
          <button
            onClick={() => setFiltroEstado("activas")}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
              filtroEstado === "activas"
                ? "bg-emerald-600 text-white"
                : "border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            Activas ({clinicas.filter((c) => c.activa).length})
          </button>
          <button
            onClick={() => setFiltroEstado("inactivas")}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
              filtroEstado === "inactivas"
                ? "bg-emerald-600 text-white"
                : "border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            Inactivas ({clinicas.filter((c) => !c.activa).length})
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-950/40 p-4 text-xs text-rose-300">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-900/80 uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-4 font-semibold">Clínica</th>
                <th className="px-6 py-4 font-semibold">Plan Contratado</th>
                <th className="px-6 py-4 font-semibold">Administrador</th>
                <th className="px-6 py-4 font-semibold">Registro</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {cargando ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                      <span>Cargando directorio de clínicas...</span>
                    </div>
                  </td>
                </tr>
              ) : clinicasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No se encontraron clínicas que coincidan con los criterios.
                  </td>
                </tr>
              ) : (
                clinicasFiltradas.map((clinica) => {
                  const estaProcesando = procesandoId === clinica.id;
                  const adminPrincipal = clinica.administradores[0];

                  return (
                    <tr
                      key={clinica.id}
                      className="transition hover:bg-slate-900/50"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white text-sm">
                          {clinica.nombre_comercial}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          ID: #{clinica.id} &bull; {clinica.total_usuarios} usuarios &bull; {clinica.total_pacientes} pacientes
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {clinica.plan ? (
                          <div>
                            <span className="inline-flex items-center rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                              {clinica.plan.nombre}
                            </span>
                            <div className="mt-1 text-[11px] text-slate-400">
                              ${clinica.plan.precio_mensual} MXN / mes
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-500">Sin plan vinculado</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {adminPrincipal ? (
                          <div>
                            <div className="font-medium text-slate-100">
                              {adminPrincipal.nombre_completo}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {adminPrincipal.correo_electronico}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-500">Sin administrador</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-slate-400">
                        {clinica.fecha_registro
                          ? new Date(clinica.fecha_registro).toLocaleDateString(
                              "es-MX",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )
                          : "N/D"}
                      </td>

                      <td className="px-6 py-4">
                        {clinica.activa ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            Activa
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-950/40 px-2.5 py-0.5 text-[11px] font-semibold text-rose-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                            Suspendida
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleToggleEstado(clinica)}
                          disabled={estaProcesando}
                          className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            clinica.activa
                              ? "border border-rose-500/30 bg-rose-950/30 text-rose-300 hover:bg-rose-900/50"
                              : "border border-emerald-500/30 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/50"
                          }`}
                        >
                          {estaProcesando ? (
                            <>
                              <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              <span>Actualizando...</span>
                            </>
                          ) : clinica.activa ? (
                            <>
                              <svg
                                className="h-3.5 w-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span>Suspender</span>
                            </>
                          ) : (
                            <>
                              <svg
                                className="h-3.5 w-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span>Activar</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
