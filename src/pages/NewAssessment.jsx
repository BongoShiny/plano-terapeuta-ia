import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import StepOne from "../components/assessment/StepOne";
import StepTwo from "../components/assessment/StepTwo";
import StepThree from "../components/assessment/StepThree";
import StepFour from "../components/assessment/StepFour";
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { useClinic } from "@/context/ClinicContext";

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

- Histórico: ${data.historico_dor || "Não informado"}
- Causas Prováveis: ${(data.causas_provaveis || []).join(", ") || "Não informado"}
- Atividade Física: ${data.atividade_fisica || "Não informado"}
- Condições Preexistentes: ${(data.condicoes_preexistentes || []).join(", ") || "Nenhuma"}
- Medicamentos: ${data.medicamentos || "Nenhum"}
- Resultado Câmera Termal: ${data.resultado_camera_termal || "A ser realizado na primeira sessão"}
- Análise Detalhada Câmera Termal (IA): ${data.analise_camera_termal ? data.analise_camera_termal.substring(0, 800) : "Não realizada"}
- Objetivos do Paciente: ${data.objetivos_paciente || "Não informado"}

REGRAS OBRIGATÓRIAS — SIGA À RISCA:
1. ACOLHIMENTO: Mencione o nome "${data.nome}" várias vezes em todos os textos para gerar conexão e empatia.
2. ESTRUTURA: 24 sessões divididas em 3 Etapas. Etapa 1: sessões 1-8 (4 ciclos). Etapa 2: sessões 9-16 (3 ciclos). Etapa 3: sessões 17-24 (3 ciclos). TOTAL: 10 CICLOS.
3. HIERARQUIA DE TÉCNICAS: A Liberação Miofascial SEMPRE é citada PRIMEIRO em todas as listas de técnicas.
4. SEGURANÇA E ÉTICA: Ventosaterapia, Dry Needling e Eletroestimulação SEMPRE devem ser seguidas de "(CASO O CLIENTE APROVAR)" — nunca omita isso.
5. LINGUAGEM: Persuasiva, acolhedora e profissional. O objetivo é que o paciente se sinta cuidado e confiante para fechar o pacote completo.
6. Retorne SOMENTE o JSON, sem nenhum texto antes ou depois.
7. FORMATAÇÃO: NUNCA use markdown nos textos. Proibido usar ###, ##, **, __, --, "---", aspas decorativas (" "), asteriscos ou qualquer símbolo de formatação. Todos os campos de texto devem ser texto simples, sem marcações.
8. ANÁLISE TÉRMICA: Se gerar títulos de análises térmicas, SEMPRE use "Análises termográficos gerais:" em vez de "Achados". Mantenha coerência estrutural e profissionalismo.
9. PROIBIDO: NUNCA use a palavra "fisioterapia" ou qualquer variação dela (fisioterapeuta, fisioterápico, etc). Use sempre "Liberação Miofascial", "tratamento terapêutico", "técnicas de relaxamento" ou "terapia especializada" em seu lugar.
10. TEMPO DE DOR: NUNCA mencione o tempo de dor do paciente em NENHUM campo do JSON. Não escreva "há X meses", "há X anos", "cerca de X meses" ou qualquer referência temporal sobre a duração da dor.
11. PROIBIÇÃO ABSOLUTA DE SUPOSIÇÕES: Use EXCLUSIVAMENTE as informações fornecidas nos DADOS DO PACIENTE acima. NUNCA invente, suponha ou deduza informações que não foram explicitamente informadas. Se um campo diz "Não informado", NÃO tente adivinhar ou criar informações sobre ele. Por exemplo: se as causas prováveis dizem "Postura no trabalho / computador", NUNCA escreva "geradas por um acidente" ou qualquer outra causa inventada. Se o histórico diz "Não informado", NÃO invente um histórico. Cada frase do plano deve ser verificável nos dados fornecidos. Inventar informações médicas é EXTREMAMENTE GRAVE e pode causar desconforto ao paciente.

