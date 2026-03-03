import React from "react";

const BG_IMAGE_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699c716b5aaf606ea054cadd/ef18c5b4c_image.png";
const FOOTER_IMAGE_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699c716b5aaf606ea054cadd/ac819d2fc_image.png";

function Divider() {
  return <div style={{ height: 1, background: "#D1C4B0", margin: "14px 0" }} />;
}

function SectionTitle({ children }) {
  return (
    <div style={{ fontSize: 13, fontWeight: 700, color: "#1B3A4B", marginBottom: 8 }}>
      {children}
    </div>
  );
}

function ThermalAnalysisText({ text }) {
  if (!text) return null;
  // Split text into paragraphs, then within each paragraph handle [ALERTA] blocks
  const paragraphs = text.split(/\n+/).filter(p => p.trim());
  return (
    <div style={{ fontSize: 13, lineHeight: 1.9, color: "#222", textAlign: "justify" }}>
      {paragraphs.map((para, pi) => {
        // Split paragraph by [ALERTA]...[/ALERTA]
        const parts = para.split(/(\[ALERTA\][\s\S]*?\[\/ALERTA\])/g);
        return (
          <p key={pi} style={{ margin: "0 0 10px 0" }}>
            {parts.map((part, i) => {
              if (part.startsWith("[ALERTA]")) {
                const content = part.replace(/^\[ALERTA\]/, "").replace(/\[\/ALERTA\]$/, "");
                return (
                  <span key={i} style={{
                    display: "inline",
                    background: "#FFF3CD",
                    color: "#7B2D00",
                    fontWeight: 900,
                    fontSize: 13.5,
                    borderLeft: "4px solid #C17F6A",
                    paddingLeft: 7,
                    paddingRight: 5,
                    borderRadius: 2,
                  }}>
                    ⚠ {content}
                  </span>
                );
              }
              return <span key={i}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}

function DiamondIcon() {
  return <span style={{ color: "#C17F6A", marginRight: 6, fontSize: 12 }}>◆</span>;
}

function CicloBlock({ ciclo }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#1B3A4B", marginBottom: 6 }}>
        <DiamondIcon />Ciclo {ciclo.numero}:
      </div>
      <div style={{ paddingLeft: 4 }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1B3A4B", flexShrink: 0, marginTop: 4 }} />
          <p style={{ fontSize: 12.5, color: "#222", margin: 0, lineHeight: 1.6 }}>
           <strong style={{ color: "#1B3A4B" }}>Objetivo:</strong> {ciclo.objetivo}
          </p>
        </div>
        <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1B3A4B", flexShrink: 0, marginTop: 4 }} />
          <p style={{ fontSize: 12.5, color: "#222", margin: 0, lineHeight: 1.6 }}>
           <strong style={{ color: "#1B3A4B" }}>Técnicas aplicadas:</strong>{" "}
           <span dangerouslySetInnerHTML={{ __html: ciclo.tecnicas.replace(/Liberação Miofascial/g, '<strong style="color:#1B3A4B">Liberação Miofascial</strong>').replace(/Dry Needling/g, '<strong>Dry Needling</strong>').replace(/caso o cliente aprove/g, '<em>caso o cliente aprove</em>') }} />
          </p>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1B3A4B", flexShrink: 0, marginTop: 4 }} />
          <p style={{ fontSize: 12.5, color: "#222", margin: 0, lineHeight: 1.6 }}>
            <strong style={{ color: "#1B3A4B" }}>Músculos trabalhados:</strong> {ciclo.musculos}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PlanDocument({ plan, patientData }) {
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

  const safeArray = (val) => Array.isArray(val) ? val : [];
  const etapas = safeArray(planData?.etapas);

  const pageStyle = {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#ffffff",
    marginBottom: 24,
    borderRadius: 0,
    width: "210mm",
    height: "297mm",
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
    padding: "50mm 12mm 42mm 12mm",
    position: "relative",
    zIndex: 1,
    overflow: "hidden",
    maxHeight: "297mm",
    boxSizing: "border-box",
  };

  const PageWrapper = ({ children, id }) => (
    <div id={id} style={pageStyle}>
      <img src={BG_IMAGE_URL} alt="" style={bgStyle} />
      <img src={FOOTER_IMAGE_URL} alt="" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", display: "block", zIndex: 0 }} />
      <div style={contentStyle}>{children}</div>
    </div>
  );

  // Compact ciclo row
  function CicloCompact({ ciclo }) {
    return (
      <div style={{ display: "flex", gap: 6, marginBottom: 6, fontSize: 13, lineHeight: 1.6 }}>
        <span style={{ color: "#C17F6A", fontWeight: 700, flexShrink: 0 }}>● C{ciclo.numero}:</span>
        <span><strong>{ciclo.objetivo}</strong>{ciclo.tecnicas ? ` | ${ciclo.tecnicas}` : ""}{ciclo.musculos ? ` | ${ciclo.musculos}` : ""}</span>
      </div>
    );
  }

  const hasPostural = planData?.foto_postural_1 || planData?.foto_postural_2 || planData?.avaliacao_postural;
  const hasThermal = safeArray(planData?.fotos_camera_termal).length > 0 || planData?.analise_camera_termal;

  return (
    <div style={{ fontFamily: "'Arial', 'Helvetica', sans-serif", color: "#222", lineHeight: 1.5 }}>

      {/* ============ PAGE 1: Info + Resumos ============ */}
      <PageWrapper id="plan-page-1">
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, lineHeight: 1.6 }}>
            <span style={{ fontWeight: 700 }}>Paciente: </span>{plan.patient_nome} &nbsp;|&nbsp;
            <span style={{ fontWeight: 700 }}>Sexo: </span>{patientData?.sexo || "–"} &nbsp;|&nbsp;
            <span style={{ fontWeight: 700 }}>Telefone: </span>{plan.patient_telefone} &nbsp;|&nbsp;
            <span style={{ fontWeight: 700 }}>Terapia: </span>{plan.terapia_especial}
          </div>
        </div>
        <Divider />

        {planData?.resumo_queixas && (
          <div style={{ marginBottom: 12 }}>
            <SectionTitle>Resumo das Queixas e Áreas Afetadas</SectionTitle>
            <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0, paddingLeft: 6, textAlign: "justify" }}>
              {planData.resumo_queixas.substring(0, 400)}
            </p>
          </div>
        )}

        {(planData?.resultado_camera_termal || planData?.analise_camera_termal) && (
          <>
            <Divider />
            <div style={{ marginBottom: 12 }}>
              <SectionTitle>Resultado da Câmera Termal</SectionTitle>
              <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0, paddingLeft: 6, textAlign: "justify" }}>
                {(planData.resultado_camera_termal || planData.analise_camera_termal || "").substring(0, 350)}
              </p>
            </div>
          </>
        )}

        {safeArray(planData?.objetivos_tratamento).length > 0 && (
          <>
            <Divider />
            <div style={{ marginBottom: 12 }}>
              <SectionTitle>Objetivos do Tratamento</SectionTitle>
              <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
                {safeArray(planData.objetivos_tratamento).slice(0, 5).map((obj, i) => (
                  <li key={i} style={{ display: "flex", gap: 6, fontSize: 13, marginBottom: 4, lineHeight: 1.6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1B3A4B", flexShrink: 0, marginTop: 5 }} />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {planData?.objetivo_geral && (
          <>
            <Divider />
            <div style={{ marginBottom: 12 }}>
              <SectionTitle>Objetivo Geral</SectionTitle>
              <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0, paddingLeft: 6, textAlign: "justify" }}>
                {planData.objetivo_geral.substring(0, 300)}
              </p>
            </div>
          </>
        )}

        {planData?.explicacao_terapia && (
          <>
            <Divider />
            <div style={{ marginBottom: 12 }}>
              <SectionTitle>Explicação da Terapia Especial</SectionTitle>
              <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0, paddingLeft: 6, textAlign: "justify" }}>
                {planData.explicacao_terapia.substring(0, 300)}
              </p>
            </div>
          </>
        )}
      </PageWrapper>

      {/* ============ PAGE 2: Etapas 1 + 2 ============ */}
      {etapas.length > 0 && (
        <PageWrapper id="plan-page-etapas-12">
          {etapas.slice(0, 2).map((etapa, ei) => (
            <div key={ei} style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1B3A4B", marginBottom: 5 }}>
                Etapa {etapa.numero}: {etapa.nome}
              </div>
              {etapa.objetivo_etapa && (
                <div style={{ fontSize: 13, color: "#444", marginBottom: 7, paddingLeft: 8 }}>
                  <strong>Objetivo:</strong> {etapa.objetivo_etapa.substring(0, 180)}
                </div>
              )}
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1B3A4B", marginBottom: 5 }}>Intervenções:</div>
              {safeArray(etapa.ciclos).map((ciclo, ci) => (
                <CicloCompact key={ci} ciclo={ciclo} />
              ))}
              {ei === 0 && <Divider />}
            </div>
          ))}
        </PageWrapper>
      )}

      {/* ============ PAGE 3: Etapa 3 + Resumo Final ============ */}
      {etapas.length > 2 && (
        <PageWrapper id="plan-page-etapa-3">
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1B3A4B", marginBottom: 4 }}>
              Etapa {etapas[2].numero}: {etapas[2].nome}
            </div>
            {etapas[2].objetivo_etapa && (
              <div style={{ fontSize: 11.5, color: "#444", marginBottom: 6, paddingLeft: 8 }}>
                <strong>Objetivo:</strong> {etapas[2].objetivo_etapa.substring(0, 180)}
              </div>
            )}
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#1B3A4B", marginBottom: 4 }}>Intervenções:</div>
            {safeArray(etapas[2].ciclos).map((ciclo, ci) => (
              <CicloCompact key={ci} ciclo={ciclo} />
            ))}
          </div>

          {planData?.resumo_final && (
            <>
              <Divider />
              <div>
                <SectionTitle>Resumo do Plano Terapêutico</SectionTitle>
                <p style={{ fontSize: 11.5, lineHeight: 1.6, margin: 0, paddingLeft: 6, textAlign: "justify" }}>
                  {planData.resumo_final.substring(0, 500)}
                </p>
              </div>
            </>
          )}
        </PageWrapper>
      )}

      {/* ============ PAGE 4: Fotos Posturais + Avaliação Postural ============ */}
      {hasPostural && (
        <PageWrapper id="plan-page-postural">
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1B3A4B", marginBottom: 8, textAlign: "center" }}>
            Avaliação Postural
          </div>
          <Divider />
          {(planData?.foto_postural_1 || planData?.foto_postural_2) && (
            <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
              {planData?.foto_postural_1 && (
                <div style={{ flex: 1, textAlign: "center" }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#1B3A4B", margin: "0 0 4px 0" }}>Vista Frontal</p>
                  <img src={planData.foto_postural_1} alt="Postural 1" style={{ width: "100%", maxHeight: "90mm", borderRadius: 6, objectFit: "contain" }} />
                </div>
              )}
              {planData?.foto_postural_2 && (
                <div style={{ flex: 1, textAlign: "center" }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#1B3A4B", margin: "0 0 4px 0" }}>Vista Lateral</p>
                  <img src={planData.foto_postural_2} alt="Postural 2" style={{ width: "100%", maxHeight: "90mm", borderRadius: 6, objectFit: "contain" }} />
                </div>
              )}
            </div>
          )}
          {planData?.avaliacao_postural && (
            <>
              <Divider />
              <p style={{ fontSize: 10.5, lineHeight: 1.7, margin: 0, textAlign: "justify", whiteSpace: "pre-wrap", color: "#222" }}>
                {planData.avaliacao_postural.substring(0, 1200)}
              </p>
            </>
          )}
        </PageWrapper>
      )}

      {/* ============ PAGE 5: Câmera Termal - Fotos ============ */}
      {safeArray(planData?.fotos_camera_termal).length > 0 && (
        <PageWrapper id="plan-page-termal-fotos">
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1B3A4B", marginBottom: 8, textAlign: "center" }}>
            Fotos da Câmera Termal
          </div>
          <Divider />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 10 }}>
            {safeArray(planData.fotos_camera_termal).map((url, i) => (
              <div key={i} style={{ borderRadius: 6, overflow: "hidden", border: "1px solid #E5E7EB" }}>
                <img src={url} alt={`Termal ${i + 1}`} style={{ width: "100%", display: "block", objectFit: "cover", height: 160 }} />
              </div>
            ))}
          </div>
        </PageWrapper>
      )}

      {/* ============ PAGE 6: Análise Câmera Termal ============ */}
      {(planData?.analise_camera_termal || planData?.resultado_camera_termal) && (
        <PageWrapper id="plan-page-termal-analise">
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1B3A4B", marginBottom: 8, textAlign: "center" }}>
            Análise da Câmera Termal
          </div>
          <Divider />
          <ThermalAnalysisText text={planData.analise_camera_termal || planData.resultado_camera_termal} />
        </PageWrapper>
      )}

      {/* Fallback */}
      {!planData && plan.plano_completo && (
        <PageWrapper id="plan-page-fallback">
          <pre style={{ fontSize: 11, whiteSpace: "pre-wrap", lineHeight: 1.7, fontFamily: "Arial, sans-serif" }}>
            {plan.plano_completo}
          </pre>
        </PageWrapper>
      )}
    </div>
  );
}