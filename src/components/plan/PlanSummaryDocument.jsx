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

  // Remove patient name and clean trailing prepositions / incomplete endings
  const removeName = (text) => {
    if (!text || !plan.patient_nome) return text;
    const name = plan.patient_nome;
    let cleaned = text
      .replace(new RegExp(`\\bde\\s+${name}\\b`, "gi"), "")
      .replace(new RegExp(`\\bdo\\s+${name}\\b`, "gi"), "")
      .replace(new RegExp(`\\bda\\s+${name}\\b`, "gi"), "")
      .replace(new RegExp(`\\bpara\\s+${name}\\b`, "gi"), "")
      .replace(new RegExp(`\\b${name}\\b`, "gi"), "")
      .replace(/\s{2,}/g, " ")
      .trim();
    // Remove trailing dangling prepositions/articles
    cleaned = cleaned.replace(/\s+(em|na|no|nas|nos|de|do|da|dos|das|para|pelo|pela|ao|à|com|e)\s*\.?\s*$/gi, "");
    // Remove trailing period preceded by space
    cleaned = cleaned.replace(/\s+\.\s*$/, ".");
    // Ensure ends with period
    if (cleaned && !cleaned.endsWith(".") && !cleaned.endsWith("!") && !cleaned.endsWith("?")) {
      cleaned += ".";
    }
    return cleaned;
  };

  // Truncate queixas to max 250 chars ending at a period
  const truncateAtPeriod = (text, max) => {
    if (!text) return "";
    if (text.length <= max) return text;
    const cut = text.substring(0, max);
    const lastPeriod = cut.lastIndexOf(".");
    return lastPeriod > 50 ? cut.substring(0, lastPeriod + 1) : cut + "...";
  };

  const hasPostural = planData?.foto_postural_1 || planData?.foto_postural_2 || planData?.avaliacao_postural;
  const thermalPhotos = safeArray(planData?.fotos_camera_termal);
  const hasThermalPhotos = thermalPhotos.length > 0;

  // Split postural text into frontal/lateral
  const parsePostural = (text) => {
    if (!text) return { frontal: [], lateral: [] };
    const allText = text.replace(/\n+/g, " ");
    const splitRegex = /(?=na vista lateral|no plano sagital)/i;
    const parts = allText.split(splitRegex);
    const toSentences = (str, limit = 3) =>
      str.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(s => s.length > 10).slice(0, limit);
    return { frontal: toSentences(parts[0] || "", 3), lateral: toSentences(parts[1] || "", 3) };
  };

  // Same page style as PlanDocument
  const pageStyle = {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#ffffff",
    width: "210mm",
    height: "297mm",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    pageBreakAfter: "always",
    pageBreakInside: "avoid",
  };

  const PageWrapper = ({ children, id }) => (
    <div id={id} style={pageStyle}>
      <img src={BG_IMAGE_URL} alt="" style={{
        position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
        objectFit: "fill", zIndex: 0, pointerEvents: "none",
      }} />
      <img src={FOOTER_IMAGE_URL} alt="" style={{
        position: "absolute", bottom: 0, left: 0, width: "100%", display: "block", zIndex: 0,
      }} />
      <div style={{
        flex: 1,
        padding: "50mm 12mm 42mm 12mm",
        position: "relative",
        zIndex: 1,
        boxSizing: "border-box",
        overflow: "hidden",
        maxHeight: "297mm",
      }}>
        {children}
      </div>
    </div>
  );

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
          padding: "150px 60px 180px 60px",
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

      {/* ============ PAGE 2: Avaliação Postural (identical to PlanDocument) ============ */}
      {hasPostural && (
        <PageWrapper id="summary-page-2">
          <div style={{ fontSize: 18, fontWeight: 900, color: "#1B3A4B", marginBottom: 10, textAlign: "center", letterSpacing: 0.5 }}>
            Avaliação Postural
          </div>
          <Divider />
          <div style={{ display: "flex", gap: 10, marginBottom: 10, justifyContent: "center" }}>
            {planData?.foto_postural_1 && (
              <div style={{ flex: 1, textAlign: "center" }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: "#1B3A4B", margin: "0 0 3px 0" }}>Vista Frontal</p>
                <img src={planData.foto_postural_1} alt="Postural 1" style={{ width: "100%", height: "100mm", objectFit: "contain", borderRadius: 4 }} />
              </div>
            )}
            {planData?.foto_postural_2 && (
              <div style={{ flex: 1, textAlign: "center" }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: "#1B3A4B", margin: "0 0 3px 0" }}>Vista Lateral</p>
                <img src={planData.foto_postural_2} alt="Postural 2" style={{ width: "100%", height: "100mm", objectFit: "contain", borderRadius: 4 }} />
              </div>
            )}
          </div>
          <Divider />
          {planData?.avaliacao_postural && (() => {
            const { frontal, lateral } = parsePostural(planData.avaliacao_postural);
            return (
              <div style={{ display: "flex", gap: 12 }}>
                {frontal.length > 0 && (
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#1B3A4B", marginBottom: 6 }}>Na vista frontal (plano coronal)</div>
                    <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
                      {frontal.map((s, i) => (
                        <li key={i} style={{ display: "flex", gap: 6, fontSize: 14, marginBottom: 6, lineHeight: 1.7, color: "#222" }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C17F6A", flexShrink: 0, marginTop: 4 }} />
                          <span style={{ fontWeight: 600 }}>{removeName(s)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {frontal.length > 0 && lateral.length > 0 && (
                  <div style={{ width: 1, background: "#D1C4B0", flexShrink: 0 }} />
                )}
                {lateral.length > 0 && (
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#1B3A4B", marginBottom: 6 }}>Na vista lateral (plano sagital)</div>
                    <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
                      {lateral.map((s, i) => (
                        <li key={i} style={{ display: "flex", gap: 6, fontSize: 14, marginBottom: 6, lineHeight: 1.7, color: "#222" }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C17F6A", flexShrink: 0, marginTop: 4 }} />
                          <span style={{ fontWeight: 600 }}>{removeName(s)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })()}
        </PageWrapper>
      )}

      {/* ============ PAGE 3: Fotos da Câmera Termal (identical to PlanDocument) ============ */}
      {hasThermalPhotos && (
        <PageWrapper id="summary-page-3">
          <div style={{ fontSize: 18, fontWeight: 900, color: "#1B3A4B", marginBottom: 10, textAlign: "center", letterSpacing: 0.5 }}>
            Fotos da Câmera Termal
          </div>
          <Divider />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginTop: 10 }}>
            {thermalPhotos.map((url, i) => (
              <div key={i} style={{
                borderRadius: 6,
                overflow: "hidden",
                border: "1px solid #E5E7EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#000",
                height: 340,
              }}>
                <img src={url} alt={`Termal ${i + 1}`} style={{ maxWidth: "100%", maxHeight: "100%", display: "block", objectFit: "contain" }} />
              </div>
            ))}
          </div>
        </PageWrapper>
      )}
    </div>
  );
}