JSON a retornar (preencha todos os campos com conteúdo real e personalizado para ${data.nome}):

{
  "resumo_queixas": "Escreva UM parágrafo de no máximo 3 frases, acolhedor e completo, sobre as queixas de ${data.nome}. IMPORTANTE: Nas áreas afetadas (${(data.areas_afetadas || []).join(", ")}), reescreva TODOS os nomes removendo as barras (/) e hífens. Transforme cada área em linguagem natural e fluida: 'Pescoço / Cervical' → 'pescoço', 'Lombar / Coluna Lombar' → 'coluna lombar', 'Cabeça / Crânio' → 'cabeça', 'Ombros / Escapular' → 'ombros', etc. Use conectores como 'e' ou vírgulas para unir as áreas. Se as causas prováveis foram informadas, mencione-as usando EXATAMENTE os termos fornecidos nos dados — NÃO reformule, NÃO invente sinônimos e NÃO adicione causas que não estão nos dados. NUNCA mencione o tempo de dor do paciente. NUNCA invente informações como acidentes, traumas ou eventos que não foram explicitamente informados nos dados do paciente. Termine sempre com ponto final.",
  "resultado_camera_termal": "${data.resultado_camera_termal ? data.resultado_camera_termal : "A câmera termal será utilizada na primeira sessão de " + data.nome + " para mapear os pontos de calor e inflamação, identificando com precisão as áreas de maior sobrecarga muscular e personalizando ainda mais o tratamento."}",
  "objetivos_tratamento": [
    "Objetivo específico 1 baseado nas queixas de ${data.nome} (ex: reduzir dor em área específica)",
    "Objetivo específico 2 (ex: restaurar mobilidade)",
    "Objetivo específico 3 (ex: corrigir postura/assimetria)",
    "Objetivo específico 4 (ex: eliminar inflamação identificada na câmera termal)",
    "Garantir que ${data.nome} mantenha qualidade de vida, postura e bem-estar a longo prazo"
  ],
  "objetivo_geral": "Escreva UM parágrafo de no máximo 3 frases, persuasivo sobre como o plano proporcionará alívio imediato, recuperação muscular e qualidade de vida para ${data.nome}. Mencione o nome. Termine sempre com ponto final.",
  "explicacao_terapia": "Escreva UM parágrafo de no máximo 3 frases, explicando como a terapia ${data.terapia_especial} vai tratar especificamente as queixas de ${data.nome}. Enfatize que a Liberação Miofascial é a base do tratamento e como ela age nos tecidos de ${data.nome}. Termine sempre com ponto final.",
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
  "resumo_final": "Escreva UM parágrafo de no máximo 4 frases, persuasivo e acolhedor sobre o plano de ${data.nome}. Destaque as 3 etapas e o alívio progressivo. Convença ${data.nome} de que o pacote de 24 sessões é o caminho para uma vida sem dor. Termine sempre com ponto final."
}`;
}

export default function NewAssessment() {
  const navigate = useNavigate();
  const { selectedClinicId } = useClinic();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const [generating, setGenerating] = useState(false);

  const handleChange = (key, value) => setData((p) => ({ ...p, [key]: value }));

  const canProceed = () => {
    if (step === 0) return data.nome && data.telefone && data.terapia_especial && data.sexo;
    if (step === 1) {
      if (data._ai_filled) return true;
      return data.tempo_dor && (data.areas_afetadas || []).length > 0;
    }
    if (step === 2) return (data.causas_provaveis || []).length > 0;
    if (step === 3) return true;
    return false;
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      // Auto-analyze postural photos if attached but not yet analyzed
      if ((data.foto_postural_1 || data.foto_postural_2) && !data.avaliacao_postural) {
        const fileUrls = [data.foto_postural_1, data.foto_postural_2].filter(Boolean);
        const posturalResult = await base44.integrations.Core.InvokeLLM({
          prompt: `Você é um fisioterapeuta especialista em avaliação postural da clínica Vibe Terapias. Analise as fotos posturais clínicas do paciente ${data.nome} (${data.sexo}, ${data.idade} anos) com queixas em: ${(data.areas_afetadas || []).join(", ")}.
