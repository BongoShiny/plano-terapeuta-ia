import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, PageBreak, Tab } from 'npm:docx@9.0.2';

function trunc(text, max) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max).trimEnd() + "..." : text;
}

function safeArr(v) { return Array.isArray(v) ? v : []; }

function makeBulletParagraph(text, options = {}) {
  return new Paragraph({
    children: [
      new TextRun({ text: "•  " + text, size: 19, font: "Calibri", ...options }),
    ],
    spacing: { before: 0, after: 50, line: 260 },
    indent: { left: 580, hanging: 300 },
  });
}

function makeHeadingParagraph(text, level = 2) {
  const size = level === 1 ? 26 : 21;
  return new Paragraph({
    children: [
      new TextRun({ text, bold: true, size, color: "1B3A4B", font: "Calibri" }),
    ],
    spacing: { before: level === 1 ? 200 : 140, after: 60, line: 260 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, space: 3, color: "D1C4B0" },
    },
  });
}

function makeBodyParagraph(text, maxChars = 480) {
  const firstPara = (text || "").split(/\n+/).find(p => p.trim()) || "";
  const truncated = trunc(firstPara, maxChars);
  return new Paragraph({
    children: [
      new TextRun({ text: truncated, size: 19, font: "Calibri" }),
    ],
    spacing: { before: 0, after: 80, line: 260 },
    indent: { left: 480 },
    alignment: AlignmentType.JUSTIFIED,
  });
}

