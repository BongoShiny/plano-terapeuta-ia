import React, { useState } from "react";
import { Camera, Target, CheckCircle, Upload, Loader2, ImageIcon, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import CameraThermalUploader from "./CameraThermalUploader";

function PhotoUploader({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    onChange(file_url);
    setUploading(false);
  };

  return (
    <div>
      <p className="text-xs font-semibold mb-2" style={{ color: "#374151" }}>{label}</p>
      <label
        className="flex flex-col items-center justify-center w-full rounded-xl cursor-pointer border-2 border-dashed transition-all"
        style={{ borderColor: value ? "#C17F6A" : "#D1D5DB", background: value ? "#FFF5F0" : "#FAFAFA", minHeight: 120 }}
      >
        {uploading ? (
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#C17F6A" }} />
        ) : value ? (
          <img src={value} alt="preview" className="w-full object-cover rounded-xl" style={{ maxHeight: 160 }} />
        ) : (
          <div className="flex flex-col items-center gap-2 p-4">
            <Upload className="w-6 h-6" style={{ color: "#C17F6A" }} />
            <span className="text-xs text-gray-400">Clique para enviar foto</span>
          </div>
        )}
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </label>
    </div>
  );
}

export default function StepFour({ data, onChange }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const summaryItems = [
    { label: "Paciente", value: `${data.nome || "-"}, ${data.idade || "-"} anos (${data.sexo || "-"})` },
    { label: "Telefone", value: data.telefone || "-" },
    { label: "Terapia", value: data.terapia_especial || "-" },
    { label: "Intensidade da dor", value: data.intensidade_dor ? `${data.intensidade_dor}/10` : "-" },
    { label: "Tempo de dor", value: data.tempo_dor || "-" },
    { label: "Áreas afetadas", value: (data.areas_afetadas || []).join(", ") || "-" },
  ];

  const analyzePosturalPhotos = async () => {
    if (!data.foto_postural_1 && !data.foto_postural_2) return;
    setAnalyzing(true);
    const fileUrls = [data.foto_postural_1, data.foto_postural_2].filter(Boolean);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Você é um especialista em avaliação postural da clínica Vibe Terapias. Analise as fotos posturais do paciente ${data.nome} (${data.sexo}, ${data.idade} anos) com queixas em: ${(data.areas_afetadas || []).join(", ")}.
      
Realize uma avaliação postural detalhada e profissional em português, estruturada em:
1. Vista Frontal (Plano Coronal) - se disponível
2. Vista Lateral (Plano Sagital) - se disponível

Para cada vista analise: cabeça, cervical, ombros, coluna torácica, coluna lombar e pelve, joelhos, tornozelos e pés.
Identifique desvios, assimetrias, compensações musculares e relate com as queixas do paciente.
Use linguagem profissional e acolhedora. Seja detalhado e relacione os achados posturais com as queixas de dor.`,
      file_urls: fileUrls,
    });
    onChange("avaliacao_postural", result);
    setAnalyzed(true);
    setAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: "#1B3A4B" }}>
          Avaliação Complementar
        </h2>
        <p className="text-sm text-gray-500">
          Fotos posturais, câmera termal e objetivos do paciente.
        </p>
      </div>

      {/* Fotos posturais */}
      <div className="rounded-2xl p-5 border" style={{ borderColor: "#E5E7EB" }}>
        <div className="flex items-center gap-2 mb-4">
          <ImageIcon className="w-4 h-4" style={{ color: "#C17F6A" }} />
          <h3 className="font-semibold text-sm" style={{ color: "#1B3A4B" }}>
            Fotos da Avaliação Postural
            <span className="ml-2 font-normal text-gray-400">(opcional)</span>
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <PhotoUploader
            label="Foto 1 (Vista Frontal)"
            value={data.foto_postural_1 || ""}
            onChange={(v) => { onChange("foto_postural_1", v); setAnalyzed(false); }}
          />
          <PhotoUploader
            label="Foto 2 (Vista Lateral)"
            value={data.foto_postural_2 || ""}
            onChange={(v) => { onChange("foto_postural_2", v); setAnalyzed(false); }}
          />
        </div>

        {(data.foto_postural_1 || data.foto_postural_2) && (
          <button
            onClick={analyzePosturalPhotos}
            disabled={analyzing}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: analyzing ? "#E5E7EB" : "linear-gradient(135deg, #1B3A4B 0%, #2A4F63 100%)", color: analyzing ? "#9CA3AF" : "white" }}
          >
            {analyzing ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Analisando fotos com IA...</>
            ) : analyzed ? (
              <><CheckCircle className="w-4 h-4" />Análise realizada! Analisar novamente</>
            ) : (
              <><Sparkles className="w-4 h-4" />Analisar Fotos com IA</>
            )}
          </button>
        )}

        {data.avaliacao_postural && (
          <div className="mt-4 p-4 rounded-xl text-xs" style={{ background: "#F0F7FF", color: "#1B3A4B", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
            {data.avaliacao_postural}
          </div>
        )}
      </div>

      {/* Câmera Termal */}
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

      {/* Objetivos */}
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