Realize uma avaliação postural concisa e profissional em português. IMPORTANTE: Mantenha o texto COMPACTO e OBJETIVO — use sentenças curtas e diretas. Escreva em texto corrido, sem usar markdown, asteriscos, hashtags, travessões decorativos ou qualquer símbolo de formatação.
ESTRUTURA OBRIGATÓRIA:
Comece com análise da vista frontal (plano coronal) mencionando cabeça, ombros, coluna e pelve.
Depois, OBRIGATORIAMENTE, adicione um parágrafo começando com "na vista lateral (plano sagital)" analisando a mesma região vista de perfil, identificando lordose cervical, cifose torácica, lordose lombar, posição da pelve e alinhamento geral.
Para cada vista, mencione apenas os achados mais relevantes e sua relação com as queixas do paciente.`,
          file_urls: fileUrls,
        });
        data.avaliacao_postural = posturalResult;
        handleChange("avaliacao_postural", posturalResult);
      }

      // Auto-analyze thermal photos if attached but not yet analyzed
      if ((data.fotos_camera_termal || []).length > 0 && !data.analise_camera_termal) {
        const thermalResult = await base44.integrations.Core.InvokeLLM({
          prompt: `Você é um fisioterapeuta clínico especializado em termografia da clínica Vibe Terapias. As imagens anexadas são imagens termográficas clínicas (termogramas) utilizadas para avaliação muscular e fascial do paciente ${data.nome || "o paciente"} (${data.sexo || ""}, ${data.idade || ""} anos), com queixas relatadas em: ${(data.areas_afetadas || []).join(", ") || "diversas regiões"}.
