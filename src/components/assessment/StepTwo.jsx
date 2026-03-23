import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Sparkles, Loader2, FileText, PenLine } from "lucide-react";

const AREAS = [
  "Pescoço / Cervical", "Cabeça / Crânio", "Ombros", "Braços / Membros Superiores",
  "Coluna Torácica", "Lombar / Coluna Lombar", "Quadril / Glúteos",
  "Pernas / Membros Inferiores", "Joelhos", "Pés / Tornozelos",
  "Abdômen", "Mandíbula / ATM", "Costas (geral)", "Corpo todo",
];

const TEMPOS = [
  "Menos de 1 mês", "1 a 3 meses", "3 a 6 meses",
  "6 meses a 1 ano", "1 a 2 anos", "Mais de 2 anos",
];

function ManualForm({ data, onChange }) {
  const toggleArea = (area) => {
    const current = data.areas_afetadas || [];
    if (current.includes(area)) {
      onChange("areas_afetadas", current.filter((a) => a !== area));
    } else {
      onChange("areas_afetadas", [...current, area]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>
          Principais queixas do paciente <span className="font-normal text-gray-400">(selecione todas)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {AREAS.map((area) => {
            const selected = (data.areas_afetadas || []).includes(area);
            return (
              <button
                key={area}
                type="button"
                onClick={() => toggleArea(area)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
                style={{
                  background: selected ? "#C17F6A" : "white",
                  color: selected ? "white" : "#374151",
                  borderColor: selected ? "#C17F6A" : "#D1D5DB",
                }}
              >
                {area}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>
          Há quanto tempo sente essa dor? *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {TEMPOS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onChange("tempo_dor", t)}
              className="px-3 py-2.5 rounded-xl text-xs font-medium text-center transition-all border"
              style={{
                background: data.tempo_dor === t ? "#1B3A4B" : "white",
                color: data.tempo_dor === t ? "white" : "#374151",
                borderColor: data.tempo_dor === t ? "#1B3A4B" : "#D1D5DB",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AiResumoForm({ data, onChange, onAnalyze, analyzing }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>
          Resumo do Cliente
          <span className="ml-2 font-normal text-gray-400">(conversa do WhatsApp, anamnese, etc.)</span>
        </label>
        <textarea
          value={data.resumo_cliente || ""}
          onChange={(e) => onChange("resumo_cliente", e.target.value)}
          placeholder="Cole aqui tudo o que conversou com o cliente no WhatsApp, dados da anamnese, queixas relatadas, histórico de dores, medicamentos, condições de saúde... Quanto mais detalhado, melhor será a análise da IA."
          rows={8}
          className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none resize-none"
          style={{ borderColor: "#D1D5DB", background: "white" }}
          onFocus={(e) => (e.target.style.borderColor = "#C17F6A")}
          onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
        />
      </div>

      {data._ai_filled && (
        <div className="rounded-xl p-4 border" style={{ background: "#F0FDF4", borderColor: "#BBF7D0" }}>
          <p className="text-sm font-semibold" style={{ color: "#22C55E" }}>
            ✓ Análise completa! As etapas 2 e 3 foram preenchidas automaticamente.
          </p>
          <p className="text-xs text-gray-500 mt-1">Clique em "Próximo" para ir à etapa de fotos e finalização.</p>
        </div>
      )}

      {!data._ai_filled && (
        <button
          type="button"
          onClick={onAnalyze}
          disabled={!data.resumo_cliente || data.resumo_cliente.trim().length < 20 || analyzing}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white transition-all"
          style={{
            background: (!data.resumo_cliente || data.resumo_cliente.trim().length < 20 || analyzing)
              ? "#E5E7EB"
              : "linear-gradient(135deg, #1B3A4B 0%, #2A4F63 100%)",
            color: (!data.resumo_cliente || data.resumo_cliente.trim().length < 20 || analyzing) ? "#9CA3AF" : "white",
          }}
        >
          {analyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analisando com IA...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Analisar com IA e preencher automaticamente
            </>
          )}
        </button>
      )}
    </div>
  );
}

export default function StepTwo({ data, onChange, onSkipToStep }) {
  const [mode, setMode] = useState(data._ai_filled ? "ai" : null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Você é um assistente clínico da Vibe Terapias. Analise o resumo abaixo de um cliente e extraia as informações estruturadas.

RESUMO DO CLIENTE:
${data.resumo_cliente}

TERAPIA ESPECIAL ESCOLHIDA: ${data.terapia_especial || "Liberação Miofascial"}

Extraia as informações e retorne um JSON com os seguintes campos:
- areas_afetadas: array de strings, escolha APENAS entre estas opções: "Pescoço / Cervical", "Cabeça / Crânio", "Ombros", "Braços / Membros Superiores", "Coluna Torácica", "Lombar / Coluna Lombar", "Quadril / Glúteos", "Pernas / Membros Inferiores", "Joelhos", "Pés / Tornozelos", "Abdômen", "Mandíbula / ATM", "Costas (geral)", "Corpo todo"
- tempo_dor: string, escolha APENAS entre: "Menos de 1 mês", "1 a 3 meses", "3 a 6 meses", "6 meses a 1 ano", "1 a 2 anos", "Mais de 2 anos"
- queixas_principais: string com resumo das queixas
- causas_provaveis: array de strings, escolha APENAS entre: "Postura no trabalho / computador", "Sedentarismo", "Estresse / Ansiedade", "Atividade física intensa", "Acidente / Queda", "Gravidez / Pós-parto", "Trabalho físico pesado", "Sono inadequado", "Herança genética", "Não sei ao certo"
- atividade_fisica: string, escolha APENAS entre: "Não pratico atividade física", "Caminhada", "Musculação", "Yoga / Pilates", "Corrida", "Beach Tênis / Esportes", "Natação", "Ciclismo", "Dança", "Outros"
- condicoes_preexistentes: array de strings, escolha APENAS entre: "Fibromialgia", "Artrose / Artrite", "Hérnia de Disco", "Diabetes", "Hipertensão", "Obesidade / Sobrepeso", "Lipedema", "Bruxismo", "Ansiedade / Depressão", "Enxaqueca / Cefaleia crônica", "Osteoporose", "Doenças autoimunes", "Nenhuma"
- medicamentos: string com medicamentos mencionados ou "Nenhum"
- historico_dor: string com breve histórico

Se alguma informação não foi mencionada no resumo, use o valor mais provável baseado no contexto ou deixe vazio.`,
        response_json_schema: {
          type: "object",
          properties: {
            areas_afetadas: { type: "array", items: { type: "string" } },
            tempo_dor: { type: "string" },
            queixas_principais: { type: "string" },
            causas_provaveis: { type: "array", items: { type: "string" } },
            atividade_fisica: { type: "string" },
            condicoes_preexistentes: { type: "array", items: { type: "string" } },
            medicamentos: { type: "string" },
            historico_dor: { type: "string" },
          },
        },
      });

      // Fill all fields from AI result
      if (result.areas_afetadas) onChange("areas_afetadas", result.areas_afetadas);
      if (result.tempo_dor) onChange("tempo_dor", result.tempo_dor);
      if (result.queixas_principais) onChange("queixas_principais", result.queixas_principais);
      if (result.causas_provaveis) onChange("causas_provaveis", result.causas_provaveis);
      if (result.atividade_fisica) onChange("atividade_fisica", result.atividade_fisica);
      if (result.condicoes_preexistentes) onChange("condicoes_preexistentes", result.condicoes_preexistentes);
      if (result.medicamentos) onChange("medicamentos", result.medicamentos);
      if (result.historico_dor) onChange("historico_dor", result.historico_dor);
      onChange("_ai_filled", true);

      // Skip to step 4 (index 3)
      if (onSkipToStep) onSkipToStep(3);
    } catch (err) {
      console.error("AI analysis error:", err);
      alert("Erro ao analisar. Tente novamente. Detalhe: " + (err?.message || String(err)));
    } finally {
      setAnalyzing(false);
    }
  };

  // Mode selection screen
  if (mode === null) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-1" style={{ color: "#1B3A4B" }}>
            Queixas e Dores
          </h2>
          <p className="text-sm text-gray-500">
            Escolha como deseja preencher as informações do paciente.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setMode("manual")}
            className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all hover:shadow-md text-center"
            style={{ borderColor: "#D1D5DB", background: "white" }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "#E8F0F4" }}>
              <PenLine className="w-6 h-6" style={{ color: "#1B3A4B" }} />
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: "#1B3A4B" }}>Preencher Manualmente</p>
              <p className="text-xs text-gray-400 mt-1">Selecione as queixas, áreas e histórico passo a passo</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMode("ai")}
            className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all hover:shadow-md text-center"
            style={{ borderColor: "#C17F6A", background: "#FDF8F5" }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "#F5E6DD" }}>
              <Sparkles className="w-6 h-6" style={{ color: "#C17F6A" }} />
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: "#1B3A4B" }}>Resumo com IA</p>
              <p className="text-xs text-gray-400 mt-1">Cole o resumo da conversa e a IA preenche tudo automaticamente</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold mb-1" style={{ color: "#1B3A4B" }}>
            Queixas e Dores
          </h2>
          <p className="text-sm text-gray-500">
            {mode === "ai"
              ? "Cole o resumo da conversa e a IA analisa automaticamente."
              : "Descreva as principais queixas e localização das dores."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMode(mode === "ai" ? "manual" : "ai")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
          style={{ color: "#C17F6A", borderColor: "#C17F6A" }}
        >
          {mode === "ai" ? <PenLine className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
          {mode === "ai" ? "Manual" : "Usar IA"}
        </button>
      </div>

      {mode === "manual" && <ManualForm data={data} onChange={onChange} />}
      {mode === "ai" && <AiResumoForm data={data} onChange={onChange} onAnalyze={handleAnalyze} analyzing={analyzing} />}
    </div>
  );
}