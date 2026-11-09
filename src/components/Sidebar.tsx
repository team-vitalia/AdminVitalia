"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { confirmModal, toast } from "@/lib/alerts";

interface NavItem {
  name: string;
  href: string;
  icon: (active: boolean) => React.ReactNode;
}

interface SidebarProps {
  abierto: boolean;
  onCerrar: () => void;
}

export default function Sidebar({ abierto, onCerrar }: SidebarProps) {
  const pathname = usePathname();
  const { usuario, cerrarSesion } = useAuth();

  const handleCerrarSesion = async () => {
    const confirmado = await confirmModal({
      title: "¿Cerrar sesión?",
      text: "¿Deseas salir del panel de administración central?",
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
      isDanger: true,
    });
    if (confirmado) {
      toast.success("Sesión finalizada correctamente");
      cerrarSesion();
    }
  };

  const navItems: NavItem[] = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: (active) => (
        <svg
          className={`h-4 w-4 ${active ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      name: "Clínicas",
      href: "/clinicas",
      icon: (active) => (
        <svg
          className={`h-4 w-4 ${active ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      name: "Planes",
      href: "/planes",
      icon: (active) => (
        <svg
          className={`h-4 w-4 ${active ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      {abierto && (
        <div
          onClick={onCerrar}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200/90 bg-white text-slate-800 transition-all duration-300 ease-in-out lg:translate-x-0 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 ${
          abierto ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-200/80 px-6 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 p-1.5 border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
              <Image
                src="/logo.png"
                alt="Logo VITALIA"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white block">
                VITALIA
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                Super Admin
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onCerrar}
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-4 py-6">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Navegación
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCerrar}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                    active
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm dark:bg-slate-900 dark:text-white dark:border-slate-800"
                      : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900/50 dark:hover:text-slate-200"
                  }`}
                >
                  {item.icon(active)}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-slate-200/80 p-4 dark:border-slate-800/80">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3 border border-slate-200/80 dark:bg-slate-900/80 dark:border-slate-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 font-bold text-xs dark:bg-emerald-500/20 dark:text-emerald-400">
              SA
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                {usuario?.nombre || "Super Administrador"}
              </p>
              <p className="truncate text-[10px] text-slate-500 dark:text-slate-400">
                {usuario?.correo || "superadmin@vitalia.com"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCerrarSesion}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50/80 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-slate-800 dark:bg-slate-900/60 dark:text-rose-300 dark:hover:bg-rose-950/30 dark:hover:border-rose-500/30"
          >
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}
