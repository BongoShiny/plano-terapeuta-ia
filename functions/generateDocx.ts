import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType } from 'npm:docx@7.8.2';

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

    const children = [];

    // ---- CABEÇALHO ----
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "VIBE TERAPIAS - PLANO TERAPÊUTICO", bold: true, size: 32, color: "1B3A4B" })],
        spacing: { after: 80 },
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Clínica Especializada em Dor", size: 22, color: "C17F6A" })],
        spacing: { after: 60 },
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "LONDRINA/PR: (43) 9 8857-4142  |  SÃO PAULO/SP: (11) 9 4707-3114", size: 18, color: "555555" })],
        spacing: { after: 200 },
      }),
    );

    // ---- DADOS DO PACIENTE ----
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Paciente: ", bold: true, size: 22 }),
          new TextRun({ text: `${plan.patient_nome}    `, size: 22 }),
          new TextRun({ text: "Terapia Especial: ", bold: true, size: 22 }),
          new TextRun({ text: plan.terapia_especial || "", size: 22 }),
        ],
        spacing: { after: 60 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Telefone: ", bold: true, size: 22 }),
          new TextRun({ text: plan.patient_telefone || "", size: 22 }),
        ],
        spacing: { after: 200 },
      }),
    );

    if (planData) {
      // ---- RESUMO QUEIXAS ----
      if (planData.resumo_queixas) {
        children.push(
          new Paragraph({ text: "Resumo das Queixas e Dores", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
          new Paragraph({ children: [new TextRun({ text: planData.resumo_queixas, size: 20 })], spacing: { after: 120 } }),
        );
      }

      // ---- CÂMERA TERMAL ----
      if (planData.resultado_camera_termal) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: "Resultado da Câmera Termal: ", bold: true, size: 20 }),
              new TextRun({ text: planData.resultado_camera_termal, size: 20 }),
            ],
            spacing: { after: 120 },
          }),
        );
      }

      // ---- ANÁLISE CÂMERA TERMAL ----
      if (planData.analise_camera_termal) {
        children.push(
          new Paragraph({ text: "Análise da Câmera Termal", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
        );
        // Parse [ALERTA]...[/ALERTA] blocks
        const analiseText = planData.analise_camera_termal;
        const paragraphs = analiseText.split(/\n+/).filter(p => p.trim());
        for (const para of paragraphs) {
          const parts = para.split(/(\[ALERTA\][\s\S]*?\[\/ALERTA\])/g);
          const runs = parts.map(part => {
            if (part.startsWith("[ALERTA]")) {
              const content = "⚠ " + part.replace(/^\[ALERTA\]/, "").replace(/\[\/ALERTA\]$/, "");
              return new TextRun({ text: content, bold: true, size: 20, color: "7B2D00" });
            }
            return new TextRun({ text: part, size: 20 });
          });
          children.push(new Paragraph({ children: runs, spacing: { after: 100 } }));
        }
      }

      // ---- OBJETIVOS ----
      if (safeArray(planData.objetivos_tratamento).length) {
        children.push(
          new Paragraph({ text: "Objetivos do Tratamento", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
        );
        for (const obj of safeArray(planData.objetivos_tratamento)) {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: `• ${obj}`, size: 20 })],
              spacing: { after: 60 },
            }),
          );
        }
      }

      // ---- OBJETIVO GERAL ----
      if (planData.objetivo_geral) {
        children.push(
          new Paragraph({ text: "Objetivo Geral", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
          new Paragraph({ children: [new TextRun({ text: planData.objetivo_geral, size: 20 })], spacing: { after: 120 } }),
        );
      }

      // ---- EXPLICAÇÃO TERAPIA ----
      if (planData.explicacao_terapia) {
        children.push(
          new Paragraph({ text: "Explicação da Terapia Especial", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
          new Paragraph({ children: [new TextRun({ text: planData.explicacao_terapia, size: 20 })], spacing: { after: 200 } }),
        );
      }

      // ---- ETAPAS ----
      children.push(
        new Paragraph({ text: "PLANO DE TRATAMENTO E FASES INTEGRADAS", heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 200 } }),
      );

      for (const etapa of safeArray(planData.etapas)) {
        children.push(
          new Paragraph({
            text: `Etapa ${etapa.numero}: ${etapa.nome}`,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 120 },
          }),
          new Paragraph({
            children: [new TextRun({ text: etapa.objetivo_etapa || "", size: 20, bold: true })],
            spacing: { after: 140 },
          }),
        );

        const headerRow = new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Ciclo", bold: true, size: 20 })] })], width: { size: 20, type: WidthType.PERCENTAGE } }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Objetivo", bold: true, size: 20 })] })], width: { size: 30, type: WidthType.PERCENTAGE } }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Técnicas", bold: true, size: 20 })] })], width: { size: 25, type: WidthType.PERCENTAGE } }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Músculos", bold: true, size: 20 })] })], width: { size: 25, type: WidthType.PERCENTAGE } }),
          ],
          tableHeader: true,
        });

        const dataRows = safeArray(etapa.ciclos).map((ciclo) =>
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `Ciclo ${ciclo.numero}`, size: 18 })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: ciclo.objetivo || "", size: 18 })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: ciclo.tecnicas || "", size: 18 })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: ciclo.musculos || "", size: 18 })] })] }),
            ],
          })
        );

        children.push(
          new Table({
            rows: [headerRow, ...dataRows],
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),
          new Paragraph({ text: "", spacing: { after: 200 } }),
        );
      }

      // ---- RESUMO FINAL ----
      if (planData.resumo_final) {
        children.push(
          new Paragraph({ text: "Resumo do Plano Terapêutico", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
          new Paragraph({ children: [new TextRun({ text: planData.resumo_final, size: 20 })], spacing: { after: 200 } }),
        );
      }
    } else if (plan.plano_completo) {
      children.push(
        new Paragraph({ children: [new TextRun({ text: plan.plano_completo, size: 20 })] }),
      );
    }

    // ---- RODAPÉ ----
    children.push(
      new Paragraph({ text: "", spacing: { before: 300 } }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "LONDRINA/PR – R. Alvarenga Peixoto, 26  |  SÃO PAULO/SP – Av. Rouxinol, 1041  |  Av. Paulista, 1337", size: 16, color: "777777" })],
      }),
    );

    const doc = new Document({ sections: [{ children }] });
    const buffer = await Packer.toBuffer(doc);

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="Plano_Vibe_${plan.patient_nome || 'Paciente'}.docx"`,
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});