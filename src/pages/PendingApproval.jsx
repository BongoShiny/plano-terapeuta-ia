import React from "react";
import { Clock, LogOut } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function PendingApproval() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#FAF9F7" }}>
      <div className="bg-white rounded-3xl shadow-sm border p-8 md:p-12 max-w-md w-full text-center" style={{ borderColor: "#E5E7EB" }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "#FEF3C7" }}>
          <Clock className="w-8 h-8" style={{ color: "#D97706" }} />
        </div>
        <h1 className="text-2xl font-bold mb-3" style={{ color: "#1B3A4B" }}>
          Aguardando Aprovação
        </h1>
        <p className="text-gray-500 mb-2">
          Seu cadastro foi recebido e está aguardando a aprovação do administrador da clínica.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          Você receberá acesso assim que for aprovado.
        </p>
        <button
          onClick={() => base44.auth.logout()}
          className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-xl text-sm font-medium border transition-all"
          style={{ color: "#7A9DB0", borderColor: "#D1D5DB" }}
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </div>
  );
}