"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard":
        return {
          title: "Panel General de Métricas",
          subtitle: "Rendimiento financiero y volumen de clínicas en tiempo real",
        };
      case "/clinicas":
        return {
          title: "Gestión de Clínicas y Suscripciones",
          subtitle: "Supervisión de clientes, administradores y control de acceso",
        };
      case "/planes":
        return {
          title: "Catálogo de Planes y Tarifas",
          subtitle: "Estructura de precios SaaS y distribución de suscriptores",
        };
      default:
        return {
          title: "Backoffice Central",
          subtitle: "Plataforma de Super Administración VITALIA",
        };
    }
  };

  const { title, subtitle } = getPageTitle();

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950/80 px-8 backdrop-blur">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3.5 py-1.5 text-xs text-slate-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium">FastAPI Backend Activo</span>
        </div>
      </div>
    </header>
  );
}
