"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  UsuarioSuperadmin,
  loginSuperadmin,
  getMe,
} from "@/services/superadmin";
import { getAuthToken, removeAuthToken } from "@/services/api";

interface AuthContextType {
  usuario: UsuarioSuperadmin | null;
  cargando: boolean;
  iniciarSesion: (correo: string, contrasena: string) => Promise<void>;
  cerrarSesion: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioSuperadmin | null>(null);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function verificarSesion() {
      const token = getAuthToken();
      if (!token) {
        setCargando(false);
        if (pathname !== "/login") {
          router.replace("/login");
        }
        return;
      }

      try {
        const datos = await getMe();
        if (datos.rol_id !== 1) {
          removeAuthToken();
          setUsuario(null);
          if (pathname !== "/login") {
            router.replace("/login");
          }
        } else {
          setUsuario(datos);
          if (pathname === "/login") {
            router.replace("/dashboard");
          }
        }
      } catch {
        removeAuthToken();
        setUsuario(null);
        if (pathname !== "/login") {
          router.replace("/login");
        }
      } finally {
        setCargando(false);
      }
    }

    verificarSesion();
  }, [pathname, router]);

  const iniciarSesion = async (correo: string, contrasena: string) => {
    setCargando(true);
    try {
      const { usuario: userAuth } = await loginSuperadmin(correo, contrasena);
      setUsuario(userAuth);
      router.replace("/dashboard");
    } finally {
      setCargando(false);
    }
  };

  const cerrarSesion = () => {
    removeAuthToken();
    setUsuario(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        cargando,
        iniciarSesion,
        cerrarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  }
  return context;
}
