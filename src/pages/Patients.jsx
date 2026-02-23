import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { createPageUrl } from "@/utils";
import {
  Search, Plus, FileText, Phone, User2,
  ChevronRight, Loader2, Activity
} from "lucide-react";

const STATUS_STYLE = {
  Ativo: { bg: "#EFF6FF", color: "#3B82F6" },
  "Em Tratamento": { bg: "#FEF3C7", color: "#D97706" },
  Concluído: { bg: "#F0FDF4", color: "#22C55E" },
  Inativo: { bg: "#F9FAFB", color: "#9CA3AF" },
};

export default function Patients() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [viewingPlanPatient, setViewingPlanPatient] = useState(null);

  const { data: patients = [], isLoading: loadingPatients } = useQuery({
    queryKey: ["patients"],
    queryFn: () => base44.entities.Patient.list("-created_date", 100),
  });

  const { data: plans = [] } = useQuery({
    queryKey: ["plans"],
    queryFn: () => base44.entities.TherapeuticPlan.list("-created_date", 200),
  });

  const filtered = patients.filter((p) =>
    (p.nome || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.terapia_especial || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.telefone || "").includes(search)
  );

  const getPatientPlans = (patientId) =>
    plans.filter((pl) => pl.patient_id === patientId);

  const planStatusMap = {
    Ativo: { label: "Gerado", color: "#3B82F6", bg: "#EFF6FF" },
    Apresentado: { label: "Apresentado", color: "#F59E0B", bg: "#FFFBEB" },
    Fechado: { label: "Fechado ✓", color: "#22C55E", bg: "#F0FDF4" },
    Gerando: { label: "Gerando...", color: "#8B5CF6", bg: "#F5F3FF" },
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: "#FAF9F7" }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "#1B3A4B" }}>
              Pacientes
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              {patients.length} {patients.length === 1 ? "paciente" : "pacientes"} cadastrados
            </p>
          </div>
          <button
            onClick={() => navigate(createPageUrl("NewAssessment"))}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg, #C17F6A 0%, #A86755 100%)" }}
          >
            <Plus className="w-4 h-4" />
            Novo Atendimento
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, terapia ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white border rounded-2xl text-sm focus:outline-none"
            style={{ borderColor: "#E5E7EB" }}
            onFocus={(e) => (e.target.style.borderColor = "#C17F6A")}
            onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
          />
        </div>

        {/* Patient list */}
        {loadingPatients ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#C17F6A" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <User2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="font-semibold text-gray-400">
              {search ? "Nenhum paciente encontrado" : "Nenhum paciente cadastrado"}
            </p>
            {!search && (
              <button
                onClick={() => navigate(createPageUrl("NewAssessment"))}
                className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: "#C17F6A" }}
              >
                Cadastrar primeiro paciente
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((patient) => {
              const patientPlans = getPatientPlans(patient.id);
              const latestPlan = patientPlans[0];
              const statusStyle = STATUS_STYLE[patient.status] || STATUS_STYLE.Ativo;

              return (
                <div
                  key={patient.id}
                  className="bg-white rounded-2xl border p-4 md:p-5 transition-all hover:shadow-md"
                  style={{ borderColor: "#E5E7EB" }}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #C17F6A 0%, #1B3A4B 100%)" }}
                    >
                      {patient.nome?.charAt(0)?.toUpperCase() || "?"}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-bold text-sm" style={{ color: "#1B3A4B" }}>
                            {patient.nome}
                          </h3>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {patient.idade ? `${patient.idade} anos • ` : ""}
                            {patient.sexo} • {patient.terapia_especial}
                          </p>
                        </div>
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{ background: statusStyle.bg, color: statusStyle.color }}
                        >
                          {patient.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          {patient.telefone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Activity className="w-3.5 h-3.5" />
                          {patientPlans.length} {patientPlans.length === 1 ? "plano" : "planos"}
                        </span>
                      </div>

                      {/* Plans */}
                      {patientPlans.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {patientPlans.slice(0, 3).map((pl) => {
                            const ps = planStatusMap[pl.status] || planStatusMap.Ativo;
                            return (
                              <button
                                key={pl.id}
                                onClick={() => navigate(createPageUrl(`PlanView?id=${pl.id}`))}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:shadow-sm"
                                style={{ background: ps.bg, color: ps.color }}
                              >
                                <FileText className="w-3 h-3" />
                                {ps.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => navigate(createPageUrl("NewAssessment"))}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white"
                        style={{ background: "#C17F6A" }}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Novo Plano</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}