function makeCicloParagraph(ciclo) {
  const children = [
    new TextRun({ text: `● Ciclo ${ciclo.numero}: `, bold: true, size: 18, color: "C17F6A", font: "Calibri" }),
    new TextRun({ text: ciclo.objetivo || "", size: 17, font: "Calibri" }),
  ];
  if (ciclo.tecnicas) {
    children.push(new TextRun({ text: ` | ${ciclo.tecnicas}`, size: 17, color: "444444", font: "Calibri" }));
  }
  if (ciclo.musculos) {
    children.push(new TextRun({ text: ` | ${ciclo.musculos}`, size: 17, color: "666666", font: "Calibri" }));
  }
  return new Paragraph({
    children,
    spacing: { before: 40, after: 30, line: 240 },
    indent: { left: 360, hanging: 220 },
    alignment: AlignmentType.JUSTIFIED,
  });
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const { planId } = await req.json();
    const plans = await base44.asServiceRole.entities.TherapeuticPlan.filter({ id: planId });
    if (!plans.length) return Response.json({ error: 'Plan not found' }, { status: 404 });
    const plan = plans[0];

    let patientData = null;
    if (plan.patient_id) {
      const patients = await base44.asServiceRole.entities.Patient.filter({ id: plan.patient_id });
      if (patients.length) patientData = patients[0];
    }

    let planData = null;
    if (plan.plano_completo) {
      try {
        const jsonMatch = plan.plano_completo.match(/\{[\s\S]*\}/);
        if (jsonMatch) planData = JSON.parse(jsonMatch[0]);
      } catch (_e) {}
    }

    const sections = [];

    // ── PAGE 1: Info + Resumos ──
    const page1Children = [];

    // Title
    page1Children.push(new Paragraph({
      children: [
        new TextRun({ text: "● ", bold: true, size: 24, color: "C17F6A", font: "Calibri" }),
        new TextRun({ text: "PLANO TERAPÊUTICO – VIBE TERAPIAS", bold: true, size: 24, color: "1B3A4B", font: "Calibri" }),
      ],
      spacing: { before: 0, after: 120 },
    }));

    // Patient info
    const infoRows = [
      ["Paciente: ", plan.patient_nome || ""],
      ["Sexo: ", patientData?.sexo || ""],
      ["Telefone: ", plan.patient_telefone || ""],
      ["Terapia Especial: ", plan.terapia_especial || ""],
    ];
    for (const [label, val] of infoRows) {
      page1Children.push(new Paragraph({
        children: [
          new TextRun({ text: label, bold: true, size: 19, font: "Calibri" }),
          new TextRun({ text: val, size: 19, font: "Calibri" }),
        ],
        spacing: { after: 30 },
      }));
    }
    page1Children.push(new Paragraph({ children: [], spacing: { after: 40 } }));

    if (planData) {
      if (planData.resumo_queixas) {
        page1Children.push(makeHeadingParagraph("Resumo das Queixas, Dores e Áreas Afetadas", 2));
        page1Children.push(makeBodyParagraph(planData.resumo_queixas, 520));
      }

      const termalText = planData.resultado_camera_termal || planData.analise_camera_termal;
      if (termalText) {
        page1Children.push(makeHeadingParagraph("Resultado da Avaliação com a câmera termal:", 2));
        page1Children.push(makeBodyParagraph(termalText, 480));
      }

      if (safeArr(planData.objetivos_tratamento).length) {
        page1Children.push(makeHeadingParagraph("Objetivos do Tratamento", 2));
        for (const obj of safeArr(planData.objetivos_tratamento)) {
          page1Children.push(makeBulletParagraph(trunc(obj, 120)));
        }
        page1Children.push(new Paragraph({ children: [], spacing: { after: 40 } }));
      }

      if (planData.objetivo_geral) {
        page1Children.push(makeHeadingParagraph("Objetivo Geral do Tratamento", 2));
        page1Children.push(makeBodyParagraph(planData.objetivo_geral, 400));
      }

      if (planData.explicacao_terapia) {
        page1Children.push(makeHeadingParagraph("Explicação da Terapia Especial", 2));
        page1Children.push(makeBodyParagraph(planData.explicacao_terapia, 420));
      }

      // ── Etapas ──
      const etapas = safeArr(planData.etapas);

      if (etapas.length > 0) {
        // Page break before etapas
        page1Children.push(new Paragraph({ children: [new PageBreak()] }));

        // Etapas 1 and 2
        const etapas12 = etapas.slice(0, 2);
        for (const etapa of etapas12) {
          page1Children.push(new Paragraph({
            children: [
              new TextRun({ text: `Etapa ${etapa.numero}: ${etapa.nome}`, bold: true, size: 21, color: "1B3A4B", font: "Calibri" }),
            ],
            spacing: { before: 100, after: 40, line: 240 },
          }));

          if (etapa.objetivo_etapa) {
            page1Children.push(new Paragraph({
              children: [
                new TextRun({ text: "Objetivo: ", bold: true, size: 18, color: "1B3A4B", font: "Calibri" }),
                new TextRun({ text: trunc(etapa.objetivo_etapa, 200), bold: true, size: 17, font: "Calibri" }),
              ],
              spacing: { before: 20, after: 30, line: 240 },
              indent: { left: 300 },
            }));
          }

          page1Children.push(new Paragraph({
            children: [
              new TextRun({ text: "Intervenções", bold: true, size: 19, color: "1B3A4B", font: "Calibri" }),
            ],
            spacing: { before: 30, after: 20, line: 240 },
          }));

          for (const ciclo of safeArr(etapa.ciclos)) {
            page1Children.push(makeCicloParagraph(ciclo));
          }
          page1Children.push(new Paragraph({ children: [], spacing: { after: 60 } }));
        }

        // Etapa 3
        if (etapas.length > 2) {
          page1Children.push(new Paragraph({ children: [new PageBreak()] }));

          const etapa3 = etapas[2];
          page1Children.push(new Paragraph({
            children: [
              new TextRun({ text: `Etapa ${etapa3.numero}: ${etapa3.nome}`, bold: true, size: 21, color: "1B3A4B", font: "Calibri" }),
            ],
            spacing: { before: 80, after: 40, line: 240 },
          }));

          if (etapa3.objetivo_etapa) {
            page1Children.push(new Paragraph({
              children: [
                new TextRun({ text: "Objetivo: ", bold: true, size: 18, color: "1B3A4B", font: "Calibri" }),
                new TextRun({ text: trunc(etapa3.objetivo_etapa, 200), bold: true, size: 17, font: "Calibri" }),
              ],
              spacing: { before: 20, after: 30, line: 240 },
              indent: { left: 300 },
            }));
          }

          page1Children.push(new Paragraph({
            children: [
              new TextRun({ text: "Intervenções", bold: true, size: 19, color: "1B3A4B", font: "Calibri" }),
            ],
            spacing: { before: 30, after: 20, line: 240 },
          }));

          for (const ciclo of safeArr(etapa3.ciclos)) {
            page1Children.push(makeCicloParagraph(ciclo));
          }

          if (planData.resumo_final) {
            page1Children.push(new Paragraph({ children: [], spacing: { after: 60 } }));
            page1Children.push(makeHeadingParagraph("Resumo do Plano Terapêutico", 2));
            page1Children.push(makeBodyParagraph(planData.resumo_final, 420));
          }
        }
      }
    } else if (plan.plano_completo) {
      page1Children.push(new Paragraph({
        children: [new TextRun({ text: plan.plano_completo, size: 19, font: "Calibri" })],
      }));
    }

    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: { top: 1440, right: 720, bottom: 1440, left: 720 },
          },
        },
        children: page1Children,
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    const uint8 = new Uint8Array(buffer);

    const filename = `Plano_Vibe_${(plan.patient_nome || "Paciente").replace(/\s+/g, "_")}.docx`;

    return new Response(uint8, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(uint8.length),
      },
    });
  } catch (error) {
    console.error("generateDocx error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});