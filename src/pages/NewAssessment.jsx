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
- Resultado Câmera Termal: ${data.resultado_camera_termal || "Não realizado"}
- Objetivos do Paciente: ${data.objetivos_paciente || "Não informado"}

REGRAS OBRIGATÓRIAS:
1. Mencione o nome do paciente várias vezes no texto para que ele se sinta acolhido
2. CADA ETAPA TEM EXATAMENTE 3 CICLOS - NÃO MUDE ISSO
3. O plano total tem 24 sessões divididas em 3 Etapas
4. Sempre mencione Liberação Miofascial primeiro, depois os bônus separados por vírgula (não por +)
5. Dry Needling, Eletroestimulação e Ventosaterapia: coloque "(se aprovado)" após mencionar
6. O plano deve ser persuasivo e fácil de explicar para o paciente na recepção
7. Use linguagem acolhedora e profissional

ESTRUTURA OBRIGATÓRIA DO PLANO:

**PACIENTE:** ${data.nome}
**IDADE:** ${data.idade} anos | **SEXO:** ${data.sexo} | **TELEFONE:** ${data.telefone}
**TERAPIA ESPECIAL:** ${data.terapia_especial}

---

**RESUMO DAS QUEIXAS, DORES E ÁREAS AFETADAS**
[Escreva um parágrafo acolhedor sobre as queixas, mencionando o nome do paciente, as dores relatadas, tempo, áreas afetadas e causas prováveis. Faça o paciente se sentir compreendido.]

**Resultado da Avaliação com a Câmera Termal:**
[Inclua o resultado da câmera termal se disponível, ou escreva "A ser realizado na primeira sessão"]

---

**OBJETIVOS DO TRATAMENTO**
• [Objetivo específico 1 baseado nas queixas]
• [Objetivo específico 2]
• [Objetivo específico 3]
• [Objetivo específico 4]
• [Objetivo específico 5 - prevenção de lesões futuras]

**Objetivo Geral do Tratamento**
[Parágrafo geral mencionando o nome do paciente, focado em proporcionar alívio, recuperação e qualidade de vida]

---

**EXPLICAÇÃO DA TERAPIA ESPECIAL - ${data.terapia_especial}**
[Parágrafo explicando a terapia especial escolhida e como ela vai ajudar especificamente este paciente]

---

**ETAPA 1: ALÍVIO IMEDIATO DAS DORES E PREPARAÇÃO DO CORPO (Sessões 1 a 8)**

**OBJETIVO DA ETAPA:** O FOCO DESSA FASE É PROPORCIONAR ALÍVIO IMEDIATO DAS DORES E TENSÕES MUSCULARES, INICIANDO O PROCESSO DE RELAXAMENTO DAS ÁREAS MAIS AFETADAS DE ${data.nome.toUpperCase()}.

**Ciclo 1: Sessões 1 e 2**
Objetivo: [Objetivo específico do ciclo 1]
Técnicas aplicadas: Liberação miofascial, [outras técnicas] (se aprovado)
Músculos trabalhados: [músculos específicos baseados nas áreas afetadas]

**Ciclo 2: Sessões 3 e 4**
Objetivo: [Objetivo específico do ciclo 2]
Técnicas aplicadas: Liberação miofascial, [outras técnicas] (se aprovado)
Músculos trabalhados: [músculos específicos]

**Ciclo 3: Sessões 5, 6, 7 e 8**
Objetivo: [Objetivo específico do ciclo 3]
Técnicas aplicadas: Liberação miofascial, [outras técnicas] (se aprovado)
Músculos trabalhados: [músculos específicos]

---

**ETAPA 2: RECUPERAÇÃO FUNCIONAL E CORREÇÃO DE ASSIMETRIAS (Sessões 9 a 16)**

**OBJETIVO DA ETAPA:** APROFUNDAR O TRATAMENTO DE ${data.nome.toUpperCase()}, PROMOVENDO A RECUPERAÇÃO FUNCIONAL DAS ÁREAS MAIS COMPROMETIDAS E INICIANDO O FORTALECIMENTO MUSCULAR.

**Ciclo 4: Sessões 9, 10 e 11**
Objetivo: [Objetivo específico]
Técnicas aplicadas: Liberação miofascial, [outras técnicas] (se aprovado)
Músculos trabalhados: [músculos específicos]

**Ciclo 5: Sessões 12 e 13**
Objetivo: [Objetivo específico]
Técnicas aplicadas: Liberação miofascial, [outras técnicas] (se aprovado)
Músculos trabalhados: [músculos específicos]

**Ciclo 6: Sessões 14, 15 e 16**
Objetivo: [Objetivo específico]
Técnicas aplicadas: Liberação miofascial, [outras técnicas] (se aprovado)
Músculos trabalhados: [músculos específicos]

---

**ETAPA 3: AJUSTES FINAIS E MANUTENÇÃO DURADOURA (Sessões 17 a 24)**

**OBJETIVO DA ETAPA:** FORTALECER OS MÚSCULOS DE ${data.nome.toUpperCase()} E PREVENIR FUTURAS LESÕES, GARANTINDO RECUPERAÇÃO TOTAL E MANUTENÇÃO DO BEM-ESTAR A LONGO PRAZO.

**Ciclo 7: Sessões 17, 18 e 19**
Objetivo: [Objetivo específico]
Técnicas aplicadas: Liberação miofascial, [outras técnicas] (se aprovado)
Músculos trabalhados: [músculos específicos]

**Ciclo 8: Sessões 20, 21 e 22**
Objetivo: [Objetivo específico]
Técnicas aplicadas: Liberação miofascial, [outras técnicas] (se aprovado)
Músculos trabalhados: [músculos específicos]

**Ciclo 9: Sessões 23 e 24**
Objetivo: Garantir a recuperação completa de ${data.nome} e estabilização muscular duradoura
Técnicas aplicadas: Liberação miofascial, [todas as técnicas aprovadas]
Músculos trabalhados: Todos os músculos trabalhados nas fases anteriores

---

**RESUMO DO PLANO TERAPÊUTICO**
[Parágrafo persuasivo e acolhedor, mencionando o nome do paciente várias vezes, explicando que o plano foi personalizado para as necessidades específicas dele, com foco no alívio das dores relatadas. Mencione as 3 etapas de forma motivadora. Esse resumo deve ser fácil de apresentar presencialmente e convencer o paciente a fechar o pacote de 24 sessões.]

---

**TÉCNICAS APLICADAS NO PROGRAMA:**
• **Liberação Miofascial:** Técnica manual para aliviar tensões e aderências nas fáscias e músculos das áreas afetadas de ${data.nome}
• **Ventosaterapia** (se aprovado): Para melhorar a circulação sanguínea e aliviar tensões profundas
• **Dry Needling** (se aprovado): Agulhamento em pontos gatilhos para liberar tensões musculares
• **Eletroestimulação** (se aprovado): Para analgesia e ativação muscular
• **Exercícios Posturais:** Orientações para manter os resultados entre as sessões`;
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