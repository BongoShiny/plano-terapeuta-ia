import React from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { createPageUrl } from "@/utils";
import {
  Users, FileText, TrendingUp, Plus,
  ArrowRight, Sparkles, Clock, CheckCircle
} from "lucide-react";

function StatCard({ label, value, icon: Icon, color, bg }) {
  return (
    <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E5E7EB" }}>
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center"
          style={{ background: bg }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <p className="text-3xl font-bold mb-1" style={{ color: "#1B3A4B" }}>{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => base44.auth.me(),
  });

  const { data: patients = [] } = useQuery({
    queryKey: ["patients"],
    queryFn: () => base44.entities.Patient.list("-created_date", 200),
  });

  const { data: plans = [] } = useQuery({
    queryKey: ["plans"],
    queryFn: () => base44.entities.TherapeuticPlan.list("-created_date", 200),
  });

  const recentPlans = plans.slice(0, 5);
  const activePlans = plans.filter((p) => p.status === "Ativo" || p.status === "Apresentado");
  const closedPlans = plans.filter((p) => p.status === "Fechado");

  const planStatusConfig = {
    Ativo: { label: "Gerado", color: "#3B82F6", bg: "#EFF6FF" },
    Apresentado: { label: "Apresentado", color: "#F59E0B", bg: "#FFFBEB" },
    Fechado: { label: "Fechado ✓", color: "#22C55E", bg: "#F0FDF4" },
    Gerando: { label: "Gerando...", color: "#8B5CF6", bg: "#F5F3FF" },
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: "#FAF9F7" }}>
      <div className="max-w-6xl mx-auto">
        {/* Welcome header */}
        <div className="mb-8">
          <p className="text-sm text-gray-400 mb-1">
            {getGreeting()}, {user?.full_name?.split(" ")[0] || "bem-vindo(a)"}!
          </p>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "#1B3A4B" }}>
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Central de gestão de planos terapêuticos
          </p>
        </div>

        {/* Hero CTA */}
        <div
          className="rounded-3xl p-6 md:p-8 mb-8 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1B3A4B 0%, #2A4F63 100%)" }}
        >
          <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full opacity-10" style={{ background: "#C17F6A" }} />
          <div className="absolute right-16 -top-4 w-24 h-24 rounded-full opacity-5" style={{ background: "#fff" }} />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5" style={{ color: "#C17F6A" }} />
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#C17F6A" }}>
                  Gerador de Planos com I.A.
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                Crie um novo plano terapêutico
              </h2>
              <p className="text-sm" style={{ color: "#B0C4CF" }}>
                Preencha a avaliação do paciente e a IA gera um plano personalizado
                com 24 sessões em segundos.
              </p>
            </div>
            <button
              onClick={() => navigate(createPageUrl("NewAssessment"))}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all flex-shrink-0"
              style={{ background: "#C17F6A", color: "white" }}
            >
              <Plus className="w-4 h-4" />
              Novo Atendimento
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total de Pacientes"
            value={patients.length}
            icon={Users}
            color="#1B3A4B"
            bg="#E8F0F4"
          />
          <StatCard
            label="Planos Gerados"
            value={plans.length}
            icon={FileText}
            color="#C17F6A"
            bg="#F5E6DD"
          />
          <StatCard
            label="Em Andamento"
            value={activePlans.length}
            icon={Clock}
            color="#F59E0B"
            bg="#FFFBEB"
          />
          <StatCard
            label="Pacotes Fechados"
            value={closedPlans.length}
            icon={CheckCircle}
            color="#22C55E"
            bg="#F0FDF4"
          />
        </div>

        {/* Recent Plans */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: "#1B3A4B" }}>
              Planos Recentes
            </h2>
            <button
              onClick={() => navigate(createPageUrl("Patients"))}
              className="text-sm flex items-center gap-1 font-medium"
              style={{ color: "#C17F6A" }}
            >
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {recentPlans.length === 0 ? (
            <div
              className="rounded-2xl border-2 border-dashed p-12 text-center"
              style={{ borderColor: "#E5E7EB" }}
            >
              <Sparkles className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="font-semibold text-gray-400 mb-2">Nenhum plano gerado ainda</p>
              <p className="text-sm text-gray-400">
                Faça seu primeiro atendimento para ver os planos aqui.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPlans.map((plan) => {
                const ps = planStatusConfig[plan.status] || planStatusConfig.Ativo;
                return (
                  <button
                    key={plan.id}
                    onClick={() => navigate(createPageUrl(`PlanView?id=${plan.id}`))}
                    className="w-full bg-white rounded-2xl border p-4 flex items-center gap-4 hover:shadow-md transition-all text-left"
                    style={{ borderColor: "#E5E7EB" }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #C17F6A 0%, #1B3A4B 100%)" }}
                    >
                      {plan.patient_nome?.charAt(0) || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate" style={{ color: "#1B3A4B" }}>
                        {plan.patient_nome}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{plan.terapia_especial}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-semibold hidden sm:block"
                        style={{ background: ps.bg, color: ps.color }}
                      >
                        {ps.label}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-300" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}