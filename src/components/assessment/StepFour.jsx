import React, { useState } from "react";
import { Camera, Target, CheckCircle, Upload, Loader2, ImageIcon, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import CameraThermalUploader from "./CameraThermalUploader";

function PosturalPreview({ text }) {
  if (!text) return null;
  const allText = text.replace(/\n+/g, " ");
  const splitRegex = /(?=na vista lateral|no plano sagital)/i;
  const parts = allText.split(splitRegex);
  const frontalText = parts[0] || "";
  const lateralText = parts[1] || "";

  const toSentences = (str) =>
    str.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(s => s.length > 10).slice(0, 3);

  const frontalSentences = toSentences(frontalText);
  const lateralSentences = toSentences(lateralText);

  const BulletList = ({ sentences }) => (
    <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
      {sentences.map((s, i) => (
        <li key={i} style={{ display: "flex", gap: 6, fontSize: 12, marginBottom: 5, lineHeight: 1.6, color: "#1B3A4B" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C17F6A", flexShrink: 0, marginTop: 5 }} />
          <span>{s}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="mt-4 p-4 rounded-xl" style={{ background: "#F0F7FF" }}>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#1B3A4B", marginBottom: 6 }}>Na vista frontal (plano coronal)</div>
          <BulletList sentences={frontalSentences} />
        </div>
        <div style={{ width: 1, background: "#D1C4B0", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#1B3A4B", marginBottom: 6 }}>Na vista lateral (plano sagital)</div>
          <BulletList sentences={lateralSentences} />
        </div>
      </div>
    </div>
  );
}

function ThermalPreview({ text }) {
  if (!text) return null;

  // Split text into lines/paragraphs
  const lines = text.split(/\n+/).map(l => l.trim()).filter(l => l.length > 0);

  // Parse into sections: each section has a title line and content lines
  const sections = [];
  let current = null;

  // Known section title keywords
  const titlePatterns = [
    /laudo termogr[aá]fico cl[ií]nico/i,
    /an[aá]lises termogr[aá]ficos gerais/i,
    /regi[aã]o cervical/i,
    /regi[aã]o lombar/i,
    /regi[aã]o tor[aá]cica/i,
    /conclus[aã]o cl[ií]nica/i,
    /an[aá]lise por regi[aã]o/i,
    /regi[aã]o dos ombros/i,
    /regi[aã]o do joelho/i,
    /regi[aã]o dos quadris/i,
    /\d+\.\s/,
  ];

  const isTitle = (line) =>
    titlePatterns.some(p => p.test(line)) || /^\d+\./.test(line);

  for (const line of lines) {
    if (isTitle(line)) {
      if (current) sections.push(current);
      current = { title: line.replace(/^\d+\.\s*/, ''), content: [] };
    } else {
      if (!current) current = { title: null, content: [] };
      current.content.push(line);
    }
  }
  if (current) sections.push(current);

  return (
    <div className="mb-3 p-4 rounded-xl" style={{ background: "#FFF5F0" }}>
      {sections.map((section, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          {section.title && (
            <div style={{ display: "flex", gap: 8, marginBottom: 4, alignItems: "flex-start" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#C17F6A", flexShrink: 0, marginTop: 5 }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#1B3A4B", lineHeight: 1.6 }}>{section.title}</span>
            </div>
          )}
          {section.content.map((line, j) => (
            <div key={j} style={{ display: "flex", gap: 8, marginBottom: 4, alignItems: "flex-start" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#C17F6A", flexShrink: 0, marginTop: 5 }} />
              <span style={{ fontSize: 12, color: "#374151", lineHeight: 1.7, fontWeight: j === 0 && !section.title ? 700 : 400 }}>{line}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

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
          <img src={value} alt="preview" className="w-full object-contain rounded-xl" />
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
  const [analyzingThermal, setAnalyzingThermal] = useState(false);
  const [analyzedThermal, setAnalyzedThermal] = useState(false);

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
      prompt: `Você é um fisioterapeuta especialista em avaliação postural da clínica Vibe Terapias. Analise as fotos posturais clínicas do paciente ${data.nome} (${data.sexo}, ${data.idade} anos) com queixas em: ${(data.areas_afetadas || []).join(", ")}.

  Realize uma avaliação postural concisa e profissional em português. IMPORTANTE: Mantenha o texto COMPACTO e OBJETIVO — use sentenças curtas e diretas. Escreva em texto corrido, sem usar markdown, asteriscos, hashtags, travessões decorativos ou qualquer símbolo de formatação.

  ESTRUTURA OBRIGATÓRIA:
  Comece com análise da vista frontal (plano coronal) mencionando cabeça, ombros, coluna e pelve. 

  Depois, OBRIGATORIAMENTE, adicione um parágrafo começando com "na vista lateral (plano sagital)" analisando a mesma região vista de perfil, identificando lordose cervical, cifose torácica, lordose lombar, posição da pelve e alinhamento geral.

  Para cada vista, mencione apenas os achados mais relevantes e sua relação com as queixas do paciente. O objetivo é um texto compacto que sempre caiba em tamanho pequeno (S) na visualização.`,
      file_urls: fileUrls,
    });
    onChange("avaliacao_postural", result);
    setAnalyzed(true);
    setAnalyzing(false);
  };

  const analyzeThermalPhotos = async () => {
    if (!data.fotos_camera_termal?.length) return;
    setAnalyzingThermal(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Você é um fisioterapeuta clínico especializado em termografia da clínica Vibe Terapias. As imagens anexadas são imagens termográficas clínicas (termogramas) utilizadas para avaliação muscular e fascial do paciente ${data.nome || "o paciente"} (${data.sexo || ""}, ${data.idade || ""} anos), com queixas relatadas em: ${(data.areas_afetadas || []).join(", ") || "diversas regiões"}.

Nas imagens termográficas, as áreas em vermelho/laranja indicam regiões com maior temperatura superficial, associadas a tensão muscular, pontos-gatilho, inflamação fascial ou sobrecarga postural. Realize uma análise termográfica clínica completa.

Escreva um laudo termográfico clínico em português, em parágrafos corridos. Use a marcação [ALERTA] antes de frases sobre riscos clínicos de não tratar e [/ALERTA] para fechar. Não use asteriscos, hashtags ou outros símbolos de formatação.

Estruture o laudo assim:
- Análises termográficos gerais.
- Para cada região com alteração térmica: descrição do achado, correlação clínica, e [ALERTA]risco clínico caso não seja tratado com o plano terapêutico adequado — mencione impacto funcional, progressão da dor e qualidade de vida de ${data.nome || "o paciente"}[/ALERTA].
- Conclusão clínica recomendando o plano de 24 sessões da Vibe Terapias.

Mencione o nome ${data.nome || "do paciente"} ao longo do texto.`,
      file_urls: data.fotos_camera_termal,
    });
    onChange("analise_camera_termal", result);
    if (!data.resultado_camera_termal) {
      // Filter out header lines like "Laudo Termográfico Clínico", "Análises termográficos gerais" etc.
      const headerPatterns = [/laudo termogr/i, /an[aá]lises? termogr/i];
      const summaryLines = result.replace(/\*\*/g, '').replace(/\[ALERTA\]/g, '').replace(/\[\/ALERTA\]/g, '')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0)
        .filter(l => !headerPatterns.some(p => p.test(l)));
      const summaryText = summaryLines.slice(0, 6).join(' ').substring(0, 1200);
      onChange("resultado_camera_termal", summaryText);
    }
    if (!data.objetivos_paciente) {
      const areas = (data.areas_afetadas || []).join(", ");
      onChange("objetivos_paciente",
        `Eliminar todos os pontos de dor identificados pela câmera termal nas regiões de ${areas || "todas as áreas comprometidas"}, recuperar a mobilidade completa, acabar com as inflamações e conseguir realizar toda a rotina do dia a dia sem dor ao longo das 24 sessões do plano terapêutico personalizado da Vibe Terapias.`
      );
    }
    setAnalyzedThermal(true);
    setAnalyzingThermal(false);
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
              <><Loader2 className="w-4 h-4 animate-spin" />Analisando fotos posturais...</>
            ) : analyzed ? (
              <><CheckCircle className="w-4 h-4" />Análise realizada! Analisar novamente</>
            ) : (
              <><Sparkles className="w-4 h-4" />Analisar Fotos Posturais</>
            )}
          </button>
        )}

        {data.avaliacao_postural && (
          <PosturalPreview text={data.avaliacao_postural} />
        )}
      </div>

      {/* Câmera Termal */}
      <div className="rounded-2xl p-5 border" style={{ borderColor: "#E5E7EB" }}>
        <div className="flex items-center gap-2 mb-3">
          <Camera className="w-4 h-4" style={{ color: "#C17F6A" }} />
          <h3 className="font-semibold text-sm" style={{ color: "#1B3A4B" }}>
            Avaliação com a Câmera Termal
            <span className="ml-2 font-normal text-gray-400">(opcional)</span>
          </h3>
        </div>
        <div className="mb-3">
          <label className="block text-xs font-semibold mb-2" style={{ color: "#374151" }}>
            Fotos da câmera termal (até 4 fotos)
          </label>
          <CameraThermalUploader
            value={data.fotos_camera_termal || []}
            onChange={(v) => { onChange("fotos_camera_termal", v); setAnalyzedThermal(false); }}
          />
        </div>

        {(data.fotos_camera_termal || []).length > 0 && (
          <button
            onClick={analyzeThermalPhotos}
            disabled={analyzingThermal}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all mb-3"
            style={{ background: analyzingThermal ? "#E5E7EB" : "linear-gradient(135deg, #C17F6A 0%, #A5634F 100%)", color: analyzingThermal ? "#9CA3AF" : "white" }}
          >
            {analyzingThermal ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Identificando pontos de dor...</>
            ) : analyzedThermal ? (
              <><CheckCircle className="w-4 h-4" />Análise realizada! Analisar novamente</>
            ) : (
              <><Sparkles className="w-4 h-4" />Analisar Câmera Termal</>
            )}
          </button>
        )}

        {data.analise_camera_termal && (
          <ThermalPreview text={data.analise_camera_termal} />
        )}

        <label className="block text-xs font-semibold mb-1" style={{ color: "#374151" }}>
          Descrição / Resultado (resumo)
        </label>
        <textarea
          value={data.resultado_camera_termal || ""}
          onChange={(e) => onChange("resultado_camera_termal", e.target.value)}
          placeholder="Ex: Tensão elevada na região cervical, lombar e ombros. Ponto de calor identificado em L4-L5..."
          rows={3}
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
          ✦ Vibe Terapias — Plano Personalizado
        </p>
        <p className="text-sm" style={{ color: "#B0C4CF" }}>
          Clique em "Gerar Plano Terapêutico" para criar um plano personalizado
          com 24 sessões divididas em 3 etapas.
        </p>
      </div>
    </div>
  );
}