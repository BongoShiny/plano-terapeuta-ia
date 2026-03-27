import React from "react";
import { base44 } from "@/api/base44Client";

export default function VibeLogin() {
  const handleLogin = (e) => {
    e.preventDefault();
    base44.auth.redirectToLogin(window.location.origin);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "rgb(44, 36, 22)" }}
    >
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm p-8 rounded-2xl"
        style={{
          background: "rgba(255, 255, 255, 0.06)",
          border: "1px solid rgba(241, 212, 125, 0.15)",
        }}
      >
        <h2
          className="text-2xl font-bold text-center mb-6"
          style={{ color: "rgb(241, 212, 125)", fontFamily: "serif" }}
        >
          Acesso Restrito
        </h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Usuário"
            className="w-full px-4 py-3 rounded-lg text-sm outline-none"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(241, 212, 125, 0.2)",
              color: "#fff",
            }}
          />
        </div>

        <div className="mb-6">
          <input
            type="password"
            placeholder="Senha"
            className="w-full px-4 py-3 rounded-lg text-sm outline-none"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(241, 212, 125, 0.2)",
              color: "#fff",
            }}
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-lg font-bold text-sm transition-all hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, rgb(197, 165, 74), rgb(139, 187, 161))",
            color: "rgb(26, 10, 10)",
          }}
        >
          Entrar
        </button>
      </form>
    </div>
  );
}