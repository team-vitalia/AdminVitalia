"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);
    const stored = localStorage.getItem("vitalia_backoffice_theme") as Theme | null;
    if (stored === "light" || stored === "dark") {
      setThemeState(stored);
      aplicarTema(stored);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme: Theme = prefersDark ? "dark" : "light";
      setThemeState(initialTheme);
      aplicarTema(initialTheme);
    }
  }, []);

  const aplicarTema = (nuevoTema: Theme) => {
    const root = document.documentElement;
    if (nuevoTema === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  const setTheme = (nuevoTema: Theme) => {
    setThemeState(nuevoTema);
    localStorage.setItem("vitalia_backoffice_theme", nuevoTema);
    aplicarTema(nuevoTema);
  };

  const toggleTheme = () => {
    const siguiente = theme === "dark" ? "light" : "dark";
    setTheme(siguiente);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
