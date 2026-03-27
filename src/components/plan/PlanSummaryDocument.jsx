import React from "react";

const BG_IMAGE_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699c716b5aaf606ea054cadd/ef18c5b4c_image.png";
const FOOTER_IMAGE_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699c716b5aaf606ea054cadd/ac819d2fc_image.png";

function Divider() {
  return <div style={{ height: 1, background: "#D1C4B0", margin: "10px 0" }} />;
}

function SectionTitle({ children }) {
  return (
    <div style={{ fontSize: 14.5, fontWeight: 700, color: "#1B3A4B", marginBottom: 6, letterSpacing: "0.4px" }}>
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
    <div style={{ fontFamily: "'Arial', 'Helvetica', sans-serif", color: "#1a1a1a", lineHeight: 1.45, letterSpacing: "0.3px" }}>
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
          padding: "170px 60px 180px 60px",
          position: "relative",
          zIndex: 1,
          boxSizing: "border-box",
          overflow: "hidden",
        }}>
          {/* Title */}
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 19, fontWeight: 900, color: "#1B3A4B", marginBottom: 3, letterSpacing: "0.6px" }}>
              Resumo do Plano Terapêutico
            </div>
            <div style={{ fontSize: 13, color: "#555" }}>
              Documento preparado para <strong style={{ color: "#1B3A4B" }}>{plan.patient_nome}</strong>
            </div>
          </div>

          <Divider />

          {/* Patient info */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 22px", fontSize: 13, marginBottom: 2, fontWeight: 500 }}>
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
              <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0, textAlign: "justify", fontWeight: 450 }}>
                {truncateAtPeriod(planData.resumo_queixas, 300)}
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
                    <li key={i} style={{ display: "flex", gap: 7, fontSize: 13, marginBottom: 4, lineHeight: 1.5, fontWeight: 450 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C17F6A", flexShrink: 0, marginTop: 5 }} />
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
                <p style={{ fontSize: 12, color: "#555", margin: "0 0 8px 0" }}>
                  Plano dividido em 3 etapas de {plan.total_sessoes || 24} sessões:
                </p>

                {[
                  { etapa: etapas[0], label: "Etapa 1 — Sessões 1 a 8: Adaptação Muscular", color: "#C17F6A" },
                  { etapa: etapas[1], label: "Etapa 2 — Sessões 9 a 16: Correção Postural e Mobilidade", color: "#7A9DB0" },
                  { etapa: etapas[2], label: "Etapa 3 — Sessões 17 a 24: Manutenção", color: "#1B3A4B" },
                ].map((item, idx) => item.etapa ? (
                  <div key={idx} style={{ marginBottom: 10, padding: "8px 12px", background: "#F8F6F3", borderRadius: 7, borderLeft: `3px solid ${item.color}` }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#1B3A4B", marginBottom: 4 }}>
                      {item.label}
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
                      {safeArray(item.etapa.ciclos).slice(0, 2).map((ciclo, i) => (
                        <li key={i} style={{ display: "flex", gap: 5, fontSize: 12.5, marginBottom: 3, lineHeight: 1.45, fontWeight: 450 }}>
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
            <p style={{ fontSize: 13, color: "#fff", lineHeight: 1.6, margin: 0, fontWeight: 600, textAlign: "center" }}>
              Seu plano de {plan.total_sessoes || 24} sessões foi desenvolvido especialmente para você.
              O tratamento é progressivo — cada etapa é essencial para resultados duradouros.
            </p>
          </div>

          <div style={{ marginTop: 8, textAlign: "center", fontSize: 10.5, color: "#999" }}>
            Vibe Terapias — Clínica Especializada em Dor · Documento completo com seu terapeuta.
          </div>
        </div>
      </div>
    </div>
  );
}