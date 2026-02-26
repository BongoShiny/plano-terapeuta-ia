import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import StepOne from "../components/assessment/StepOne";
import StepTwo from "../components/assessment/StepTwo";
import StepThree from "../components/assessment/StepThree";
import StepFour from "../components/assessment/StepFour";
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from "lucide-react";

const STEPS = [
  { title: "Dados Pessoais", subtitle: "Identificação" },
  { title: "Queixas e Dores", subtitle: "Avaliação" },
  { title: "Saúde e Histórico", subtitle: "Anamnese" },
  { title: "Finalização", subtitle: "Gerar Plano" },
];

function buildPrompt(data) {
  const nomeUpper = (data.nome || "").toUpperCase();
  return `Você é o motor de inteligência da clínica Vibe Terapias, especializada em Liberação Miofascial.
Crie um plano terapêutico completo e personalizado. Retorne APENAS um JSON válido, sem texto antes ou depois.

DADOS DO PACIENTE:
- Nome: ${data.nome || "Não informado"}
- Idade: ${data.idade || "Não informada"} anos
- Sexo: ${data.sexo || "Não informado"}
- Telefone: ${data.telefone || "Não informado"}
- Terapia Especial: ${data.terapia_especial || "Liberação Miofascial"}
- Queixas Principais: ${data.queixas_principais || "Não informado"}
- Áreas Afetadas: ${(data.areas_afetadas || []).join(", ") || "Não informado"}
- Intensidade da Dor: ${data.intensidade_dor || 0}/10
- Tempo de Dor: ${data.tempo_dor || "Não informado"}
- Histórico: ${data.historico_dor || "Não informado"}
- Causas Prováveis: ${(data.causas_provaveis || []).join(", ") || "Não informado"}
- Atividade Física: ${data.atividade_fisica || "Não informado"}
- Condições Preexistentes: ${(data.condicoes_preexistentes || []).join(", ") || "Nenhuma"}
- Medicamentos: ${data.medicamentos || "Nenhum"}
- Resultado Câmera Termal: ${data.resultado_camera_termal || "A ser realizado na primeira sessão"}
- Objetivos do Paciente: ${data.objetivos_paciente || "Não informado"}

REGRAS OBRIGATÓRIAS — SIGA À RISCA:
1. ACOLHIMENTO: Mencione o nome "${data.nome}" várias vezes em todos os textos para gerar conexão e empatia.
2. ESTRUTURA: 24 sessões divididas em 3 Etapas. Etapa 1: sessões 1-8 (4 ciclos). Etapa 2: sessões 9-16 (3 ciclos). Etapa 3: sessões 17-24 (3 ciclos). TOTAL: 10 CICLOS.
3. HIERARQUIA DE TÉCNICAS: A Liberação Miofascial SEMPRE é citada PRIMEIRO em todas as listas de técnicas.
4. SEGURANÇA E ÉTICA: Ventosaterapia, Dry Needling e Eletroestimulação SEMPRE devem ser seguidas de "(CASO O CLIENTE APROVAR)" — nunca omita isso.
5. LINGUAGEM: Persuasiva, acolhedora e profissional. O objetivo é que o paciente se sinta cuidado e confiante para fechar o pacote completo.
6. Retorne SOMENTE o JSON, sem nenhum texto antes ou depois.

JSON a retornar (preencha todos os campos com conteúdo real e personalizado para ${data.nome}):

{
  "resumo_queixas": "Parágrafo acolhedor e detalhado sobre as queixas de ${data.nome}, mencionando as áreas afetadas (${(data.areas_afetadas || []).join(", ")}), o tempo de dor (${data.tempo_dor}), intensidade (${data.intensidade_dor}/10) e causas prováveis. Use o nome várias vezes.",
  "resultado_camera_termal": "${data.resultado_camera_termal ? data.resultado_camera_termal : "A câmera termal será utilizada na primeira sessão de " + data.nome + " para mapear os pontos de calor e inflamação, identificando com precisão as áreas de maior sobrecarga muscular e personalizando ainda mais o tratamento."}",
  "objetivos_tratamento": [
    "Objetivo específico 1 baseado nas queixas de ${data.nome} (ex: reduzir dor em área específica)",
    "Objetivo específico 2 (ex: restaurar mobilidade)",
    "Objetivo específico 3 (ex: corrigir postura/assimetria)",
    "Objetivo específico 4 (ex: eliminar inflamação identificada na câmera termal)",
    "Garantir que ${data.nome} mantenha qualidade de vida, postura e bem-estar a longo prazo"
  ],
  "objetivo_geral": "Parágrafo geral e persuasivo sobre como o plano proporcionará alívio imediato, recuperação muscular e qualidade de vida para ${data.nome}. Mencione o nome várias vezes.",
  "explicacao_terapia": "Parágrafo explicando como a terapia ${data.terapia_especial} vai tratar especificamente as queixas de ${data.nome}. Enfatize que a Liberação Miofascial é a base de todo o tratamento e como ela age nos tecidos de ${data.nome}.",
  "etapas": [
    {
      "numero": 1,
      "nome": "Alívio Imediato das Dores e Preparação do Corpo de ${data.nome}",
      "sessoes": "Sessões 1 a 8",
      "objetivo_etapa": "O FOCO DESSA FASE É PROPORCIONAR ALÍVIO IMEDIATO DAS DORES DE ${nomeUpper}, REDUZINDO AS TENSÕES MUSCULARES E PREPARANDO O CORPO PARA TERAPIAS MAIS PROFUNDAS.",
      "ciclos": [
        {
          "numero": 1,
          "objetivo": "Mapeamento inicial e alívio das tensões mais agudas de ${data.nome}.",
          "tecnicas": "Liberação Miofascial, Ventosaterapia deslizante (CASO O CLIENTE APROVAR), Pedras Quentes.",
          "musculos": "Músculos das áreas de maior queixa de ${data.nome}: ${(data.areas_afetadas || []).join(", ")}."
        },
        {
          "numero": 2,
          "objetivo": "Redução da inflamação e das dores irradiadas identificadas em ${data.nome}.",
          "tecnicas": "Liberação Miofascial, Dry Needling (CASO O CLIENTE APROVAR), Eletroestimulação (CASO O CLIENTE APROVAR).",
          "musculos": "Músculos profundos das regiões de maior queixa de ${data.nome} e cadeias musculares relacionadas."
        },
        {
          "numero": 3,
          "objetivo": "Consolidação do alívio e início da recuperação da mobilidade de ${data.nome}.",
          "tecnicas": "Liberação Miofascial, Ventosaterapia (CASO O CLIENTE APROVAR), Massagem Relaxante Terapêutica.",
          "musculos": "Musculatura das áreas afetadas de ${data.nome} com foco em relaxamento profundo e liberação fascial."
        },
        {
          "numero": 4,
          "objetivo": "Preparar o corpo de ${data.nome} para a transição para a fase de recuperação funcional.",
          "tecnicas": "Liberação Miofascial, Eletroestimulação (CASO O CLIENTE APROVAR), Alongamentos Terapêuticos.",
          "musculos": "Cadeias musculares completas das áreas trabalhadas, com reforço nas regiões de maior tensão de ${data.nome}."
        }
      ]
    },
    {
      "numero": 2,
      "nome": "Recuperação Funcional e Correção de Assimetrias de ${data.nome}",
      "sessoes": "Sessões 9 a 16",
      "objetivo_etapa": "APROFUNDAR O TRATAMENTO DE ${nomeUpper}, CORRIGINDO ASSIMETRIAS POSTURAIS, MELHORANDO A MOBILIDADE GLOBAL E REEQUILIBRANDO AS CADEIAS MUSCULARES.",
      "ciclos": [
        {
          "numero": 5,
          "objetivo": "Aprofundamento nas regiões de dor persistente e correção postural de ${data.nome}.",
          "tecnicas": "Liberação Miofascial, Ventosaterapia (CASO O CLIENTE APROVAR), Alongamentos Terapêuticos.",
          "musculos": "Músculos com tensões mais profundas e cadeias posturais de ${data.nome}."
        },
        {
          "numero": 6,
          "objetivo": "Aumento da amplitude de movimento e redução de tensões profundas em ${data.nome}.",
          "tecnicas": "Liberação Miofascial, Dry Needling (CASO O CLIENTE APROVAR).",
          "musculos": "Musculatura profunda e pontos-gatilho das áreas trabalhadas nas fases anteriores de ${data.nome}."
        },
        {
          "numero": 7,
          "objetivo": "Reequilíbrio muscular e preparação de ${data.nome} para a fase final.",
          "tecnicas": "Liberação Miofascial, Eletroestimulação (CASO O CLIENTE APROVAR), Mobilização Articular.",
          "musculos": "Core, musculatura estabilizadora e áreas de queixa principal de ${data.nome}."
        }
      ]
    },
    {
      "numero": 3,
      "nome": "Ajustes Finais e Manutenção Duradoura para ${data.nome}",
      "sessoes": "Sessões 17 a 24",
      "objetivo_etapa": "FORTALECER, PREVENIR RECIDIVAS E GARANTIR QUE ${nomeUpper} MANTENHA OS RESULTADOS CONQUISTADOS A LONGO PRAZO.",
      "ciclos": [
        {
          "numero": 8,
          "objetivo": "Manutenção da mobilidade e prevenção de novas tensões para ${data.nome}.",
          "tecnicas": "Liberação Miofascial, Ventosaterapia (CASO O CLIENTE APROVAR), Técnicas de Manutenção.",
          "musculos": "Todas as regiões trabalhadas no tratamento de ${data.nome}, com foco em manutenção e equilíbrio."
        },
        {
          "numero": 9,
          "objetivo": "Reforço postural, estabilidade corporal e educação de ${data.nome} para autocuidado.",
          "tecnicas": "Liberação Miofascial, Exercícios Posturais, Orientações de Autocuidado.",
          "musculos": "Core, glúteos, musculatura estabilizadora e toda a cadeia posterior de ${data.nome}."
        },
        {
          "numero": 10,
          "objetivo": "Sessão final: consolidação total, avaliação dos resultados e plano de manutenção de ${data.nome}.",
          "tecnicas": "Liberação Miofascial, Técnicas Integrativas, Reavaliação Completa com Câmera Termal.",
          "musculos": "Todos os grupos musculares trabalhados ao longo do tratamento de ${data.nome}."
        }
      ]
    }
  ],
  "resumo_final": "Parágrafo final persuasivo e acolhedor sobre o plano de ${data.nome}. Mencione o nome várias vezes. Destaque as 3 etapas, o alívio progressivo e a qualidade de vida que ${data.nome} irá recuperar. Finalize convencendo ${data.nome} de que fechar o pacote completo de 24 sessões é o caminho para uma vida sem dor e com bem-estar duradouro."
}`;
}

