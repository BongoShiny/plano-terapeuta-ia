import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import PlanDocument from "../components/plan/PlanDocument";
import { ArrowLeft, Printer, CheckCircle, Loader2, Users, FileText } from "lucide-react";

export default function PlanView() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  const [patientData, setPatientData] = useState(null);
  const planId = new URLSearchParams(window.location.search).get("id");

  useEffect(() => {
    if (!planId) return navigate(createPageUrl("Dashboard"));
    base44.entities.TherapeuticPlan.filter({ id: planId }).then(async (plans) => {
      if (plans.length) {
        const p = plans[0];
        setPlan(p);
        if (p.patient_id) {
          try {
            const patients = await base44.entities.Patient.filter({ id: p.patient_id });
            if (patients.length) setPatientData(patients[0]);
          } catch (e) {}
        }
      }
      setLoading(false);
    });
  }, [planId]);

  const markAsPresented = async () => {
    await base44.entities.TherapeuticPlan.update(plan.id, { status: "Apresentado" });
    setPlan((p) => ({ ...p, status: "Apresentado" }));
  };

  const markAsClosed = async () => {
    await base44.entities.TherapeuticPlan.update(plan.id, { status: "Fechado" });
    setPlan((p) => ({ ...p, status: "Fechado" }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3" style={{ color: "#C17F6A" }} />
          <p className="text-gray-500">Carregando plano...</p>
        </div>
      </div>
    );
  }

  if (!plan || plan.status === "Gerando") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3" style={{ color: "#C17F6A" }} />
          <p className="font-semibold text-lg" style={{ color: "#1B3A4B" }}>Gerando Plano Terapêutico...</p>
          <p className="text-gray-500 mt-1">A IA está personalizando o plano. Aguarde.</p>
        </div>
      </div>
    );
  }

  const statusMap = {
    Ativo: { label: "Gerado", color: "#3B82F6", bg: "#EFF6FF" },
    Apresentado: { label: "Apresentado", color: "#F59E0B", bg: "#FFFBEB" },
    Fechado: { label: "Pacote Fechado ✓", color: "#22C55E", bg: "#F0FDF4" },
    Arquivado: { label: "Arquivado", color: "#9CA3AF", bg: "#F9FAFB" },
  };
  const statusInfo = statusMap[plan.status] || statusMap.Ativo;

  return (
    <div className="min-h-screen" style={{ background: "#FAF9F7" }}>
      {/* Top Bar */}
      <div
        className="sticky top-0 z-10 bg-white px-4 md:px-8 py-4 flex items-center justify-between gap-4"
        style={{ borderBottom: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
      >
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(createPageUrl("Patients"))} className="flex items-center gap-2 text-sm" style={{ color: "#7A9DB0" }}>
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Pacientes</span>
          </button>
          <div className="h-4 w-px bg-gray-200" />
          <div>
            <h1 className="font-bold text-sm md:text-base" style={{ color: "#1B3A4B" }}>
              {plan.patient_nome}
            </h1>
            <p className="text-xs text-gray-400">{plan.terapia_especial}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold hidden sm:block"
            style={{ background: statusInfo.bg, color: statusInfo.color }}
          >
            {statusInfo.label}
          </span>

          {plan.status === "Ativo" && (
            <button
              onClick={markAsPresented}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all"
              style={{ background: "#C17F6A" }}
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Apresentado ao Paciente</span>
              <span className="sm:hidden">Apresentado</span>
            </button>
          )}

          {plan.status === "Apresentado" && (
            <button
              onClick={markAsClosed}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all"
              style={{ background: "#22C55E" }}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pacote Fechado!</span>
              <span className="sm:hidden">Fechado</span>
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all border"
            style={{ color: "#1B3A4B", borderColor: "#D1D5DB", background: "white" }}
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Imprimir</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {/* Plan header card */}
        <div
          className="rounded-3xl p-6 md:p-10 mb-8 relative overflow-hidden print:rounded-none print:shadow-none"
          style={{ background: "linear-gradient(135deg, #1B3A4B 0%, #2A4F63 100%)" }}
        >
          {/* Decorative circles */}
          <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-10" style={{ background: "#C17F6A" }} />
          <div className="absolute -right-4 top-16 w-32 h-32 rounded-full opacity-5" style={{ background: "#ffffff" }} />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#C17F6A" }}>
                  Vibe Terapias — Clínica Especializada em Dor
                </p>
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-1">PLANO TERAPÊUTICO</h2>
                <p className="text-sm" style={{ color: "#B0C4CF" }}>Plano de Tratamento e Sessões Integradas</p>
              </div>
              <FileText className="w-12 h-12 hidden md:block" style={{ color: "#C17F6A", opacity: 0.5 }} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Paciente", value: plan.patient_nome },
                { label: "Terapia", value: plan.terapia_especial },
                { label: "Total de Sessões", value: "24 Sessões" },
                { label: "Telefone", value: plan.patient_telefone },
              ].map((item) => (
                <div key={item.label} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <p className="text-xs mb-1" style={{ color: "#7A9DB0" }}>{item.label}</p>
                  <p className="text-sm font-bold text-white">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Session phases bar */}
            <div className="mt-6 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <p className="text-xs mb-3" style={{ color: "#7A9DB0" }}>Progressão das Sessões</p>
              <div className="flex gap-1">
                {[...Array(24)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-2 rounded-full"
                    style={{
                      background: i < 8 ? "#C17F6A" : i < 16 ? "#2A7DBF" : "#22C55E",
                      opacity: 0.8,
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-1.5 text-xs" style={{ color: "#7A9DB0" }}>
                <span>Etapa 1 (1-8)</span>
                <span>Etapa 2 (9-16)</span>
                <span>Etapa 3 (17-24)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Generated plan */}
        <div
          className="bg-white rounded-3xl shadow-sm border p-6 md:p-10 plan-content print:shadow-none print:border-0"
          style={{ borderColor: "#E5E7EB" }}
        >
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold mb-4 pb-2" style={{ color: "#1B3A4B", borderBottom: "2px solid #C17F6A" }}>
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-lg font-bold mt-8 mb-3 flex items-center gap-2" style={{ color: "#1B3A4B" }}>
                  <span className="w-1 h-5 rounded-full inline-block" style={{ background: "#C17F6A" }} />
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-base font-bold mt-6 mb-2 px-4 py-2 rounded-xl" style={{ color: "#1B3A4B", background: "#F5E6DD" }}>
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-sm leading-relaxed mb-3" style={{ color: "#374151" }}>
                  {children}
                </p>
              ),
              strong: ({ children }) => (
                <strong className="font-bold" style={{ color: "#1B3A4B" }}>
                  {children}
                </strong>
              ),
              ul: ({ children }) => (
                <ul className="space-y-1.5 mb-4 ml-2">{children}</ul>
              ),
              li: ({ children }) => (
                <li className="flex items-start gap-2 text-sm" style={{ color: "#374151" }}>
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#C17F6A" }} />
                  <span>{children}</span>
                </li>
              ),
              hr: () => (
                <hr className="my-6" style={{ borderColor: "#F3F4F6" }} />
              ),
            }}
          >
            {plan.plano_completo}
          </ReactMarkdown>
        </div>

        {/* Footer note */}
        <div className="mt-6 rounded-2xl p-5 text-center" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
          <p className="text-sm font-semibold" style={{ color: "#166534" }}>
            🌿 Plano gerado com IA especializada nos protocolos da Vibe Terapias
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Este plano é personalizado para as necessidades específicas de {plan.patient_nome}.
          </p>
        </div>
      </div>

      <style>{`
        @media print {
          .sticky { position: relative !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}