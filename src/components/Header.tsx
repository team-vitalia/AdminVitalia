"use client";

import React from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === "/dashboard") {
      return {
        title: "Panel General de Métricas",
        subtitle: "Rendimiento financiero y volumen de clínicas en tiempo real",
      };
    }
    if (pathname === "/clinicas") {
      return {
        title: "Gestión de Clínicas y Suscripciones",
        subtitle: "Supervisión de clientes, administradores y control de acceso",
      };
    }
    if (pathname.startsWith("/clinicas/")) {
      return {
        title: "Detalle de Clínica",
        subtitle: "Métricas operativas, consumo de recursos y suscripción",
      };
    }
    if (pathname === "/planes") {
      return {
        title: "Catálogo de Planes y Tarifas",
        subtitle: "Estructura de precios SaaS y distribución de suscriptores",
      };
    }
    return {
      title: "Backoffice Central",
      subtitle: "Plataforma de Super Administración VITALIA",
    };
  };

  const { title, subtitle } = getPageTitle();

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 sm:px-8 backdrop-blur transition-colors duration-200 dark:border-slate-800 dark:bg-slate-950/80">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 lg:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label="Abrir menú de navegación"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 hidden xs:block">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <ThemeToggle />

        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-300">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-[11px] font-medium hidden sm:inline">FastAPI SaaS Online</span>
          <span className="text-[11px] font-medium sm:hidden">Online</span>
        </div>
      </div>
    </header>
  );
}
