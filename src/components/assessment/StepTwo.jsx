import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Sparkles, Loader2, X, Info } from "lucide-react";

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
  const [analyzing, setAnalyzing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!data._ai_filled) {
      setShowPopup(true);
    }
  }, []);

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

  return (
    <div className="space-y-6">
      {/* Popup de instrução */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-xl relative">
            <button
              type="button"
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#F5E6DD" }}>
                <Info className="w-5 h-5" style={{ color: "#C17F6A" }} />
              </div>
              <h3 className="font-bold text-base" style={{ color: "#1B3A4B" }}>Como preencher?</h3>
            </div>
            <div className="space-y-3 text-sm" style={{ color: "#374151" }}>
              <p>Para obter o resumo do paciente:</p>
              <div className="flex gap-2 items-start">
                <span className="font-bold" style={{ color: "#C17F6A" }}>1.</span>
                <span>Entre na <strong>agenda do paciente novo</strong> e copie as informações.</span>
              </div>
              <div className="flex gap-2 items-start">
                <span className="font-bold" style={{ color: "#C17F6A" }}>2.</span>
                <span>Ou pergunte no <strong>grupo de resumo</strong> e cole aqui no campo abaixo.</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowPopup(false)}
              className="w-full mt-5 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg, #1B3A4B 0%, #2A4F63 100%)" }}
            >
              Entendi
            </button>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: "#1B3A4B" }}>
          Queixas e Dores
        </h2>
        <p className="text-sm text-gray-500">
          Cole o resumo da conversa e a IA analisa automaticamente.
        </p>
      </div>

      <AiResumoForm data={data} onChange={onChange} onAnalyze={handleAnalyze} analyzing={analyzing} />
    </div>
  );
}