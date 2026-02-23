import React from "react";

// Leaf decoration SVG
function LeafDecor({ position }) {
  const styles = {
    "top-right": { position: "absolute", top: 0, right: 0, width: 120, opacity: 0.18, transform: "rotate(0deg)" },
    "bottom-left": { position: "absolute", bottom: 0, left: 0, width: 100, opacity: 0.14, transform: "rotate(180deg)" },
    "mid-right": { position: "absolute", top: "40%", right: 0, width: 90, opacity: 0.12, transform: "rotate(15deg)" },
  };
  return (
    <svg style={styles[position]} viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M180 10 C160 80, 100 120, 40 200 C80 180, 140 150, 160 80 C140 130, 90 160, 30 240 C70 210, 130 170, 150 90" stroke="#C17F6A" strokeWidth="3" fill="none"/>
      <path d="M160 0 C140 70, 80 110, 20 190" stroke="#C17F6A" strokeWidth="2" fill="none"/>
      <path d="M200 40 C170 90, 120 130, 60 200 C100 175, 155 135, 175 75" stroke="#C17F6A" strokeWidth="2.5" fill="none"/>
      <ellipse cx="80" cy="110" rx="35" ry="20" fill="#C17F6A" transform="rotate(-30 80 110)" opacity="0.4"/>
      <ellipse cx="120" cy="60" rx="28" ry="16" fill="#C17F6A" transform="rotate(-25 120 60)" opacity="0.35"/>
      <ellipse cx="50" cy="170" rx="30" ry="18" fill="#C17F6A" transform="rotate(-35 50 170)" opacity="0.3"/>
    </svg>
  );
}

function PageHeader() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #D1C4B0" }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 130 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 8,
          background: "linear-gradient(135deg, #1B3A4B 0%, #C17F6A 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontWeight: 900, fontSize: 16, fontFamily: "serif"
        }}>V</div>
        <div>
          <div style={{ fontSize: 9, fontWeight: 900, color: "#1B3A4B", letterSpacing: 1, lineHeight: 1.1 }}>VIBE</div>
          <div style={{ fontSize: 9, fontWeight: 900, color: "#1B3A4B", letterSpacing: 1, lineHeight: 1.1 }}>TERAPIAS</div>
          <div style={{ fontSize: 7, color: "#C17F6A", letterSpacing: 0.5, lineHeight: 1.4 }}>Clínica especializada em Dor</div>
        </div>
      </div>

      {/* Title */}
      <div style={{ textAlign: "center", flex: 1, paddingLeft: 20 }}>
        <h1 style={{
          fontSize: 30, fontWeight: 300, color: "#1B3A4B",
          letterSpacing: 3, margin: 0, fontFamily: "'Georgia', 'Times New Roman', serif",
          textTransform: "uppercase"
        }}>
          PLANO TERAPÊUTICO
        </h1>
      </div>

      {/* Contacts */}
      <div style={{ textAlign: "right", minWidth: 130 }}>
        <div style={{ marginBottom: 6, paddingBottom: 6, borderBottom: "1px solid #E5E7EB" }}>
          <div style={{ fontSize: 8, fontWeight: 700, color: "#1B3A4B" }}>LONDRINA/PR</div>
          <div style={{ fontSize: 8, color: "#555", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3 }}>
            <span>⊙</span> (43) 9 8857-4142
          </div>
        </div>
        <div>
          <div style={{ fontSize: 8, fontWeight: 700, color: "#1B3A4B" }}>SÃO PAULO/SP</div>
          <div style={{ fontSize: 8, color: "#555", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3 }}>
            <span>⊙</span> (11) 9 4707-3114
          </div>
        </div>
      </div>
    </div>
  );
}

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

