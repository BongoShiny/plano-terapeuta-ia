import React from "react";

const BG_IMAGE_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699c716b5aaf606ea054cadd/ef18c5b4c_image.png";
const FOOTER_IMAGE_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699c716b5aaf606ea054cadd/ac819d2fc_image.png";

function Divider() {
  return <div style={{ height: 1, background: "#D1C4B0", margin: "14px 0" }} />;
}

function SectionTitle({ children }) {
  return (
    <div style={{ fontSize: 15, fontWeight: 700, color: "#1B3A4B", marginBottom: 8 }}>
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

  const pageStyle = {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#ffffff",
    borderRadius: 0,
    width: "794px",
    height: "1123px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    pageBreakAfter: "always",
    pageBreakInside: "avoid",
  };

  const bgStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "fill",
    zIndex: 0,
    pointerEvents: "none",
  };

  const contentStyle = {
    flex: 1,
    padding: "182px 76px 166px 76px",
    position: "relative",
    zIndex: 1,
    boxSizing: "border-box",
    overflow: "hidden",
  };

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

  return (
    <div style={{ fontFamily: "'Arial', 'Helvetica', sans-serif", color: "#222", lineHeight: 1.5 }}>
      <div id="summary-page-1" style={pageStyle}>
        <img src={BG_IMAGE_URL} alt="" style={bgStyle} />
        <img
          src={FOOTER_IMAGE_URL}
          alt=""
          style={{ position: "absolute", bottom: 0, left: 0, width: "100%", display: "block", zIndex: 0 }}
        />
        <div style={contentStyle}>
          {/* Header - Patient info */}
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#1B3A4B", marginBottom: 4 }}>
              Resumo do Plano Terapêutico
            </div>
            <div style={{ fontSize: 13, color: "#666" }}>
              Documento preparado para <strong style={{ color: "#1B3A4B" }}>{plan.patient_nome}</strong>
            </div>
          </div>

          <Divider />

          {/* Patient basic info */}
          <div style={{ display: "flex", gap: 24, fontSize: 13, marginBottom: 4 }}>
            <div><strong>Paciente:</strong> {plan.patient_nome}</div>
            {patientData?.idade && <div><strong>Idade:</strong> {patientData.idade} anos</div>}
            {patientData?.sexo && <div><strong>Sexo:</strong> {patientData.sexo}</div>}
          </div>
          <div style={{ display: "flex", gap: 24, fontSize: 13, marginBottom: 4 }}>
            <div><strong>Terapia:</strong> {plan.terapia_especial}</div>
            <div><strong>Total de Sessões:</strong> {plan.total_sessoes || 24}</div>
          </div>

          <Divider />

          {/* Queixas */}
          {planData?.resumo_queixas && (
            <div style={{ marginBottom: 14 }}>
              <SectionTitle>Suas Queixas Principais</SectionTitle>
              <p style={{ fontSize: 13, lineHeight: 1.8, margin: 0, textAlign: "justify" }}>
                {planData.resumo_queixas.length > 500
                  ? planData.resumo_queixas.substring(0, 500).replace(/[^.]*$/, "")
                  : planData.resumo_queixas}
              </p>
            </div>
          )}

          {/* Objetivos */}
          {safeArray(planData?.objetivos_tratamento).length > 0 && (
            <>
              <Divider />
              <div style={{ marginBottom: 14 }}>
                <SectionTitle>Objetivos do Seu Tratamento</SectionTitle>
                <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
                  {safeArray(planData.objetivos_tratamento).slice(0, 6).map((obj, i) => (
                    <li key={i} style={{ display: "flex", gap: 8, fontSize: 13, marginBottom: 6, lineHeight: 1.6 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#C17F6A", flexShrink: 0, marginTop: 5 }} />
                      <span>{removeName(obj)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* Etapas do tratamento */}
          {etapas.length > 0 && (
            <>
              <Divider />
              <div style={{ marginBottom: 14 }}>
                <SectionTitle>Como será o Seu Tratamento</SectionTitle>
                <p style={{ fontSize: 12.5, color: "#555", margin: "0 0 12px 0", lineHeight: 1.6 }}>
                  Seu plano é dividido em 3 etapas progressivas de {plan.total_sessoes || 24} sessões:
                </p>

                {/* Etapa 1 */}
                <div style={{ marginBottom: 14, padding: "10px 12px", background: "#F8F6F3", borderRadius: 8, borderLeft: "4px solid #C17F6A" }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#1B3A4B", marginBottom: 6 }}>
                    Etapa 1 — Sessões 1 a 8: Adaptação Muscular
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
                    {safeArray(etapas[0]?.ciclos).slice(0, 3).map((ciclo, i) => (
                      <li key={i} style={{ display: "flex", gap: 6, fontSize: 12.5, marginBottom: 4, lineHeight: 1.5 }}>
                        <span style={{ color: "#C17F6A", fontWeight: 700 }}>●</span>
                        <span>{removeName(ciclo.objetivo)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Etapa 2 */}
                {etapas[1] && (
                  <div style={{ marginBottom: 14, padding: "10px 12px", background: "#F8F6F3", borderRadius: 8, borderLeft: "4px solid #7A9DB0" }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#1B3A4B", marginBottom: 6 }}>
                      Etapa 2 — Sessões 9 a 16: Correção Postural e Mobilidade
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
                      {safeArray(etapas[1]?.ciclos).slice(0, 3).map((ciclo, i) => (
                        <li key={i} style={{ display: "flex", gap: 6, fontSize: 12.5, marginBottom: 4, lineHeight: 1.5 }}>
                          <span style={{ color: "#7A9DB0", fontWeight: 700 }}>●</span>
                          <span>{removeName(ciclo.objetivo)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Etapa 3 */}
                {etapas[2] && (
                  <div style={{ marginBottom: 14, padding: "10px 12px", background: "#F8F6F3", borderRadius: 8, borderLeft: "4px solid #1B3A4B" }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#1B3A4B", marginBottom: 6 }}>
                      Etapa 3 — Sessões 17 a 24: Dores Secundárias e Manutenção
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
                      {safeArray(etapas[2]?.ciclos).slice(0, 3).map((ciclo, i) => (
                        <li key={i} style={{ display: "flex", gap: 6, fontSize: 12.5, marginBottom: 4, lineHeight: 1.5 }}>
                          <span style={{ color: "#1B3A4B", fontWeight: 700 }}>●</span>
                          <span>{removeName(ciclo.objetivo)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Explicação da Terapia */}
          {planData?.explicacao_terapia && (
            <>
              <Divider />
              <div style={{ marginBottom: 14 }}>
                <SectionTitle>Sobre a {plan.terapia_especial}</SectionTitle>
                <p style={{ fontSize: 13, lineHeight: 1.8, margin: 0, textAlign: "justify" }}>
                  {planData.explicacao_terapia.length > 400
                    ? planData.explicacao_terapia.substring(0, 400).replace(/[^.]*$/, "")
                    : planData.explicacao_terapia}
                </p>
              </div>
            </>
          )}

          {/* Mensagem final */}
          <Divider />
          <div style={{
            background: "linear-gradient(135deg, #1B3A4B 0%, #2A4F63 100%)",
            borderRadius: 10,
            padding: "14px 18px",
            marginTop: 8,
          }}>
            <p style={{ fontSize: 13.5, color: "#fff", lineHeight: 1.7, margin: 0, fontWeight: 500, textAlign: "center" }}>
              {plan.patient_nome}, seu plano terapêutico de {plan.total_sessoes || 24} sessões foi desenvolvido
              especialmente para você. O tratamento é progressivo e cada etapa é essencial para alcançar
              resultados duradouros, mais conforto e qualidade de vida.
            </p>
          </div>

          {/* Footer info */}
          <div style={{ marginTop: 16, textAlign: "center", fontSize: 11, color: "#999" }}>
            <p style={{ margin: 0 }}>Vibe Terapias — Clínica Especializada em Dor</p>
            <p style={{ margin: 0 }}>Este é um resumo do seu plano. O documento completo está com seu terapeuta.</p>
          </div>
        </div>
      </div>
    </div>
  );
}