export default function NewAssessment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const [generating, setGenerating] = useState(false);

  const handleChange = (key, value) => setData((p) => ({ ...p, [key]: value }));

  const canProceed = () => {
    if (step === 0) return data.nome && data.telefone && data.terapia_especial && data.sexo && data.idade;
    if (step === 1) return data.queixas_principais && data.tempo_dor && (data.areas_afetadas || []).length > 0;
    if (step === 2) return (data.causas_provaveis || []).length > 0;
    if (step === 3) return data.objetivos_paciente;
    return false;
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      // Save patient first
      const patient = await base44.entities.Patient.create({
        ...data,
        status: "Em Tratamento",
      });

      // Create plan record
      const plan = await base44.entities.TherapeuticPlan.create({
        patient_id: patient.id,
        patient_nome: data.nome,
        patient_telefone: data.telefone,
        terapia_especial: data.terapia_especial,
        status: "Gerando",
        total_sessoes: 24,
      });

      // Generate with AI
      const postureUrls = [data.foto_postural_1, data.foto_postural_2].filter(Boolean);
      const prompt = buildPrompt(data);
      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        file_urls: postureUrls.length > 0 ? postureUrls : undefined,
      });

      // Inject photo URLs into plan JSON
      let finalPlan = result;
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const obj = JSON.parse(jsonMatch[0]);
          if (data.foto_postural_1) obj.foto_postural_1 = data.foto_postural_1;
          if (data.foto_postural_2) obj.foto_postural_2 = data.foto_postural_2;
          if (data.fotos_camera_termal?.length) obj.fotos_camera_termal = data.fotos_camera_termal;
          if (data.avaliacao_postural) obj.avaliacao_postural = data.avaliacao_postural;
          if (data.resultado_camera_termal) obj.resultado_camera_termal = data.resultado_camera_termal;
          finalPlan = JSON.stringify(obj);
        }
      } catch (e) {}

      await base44.entities.TherapeuticPlan.update(plan.id, {
        plano_completo: finalPlan,
        status: "Ativo",
      });

      navigate(createPageUrl(`PlanView?id=${plan.id}`));
    } catch (err) {
      console.error(err);
      alert("Erro ao gerar o plano. Tente novamente.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: "#FAF9F7" }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm mb-6 transition-colors"
            style={{ color: "#7A9DB0" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "#1B3A4B" }}>
            Novo Atendimento
          </h1>
          <p className="text-gray-500 mt-1">Preencha a avaliação para gerar o plano terapêutico com IA</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-0 mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                  style={{
                    background: i === step ? "#C17F6A" : i < step ? "#1B3A4B" : "#E5E7EB",
                    color: i <= step ? "white" : "#9CA3AF",
                  }}
                >
                  {i < step ? (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <div className="mt-1 text-center hidden md:block">
                  <p className="text-xs font-semibold" style={{ color: i === step ? "#C17F6A" : "#9CA3AF" }}>
                    {s.title}
                  </p>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="flex-1 h-0.5 mb-4"
                  style={{ background: i < step ? "#1B3A4B" : "#E5E7EB" }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-sm border p-6 md:p-8 mb-6" style={{ borderColor: "#E5E7EB" }}>
          {step === 0 && <StepOne data={data} onChange={handleChange} />}
          {step === 1 && <StepTwo data={data} onChange={handleChange} />}
          {step === 2 && <StepThree data={data} onChange={handleChange} />}
          {step === 3 && <StepFour data={data} onChange={handleChange} />}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setStep((p) => p - 1)}
            disabled={step === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all"
            style={{
              background: step === 0 ? "#F3F4F6" : "white",
              color: step === 0 ? "#D1D5DB" : "#374151",
              border: "1px solid",
              borderColor: step === 0 ? "#F3F4F6" : "#D1D5DB",
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((p) => p + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all"
              style={{
                background: canProceed() ? "#C17F6A" : "#E5E7EB",
                color: canProceed() ? "white" : "#9CA3AF",
              }}
            >
              Próximo
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={!canProceed() || generating}
              className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white transition-all"
              style={{
                background: !canProceed() || generating ? "#E5E7EB" : "linear-gradient(135deg, #1B3A4B 0%, #2A4F63 100%)",
                color: !canProceed() || generating ? "#9CA3AF" : "white",
                boxShadow: canProceed() && !generating ? "0 4px 15px rgba(27,58,75,0.3)" : "none",
              }}
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Gerando Plano...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Gerar Plano Terapêutico
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}