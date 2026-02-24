import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import PlanDocument from "../components/plan/PlanDocument";
import { ArrowLeft, Printer, CheckCircle, Loader2, Users, FileText, Download } from "lucide-react";

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

  const [downloading, setDownloading] = useState(false);

  const downloadDocx = async () => {
    setDownloading(true);
    try {
      const response = await base44.functions.invoke("generateDocx", { planId: plan.id });
      // response.data is arraybuffer
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Plano_Vibe_${plan.patient_nome || "Paciente"}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (e) {
      alert("Erro ao gerar o .docx. Tente novamente.");
    } finally {
      setDownloading(false);
    }
  };

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
            onClick={downloadDocx}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all border"
            style={{ color: "#1B3A4B", borderColor: "#D1D5DB", background: "white" }}
          >
            {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{downloading ? "Gerando..." : "Baixar .docx"}</span>
          </button>

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
      <div id="plan-print-area" className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <PlanDocument plan={plan} patientData={patientData} />
      </div>

      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          body * { visibility: hidden; }
          #plan-print-area, #plan-print-area * { visibility: visible; }
          #plan-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            margin: 0;
          }
          #plan-print-area > div > div {
            page-break-after: always;
            break-after: page;
            margin-bottom: 0 !important;
          }
          body {
            background: white !important;
            margin: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}