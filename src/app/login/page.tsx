"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/lib/alerts";
import ThemeToggle from "@/components/ThemeToggle";
import { Eye, EyeOff, Mail, Lock, ShieldCheck, ArrowRight, Loader2, AlertCircle } from "lucide-react";

function CursorWorm() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const count = 22;
    const points: { x: number; y: number }[] = [];
    const target = { x: width / 2, y: height / 2, active: false };

    for (let i = 0; i < count; i++) {
      points.push({ x: width / 2, y: height / 2 });
    }

    const handleMouseMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      target.active = true;
    };

    const handleMouseLeave = () => {
      target.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (target.active) {
        points[0].x += (target.x - points[0].x) * 0.35;
        points[0].y += (target.y - points[0].y) * 0.35;

        for (let i = 1; i < count; i++) {
          points[i].x += (points[i - 1].x - points[i].x) * 0.45;
          points[i].y += (points[i - 1].y - points[i].y) * 0.45;
        }

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < count; i++) {
          const xc = (points[i].x + points[i - 1].x) / 2;
          const yc = (points[i].y + points[i - 1].y) / 2;
          ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
        }
        ctx.strokeStyle = "rgba(20, 184, 166, 0.25)";
        ctx.lineWidth = 5;
        ctx.stroke();

        for (let i = count - 1; i >= 0; i--) {
          const ratio = (count - i) / count;
          const radius = Math.max(2, 11 * ratio);
          const alpha = 0.15 + 0.65 * ratio;

          ctx.beginPath();
          ctx.arc(points[i].x, points[i].y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
          ctx.shadowColor = "#10b981";
          ctx.shadowBlur = 12 * ratio;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(points[i].x, points[i].y, Math.max(1, radius * 0.4), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${0.45 * ratio})`;
          ctx.shadowBlur = 0;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-30"
    />
  );
}

export default function LoginPage() {
  const { iniciarSesion } = useAuth();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);

    try {
      await iniciarSesion(correo, password);
      toast.success("Bienvenido al panel SuperAdmin");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Credenciales no válidas o error de comunicación";
      setError(msg);
      toast.error(msg);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 p-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-600 dark:selection:text-emerald-300">
      <CursorWorm />

      <div className="absolute top-5 right-5 z-40 rounded-2xl border border-slate-200/80 bg-white/70 p-1 shadow-sm backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/70">
        <ThemeToggle />
      </div>

      <div className="animate-float pointer-events-none absolute -top-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-emerald-400/25 blur-[120px] dark:bg-emerald-500/15" />
      <div className="animate-float-delayed pointer-events-none absolute -bottom-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-teal-400/25 blur-[120px] dark:bg-teal-500/15" />
      <div className="animate-pulse-glow pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[36rem] w-[36rem] rounded-full bg-emerald-500/15 blur-[140px] dark:bg-emerald-600/10" />

      <div
        className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-25"
        style={{
          backgroundImage: `
            radial-gradient(circle at center, rgba(16, 185, 129, 0.16) 0%, transparent 70%),
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 3.5rem 3.5rem, 3.5rem 3.5rem",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 50%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 50%, transparent 100%)",
          color: "rgba(100, 116, 139, 0.12)",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="animate-spin-slow pointer-events-none absolute -inset-3 rounded-[2.5rem] bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-emerald-600/20 blur-2xl opacity-60 dark:opacity-30" />

        <div className="relative rounded-3xl border border-slate-200/90 bg-white/80 p-8 sm:p-10 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-slate-800/80 dark:bg-slate-900/70 dark:shadow-[0_20px_70px_-15px_rgba(0,0,0,0.8)]">
          <div className="pointer-events-none absolute inset-x-0 -top-px mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent dark:via-emerald-400/60" />

          <div className="mb-8 flex flex-col items-center text-center">
            <div className="group relative mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-100 p-2.5 shadow-lg shadow-emerald-500/10 transition-transform duration-300 hover:scale-105 dark:border-slate-700/60 dark:from-slate-800/90 dark:to-slate-900/90 dark:shadow-emerald-950/50">
              <div className="absolute inset-0 rounded-2xl bg-emerald-500/10 blur-md transition group-hover:bg-emerald-500/20" />
              <Image
                src="/logo.png"
                alt="Logo VITALIA"
                width={56}
                height={56}
                priority
                className="relative object-contain drop-shadow"
              />
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              VITALIA
            </h1>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Control Central
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-700 shadow-sm dark:border-emerald-500/30 dark:bg-emerald-950/60 dark:text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Acceso Exclusivo SuperAdmin</span>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-50 p-4 text-sm text-rose-800 backdrop-blur-sm dark:border-rose-500/30 dark:bg-rose-950/40 dark:text-rose-200">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
              <p className="leading-snug">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="correo"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                Correo Electrónico
              </label>
              <div className="group relative flex items-center">
                <div className="pointer-events-none absolute left-3.5 text-slate-400 transition-colors duration-150 group-focus-within:text-emerald-500 dark:text-slate-500 dark:group-focus-within:text-emerald-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="correo"
                  type="email"
                  required
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="superadmin@vitalia.software"
                  className="w-full rounded-xl border border-slate-200/90 bg-slate-50/80 pl-11 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-inner focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700/80 dark:bg-slate-950/60 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-950/90"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                Contraseña
              </label>
              <div className="group relative flex items-center">
                <div className="pointer-events-none absolute left-3.5 text-slate-400 transition-colors duration-150 group-focus-within:text-emerald-500 dark:text-slate-500 dark:group-focus-within:text-emerald-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  type={mostrarPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-200/90 bg-slate-50/80 pl-11 pr-11 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-inner focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700/80 dark:bg-slate-950/60 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-950/90"
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword((prev) => !prev)}
                  className="absolute right-3.5 flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  aria-label={mostrarPassword ? "Ocultar contraseña" : "Ver contraseña"}
                >
                  {mostrarPassword ? (
                    <EyeOff className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:brightness-110 hover:shadow-emerald-500/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-emerald-950/50 dark:hover:shadow-emerald-900/60"
            >
              {enviando ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <>
                  <span>Acceder al Panel</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 border-t border-slate-200/80 pt-6 text-center text-xs text-slate-500 dark:border-slate-800/80 dark:text-slate-500">
            VITALIA Healthcare Ecosystem &bull; Plataforma Multi-Tenant
          </div>
        </div>
      </div>
    </div>
  );
}