function PageFooter() {
  return (
    <div style={{ marginTop: 32, paddingTop: 16, borderTop: "1px solid #D1C4B0", textAlign: "center" }}>
      <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 4, color: "#1B3A4B", marginBottom: 10, fontFamily: "serif" }}>
        UNIDADES:
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
        {[
          { city: "LONDRINA/PR", addr: "R. ALVARENGA PEIXOTO, 26 – LAGO PARQUE" },
          { city: "SÃO PAULO/SP – (MOEMA)", addr: "AV. ROUXINOL, 1041 – CJ. 601 – 6º ANDAR" },
          { city: "SÃO PAULO/SP – (PAULISTA)", addr: "AV. PAULISTA, 1337 – 15º ANDAR / CJ. 151 – BELA VISTA" },
        ].map((u) => (
          <div key={u.city} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 7.5, fontWeight: 700, color: "#1B3A4B" }}>{u.city}</div>
            <div style={{ fontSize: 7, color: "#777" }}>{u.addr}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PlanDocument({ plan, patientData }) {
  let planData = null;

  // Try to parse JSON plan
  if (plan.plano_completo) {
    try {
      const raw = plan.plano_completo;
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        planData = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {}
  }

  // Helper to safely get array
  const safeArray = (val) => Array.isArray(val) ? val : [];
  const etapas = safeArray(planData?.etapas);

  return (
    <div style={{ fontFamily: "'Arial', 'Helvetica', sans-serif", color: "#222", lineHeight: 1.5 }}>

      {/* ============ PAGE 1 ============ */}
      <div id="plan-page-1" style={{
        background: "white", position: "relative", overflow: "hidden",
        padding: "32px 40px 20px", marginBottom: 24,
        boxShadow: "0 4px 24px rgba(0,0,0,0.12)", borderRadius: 4,
        minHeight: 900
      }}>
        <LeafDecor position="top-right" />
        <LeafDecor position="bottom-left" />

        <PageHeader />

        {/* Title badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#C17F6A", display: "inline-block", flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#1B3A4B", letterSpacing: 0.5 }}>
            PLANO TERAPÊUTICO – VIBE TERAPIAS
          </span>
        </div>

        {/* Patient info */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, lineHeight: 1.8 }}>
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

        <PageFooter />
      </div>

      {/* ============ PAGE 2+ - Etapas ============ */}
      {etapas.map((etapa, ei) => (
        <div key={ei} id={`plan-page-etapa-${ei + 1}`} style={{
          background: "white", position: "relative", overflow: "hidden",
          padding: "32px 40px 20px", marginBottom: 24,
          boxShadow: "0 4px 24px rgba(0,0,0,0.12)", borderRadius: 4,
          minHeight: 700
        }}>
          <LeafDecor position="top-right" />
          <LeafDecor position="mid-right" />

          <PageHeader />

          {/* Etapa Header */}
          <div style={{ marginBottom: 16 }}>
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

          <PageFooter />
        </div>
      ))}

      {/* ============ PAGE RESUMO ============ */}
      {planData?.resumo_final && (
        <div id="plan-page-resumo" style={{
          background: "white", position: "relative", overflow: "hidden",
          padding: "32px 40px 20px", marginBottom: 24,
          boxShadow: "0 4px 24px rgba(0,0,0,0.12)", borderRadius: 4
        }}>
          <LeafDecor position="top-right" />
          <LeafDecor position="bottom-left" />
          <PageHeader />

          <Divider />
          <div style={{ marginBottom: 16 }}>
            <SectionTitle>Resumo do Plano Terapêutico</SectionTitle>
            <p style={{ fontSize: 10.5, lineHeight: 1.8, margin: 0, paddingLeft: 8, textAlign: "justify" }}>
              {planData.resumo_final}
            </p>
          </div>
          <Divider />

          {/* Session progression table */}
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

          <PageFooter />
        </div>
      )}

      {/* Fallback: If no structured data, show raw text */}
      {!planData && plan.plano_completo && (
        <div style={{
          background: "white", padding: "32px 40px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.12)", borderRadius: 4
        }}>
          <PageHeader />
          <pre style={{ fontSize: 11, whiteSpace: "pre-wrap", lineHeight: 1.7, fontFamily: "Arial, sans-serif" }}>
            {plan.plano_completo}
          </pre>
          <PageFooter />
        </div>
      )}
    </div>
  );
}