import React from "react";
import { base44 } from "@/api/base44Client";
import { LogIn } from "lucide-react";

export default function VibeLogin() {
  const handleLogin = () => {
    base44.auth.redirectToLogin(window.location.origin);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#3B2F1E" }}
    >
      <div
        className="w-full max-w-sm rounded-xl p-8"
        style={{
          background: "rgba(60, 48, 30, 0.85)",
          border: "1px solid rgba(180, 150, 80, 0.3)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}
      >
        <h1
          className="text-center text-xl font-bold italic mb-2"
          style={{ color: "#D4A843" }}
        >
          Acesso Restrito
        </h1>
        <p className="text-center text-xs mb-8" style={{ color: "#A89070" }}>
          Vibe Terapias — Clínica Especializada em Dor
        </p>

        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-lg text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2"
          style={{
            background: "linear-gradient(90deg, #C6A84B, #7FB89E)",
            color: "#2E2417",
          }}
        >
          <LogIn className="w-4 h-4" />
          Entrar
        </button>
      </div>
    </div>
  );
}