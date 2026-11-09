"use client";

import React from "react";
import { Toaster } from "react-hot-toast";
import { useTheme } from "@/context/ThemeContext";

export default function ToasterProvider() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 3500,
        style: isDark
          ? {
              background: "#0f172a",
              color: "#f8fafc",
              border: "1px solid #1e293b",
              borderRadius: "1rem",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.4)",
              fontSize: "0.875rem",
              padding: "12px 16px",
            }
          : {
              background: "#ffffff",
              color: "#0f172a",
              border: "1px solid #e2e8f0",
              borderRadius: "1rem",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.08)",
              fontSize: "0.875rem",
              padding: "12px 16px",
            },
        success: {
          iconTheme: {
            primary: "#10b981",
            secondary: isDark ? "#0f172a" : "#ffffff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: isDark ? "#0f172a" : "#ffffff",
          },
        },
      }}
    />
  );
}
