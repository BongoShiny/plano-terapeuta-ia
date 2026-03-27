import React from "react";
import { ShieldOff, LogOut } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function BlockedUser() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#FAF9F7" }}>
      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full text-center" style={{ border: "1px solid #FECACA" }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#FEE2E2" }}>
          <ShieldOff className="w-8 h-8" style={{ color: "#EF4444" }} />
        </div>
        <h1 className="text-xl font-bold mb-2" style={{ color: "#1B3A4B" }}>
          Acesso Bloqueado
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Sua conta foi desativada pelo administrador. Entre em contato com o suporte para mais informações.
        </p>
        <button
          onClick={() => base44.auth.logout()}
          className="flex items-center gap-2 mx-auto px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: "#1B3A4B" }}
        >
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </div>
    </div>
  );
}