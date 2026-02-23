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
  return `Você é um especialista em liberação miofascial da clínica Vibe Terapias. 
Crie um plano terapêutico completo e personalizado. Retorne APENAS um JSON válido, sem texto antes ou depois, seguindo EXATAMENTE esta estrutura:

DADOS DO PACIENTE:
- Nome: ${data.nome}
- Idade: ${data.idade} anos
- Sexo: ${data.sexo}
- Telefone: ${data.telefone}
- Terapia Especial: ${data.terapia_especial}
- Queixas Principais: ${data.queixas_principais}
- Áreas Afetadas: ${(data.areas_afetadas || []).join(", ")}
- Intensidade da Dor: ${data.intensidade_dor}/10
- Tempo de Dor: ${data.tempo_dor}
- Histórico: ${data.historico_dor || "Não informado"}
- Causas Prováveis: ${(data.causas_provaveis || []).join(", ")}
- Atividade Física: ${data.atividade_fisica || "Não informado"}
- Condições Preexistentes: ${(data.condicoes_preexistentes || []).join(", ") || "Nenhuma"}
- Medicamentos: ${data.medicamentos || "Nenhum"}
- Resultado Câmera Termal: ${data.resultado_camera_termal || "A ser realizado na primeira sessão"}
- Objetivos do Paciente: ${data.objetivos_paciente || "Não informado"}

REGRAS OBRIGATÓRIAS:
1. Mencione o nome ${data.nome} várias vezes nos textos para que o paciente se sinta acolhido
2. CADA ETAPA TEM EXATAMENTE 3 CICLOS - NÃO MUDE ISSO (total 9 ciclos)
3. O plano total tem 24 sessões divididas em 3 Etapas
4. Sempre mencione Liberação Miofascial primeiro nas técnicas
5. Dry Needling, Eletroestimulação e Ventosaterapia: escreva "caso o cliente aprove" após mencionar
6. Linguagem persuasiva, acolhedora e profissional
7. Retorne SOMENTE o JSON, sem nenhum texto antes ou depois

JSON a retornar (preencha todos os campos com o conteúdo real, não deixe placeholder):

{
  "resumo_queixas": "Parágrafo acolhedor descrevendo as queixas de ${data.nome}, áreas afetadas, tempo de dor e causas prováveis. Mencione o nome várias vezes.",
  "resultado_camera_termal": "${data.resultado_camera_termal || "A câmera termal realizará o mapeamento completo na primeira sessão, identificando os pontos de tensão e sobrecarga muscular para personalizar ainda mais o tratamento."}",
  "objetivos_tratamento": [
    "Objetivo específico 1 baseado nas queixas de ${data.nome}",
    "Objetivo específico 2",
    "Objetivo específico 3",
    "Objetivo específico 4",
    "Melhorar postura, mobilidade e qualidade de vida de ${data.nome}"
  ],
  "objetivo_geral": "Parágrafo geral sobre proporcionar alívio imediato, recuperação muscular e qualidade de vida para ${data.nome}.",
  "explicacao_terapia": "Parágrafo explicando como a terapia ${data.terapia_especial} vai tratar especificamente as queixas de ${data.nome}, citando que a Liberação Miofascial é a base do tratamento.",
  "etapas": [
    {
      "numero": 1,
      "nome": "Alívio Imediato das Dores e Preparação do Corpo",
      "objetivo_etapa": "O FOCO DESSA FASE É PROPORCIONAR ALÍVIO IMEDIATO DAS DORES DE ${data.nome.toUpperCase()}, REDUZINDO TENSÕES MUSCULARES E PREPARANDO O CORPO PARA TERAPIAS MAIS PROFUNDAS.",
      "ciclos": [
        {
          "numero": 1,
          "objetivo": "Alívio inicial das dores e mapeamento das áreas mais tensas de ${data.nome}.",
          "tecnicas": "Liberação Miofascial, ventosaterapia deslizante (caso o cliente aprove), pedras quentes.",
          "musculos": "Músculos específicos das áreas afetadas: ${(data.areas_afetadas || []).join(", ")} e outros."
        },
        {
          "numero": 2,
          "objetivo": "Redução da inflamação e diminuição das dores irradiadas.",
          "tecnicas": "Liberação Miofascial, Dry Needling (caso o cliente aprove), eletroestimulação (caso o cliente aprove).",
          "musculos": "Músculos profundos das regiões de maior queixa de ${data.nome} e outros."
        },
        {
          "numero": 3,
          "objetivo": "Consolidação do alívio das dores e início da recuperação muscular de ${data.nome}.",
          "tecnicas": "Liberação Miofascial, ventosaterapia (caso o cliente aprove), massagem relaxante.",
          "musculos": "Musculatura das áreas afetadas com foco em relaxamento profundo e outros."
        }
      ]
    },
    {
      "numero": 2,
      "nome": "Recuperação Funcional e Correção de Assimetrias",
      "objetivo_etapa": "APROFUNDAR O TRATAMENTO DE ${data.nome.toUpperCase()}, CORRIGINDO ASSIMETRIAS POSTURAIS E MELHORANDO A MOBILIDADE GLOBAL.",
      "ciclos": [
        {
          "numero": 4,
          "objetivo": "Aprofundamento nas regiões de dor persistente de ${data.nome}.",
          "tecnicas": "Liberação Miofascial, ventosaterapia (caso o cliente aprove), alongamentos terapêuticos.",
          "musculos": "Músculos com tensões mais profundas nas áreas de queixa e outros."
        },
        {
          "numero": 5,
          "objetivo": "Aumento da mobilidade e redução de tensões profundas.",
          "tecnicas": "Liberação Miofascial, Dry Needling (caso o cliente aprove).",
          "musculos": "Musculatura profunda das áreas trabalhadas nas fases anteriores e outros."
        },
        {
          "numero": 6,
          "objetivo": "Preparação de ${data.nome} para a fase final de fortalecimento e manutenção.",
          "tecnicas": "Liberação Miofascial, eletroestimulação (caso o cliente aprove).",
          "musculos": "Core, musculatura estabilizadora e áreas de queixa principal e outros."
        }
      ]
    },
    {
      "numero": 3,
      "nome": "Ajustes Finais e Manutenção Duradoura",
      "objetivo_etapa": "FORTALECER, PREVENIR RECIDIVAS E GARANTIR QUE ${data.nome.toUpperCase()} MANTENHA OS RESULTADOS A LONGO PRAZO.",
      "ciclos": [
        {
          "numero": 7,
          "objetivo": "Manutenção da mobilidade e prevenção de novas tensões para ${data.nome}.",
          "tecnicas": "Liberação Miofascial, ventosaterapia (caso o cliente aprove).",
          "musculos": "Todas as regiões trabalhadas com foco na manutenção e outros."
        },
        {
          "numero": 8,
          "objetivo": "Reforço postural e estabilidade corporal de ${data.nome}.",
          "tecnicas": "Liberação Miofascial, exercícios posturais.",
          "musculos": "Core, glúteos, musculatura estabilizadora e outros."
        },
        {
          "numero": 9,
          "objetivo": "Garantir recuperação completa e estabilidade muscular duradoura.",
          "tecnicas": "Liberação Miofascial, técnicas integradas.",
          "musculos": "Todos os músculos trabalhados nas fases anteriores e outros."
        }
      ]
    }
  ],
  "resumo_final": "Parágrafo persuasivo e acolhedor sobre o plano de ${data.nome}, mencionando o nome várias vezes, destacando as 3 etapas, alívio progressivo e qualidade de vida recuperada. Deve convencer o paciente a fechar o pacote completo de 24 sessões."
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
      const prompt = buildPrompt(data);
      const result = await base44.integrations.Core.InvokeLLM({ prompt });

      await base44.entities.TherapeuticPlan.update(plan.id, {
        plano_completo: result,
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