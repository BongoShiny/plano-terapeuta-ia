import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function VibeLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      setError("Email ou senha incorretos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#1B3A4B" }}>
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0" style={{
          background: "linear-gradient(135deg, #1B3A4B 0%, #2A4F63 50%, #1B3A4B 100%)"
        }} />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full" style={{ background: "#C17F6A", filter: "blur(80px)" }} />
          <div className="absolute bottom-32 right-16 w-48 h-48 rounded-full" style={{ background: "#C17F6A", filter: "blur(60px)" }} />
        </div>
        <div className="relative z-10 text-center">
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-white text-4xl font-bold mx-auto mb-8" style={{ background: "#C17F6A", boxShadow: "0 20px 40px rgba(193, 127, 106, 0.3)" }}>
            V
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">VIBE TERAPIAS</h1>
          <p className="text-lg mb-2" style={{ color: "#C17F6A" }}>Clínica Especializada em Dor</p>
          <p className="text-sm max-w-sm mx-auto mt-6" style={{ color: "#7A9DB0" }}>
            Sistema de gestão de planos terapêuticos personalizados com inteligência artificial
          </p>
        </div>
        <div className="absolute bottom-8 text-xs" style={{ color: "#5A8899" }}>
          © 2025 Vibe Terapias. Todos os direitos reservados.
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12" style={{ background: "#FAF9F7" }}>
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4" style={{ background: "#C17F6A" }}>
              V
            </div>
            <h1 className="text-2xl font-bold" style={{ color: "#1B3A4B" }}>VIBE TERAPIAS</h1>
            <p className="text-sm" style={{ color: "#C17F6A" }}>Clínica Especializada em Dor</p>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl" style={{ border: "1px solid #E5E7EB" }}>
            <div className="mb-8">
              <h2 className="text-2xl font-bold" style={{ color: "#1B3A4B" }}>Bem-vindo</h2>
              <p className="text-sm mt-1" style={{ color: "#7A9DB0" }}>Entre com suas credenciais para acessar o sistema</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#1B3A4B" }}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="clinica@vibeterapias.com"
                  className="w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 outline-none"
                  style={{
                    border: "2px solid #E5E7EB",
                    background: "#FAFAFA",
                    color: "#1B3A4B",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#C17F6A"}
                  onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#1B3A4B" }}>Senha</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 rounded-xl text-sm transition-all duration-200 outline-none"
                    style={{
                      border: "2px solid #E5E7EB",
                      background: "#FAFAFA",
                      color: "#1B3A4B",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#C17F6A"}
                    onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                    style={{ color: "#7A9DB0" }}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-white text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  background: loading ? "#D4A494" : "#C17F6A",
                  boxShadow: loading ? "none" : "0 4px 15px rgba(193, 127, 106, 0.4)",
                }}
                onMouseEnter={(e) => { if (!loading) e.target.style.background = "#A96B58"; }}
                onMouseLeave={(e) => { if (!loading) e.target.style.background = "#C17F6A"; }}
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

          <p className="text-center text-xs mt-6" style={{ color: "#9CA3AF" }}>
            Acesso restrito a colaboradores autorizados
          </p>
        </div>
      </div>
    </div>
  );
}