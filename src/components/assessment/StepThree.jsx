import React from "react";

const CAUSAS = [
  "Postura no trabalho / computador",
  "Sedentarismo",
  "Estresse / Ansiedade",
  "Atividade física intensa",
  "Acidente / Queda",
  "Gravidez / Pós-parto",
  "Trabalho físico pesado",
  "Sono inadequado",
  "Herança genética",
  "Não sei ao certo",
];

const CONDICOES = [
  "Fibromialgia",
  "Artrose / Artrite",
  "Hérnia de Disco",
  "Diabetes",
  "Hipertensão",
  "Obesidade / Sobrepeso",
  "Lipedema",
  "Bruxismo",
  "Ansiedade / Depressão",
  "Enxaqueca / Cefaleia crônica",
  "Osteoporose",
  "Doenças autoimunes",
  "Nenhuma",
];

const ATIVIDADES = [
  "Não pratico atividade física",
  "Caminhada",
  "Musculação",
  "Yoga / Pilates",
  "Corrida",
  "Beach Tênis / Esportes",
  "Natação",
  "Ciclismo",
  "Dança",
  "Outros",
];

function CheckboxGroup({ items, selected = [], onChange, label }) {
  const toggle = (item) => {
    if (selected.includes(item)) {
      onChange(selected.filter((i) => i !== item));
    } else {
      onChange([...selected, item]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>
        {label}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((item) => {
          const checked = selected.includes(item);
          return (
            <button
              key={item}
              type="button"
              onClick={() => toggle(item)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-left transition-all border"
              style={{
                background: checked ? "#F5E6DD" : "white",
                borderColor: checked ? "#C17F6A" : "#D1D5DB",
                color: "#374151",
              }}
            >
              <span
                className="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border"
                style={{
                  background: checked ? "#C17F6A" : "white",
                  borderColor: checked ? "#C17F6A" : "#D1D5DB",
                }}
              >
                {checked && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className="font-medium">{item}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function StepThree({ data, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: "#1B3A4B" }}>
          Saúde e Histórico
        </h2>
        <p className="text-sm text-gray-500">
          Informações de saúde para personalizar o plano terapêutico.
        </p>
      </div>

      <CheckboxGroup
        label="Quais as possíveis causas das dores? (selecione todas)"
        items={CAUSAS}
        selected={data.causas_provaveis || []}
        onChange={(val) => onChange("causas_provaveis", val)}
      />

      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>
          Atividade física praticada
        </label>
        <div className="flex flex-wrap gap-2">
          {ATIVIDADES.map((a) => {
            const selected = data.atividade_fisica === a;
            return (
              <button
                key={a}
                type="button"
                onClick={() => onChange("atividade_fisica", a)}
                className="px-3 py-2 rounded-full text-xs font-medium transition-all border"
                style={{
                  background: selected ? "#C17F6A" : "white",
                  color: selected ? "white" : "#374151",
                  borderColor: selected ? "#C17F6A" : "#D1D5DB",
                }}
              >
                {a}
              </button>
            );
          })}
        </div>
      </div>

      <CheckboxGroup
        label="Condições preexistentes (selecione todas)"
        items={CONDICOES}
        selected={data.condicoes_preexistentes || []}
        onChange={(val) => onChange("condicoes_preexistentes", val)}
      />

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>
          Medicamentos em uso
          <span className="ml-2 font-normal text-gray-400">(opcional)</span>
        </label>
        <textarea
          value={data.medicamentos || ""}
          onChange={(e) => onChange("medicamentos", e.target.value)}
          placeholder="Liste os medicamentos que o paciente usa regularmente..."
          rows={3}
          className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none resize-none"
          style={{ borderColor: "#D1D5DB", background: "white" }}
          onFocus={(e) => (e.target.style.borderColor = "#C17F6A")}
          onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
        />
      </div>
    </div>
  );
}