import React from "react";

const BG_IMAGE_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699c716b5aaf606ea054cadd/ef18c5b4c_image.png";
const FOOTER_IMAGE_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699c716b5aaf606ea054cadd/ac819d2fc_image.png";

function Divider() {
  return <div style={{ height: 1, background: "#D1C4B0", margin: "8px 0" }} />;
}

function SectionTitle({ children }) {
  return (
    <div style={{ fontSize: 13, fontWeight: 700, color: "#1B3A4B", marginBottom: 4 }}>
      {children}
    </div>
  );
}

export default function PlanSummaryDocument({ plan, patientData }) {
  let planData = null;

  if (plan.plano_completo) {
    try {
      const raw = plan.plano_completo;
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        planData = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {}
  }

  const safeArray = (val) => (Array.isArray(val) ? val : []);
  const etapas = safeArray(planData?.etapas);

  // Remove patient name from text to avoid repetition
  const removeName = (text) => {
    if (!text || !plan.patient_nome) return text;
    const name = plan.patient_nome;
    return text
      .replace(new RegExp(`\\bde\\s+${name}\\b`, "gi"), "")
      .replace(new RegExp(`\\bdo\\s+${name}\\b`, "gi"), "")
      .replace(new RegExp(`\\bda\\s+${name}\\b`, "gi"), "")
      .replace(new RegExp(`\\bpara\\s+${name}\\b`, "gi"), "")
      .replace(new RegExp(`\\b${name}\\b`, "gi"), "")
      .replace(/\s{2,}/g, " ")
      .trim();
  };

  // Truncate queixas to max 250 chars ending at a period
  const truncateAtPeriod = (text, max) => {
    if (!text) return "";
    if (text.length <= max) return text;
    const cut = text.substring(0, max);
    const lastPeriod = cut.lastIndexOf(".");
    return lastPeriod > 50 ? cut.substring(0, lastPeriod + 1) : cut + "...";
  };

  return (
    <div style={{ fontFamily: "'Arial', 'Helvetica', sans-serif", color: "#222", lineHeight: 1.4 }}>
      <div id="summary-page-1" style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#ffffff",
        width: "794px",
        height: "1123px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}>
        <img src={BG_IMAGE_URL} alt="" style={{
          position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
          objectFit: "fill", zIndex: 0, pointerEvents: "none",
        }} />
        <img src={FOOTER_IMAGE_URL} alt="" style={{
          position: "absolute", bottom: 0, left: 0, width: "100%", display: "block", zIndex: 0,
        }} />

        {/* Content area - carefully sized to fit between header border and footer */}
        <div style={{
          flex: 1,
          padding: "170px 86px 180px 86px",
          position: "relative",
          zIndex: 1,
          boxSizing: "border-box",
          overflow: "hidden",
        }}>
          {/* Title */}
          <div style={{ textAlign: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 17, fontWeight: 900, color: "#1B3A4B", marginBottom: 2 }}>
              Resumo do Plano Terapêutico
            </div>
            <div style={{ fontSize: 11, color: "#666" }}>
              Documento preparado para <strong style={{ color: "#1B3A4B" }}>{plan.patient_nome}</strong>
            </div>
          </div>

          <Divider />

          {/* Patient info - single line */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 20px", fontSize: 11, marginBottom: 2 }}>
            <div><strong>Paciente:</strong> {plan.patient_nome}</div>
            {patientData?.idade && <div><strong>Idade:</strong> {patientData.idade} anos</div>}
            {patientData?.sexo && <div><strong>Sexo:</strong> {patientData.sexo}</div>}
            <div><strong>Terapia:</strong> {plan.terapia_especial}</div>
            <div><strong>Sessões:</strong> {plan.total_sessoes || 24}</div>
          </div>

          <Divider />

          {/* Queixas - condensed */}
          {planData?.resumo_queixas && (
            <div style={{ marginBottom: 6 }}>
              <SectionTitle>Suas Queixas Principais</SectionTitle>
              <p style={{ fontSize: 11, lineHeight: 1.5, margin: 0, textAlign: "justify" }}>
                {truncateAtPeriod(planData.resumo_queixas, 280)}
              </p>
            </div>
          )}

          {/* Objetivos - max 5 items */}
          {safeArray(planData?.objetivos_tratamento).length > 0 && (
            <>
              <Divider />
              <div style={{ marginBottom: 6 }}>
                <SectionTitle>Objetivos do Tratamento</SectionTitle>
                <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
                  {safeArray(planData.objetivos_tratamento).slice(0, 5).map((obj, i) => (
                    <li key={i} style={{ display: "flex", gap: 6, fontSize: 11, marginBottom: 3, lineHeight: 1.4 }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#C17F6A", flexShrink: 0, marginTop: 4 }} />
                      <span>{removeName(obj)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* Etapas - compact */}
          {etapas.length > 0 && (
            <>
              <Divider />
              <div style={{ marginBottom: 6 }}>
                <SectionTitle>Como será o Seu Tratamento</SectionTitle>
                <p style={{ fontSize: 10.5, color: "#555", margin: "0 0 6px 0" }}>
                  Plano dividido em 3 etapas de {plan.total_sessoes || 24} sessões:
                </p>

                {[
                  { etapa: etapas[0], label: "Etapa 1 — Sessões 1 a 8: Adaptação Muscular", color: "#C17F6A" },
                  { etapa: etapas[1], label: "Etapa 2 — Sessões 9 a 16: Correção Postural e Mobilidade", color: "#7A9DB0" },
                  { etapa: etapas[2], label: "Etapa 3 — Sessões 17 a 24: Manutenção", color: "#1B3A4B" },
                ].map((item, idx) => item.etapa ? (
                  <div key={idx} style={{ marginBottom: 8, padding: "6px 10px", background: "#F8F6F3", borderRadius: 6, borderLeft: `3px solid ${item.color}` }}>
                    <div style={{ fontSize: 11.5, fontWeight: 800, color: "#1B3A4B", marginBottom: 3 }}>
                      {item.label}
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
                      {safeArray(item.etapa.ciclos).slice(0, 2).map((ciclo, i) => (
                        <li key={i} style={{ display: "flex", gap: 5, fontSize: 10.5, marginBottom: 2, lineHeight: 1.4 }}>
                          <span style={{ color: item.color, fontWeight: 700 }}>●</span>
                          <span>{removeName(ciclo.objetivo)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null)}
              </div>
            </>
          )}

          {/* Mensagem final */}
          <div style={{
            background: "linear-gradient(135deg, #1B3A4B 0%, #2A4F63 100%)",
            borderRadius: 8,
            padding: "10px 14px",
            marginTop: 4,
          }}>
            <p style={{ fontSize: 11, color: "#fff", lineHeight: 1.5, margin: 0, fontWeight: 500, textAlign: "center" }}>
              Seu plano de {plan.total_sessoes || 24} sessões foi desenvolvido especialmente para você.
              O tratamento é progressivo — cada etapa é essencial para resultados duradouros.
            </p>
          </div>

          <div style={{ marginTop: 6, textAlign: "center", fontSize: 9.5, color: "#999" }}>
            Vibe Terapias — Clínica Especializada em Dor · Documento completo com seu terapeuta.
          </div>
        </div>
      </div>
    </div>
  );
}