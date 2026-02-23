import React from "react";
import { Camera, Target, CheckCircle } from "lucide-react";

export default function StepFour({ data, onChange }) {
  const summaryItems = [
    { label: "Paciente", value: `${data.nome || "-"}, ${data.idade || "-"} anos (${data.sexo || "-"})` },
    { label: "Telefone", value: data.telefone || "-" },
    { label: "Terapia", value: data.terapia_especial || "-" },
    { label: "Intensidade da dor", value: data.intensidade_dor ? `${data.intensidade_dor}/10` : "-" },
    { label: "Tempo de dor", value: data.tempo_dor || "-" },
    { label: "Áreas afetadas", value: (data.areas_afetadas || []).join(", ") || "-" },
    { label: "Atividade física", value: data.atividade_fisica || "-" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: "#1B3A4B" }}>
          Avaliação Complementar
        </h2>
        <p className="text-sm text-gray-500">
          Finalize com o resultado da câmera termal e os objetivos do paciente.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>
          <Camera className="inline w-4 h-4 mr-1.5" style={{ color: "#C17F6A" }} />
          Resultado da Avaliação com a Câmera Termal
          <span className="ml-2 font-normal text-gray-400">(opcional)</span>
        </label>
        <textarea
          value={data.resultado_camera_termal || ""}
          onChange={(e) => onChange("resultado_camera_termal", e.target.value)}
          placeholder="Ex: Tensão elevada na região cervical, lombar e ombros. Ponto de calor identificado em L4-L5..."
          rows={4}
          className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none resize-none"
          style={{ borderColor: "#D1D5DB", background: "white" }}
          onFocus={(e) => (e.target.style.borderColor = "#C17F6A")}
          onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>
          <Target className="inline w-4 h-4 mr-1.5" style={{ color: "#C17F6A" }} />
          Objetivos do paciente com o tratamento *
        </label>
        <textarea
          value={data.objetivos_paciente || ""}
          onChange={(e) => onChange("objetivos_paciente", e.target.value)}
          placeholder="Ex: Reduzir as dores no pescoço, dormir melhor, conseguir trabalhar sem dor, voltar a praticar atividades físicas..."
          rows={4}
          className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none resize-none"
          style={{ borderColor: "#D1D5DB", background: "white" }}
          onFocus={(e) => (e.target.style.borderColor = "#C17F6A")}
          onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
        />
      </div>

      {/* Summary */}
      <div className="rounded-2xl p-5" style={{ background: "#F5E6DD" }}>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5" style={{ color: "#C17F6A" }} />
          <h3 className="font-bold text-sm" style={{ color: "#1B3A4B" }}>
            Resumo do Atendimento
          </h3>
        </div>
        <div className="space-y-2">
          {summaryItems.map((item) => (
            <div key={item.label} className="flex gap-2 text-sm">
              <span className="font-semibold w-36 flex-shrink-0" style={{ color: "#1B3A4B" }}>
                {item.label}:
              </span>
              <span className="text-gray-700 flex-1">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="rounded-2xl p-5 text-center"
        style={{ background: "linear-gradient(135deg, #1B3A4B 0%, #2A4F63 100%)" }}
      >
        <p className="text-white text-sm font-medium mb-1">
          🤖 A IA da Vibe Terapias está pronta para gerar
        </p>
        <p className="text-sm" style={{ color: "#B0C4CF" }}>
          Clique em "Gerar Plano Terapêutico" para criar um plano personalizado
          com 24 sessões divididas em 3 etapas.
        </p>
      </div>
    </div>
  );
}