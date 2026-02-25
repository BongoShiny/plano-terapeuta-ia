import React from "react";

const BG_IMAGE_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699c716b5aaf606ea054cadd/ef18c5b4c_image.png";
const FOOTER_IMAGE_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699c716b5aaf606ea054cadd/ac819d2fc_image.png";

function Divider() {
  return <div style={{ height: 1, background: "#D1C4B0", margin: "14px 0" }} />;
}

function SectionTitle({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: "#1B3A4B", marginBottom: 8 }}>
      {children}
    </div>
  );
}

function DiamondIcon() {
  return <span style={{ color: "#C17F6A", marginRight: 6, fontSize: 12 }}>◆</span>;
}

function CicloBlock({ ciclo }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#1B3A4B", marginBottom: 6 }}>
        <DiamondIcon />Ciclo {ciclo.numero}:
      </div>
      <div style={{ paddingLeft: 4 }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1B3A4B", flexShrink: 0, marginTop: 4 }} />
          <p style={{ fontSize: 10.5, color: "#222", margin: 0, lineHeight: 1.6 }}>
            <strong style={{ color: "#1B3A4B" }}>Objetivo:</strong> {ciclo.objetivo}
          </p>
        </div>
        <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1B3A4B", flexShrink: 0, marginTop: 4 }} />
          <p style={{ fontSize: 10.5, color: "#222", margin: 0, lineHeight: 1.6 }}>
            <strong style={{ color: "#1B3A4B" }}>Técnicas aplicadas:</strong>{" "}
            <span dangerouslySetInnerHTML={{ __html: ciclo.tecnicas.replace(/Liberação Miofascial/g, '<strong style="color:#1B3A4B">Liberação Miofascial</strong>').replace(/Dry Needling/g, '<strong>Dry Needling</strong>').replace(/caso o cliente aprove/g, '<em>caso o cliente aprove</em>') }} />
          </p>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1B3A4B", flexShrink: 0, marginTop: 4 }} />
          <p style={{ fontSize: 10.5, color: "#222", margin: 0, lineHeight: 1.6 }}>
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
    backgroundImage: `url(${BG_IMAGE_URL})`,
    backgroundSize: "100% 100%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "top center",
    backgroundColor: "#ffffff",
    marginBottom: 24,
    borderRadius: 0,
    width: "210mm",
    height: "297mm",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
  };

  // Content area: top padding accounts for header bar, bottom stops before footer image
  const contentStyle = {
    flex: 1,
    padding: "54mm 18mm 40mm 18mm",
  };

  return (
    <div style={{ fontFamily: "'Arial', 'Helvetica', sans-serif", color: "#222", lineHeight: 1.5 }}>

      {/* ============ PAGE 1 ============ */}
      <div id="plan-page-1" style={pageStyle}>
        <img src={FOOTER_IMAGE_URL} alt="" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", display: "block" }} />
        <div style={contentStyle}>

          {/* Patient info */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, lineHeight: 1.2 }}>
              <span style={{ fontWeight: 700 }}>Paciente: </span>{plan.patient_nome}<br />
              <span style={{ fontWeight: 700 }}>Sexo: </span>{patientData?.sexo || "–"}<br />
              <span style={{ fontWeight: 700 }}>Telefone: </span>{plan.patient_telefone}<br />
              <span style={{ fontWeight: 700 }}>Terapia Especial: </span>{plan.terapia_especial}
            </div>
          </div>

          <Divider />

          {/* Resumo das queixas */}
          <div style={{ marginBottom: 14 }}>
            <SectionTitle>Resumo das Queixas, Dores e Áreas Afetadas</SectionTitle>
            <p style={{ fontSize: 10.5, lineHeight: 1.7, margin: 0, paddingLeft: 8, textAlign: "justify" }}>
              {planData?.resumo_queixas || patientData?.queixas_principais || "–"}
            </p>
          </div>

          {planData?.resultado_camera_termal && (
            <>
              <div style={{ marginBottom: 14 }}>
                <SectionTitle>Resultado da Avaliação com a câmera termal:</SectionTitle>
                <p style={{ fontSize: 10.5, lineHeight: 1.7, margin: 0, paddingLeft: 8, textAlign: "justify" }}>
                  {planData.resultado_camera_termal}
                </p>
              </div>
              <Divider />
            </>
          )}

          {/* Objetivos */}
          {safeArray(planData?.objetivos_tratamento).length > 0 && (
            <>
              <Divider />
              <div style={{ marginBottom: 14 }}>
                <SectionTitle>Objetivos do Tratamento</SectionTitle>
                <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
                  {safeArray(planData?.objetivos_tratamento).map((obj, i) => (
                    <li key={i} style={{ display: "flex", gap: 8, fontSize: 10.5, marginBottom: 5, lineHeight: 1.5 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1B3A4B", flexShrink: 0, marginTop: 4 }} />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          <Divider />

          {/* Objetivo Geral */}
          {planData?.objetivo_geral && (
            <>
              <div style={{ marginBottom: 14 }}>
                <SectionTitle>Objetivo Geral do Tratamento</SectionTitle>
                <p style={{ fontSize: 10.5, lineHeight: 1.7, margin: 0, paddingLeft: 8, textAlign: "justify" }}>
                  {planData.objetivo_geral}
                </p>
              </div>
              <Divider />
            </>
          )}

          {/* Explicação da Terapia */}
          {planData?.explicacao_terapia && (
            <div style={{ marginBottom: 14 }}>
              <SectionTitle>Explicação da Terapia Especial</SectionTitle>
              <p style={{ fontSize: 10.5, lineHeight: 1.7, margin: 0, paddingLeft: 8, textAlign: "justify" }}>
                {planData.explicacao_terapia}
              </p>
            </div>
          )}

        </div>
      </div>

      {/* ============ PAGE 2+ - Etapas ============ */}
      {etapas.map((etapa, ei) => (
        <div key={ei} id={`plan-page-etapa-${ei + 1}`} style={pageStyle}>
          <img src={FOOTER_IMAGE_URL} alt="" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", display: "block" }} />
          <div style={contentStyle}>

            <div style={{ textAlign: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#1B3A4B" }}>
                Etapa {etapa.numero}: {etapa.nome}
              </span>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "#1B3A4B", marginBottom: 4 }}>Objetivo:</div>
              <div style={{
                fontSize: 11, fontWeight: 700, color: "#1B3A4B", lineHeight: 1.6,
                textTransform: "uppercase", paddingLeft: 16
              }}>
                {etapa.objetivo_etapa}
              </div>
            </div>

            <Divider />

            <div style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#1B3A4B", marginBottom: 10 }}>Intervenções</div>
              {safeArray(etapa.ciclos).map((ciclo, ci) => (
                <CicloBlock key={ci} ciclo={ciclo} />
              ))}
            </div>

          </div>
        </div>
      ))}

      {/* ============ PAGE RESUMO ============ */}
      {planData?.resumo_final && (
        <div id="plan-page-resumo" style={pageStyle}>
          <img src={FOOTER_IMAGE_URL} alt="" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", display: "block" }} />
          <div style={contentStyle}>

            <Divider />
            <div style={{ marginBottom: 16 }}>
              <SectionTitle>Resumo do Plano Terapêutico</SectionTitle>
              <p style={{ fontSize: 10.5, lineHeight: 1.8, margin: 0, paddingLeft: 8, textAlign: "justify" }}>
                {planData.resumo_final}
              </p>
            </div>
            <Divider />

            <div style={{ marginTop: 20 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
                <thead>
                  <tr style={{ background: "#1B3A4B", color: "white" }}>
                    <th style={{ padding: "8px 12px", textAlign: "left" }}>Plano</th>
                    <th style={{ padding: "8px 12px", textAlign: "left" }}>Fases Incluídas</th>
                    <th style={{ padding: "8px 12px", textAlign: "left" }}>Intervalo entre Sessões</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { plano: "05 sessões", fases: "Etapa 1 e início da Etapa 2", intervalo: "3 a 4 dias (iniciais), depois 4 a 6 dias" },
                    { plano: "10 sessões", fases: "Etapas 1, 2 e início da Etapa 3", intervalo: "3 a 4 dias (iniciais), depois 4 a 6 dias, seguido por 7 dias" },
                    { plano: "24 sessões", fases: "Todas as etapas até a Transformação", intervalo: "3 a 4 dias (iniciais), depois 4 a 6 dias, seguido por 7 dias" },
                  ].map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? "#F9F7F5" : "white" }}>
                      <td style={{ padding: "8px 12px", fontWeight: 700, color: "#1B3A4B" }}>{row.plano}</td>
                      <td style={{ padding: "8px 12px" }}>{row.fases}</td>
                      <td style={{ padding: "8px 12px" }}>{row.intervalo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* Fallback */}
      {!planData && plan.plano_completo && (
        <div style={pageStyle}>
          <img src={FOOTER_IMAGE_URL} alt="" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", display: "block" }} />
          <div style={contentStyle}>
            <pre style={{ fontSize: 11, whiteSpace: "pre-wrap", lineHeight: 1.7, fontFamily: "Arial, sans-serif" }}>
              {plan.plano_completo}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}