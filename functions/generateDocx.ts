import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { zipSync, strToU8 } from 'npm:fflate@0.8.2';

function esc(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function para(text, { bold = false, size = 20, color = "000000", align = "left", spaceBefore = 0, spaceAfter = 100, heading = null } = {}) {
  const style = heading ? `<w:pStyle w:val="${heading}"/>` : "";
  const spacing = `<w:spacing w:before="${spaceBefore}" w:after="${spaceAfter}"/>`;
  const jc = align === "center" ? `<w:jc w:val="center"/>` : align === "both" ? `<w:jc w:val="both"/>` : "";
  const rpr = `<w:rPr>${bold ? "<w:b/>" : ""}<w:sz w:val="${size}"/><w:color w:val="${color}"/></w:rPr>`;
  return `<w:p><w:pPr>${style}${spacing}${jc}</w:pPr><w:r>${rpr}<w:t xml:space="preserve">${esc(text)}</w:t></w:r></w:p>`;
}

function paraRuns(runs, { align = "left", spaceBefore = 0, spaceAfter = 100 } = {}) {
  const jc = align === "center" ? `<w:jc w:val="center"/>` : align === "both" ? `<w:jc w:val="both"/>` : "";
  const spacing = `<w:spacing w:before="${spaceBefore}" w:after="${spaceAfter}"/>`;
  const runsXml = runs.map(r => {
    const rpr = `<w:rPr>${r.bold ? "<w:b/>" : ""}<w:sz w:val="${r.size || 20}"/><w:color w:val="${r.color || "000000"}"/></w:rPr>`;
    return `<w:r>${rpr}<w:t xml:space="preserve">${esc(r.text)}</w:t></w:r>`;
  }).join("");
  return `<w:p><w:pPr>${spacing}${jc}</w:pPr>${runsXml}</w:p>`;
}

function tableXml(headers, rows) {
  const borderProps = `<w:top w:val="single" w:sz="4" w:space="0" w:color="AAAAAA"/>
    <w:left w:val="single" w:sz="4" w:space="0" w:color="AAAAAA"/>
    <w:bottom w:val="single" w:sz="4" w:space="0" w:color="AAAAAA"/>
    <w:right w:val="single" w:sz="4" w:space="0" w:color="AAAAAA"/>
    <w:insideH w:val="single" w:sz="4" w:space="0" w:color="AAAAAA"/>
    <w:insideV w:val="single" w:sz="4" w:space="0" w:color="AAAAAA"/>`;

  const cellW = Math.floor(9000 / headers.length);

  function cell(text, bold = false, shade = false) {
    const fill = shade ? `<w:shd w:val="clear" w:color="auto" w:fill="E8F0F5"/>` : "";
    return `<w:tc>
      <w:tcPr><w:tcW w:w="${cellW}" w:type="dxa"/><w:tcBorders>${borderProps}</w:tcBorders>${fill}</w:tcPr>
      <w:p><w:pPr><w:spacing w:after="60"/></w:pPr><w:r><w:rPr>${bold ? "<w:b/>" : ""}<w:sz w:val="18"/></w:rPr><w:t xml:space="preserve">${esc(text)}</w:t></w:r></w:p>
    </w:tc>`;
  }

  const headerRow = `<w:tr>${headers.map(h => cell(h, true, true)).join("")}</w:tr>`;
  const dataRows = rows.map(row => `<w:tr>${row.map(c => cell(c)).join("")}</w:tr>`).join("");

  return `<w:tbl>
    <w:tblPr>
      <w:tblW w:w="9000" w:type="dxa"/>
      <w:tblBorders>${borderProps}</w:tblBorders>
    </w:tblPr>
    ${headerRow}${dataRows}
  </w:tbl>`;
}

function buildDocumentXml(bodyContent) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
  xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing"
  xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
  xmlns:w10="urn:schemas-microsoft-com:office:word"
  xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
  xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup"
  xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk"
  xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml"
  xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"
  mc:Ignorable="w14 wp14">
  <w:body>
    ${bodyContent}
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>`;
}

const RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:rPr><w:sz w:val="20"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:basedOn w:val="Normal"/>
    <w:pPr><w:spacing w:before="240" w:after="120"/></w:pPr>
    <w:rPr><w:b/><w:sz w:val="28"/><w:color w:val="1B3A4B"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/>
    <w:basedOn w:val="Normal"/>
    <w:pPr><w:spacing w:before="200" w:after="100"/></w:pPr>
    <w:rPr><w:b/><w:sz w:val="24"/><w:color w:val="1B3A4B"/></w:rPr>
  </w:style>
</w:styles>`;

const CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`;

const ROOT_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { planId } = await req.json();
    const plans = await base44.entities.TherapeuticPlan.filter({ id: planId });
    if (!plans.length) return Response.json({ error: 'Plan not found' }, { status: 404 });
    const plan = plans[0];

    let planData = null;
    if (plan.plano_completo) {
      try {
        const jsonMatch = plan.plano_completo.match(/\{[\s\S]*\}/);
        if (jsonMatch) planData = JSON.parse(jsonMatch[0]);
      } catch (e) {}
    }

    const safeArray = (v) => Array.isArray(v) ? v : [];
    const parts = [];

    // Header
    parts.push(para("VIBE TERAPIAS — PLANO TERAPÊUTICO", { bold: true, size: 32, color: "1B3A4B", align: "center", spaceAfter: 60 }));
    parts.push(para("Clínica Especializada em Dor", { size: 22, color: "C17F6A", align: "center", spaceAfter: 60 }));
    parts.push(para("LONDRINA/PR: (43) 9 8857-4142  |  SÃO PAULO/SP: (11) 9 4707-3114", { size: 18, color: "555555", align: "center", spaceAfter: 200 }));

    // Patient info
    parts.push(paraRuns([
      { text: "Paciente: ", bold: true, size: 22 },
      { text: `${plan.patient_nome || ""}    `, size: 22 },
      { text: "Terapia Especial: ", bold: true, size: 22 },
      { text: plan.terapia_especial || "", size: 22 },
    ], { spaceAfter: 60 }));
    parts.push(paraRuns([
      { text: "Telefone: ", bold: true, size: 22 },
      { text: plan.patient_telefone || "", size: 22 },
    ], { spaceAfter: 200 }));

    if (planData) {
      if (planData.resumo_queixas) {
        parts.push(para("Resumo das Queixas e Dores", { bold: true, size: 24, color: "1B3A4B", spaceBefore: 200, spaceAfter: 100 }));
        parts.push(para(planData.resumo_queixas, { size: 20, align: "both", spaceAfter: 120 }));
      }

      if (planData.resultado_camera_termal) {
        parts.push(paraRuns([
          { text: "Resultado da Câmera Termal: ", bold: true, size: 20, color: "1B3A4B" },
          { text: planData.resultado_camera_termal, size: 20 },
        ], { spaceAfter: 120 }));
      }

      if (planData.analise_camera_termal) {
        parts.push(para("Análise da Câmera Termal", { bold: true, size: 24, color: "1B3A4B", spaceBefore: 200, spaceAfter: 100 }));
        const paragraphs = planData.analise_camera_termal.split(/\n+/).filter(p => p.trim());
        for (const paragraph of paragraphs) {
          const segments = paragraph.split(/(\[ALERTA\][\s\S]*?\[\/ALERTA\])/g);
          const runs = segments.map(seg => {
            if (seg.startsWith("[ALERTA]")) {
              const content = "⚠ " + seg.replace(/^\[ALERTA\]/, "").replace(/\[\/ALERTA\]$/, "");
              return { text: content, bold: true, size: 20, color: "7B2D00" };
            }
            return { text: seg, size: 20 };
          }).filter(r => r.text);
          if (runs.length) parts.push(paraRuns(runs, { align: "both", spaceAfter: 100 }));
        }
      }

      if (safeArray(planData.objetivos_tratamento).length) {
        parts.push(para("Objetivos do Tratamento", { bold: true, size: 24, color: "1B3A4B", spaceBefore: 200, spaceAfter: 100 }));
        for (const obj of safeArray(planData.objetivos_tratamento)) {
          parts.push(para(`• ${obj}`, { size: 20, spaceAfter: 60 }));
        }
      }

      if (planData.objetivo_geral) {
        parts.push(para("Objetivo Geral", { bold: true, size: 24, color: "1B3A4B", spaceBefore: 200, spaceAfter: 100 }));
        parts.push(para(planData.objetivo_geral, { size: 20, align: "both", spaceAfter: 120 }));
      }

      if (planData.explicacao_terapia) {
        parts.push(para("Explicação da Terapia Especial", { bold: true, size: 24, color: "1B3A4B", spaceBefore: 200, spaceAfter: 100 }));
        parts.push(para(planData.explicacao_terapia, { size: 20, align: "both", spaceAfter: 200 }));
      }

      parts.push(para("PLANO DE TRATAMENTO E FASES INTEGRADAS", { bold: true, size: 28, color: "1B3A4B", spaceBefore: 300, spaceAfter: 200 }));

      for (const etapa of safeArray(planData.etapas)) {
        parts.push(para(`Etapa ${etapa.numero}: ${etapa.nome}`, { bold: true, size: 24, color: "1B3A4B", spaceBefore: 240, spaceAfter: 120 }));
        parts.push(para(etapa.objetivo_etapa || "", { bold: true, size: 20, spaceAfter: 140 }));

        const ciclos = safeArray(etapa.ciclos);
        if (ciclos.length) {
          parts.push(tableXml(
            ["Ciclo", "Objetivo", "Técnicas", "Músculos"],
            ciclos.map(c => [`Ciclo ${c.numero}`, c.objetivo || "", c.tecnicas || "", c.musculos || ""])
          ));
          parts.push(para("", { spaceAfter: 200 }));
        }
      }

      if (planData.resumo_final) {
        parts.push(para("Resumo do Plano Terapêutico", { bold: true, size: 24, color: "1B3A4B", spaceBefore: 200, spaceAfter: 100 }));
        parts.push(para(planData.resumo_final, { size: 20, align: "both", spaceAfter: 200 }));
      }
    } else if (plan.plano_completo) {
      parts.push(para(plan.plano_completo, { size: 20 }));
    }

    // Footer
    parts.push(para("", { spaceBefore: 300 }));
    parts.push(para("LONDRINA/PR – R. Alvarenga Peixoto, 26  |  SÃO PAULO/SP – Av. Rouxinol, 1041  |  Av. Paulista, 1337", { size: 16, color: "777777", align: "center" }));

    const documentXml = buildDocumentXml(parts.join("\n"));

    const zipData = zipSync({
      "[Content_Types].xml": strToU8(CONTENT_TYPES),
      "_rels/.rels": strToU8(ROOT_RELS),
      "word/document.xml": strToU8(documentXml),
      "word/styles.xml": strToU8(STYLES),
      "word/_rels/document.xml.rels": strToU8(RELS),
    });

    const filename = `Plano_Vibe_${(plan.patient_nome || "Paciente").replace(/\s+/g, "_")}.docx`;

    return new Response(zipData, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});