Nas imagens termográficas, as áreas em vermelho/laranja indicam regiões com maior temperatura superficial, associadas a tensão muscular, pontos-gatilho, inflamação fascial ou sobrecarga postural. Realize uma análise termográfica clínica completa.
Escreva um laudo termográfico clínico em português, em parágrafos corridos. Use a marcação [ALERTA] antes de frases sobre riscos clínicos de não tratar e [/ALERTA] para fechar. Não use asteriscos, hashtags ou outros símbolos de formatação.
Estruture o laudo assim:
- Análises termográficos gerais.
- Para cada região com alteração térmica: descrição do achado, correlação clínica, e [ALERTA]risco clínico caso não seja tratado[/ALERTA].
- Conclusão clínica recomendando o plano de 24 sessões da Vibe Terapias.`,
          file_urls: data.fotos_camera_termal,
        });
        data.analise_camera_termal = thermalResult;
        handleChange("analise_camera_termal", thermalResult);

        if (!data.resultado_camera_termal) {
          const summaryResult = await base44.integrations.Core.InvokeLLM({
            prompt: `A partir da análise termográfica abaixo, gere um resumo ULTRA CURTO com no mínimo 2 e no máximo 5 tópicos. Cada tópico deve ter no máximo 1 frase curta. Formato: cada tópico em uma linha, sem numeração, sem marcadores, sem formatação. Apenas texto simples e direto.\n\nAnálise:\n${thermalResult}`,
          });
          data.resultado_camera_termal = summaryResult.trim();
          handleChange("resultado_camera_termal", summaryResult.trim());
        }
      }

      // Save patient first
      const patient = await base44.entities.Patient.create({
        ...data,
        status: "Em Tratamento",
        clinic_id: selectedClinicId,
      });

      // Create plan record
      const plan = await base44.entities.TherapeuticPlan.create({
        patient_id: patient.id,
        patient_nome: data.nome,
        patient_telefone: data.telefone,
        terapia_especial: data.terapia_especial,
        status: "Gerando",
        total_sessoes: 24,
        clinic_id: selectedClinicId,
      });

      // Generate with AI
      const postureUrls = [data.foto_postural_1, data.foto_postural_2].filter(Boolean);
      const prompt = buildPrompt(data);
      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        file_urls: postureUrls.length > 0 ? postureUrls : undefined,
        response_json_schema: {
          type: "object",
          properties: {
            resumo_queixas: { type: "string" },
            resultado_camera_termal: { type: "string" },
            objetivos_tratamento: { type: "array", items: { type: "string" } },
            objetivo_geral: { type: "string" },
            explicacao_terapia: { type: "string" },
            etapas: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  numero: { type: "number" },
                  nome: { type: "string" },
                  sessoes: { type: "string" },
                  objetivo_etapa: { type: "string" },
                  ciclos: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        numero: { type: "number" },
                        objetivo: { type: "string" },
                        tecnicas: { type: "string" },
                        musculos: { type: "string" }
                      }
                    }
                  }
                }
              }
            },
            resumo_final: { type: "string" }
          }
        }
      });

      // result is already a parsed object when response_json_schema is used
      const obj = typeof result === "string" ? JSON.parse(result.match(/\{[\s\S]*\}/)?.[0] || "{}") : result;
      if (data.foto_postural_1) obj.foto_postural_1 = data.foto_postural_1;
      if (data.foto_postural_2) obj.foto_postural_2 = data.foto_postural_2;
      if (data.fotos_camera_termal?.length) obj.fotos_camera_termal = data.fotos_camera_termal;
      if (data.avaliacao_postural) obj.avaliacao_postural = data.avaliacao_postural;
      if (data.resultado_camera_termal) obj.resultado_camera_termal = data.resultado_camera_termal;
      if (data.analise_camera_termal) obj.analise_camera_termal = data.analise_camera_termal;
      const finalPlan = JSON.stringify(obj);

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
        <div className="flex items-center gap-0 mb-6 md:mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center">
                <div
                  className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-all"
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
                <div className="mt-1 text-center hidden sm:block">
                  <p className="text-xs font-semibold" style={{ color: i === step ? "#C17F6A" : "#9CA3AF" }}>
                    {s.title}
                  </p>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="flex-1 h-0.5 mb-0 sm:mb-4"
                  style={{ background: i < step ? "#1B3A4B" : "#E5E7EB" }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border p-4 sm:p-6 md:p-8 mb-4 md:mb-6" style={{ borderColor: "#E5E7EB" }}>
          {step === 0 && <StepOne data={data} onChange={handleChange} />}
          {step === 1 && <StepTwo data={data} onChange={handleChange} onSkipToStep={setStep} />}
          {step === 2 && <StepThree data={data} onChange={handleChange} />}
          {step === 3 && <StepFour data={data} onChange={handleChange} />}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center gap-3 pb-4">
          <button
            onClick={() => setStep((p) => p - 1)}
            disabled={step === 0}
            className="flex items-center gap-1.5 px-3 sm:px-5 py-3 rounded-xl text-sm font-medium transition-all flex-shrink-0"
            style={{
              background: step === 0 ? "#F3F4F6" : "white",
              color: step === 0 ? "#D1D5DB" : "#374151",
              border: "1px solid",
              borderColor: step === 0 ? "#F3F4F6" : "#D1D5DB",
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((p) => p + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-1.5 px-4 sm:px-6 py-3 rounded-xl text-sm font-bold text-white transition-all flex-shrink-0"
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
              className="flex items-center gap-1.5 px-4 sm:px-8 py-3 rounded-xl text-xs sm:text-sm font-bold text-white transition-all flex-shrink-0"
              style={{
                background: !canProceed() || generating ? "#E5E7EB" : "linear-gradient(135deg, #1B3A4B 0%, #2A4F63 100%)",
                color: !canProceed() || generating ? "#9CA3AF" : "white",
                boxShadow: canProceed() && !generating ? "0 4px 15px rgba(27,58,75,0.3)" : "none",
              }}
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Gerando Plano...</span>
                  <span className="sm:hidden">Gerando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">Gerar Plano Terapêutico</span>
                  <span className="sm:hidden">Gerar Plano</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}