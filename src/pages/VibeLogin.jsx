import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2 } from "lucide-react";

export default function VibeLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Preencha todos os campos");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      window.location.reload();
    } catch (err) {
      setError("Usuário ou senha incorretos.");
    } finally {
      setLoading(false);
    }
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
          className="text-center text-xl font-bold italic mb-8"
          style={{ color: "#D4A843" }}
        >
          Acesso Restrito
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Usuário"
            className="w-full px-4 py-3 rounded-lg text-sm outline-none"
            style={{
              background: "rgba(80, 65, 40, 0.7)",
              border: "1px solid rgba(180, 150, 80, 0.25)",
              color: "#E8DCC8",
            }}
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="w-full px-4 py-3 rounded-lg text-sm outline-none"
            style={{
              background: "rgba(80, 65, 40, 0.7)",
              border: "1px solid rgba(180, 150, 80, 0.25)",
              color: "#E8DCC8",
            }}
          />

          {error && (
            <p className="text-center text-xs font-medium" style={{ color: "#E57373" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(90deg, #C6A84B, #7FB89E)",
              color: "#2E2417",
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}