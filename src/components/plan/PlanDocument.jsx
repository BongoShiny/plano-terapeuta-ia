import React from "react";

const BG_IMAGE_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699c716b5aaf606ea054cadd/ef18c5b4c_image.png";
const FOOTER_IMAGE_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699c716b5aaf606ea054cadd/ac819d2fc_image.png";

function truncateAtSentence(text, maxChars) {
  if (!text || text.length <= maxChars) return text;
  const trimmed = text.substring(0, maxChars);
  const lastPeriod = Math.max(trimmed.lastIndexOf('. '), trimmed.lastIndexOf('! '), trimmed.lastIndexOf('? '));
  if (lastPeriod > 0) return trimmed.substring(0, lastPeriod + 1);
  return trimmed;
}

function Divider() {
  return <div style={{ height: 1, background: "#D1C4B0", margin: "14px 0" }} />;
}

function SectionTitle({ children }) {
  return (
    <div style={{ fontSize: 14, fontWeight: 700, color: "#1B3A4B", marginBottom: 8 }}>
      {children}
    </div>);

}

function renderInlineText(text) {
  // Split by [ALERTA]...[/ALERTA], [PODE_IMPACTO]...[/PODE_IMPACTO] and **bold**
  const parts = text.split(/(\[ALERTA\][\s\S]*?\[\/ALERTA\]|\[PODE_IMPACTO\][\s\S]*?\[\/PODE_IMPACTO\]|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
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
          borderRadius: 2
        }}>
          ⚠ {content}
        </span>);
    }
    if (part.startsWith("[PODE_IMPACTO]")) {
      const content = part.replace(/^\[PODE_IMPACTO\]/, "").replace(/\[\/PODE_IMPACTO\]$/, "");
      return (
        <span key={i} style={{
          display: "inline",
          background: "#E8F4F8",
          color: "#1B3A4B",
          fontWeight: 600,
          fontSize: 13.5,
          borderLeft: "4px solid #7A9DB0",
          paddingLeft: 7,
          paddingRight: 5,
          borderRadius: 2
        }}>
          ℹ {content}
        </span>);
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

function ThermalAnalysisText({ text }) {
  if (!text) return null;

  const sections = [
  { title: null, pattern: /an[aá]lises? termogr[aá]ficos? gerais/i },
  { title: null, pattern: /laudo termogr[aá]fico cl[ií]nico/i },
  { title: "Região cervical", pattern: /regi[aã]o cervical/i },
  { title: "Região lombar", pattern: /regi[aã]o lombar/i },
  { title: "Região craniana", pattern: /regi[aã]o craniana/i },
  { title: "Região torácica", pattern: /regi[aã]o tor[aá]cica/i },
  { title: "Região dos ombros", pattern: /regi[aã]o dos ombros/i },
  { title: "Região do quadril e glúteos", pattern: /regi[aã]o do quadril/i },
  { title: "Região abdominal", pattern: /regi[aã]o abdominal/i },
  { title: "Conclusão clínica", pattern: /conclus[aã]o cl[ií]nica/i }];

  const lines = text.split(/\n+/).map((l) => l.trim()).filter((l) => l.length > 0);
  const structured = [];
  let currentSection = null;
  let currentContent = [];

  for (const line of lines) {
    const matchedSection = line.length < 80 ? sections.find((s) => s.pattern.test(line)) : null;

    if (matchedSection) {
      if (matchedSection.title === null) {
        continue;
      }
      if (currentSection && currentContent.length > 0) {
        structured.push({ title: currentSection, content: currentContent });
      }
      currentSection = matchedSection.title;
      currentContent = [];
    } else if (line.length > 0) {
      if (!currentSection) {
        currentSection = null;
      }
      currentContent.push(line);
    }
  }

  if (currentContent.length > 0) {
    structured.push({ title: currentSection, content: currentContent });
  }

  if (structured.length === 0) {
    return (
      <div style={{ fontSize: 13, lineHeight: 1.9, color: "#222", textAlign: "justify" }}>
        {lines.map((line, i) =>
        <p key={i} style={{ margin: "0 0 8px 0" }}>
            {renderInlineText(line)}
          </p>
        )}
      </div>);
  }

  return (
    <div style={{ fontSize: 13, lineHeight: 1.9, color: "#222" }}>
      {structured.map((section, si) =>
      <div key={si} style={{ marginBottom: 14 }}>
          {section.title &&
            <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#C17F6A", flexShrink: 0, marginTop: 6 }} />
              <span style={{ fontSize: 13, fontWeight: 800, color: "#1B3A4B" }}>{section.title}</span>
            </div>
          }
          <div style={{ paddingLeft: 0 }}>
            {section.content.map((line, li) => {
            // Split line into normal text and alert parts
            const alertParts = line.split(/(\[ALERTA\][\s\S]*?\[\/ALERTA\])/g);
            const hasAlert = alertParts.some(p => p.startsWith("[ALERTA]"));

            if (hasAlert) {
              return (
                <div key={li}>
                  {alertParts.map((part, pi) => {
                    if (part.startsWith("[ALERTA]")) {
                      return (
                        <div key={pi} style={{ display: "flex", gap: 8, marginBottom: 6, marginTop: 6, alignItems: "flex-start" }}>
                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#C17F6A", flexShrink: 0, marginTop: 6 }} />
                          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, textAlign: "justify" }}>
                            {renderInlineText(part)}
                          </p>
                        </div>
                      );
                    }
                    if (part.trim()) {
                      return (
                        <div key={pi} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#C17F6A", flexShrink: 0, marginTop: 6 }} />
                          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, textAlign: "justify", fontWeight: 400 }}>
                            {part}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              );
            }

            return (
              <div key={li} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#C17F6A", flexShrink: 0, marginTop: 6 }} />
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, textAlign: "justify", fontWeight: 400 }}>
                    {renderInlineText(line)}
                  </p>
                </div>);
          })}
          </div>
        </div>
      )}
    </div>);
}

