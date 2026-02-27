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
    <div style={{ fontSize: 11.5, lineHeight: 1.8, color: "#222", textAlign: "justify" }}>
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
                    fontWeight: 700,
                    borderLeft: "3px solid #C17F6A",
                    paddingLeft: 6,
                    paddingRight: 4,
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

  return (
    <div style={{ fontFamily: "'Arial', 'Helvetica', sans-serif", color: "#222", lineHeight: 1.5 }}>

      {/* ============ PAGE 1 ============ */}
      <PageWrapper id="plan-page-1">
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, lineHeight: 1.4 }}>
            <span style={{ fontWeight: 700 }}>Paciente: </span>{plan.patient_nome}<br />
            <span style={{ fontWeight: 700 }}>Sexo: </span>{patientData?.sexo || "–"}<br />
            <span style={{ fontWeight: 700 }}>Telefone: </span>{plan.patient_telefone}<br />
            <span style={{ fontWeight: 700 }}>Terapia Especial: </span>{plan.terapia_especial}
          </div>
        </div>

        <Divider />

        <div style={{ marginBottom: 14 }}>
          <SectionTitle>Resumo das Queixas, Dores e Áreas Afetadas</SectionTitle>
          <p style={{ fontSize: 12.5, lineHeight: 1.7, margin: 0, paddingLeft: 8, textAlign: "justify" }}>
            {planData?.resumo_queixas || patientData?.queixas_principais || "–"}
          </p>
        </div>

        {planData?.resultado_camera_termal && (
          <>
            <div style={{ marginBottom: 14 }}>
              <SectionTitle>Resultado da Avaliação com a câmera termal:</SectionTitle>
              <p style={{ fontSize: 12.5, lineHeight: 1.7, margin: 0, paddingLeft: 8, textAlign: "justify" }}>
                {planData.resultado_camera_termal}
              </p>
            </div>
            <Divider />
          </>
        )}

        {safeArray(planData?.objetivos_tratamento).length > 0 && (
          <>
            <Divider />
            <div style={{ marginBottom: 14 }}>
              <SectionTitle>Objetivos do Tratamento</SectionTitle>
              <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
                {safeArray(planData?.objetivos_tratamento).map((obj, i) => (
                  <li key={i} style={{ display: "flex", gap: 8, fontSize: 12.5, marginBottom: 5, lineHeight: 1.5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1B3A4B", flexShrink: 0, marginTop: 4 }} />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <Divider />

        {planData?.objetivo_geral && (
          <>
            <div style={{ marginBottom: 14 }}>
              <SectionTitle>Objetivo Geral do Tratamento</SectionTitle>
              <p style={{ fontSize: 12.5, lineHeight: 1.7, margin: 0, paddingLeft: 8, textAlign: "justify" }}>
                {planData.objetivo_geral}
              </p>
            </div>
            <Divider />
          </>
        )}

        {planData?.explicacao_terapia && (
          <div style={{ marginBottom: 14 }}>
            <SectionTitle>Explicação da Terapia Especial</SectionTitle>
            <p style={{ fontSize: 12.5, lineHeight: 1.7, margin: 0, paddingLeft: 8, textAlign: "justify" }}>
              {planData.explicacao_terapia}
            </p>
          </div>
        )}
      </PageWrapper>

      {/* ============ PAGE 2+ - Etapas ============ */}
      {etapas.map((etapa, ei) => {
        const isLast = ei === etapas.length - 1;
        return (
          <PageWrapper key={ei} id={`plan-page-etapa-${ei + 1}`}>
            <div style={{ textAlign: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1B3A4B" }}>
                Etapa {etapa.numero}: {etapa.nome}
              </span>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1B3A4B", marginBottom: 4 }}>Objetivo:</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1B3A4B", lineHeight: 1.6, textTransform: "uppercase", paddingLeft: 16 }}>
                {etapa.objetivo_etapa}
              </div>
            </div>

            <Divider />

            <div style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1B3A4B", marginBottom: 10 }}>Intervenções</div>
              {safeArray(etapa.ciclos).map((ciclo, ci) => (
                <CicloBlock key={ci} ciclo={ciclo} />
              ))}
            </div>

            {isLast && planData?.resumo_final && (
              <>
                <Divider />
                <div style={{ marginBottom: 16 }}>
                  <SectionTitle>Resumo do Plano Terapêutico</SectionTitle>
                  <p style={{ fontSize: 12.5, lineHeight: 1.8, margin: 0, paddingLeft: 8, textAlign: "justify" }}>
                    {planData.resumo_final}
                  </p>
                </div>
              </>
            )}
          </PageWrapper>
        );
      })}

      {/* ============ PAGE FOTOS POSTURAIS ============ */}
      {(planData?.foto_postural_1 || planData?.foto_postural_2) && (
        <PageWrapper id="plan-page-fotos-posturais">
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1B3A4B", marginBottom: 10, textAlign: "center" }}>
            Fotos da Avaliação Postural
          </div>
          <Divider />
          <div style={{ display: "flex", gap: 20, marginTop: 16 }}>
            {planData?.foto_postural_1 && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#1B3A4B", margin: 0 }}>Vista Frontal</p>
                <img src={planData.foto_postural_1} alt="Foto Postural 1" style={{ width: "100%", maxHeight: "160mm", borderRadius: 8, objectFit: "contain", display: "block" }} />
              </div>
            )}
            {planData?.foto_postural_2 && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#1B3A4B", margin: 0 }}>Vista Lateral</p>
                <img src={planData.foto_postural_2} alt="Foto Postural 2" style={{ width: "100%", maxHeight: "160mm", borderRadius: 8, objectFit: "contain", display: "block" }} />
              </div>
            )}
          </div>
        </PageWrapper>
      )}

      {/* ============ PAGE AVALIAÇÃO POSTURAL ============ */}
      {planData?.avaliacao_postural && (
        <PageWrapper id="plan-page-avaliacao-postural">
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1B3A4B", marginBottom: 10, textAlign: "center" }}>
            Avaliação Postural
          </div>
          <Divider />
          <p style={{ fontSize: 11, lineHeight: 1.8, margin: 0, textAlign: "justify", whiteSpace: "pre-wrap", color: "#222" }}>
            {planData.avaliacao_postural}
          </p>
        </PageWrapper>
      )}

      {/* ============ PAGE CÂMERA TERMAL - FOTOS ============ */}
      {safeArray(planData?.fotos_camera_termal).length > 0 && (
        <PageWrapper id="plan-page-termal">
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1B3A4B", marginBottom: 16, textAlign: "center" }}>
            Avaliação com Câmera Termal
          </div>
          <Divider />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 12 }}>
            {safeArray(planData.fotos_camera_termal).map((url, i) => (
              <div key={i} style={{ borderRadius: 8, overflow: "hidden", border: "1px solid #E5E7EB" }}>
                <img src={url} alt={`Câmera Termal ${i + 1}`} style={{ width: "100%", display: "block", objectFit: "cover", height: 180 }} />
              </div>
            ))}
          </div>
        </PageWrapper>
      )}

      {/* ============ PAGE CÂMERA TERMAL - ANÁLISE ============ */}
      {(planData?.analise_camera_termal || planData?.resultado_camera_termal) && (
        <PageWrapper id="plan-page-termal-analise">
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1B3A4B", marginBottom: 10, textAlign: "center" }}>
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