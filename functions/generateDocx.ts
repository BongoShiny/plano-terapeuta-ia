import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

function esc(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function makeRun(text, { bold = false, size = 20, color = null } = {}) {
  const b = bold ? "<w:b/><w:bCs/>" : "";
  const c = color ? `<w:color w:val="${color}"/>` : "";
  return `<w:r><w:rPr>${b}<w:sz w:val="${size}"/><w:szCs w:val="${size}"/>${c}</w:rPr><w:t xml:space="preserve">${esc(text)}</w:t></w:r>`;
}

function makePara(runs, { align = null, spaceBefore = 0, spaceAfter = 120 } = {}) {
  const jc = align ? `<w:jc w:val="${align}"/>` : "";
  const spacing = `<w:spacing w:before="${spaceBefore}" w:after="${spaceAfter}" w:line="276" w:lineRule="auto"/>`;
  return `<w:p><w:pPr>${spacing}${jc}</w:pPr>${runs}</w:p>`;
}

function makeHeading(text, level = 1) {
  const size = level === 1 ? 28 : 24;
  const color = "1B3A4B";
  return makePara(makeRun(text, { bold: true, size, color }), { spaceBefore: 200, spaceAfter: 100 });
}

function makeTable(headers, rows) {
  const pct = Math.floor(5000 / headers.length);
  const border = `<w:top w:val="single" w:sz="4" w:color="CCCCCC"/><w:left w:val="single" w:sz="4" w:color="CCCCCC"/><w:bottom w:val="single" w:sz="4" w:color="CCCCCC"/><w:right w:val="single" w:sz="4" w:color="CCCCCC"/><w:insideH w:val="single" w:sz="4" w:color="CCCCCC"/><w:insideV w:val="single" w:sz="4" w:color="CCCCCC"/>`;

  function makeCell(text, isHeader = false) {
    const fill = isHeader ? `<w:shd w:val="clear" w:color="auto" w:fill="E0EAF0"/>` : "";
    const p = makePara(makeRun(text, { bold: isHeader, size: 18, color: isHeader ? "1B3A4B" : null }), { spaceAfter: 60 });
    return `<w:tc><w:tcPr><w:tcW w:w="${pct}" w:type="pct"/><w:tcBorders>${border}</w:tcBorders>${fill}<w:tcMar><w:top w:w="60" w:type="dxa"/><w:left w:w="108" w:type="dxa"/><w:bottom w:w="60" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tcMar></w:tcPr>${p}</w:tc>`;
  }

  const headerRow = `<w:tr><w:trPr><w:tblHeader/></w:trPr>${headers.map(h => makeCell(h, true)).join("")}</w:tr>`;
  const dataRows = rows.map(row => `<w:tr>${row.map(c => makeCell(String(c || ""))).join("")}</w:tr>`).join("");

  return `<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/><w:tblBorders>${border}</w:tblBorders><w:tblCellMar><w:top w:w="60" w:type="dxa"/><w:left w:w="108" w:type="dxa"/><w:bottom w:w="60" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${headers.map(() => `<w:gridCol/>`).join("")}</w:tblGrid>${headerRow}${dataRows}</w:tbl>`;
}

function buildDocXml(bodyParts) {
  const body = bodyParts.join("\n") + `\n<w:sectPr><w:pgSz w:w="12240" w:h="15840" w:orient="portrait"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="709" w:footer="709" w:gutter="0"/></w:sectPr>`;
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 wp14"><w:body>${body}</w:body></w:document>`;
}

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

const DOC_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:docDefaults>
    <w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="20"/><w:szCs w:val="20"/><w:lang w:val="pt-BR"/></w:rPr></w:rPrDefault>
    <w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="276" w:lineRule="auto"/></w:pPr></w:pPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>
</w:styles>`;

// Simple ZIP builder without external deps
function u8(str) {
  return new TextEncoder().encode(str);
}

function crc32(buf) {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    table[i] = c;
  }
  let crc = 0xFFFFFFFF;
  for (const byte of buf) crc = table[(crc ^ byte) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function le16(n) { return [(n & 0xff), (n >> 8) & 0xff]; }
function le32(n) { return [(n & 0xff), (n >> 8) & 0xff, (n >> 16) & 0xff, (n >> 24) & 0xff]; }

function buildZip(files) {
  const parts = [];
  const centralDir = [];
  let offset = 0;

  for (const [name, content] of files) {
    const nameBytes = u8(name);
    const data = typeof content === "string" ? u8(content) : content;
    const crc = crc32(data);
    const size = data.length;

    const localHeader = new Uint8Array([
      0x50, 0x4B, 0x03, 0x04, // local file header sig
      0x14, 0x00,             // version needed
      0x00, 0x00,             // general flags
      0x00, 0x00,             // compression (stored)
      0x00, 0x00,             // mod time
      0x00, 0x00,             // mod date
      ...le32(crc),
      ...le32(size),
      ...le32(size),
      ...le16(nameBytes.length),
      0x00, 0x00,             // extra field length
      ...nameBytes,
    ]);

    const cdEntry = new Uint8Array([
      0x50, 0x4B, 0x01, 0x02, // central dir sig
      0x14, 0x00,             // version made by
      0x14, 0x00,             // version needed
      0x00, 0x00,             // flags
      0x00, 0x00,             // compression
      0x00, 0x00,             // mod time
      0x00, 0x00,             // mod date
      ...le32(crc),
      ...le32(size),
      ...le32(size),
      ...le16(nameBytes.length),
      0x00, 0x00,             // extra field length
      0x00, 0x00,             // file comment length
      0x00, 0x00,             // disk number start
      0x00, 0x00,             // int file attrs
      0x00, 0x00, 0x00, 0x00, // ext file attrs
      ...le32(offset),
      ...nameBytes,
    ]);

    parts.push(localHeader, data);
    centralDir.push(cdEntry);
    offset += localHeader.length + data.length;
  }

  const cdStart = offset;
  const cdBytes = centralDir.reduce((a, b) => a + b.length, 0);

  const eocd = new Uint8Array([
    0x50, 0x4B, 0x05, 0x06, // end of central dir sig
    0x00, 0x00,             // disk number
    0x00, 0x00,             // disk with start of central dir
    ...le16(centralDir.length),
    ...le16(centralDir.length),
    ...le32(cdBytes),
    ...le32(cdStart),
    0x00, 0x00,             // comment length
  ]);

  const allParts = [...parts, ...centralDir, eocd];
  const total = allParts.reduce((s, p) => s + p.length, 0);
  const result = new Uint8Array(total);
  let pos = 0;
  for (const p of allParts) { result.set(p, pos); pos += p.length; }
  return result;
}

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

    const safeArr = (v) => Array.isArray(v) ? v : [];
    const parts = [];

    // Header
    parts.push(makePara(makeRun("VIBE TERAPIAS — PLANO TERAPÊUTICO", { bold: true, size: 32, color: "1B3A4B" }), { align: "center", spaceBefore: 0, spaceAfter: 60 }));
    parts.push(makePara(makeRun("Clínica Especializada em Dor", { size: 22, color: "C17F6A" }), { align: "center", spaceAfter: 60 }));
    parts.push(makePara(makeRun("LONDRINA/PR: (43) 9 8857-4142  |  SÃO PAULO/SP: (11) 9 4707-3114", { size: 18, color: "555555" }), { align: "center", spaceAfter: 200 }));

    // Patient
    parts.push(makePara(
      makeRun("Paciente: ", { bold: true, size: 22 }) + makeRun(`${plan.patient_nome || ""}    `, { size: 22 }) +
      makeRun("Terapia Especial: ", { bold: true, size: 22 }) + makeRun(plan.terapia_especial || "", { size: 22 }),
      { spaceAfter: 60 }
    ));
    parts.push(makePara(makeRun("Telefone: ", { bold: true, size: 22 }) + makeRun(plan.patient_telefone || "", { size: 22 }), { spaceAfter: 200 }));

    if (planData) {
      if (planData.resumo_queixas) {
        parts.push(makeHeading("Resumo das Queixas e Dores", 2));
        parts.push(makePara(makeRun(planData.resumo_queixas, { size: 20 }), { align: "both", spaceAfter: 120 }));
      }

      if (planData.resultado_camera_termal) {
        parts.push(makePara(
          makeRun("Resultado da Câmera Termal: ", { bold: true, size: 20, color: "1B3A4B" }) +
          makeRun(planData.resultado_camera_termal, { size: 20 }),
          { spaceAfter: 120 }
        ));
      }

      if (planData.analise_camera_termal) {
        parts.push(makeHeading("Análise da Câmera Termal", 2));
        const paras = planData.analise_camera_termal.split(/\n+/).filter(p => p.trim());
        for (const p of paras) {
          const segs = p.split(/(\[ALERTA\][\s\S]*?\[\/ALERTA\])/g);
          const runs = segs.map(seg => {
            if (seg.startsWith("[ALERTA]")) {
              const content = "⚠ " + seg.replace(/^\[ALERTA\]/, "").replace(/\[\/ALERTA\]$/, "");
              return makeRun(content, { bold: true, size: 20, color: "7B2D00" });
            }
            return makeRun(seg, { size: 20 });
          }).join("");
          if (runs) parts.push(makePara(runs, { align: "both", spaceAfter: 100 }));
        }
      }

      if (safeArr(planData.objetivos_tratamento).length) {
        parts.push(makeHeading("Objetivos do Tratamento", 2));
        for (const obj of safeArr(planData.objetivos_tratamento)) {
          parts.push(makePara(makeRun(`\u2022 ${obj}`, { size: 20 }), { spaceAfter: 60 }));
        }
      }

      if (planData.objetivo_geral) {
        parts.push(makeHeading("Objetivo Geral", 2));
        parts.push(makePara(makeRun(planData.objetivo_geral, { size: 20 }), { align: "both", spaceAfter: 120 }));
      }

      if (planData.explicacao_terapia) {
        parts.push(makeHeading("Explicação da Terapia Especial", 2));
        parts.push(makePara(makeRun(planData.explicacao_terapia, { size: 20 }), { align: "both", spaceAfter: 200 }));
      }

      parts.push(makeHeading("PLANO DE TRATAMENTO E FASES INTEGRADAS", 1));

      for (const etapa of safeArr(planData.etapas)) {
        parts.push(makePara(makeRun(`Etapa ${etapa.numero}: ${etapa.nome}`, { bold: true, size: 24, color: "1B3A4B" }), { spaceBefore: 240, spaceAfter: 120 }));
        if (etapa.objetivo_etapa) {
          parts.push(makePara(makeRun(etapa.objetivo_etapa, { bold: true, size: 20 }), { spaceAfter: 140 }));
        }
        const ciclos = safeArr(etapa.ciclos);
        if (ciclos.length) {
          parts.push(makeTable(
            ["Ciclo", "Objetivo", "Técnicas", "Músculos"],
            ciclos.map(c => [`Ciclo ${c.numero}`, c.objetivo || "", c.tecnicas || "", c.musculos || ""])
          ));
          parts.push(makePara("", { spaceAfter: 200 }));
        }
      }

      if (planData.resumo_final) {
        parts.push(makeHeading("Resumo do Plano Terapêutico", 2));
        parts.push(makePara(makeRun(planData.resumo_final, { size: 20 }), { align: "both", spaceAfter: 200 }));
      }
    } else if (plan.plano_completo) {
      parts.push(makePara(makeRun(plan.plano_completo, { size: 20 })));
    }

    parts.push(makePara("", { spaceBefore: 300 }));
    parts.push(makePara(makeRun("LONDRINA/PR – R. Alvarenga Peixoto, 26  |  SÃO PAULO/SP – Av. Rouxinol, 1041  |  Av. Paulista, 1337", { size: 16, color: "777777" }), { align: "center" }));

    const docXml = buildDocXml(parts);

    const zipBytes = buildZip([
      ["[Content_Types].xml", CONTENT_TYPES],
      ["_rels/.rels", ROOT_RELS],
      ["word/document.xml", docXml],
      ["word/styles.xml", STYLES],
      ["word/_rels/document.xml.rels", DOC_RELS],
    ]);

    const filename = `Plano_Vibe_${(plan.patient_nome || "Paciente").replace(/\s+/g, "_")}.docx`;

    return new Response(zipBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(zipBytes.length),
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});