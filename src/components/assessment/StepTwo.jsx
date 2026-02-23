import React from "react";

const AREAS = [
  "Pescoço / Cervical", "Cabeça / Crânio", "Ombros", "Braços / Membros Superiores",
  "Coluna Torácica", "Lombar / Coluna Lombar", "Quadril / Glúteos",
  "Pernas / Membros Inferiores", "Joelhos", "Pés / Tornozelos",
  "Abdômen", "Mandíbula / ATM", "Costas (geral)", "Corpo todo",
];

const TEMPOS = [
  "Menos de 1 mês", "1 a 3 meses", "3 a 6 meses",
  "6 meses a 1 ano", "1 a 2 anos", "Mais de 2 anos",
];

function DorSlider({ value, onChange }) {
  const getColor = (val) => {
    if (val <= 3) return "#22C55E";
    if (val <= 5) return "#F59E0B";
    if (val <= 7) return "#F97316";
    return "#EF4444";
  };
  const getLabel = (val) => {
    if (val === 0) return "Sem dor";
    if (val <= 3) return "Dor leve";
    if (val <= 5) return "Dor moderada";
    if (val <= 7) return "Dor intensa";
    return "Dor muito intensa";
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold" style={{ color: "#374151" }}>Intensidade da dor *</span>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold" style={{ color: getColor(value || 0) }}>
            {value || 0}
          </span>
          <span className="text-sm font-medium" style={{ color: getColor(value || 0) }}>
            {getLabel(value || 0)}
          </span>
        </div>
      </div>
      <input
        type="range"
        min="0"
        max="10"
        value={value || 0}
        onChange={(e) => onChange("intensidade_dor", parseInt(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: getColor(value || 0) }}
      />
      <div className="flex justify-between text-xs text-gray-400">
        <span>0 — Sem dor</span>
        <span>5 — Moderada</span>
        <span>10 — Insuportável</span>
      </div>
    </div>
  );
}

export default function StepTwo({ data, onChange }) {
  const toggleArea = (area) => {
    const current = data.areas_afetadas || [];
    if (current.includes(area)) {
      onChange("areas_afetadas", current.filter((a) => a !== area));
    } else {
      onChange("areas_afetadas", [...current, area]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: "#1B3A4B" }}>
          Queixas e Dores
        </h2>
        <p className="text-sm text-gray-500">
          Descreva as principais queixas e localização das dores.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>
          Principais queixas do paciente *
        </label>
        <textarea
          value={data.queixas_principais || ""}
          onChange={(e) => onChange("queixas_principais", e.target.value)}
          placeholder="Descreva detalhadamente as queixas: tipo de dor, frequência, o que melhora, o que piora..."
          rows={4}
          className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none resize-none"
          style={{ borderColor: "#D1D5DB", background: "white" }}
          onFocus={(e) => (e.target.style.borderColor = "#C17F6A")}
          onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>
          Áreas afetadas <span className="font-normal text-gray-400">(selecione todas)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {AREAS.map((area) => {
            const selected = (data.areas_afetadas || []).includes(area);
            return (
              <button
                key={area}
                type="button"
                onClick={() => toggleArea(area)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
                style={{
                  background: selected ? "#C17F6A" : "white",
                  color: selected ? "white" : "#374151",
                  borderColor: selected ? "#C17F6A" : "#D1D5DB",
                }}
              >
                {area}
              </button>
            );
          })}
        </div>
      </div>

      <DorSlider value={data.intensidade_dor} onChange={onChange} />

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>
          Há quanto tempo sente essa dor? *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {TEMPOS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onChange("tempo_dor", t)}
              className="px-3 py-2.5 rounded-xl text-xs font-medium text-center transition-all border"
              style={{
                background: data.tempo_dor === t ? "#1B3A4B" : "white",
                color: data.tempo_dor === t ? "white" : "#374151",
                borderColor: data.tempo_dor === t ? "#1B3A4B" : "#D1D5DB",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>
          Histórico completo da dor
        </label>
        <textarea
          value={data.historico_dor || ""}
          onChange={(e) => onChange("historico_dor", e.target.value)}
          placeholder="Como começou a dor? Houve algum evento que desencadeou? Tratamentos anteriores? Exames realizados?"
          rows={4}
          className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none resize-none"
          style={{ borderColor: "#D1D5DB", background: "white" }}
          onFocus={(e) => (e.target.style.borderColor = "#C17F6A")}
          onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
        />
      </div>
    </div>
  );
}