function PosturalBullets({ text }) {
  if (!text) return null;

  const allText = text.replace(/\n+/g, " ");

  // Try to split on "vista lateral" or "plano sagital" keywords
  const splitRegex = /(?=na vista lateral|no plano sagital)/i;
  const parts = allText.split(splitRegex);

  const frontalText = parts[0] || "";
  const lateralText = parts[1] || "";

  const toSentences = (str) =>
  str.
  split(/(?<=[.!?])\s+/).
  map((s) => s.trim()).
  filter((s) => s.length > 10).
  slice(0, 4);

  const frontalSentences = toSentences(frontalText);
  const lateralSentences = toSentences(lateralText);

  const BulletList = ({ sentences }) =>
  <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
      {sentences.map((s, i) =>
    <li key={i} style={{ display: "flex", gap: 6, fontSize: 13, marginBottom: 4, lineHeight: 1.5, color: "#222" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C17F6A", flexShrink: 0, marginTop: 5 }} />
          <span>{s}</span>
        </li>
    )}
    </ul>;


  return (
    <div>
      {frontalSentences.length > 0 &&
      <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#1B3A4B", marginBottom: 4 }}>Na vista frontal (plano coronal)</div>
          <BulletList sentences={frontalSentences} />
        </div>
      }
      {lateralSentences.length > 0 &&
      <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#1B3A4B", marginBottom: 4 }}>Na vista lateral (plano sagital)</div>
          <BulletList sentences={lateralSentences} />
        </div>
      }
    </div>);

}

function PosturalColumns({ text }) {
  if (!text) return null;

  const allText = text.replace(/\n+/g, " ");
  const splitRegex = /(?=na vista lateral|no plano sagital)/i;
  const parts = allText.split(splitRegex);

  const frontalText = parts[0] || "";
  const lateralText = parts[1] || "";

  const toSentences = (str, limit = 3) =>
  str.
  split(/(?<=[.!?])\s+/).
  map((s) => s.trim()).
  filter((s) => s.length > 10).
  slice(0, limit);

  const frontalSentences = toSentences(frontalText, 2);
  const lateralSentences = toSentences(lateralText, 3);

  const BulletList = ({ sentences }) =>
  <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
      {sentences.map((s, i) =>
    <li key={i} style={{ display: "flex", gap: 6, fontSize: 14, marginBottom: 6, lineHeight: 1.7, color: "#222" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C17F6A", flexShrink: 0, marginTop: 4 }} />
          <span style={{ fontWeight: 600 }} className="text-sm text-justify normal-case">{s}</span>
        </li>
    )}
    </ul>;


  return (
    <div style={{ display: "flex", gap: 12 }}>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: "#1B3A4B", marginBottom: 6 }} className="mx-3 rounded">Na vista frontal (plano coronal)</div>
      <BulletList sentences={frontalSentences} />
    </div>
    <div style={{ width: 1, background: "#D1C4B0", flexShrink: 0 }} />
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: "#1B3A4B", marginBottom: 6 }} className="mx-3">Na vista lateral (plano sagital)</div>
      <BulletList sentences={lateralSentences} />
    </div>
    </div>);

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
    </div>);

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
    pageBreakInside: "avoid"
  };

  const bgStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "fill",
    zIndex: 0,
    pointerEvents: "none"
  };

  const contentStyle = {
    flex: 1,
    padding: "50mm 12mm 42mm 12mm",
    position: "relative",
    zIndex: 1,
    overflow: "hidden",
    maxHeight: "297mm",
    boxSizing: "border-box"
  };

  const contentStylePage1 = {
    ...contentStyle,
    padding: "45mm 12mm 42mm 12mm"
  };

  const PageWrapper = ({ children, id, isFirstPage }) =>
  <div id={id} style={pageStyle}>
      <img src={BG_IMAGE_URL} alt="" style={bgStyle} />
      <img src={FOOTER_IMAGE_URL} alt="" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", display: "block", zIndex: 0 }} />
      <div style={isFirstPage ? contentStylePage1 : contentStyle}>{children}</div>
    </div>;


  // Compact ciclo row
  function CicloCompact({ ciclo }) {
    return (
      <div style={{ display: "flex", gap: 6, marginBottom: 6, fontSize: 13, lineHeight: 1.6 }}>
        <span style={{ color: "#C17F6A", fontWeight: 700, flexShrink: 0 }}>●</span>
        <span><strong>{ciclo.objetivo}</strong>{ciclo.tecnicas ? ` | ${ciclo.tecnicas}` : ""}{ciclo.musculos ? ` | ${ciclo.musculos}` : ""}</span>
      </div>);

  }

  const hasPostural = planData?.foto_postural_1 || planData?.foto_postural_2 || planData?.avaliacao_postural;
  const hasThermal = safeArray(planData?.fotos_camera_termal).length > 0 || planData?.analise_camera_termal;

  return (
    <div style={{ fontFamily: "'Arial', 'Helvetica', sans-serif", color: "#222", lineHeight: 1.5 }}>

      {/* ============ PAGE 1: Info + Resumos ============ */}
      <PageWrapper id="plan-page-1" isFirstPage={true}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, lineHeight: 1.6 }}>
            <span style={{ fontWeight: 700 }}>Paciente: </span>{plan.patient_nome} &nbsp;|&nbsp;
            <span style={{ fontWeight: 700 }}>Sexo: </span>{patientData?.sexo || "–"} &nbsp;|&nbsp;
            <span style={{ fontWeight: 700 }}>Telefone: </span>{plan.patient_telefone} &nbsp;|&nbsp;
            <span style={{ fontWeight: 700 }}>Terapia: </span>{plan.terapia_especial}
          </div>
        </div>
        <Divider />

        {planData?.resumo_queixas &&
        <div style={{ marginBottom: 12 }}>
            <SectionTitle>Resumo das Queixas e Áreas Afetadas</SectionTitle>
            <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0, paddingLeft: 6, textAlign: "justify" }}>
              {truncateAtSentence(planData.resumo_queixas, 400)}
            </p>
          </div>
        }

        {planData?.resultado_camera_termal &&
        <>
            <Divider />
            <div style={{ marginBottom: 12 }}>
              <SectionTitle>Resultado da Avaliação com a câmera termal:</SectionTitle>
              <ThermalSummaryBullets text={planData.resultado_camera_termal} />
            </div>
          </>
        }

        {safeArray(planData?.objetivos_tratamento).length > 0 &&
        <>
            <Divider />
            <div style={{ marginBottom: 12 }}>
              <SectionTitle>Objetivos do Tratamento</SectionTitle>
              <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
                {safeArray(planData.objetivos_tratamento).slice(0, 5).map((obj, i) =>
              <li key={i} style={{ display: "flex", gap: 6, fontSize: 13, marginBottom: 4, lineHeight: 1.6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C17F6A", flexShrink: 0, marginTop: 5 }} />
                    <span>{obj}</span>
                  </li>
              )}
              </ul>
            </div>
          </>
        }

        {planData?.objetivo_geral &&
        <>
            <Divider />
            <div style={{ marginBottom: 12 }}>
              <SectionTitle>Objetivo Geral</SectionTitle>
              <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0, paddingLeft: 6, textAlign: "justify" }}>
                {truncateAtSentence(planData.objetivo_geral, 400)}
              </p>
            </div>
          </>
        }

        {planData?.explicacao_terapia &&
        <>
            <Divider />
            <div style={{ marginBottom: 12 }}>
              <SectionTitle>Explicação da Terapia Especial</SectionTitle>
              <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0, paddingLeft: 6, textAlign: "justify" }}>
                {truncateAtSentence(planData.explicacao_terapia, 400)}
              </p>
            </div>
          </>
        }
      </PageWrapper>

      {/* ============ PAGE 2: Resumo das 3 Etapas (Consolidado) ============ */}
      {etapas.length > 0 &&
      <PageWrapper id="plan-page-etapas-resumo">
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#1B3A4B", marginBottom: 12 }}>
              Etapa 1 a 8 sessões: Adaptação Muscular
            </div>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
              {safeArray(etapas[0]?.ciclos).slice(0, 4).map((ciclo, i) =>
            <li key={i} style={{ display: "flex", gap: 6, fontSize: 13, marginBottom: 6, lineHeight: 1.6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C17F6A", flexShrink: 0, marginTop: 5 }} />
                  <span style={{ fontWeight: 600 }}>{ciclo.objetivo}</span>
                </li>
            )}
            </ul>
          </div>

          <Divider />

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#1B3A4B", marginBottom: 12 }}>
              Etapa 9 a 16: Correção postural e melhora da mobilidade
            </div>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
              {safeArray(etapas[1]?.ciclos).slice(0, 4).map((ciclo, i) =>
            <li key={i} style={{ display: "flex", gap: 6, fontSize: 13, marginBottom: 6, lineHeight: 1.6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C17F6A", flexShrink: 0, marginTop: 5 }} />
                  <span style={{ fontWeight: 600 }}>{ciclo.objetivo}</span>
                </li>
            )}
            </ul>
          </div>

          <Divider />

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#1B3A4B", marginBottom: 12 }}>
              Etapa 17 a 24: Dores secundárias
            </div>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
              {safeArray(etapas[2]?.ciclos).slice(0, 4).map((ciclo, i) =>
            <li key={i} style={{ display: "flex", gap: 6, fontSize: 13, marginBottom: 6, lineHeight: 1.6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C17F6A", flexShrink: 0, marginTop: 5 }} />
                  <span style={{ fontWeight: 600 }}>{ciclo.objetivo}</span>
                </li>
            )}
            </ul>
          </div>

          {planData?.objetivo_geral &&
        <>
            <Divider />
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#1B3A4B", marginBottom: 10 }}>
                Resumo do Plano Terapêutico
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: "#222", textAlign: "justify", margin: 0, fontWeight: 600 }}>
                {plan.patient_nome} receberá um plano terapêutico completo, focado no alívio das dores do(a) {(patientData?.areas_afetadas || []).slice(0, 2).join(" e ")}, relaxamento da musculatura e prevenção de novas crises. O tratamento é progressivo, dividido em três etapas bem estruturadas, garantindo resultados duradouros, mais conforto no dia a dia e melhora significativa da qualidade de vida. Fechar o plano terapêutico completo de 24 sessões é o caminho ideal para que {plan.patient_nome} viva sem dor e desfrute de uma vida plena e equilibrada.
              </p>
            </div>
          </>
        }
        </PageWrapper>
      }

      {/* ============ PAGE 3: Fotos Posturais + Avaliação Postural ============ */}
      {hasPostural &&
      <PageWrapper id="plan-page-postural">
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1B3A4B", marginBottom: 6, textAlign: "center" }}>
            Avaliação Postural
          </div>
          <Divider />
          {/* Top: images side by side */}
          <div style={{ display: "flex", gap: 10, marginBottom: 10, justifyContent: "center" }}>
            {planData?.foto_postural_1 &&
          <div style={{ flex: 1, textAlign: "center" }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: "#1B3A4B", margin: "0 0 3px 0" }}>Vista Frontal</p>
                <img src={planData.foto_postural_1} alt="Postural 1" style={{ width: "100%", height: "100mm", objectFit: "contain", borderRadius: 4 }} />
              </div>
          }
            {planData?.foto_postural_2 &&
          <div style={{ flex: 1, textAlign: "center" }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: "#1B3A4B", margin: "0 0 3px 0" }}>Vista Lateral</p>
                <img src={planData.foto_postural_2} alt="Postural 2" style={{ width: "100%", height: "100mm", objectFit: "contain", borderRadius: 4 }} />
              </div>
          }
          </div>
          <Divider />
          {/* Bottom: text side by side */}
          {planData?.avaliacao_postural &&
        <PosturalColumns text={planData.avaliacao_postural} />
        }
        </PageWrapper>
      }

      {/* ============ PAGE 5: Câmera Termal - Fotos ============ */}
      {safeArray(planData?.fotos_camera_termal).length > 0 &&
      <PageWrapper id="plan-page-termal-fotos">
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1B3A4B", marginBottom: 8, textAlign: "center" }}>
            Fotos da Câmera Termal
          </div>
          <Divider />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginTop: 10 }}>
            {safeArray(planData.fotos_camera_termal).map((url, i) =>
          <div key={i} style={{ borderRadius: 6, overflow: "hidden", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", background: "#000", height: 340 }}>
                <img src={url} alt={`Termal ${i + 1}`} style={{ maxWidth: "100%", maxHeight: "100%", display: "block", objectFit: "contain" }} />
              </div>
          )}
          </div>
        </PageWrapper>
      }

      {/* ============ PAGE 6: Análise Câmera Termal ============ */}
      {(planData?.analise_camera_termal || planData?.resultado_camera_termal) &&
      <PageWrapper id="plan-page-termal-analise">
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1B3A4B", marginBottom: 8, textAlign: "center" }}>
            Análise da Câmera Termal
          </div>
          <Divider />
          <ThermalAnalysisText text={planData.analise_camera_termal || planData.resultado_camera_termal} />
        </PageWrapper>
      }

      {/* Fallback */}
      {!planData && plan.plano_completo &&
      <PageWrapper id="plan-page-fallback">
          <pre style={{ fontSize: 11, whiteSpace: "pre-wrap", lineHeight: 1.7, fontFamily: "Arial, sans-serif" }}>
            {plan.plano_completo}
          </pre>
        </PageWrapper>
      }
    </div>);

}