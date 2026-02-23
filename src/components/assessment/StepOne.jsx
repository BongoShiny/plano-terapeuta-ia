import React from "react";
import { User, Phone, Mail, Stethoscope } from "lucide-react";

const TERAPIAS = [
  "Liberação Miofascial",
  "Pescoço e Crânio Relax",
  "Pernas e Pés Relax",
  "Fibromialgia",
  "Lipedema",
  "Bruxismo",
  "Desinflama",
  "Hérnia de Disco",
  "Gestação Sem Dor",
];

export default function StepOne({ data, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: "#1B3A4B" }}>
          Dados do Paciente
        </h2>
        <p className="text-sm text-gray-500">Preencha as informações pessoais do paciente.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>
            Nome Completo *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={data.nome || ""}
              onChange={(e) => onChange("nome", e.target.value)}
              placeholder="Nome completo do paciente"
              className="w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none transition-all"
              style={{
                borderColor: data.nome ? "#C17F6A" : "#D1D5DB",
                background: "white",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#C17F6A")}
              onBlur={(e) => (e.target.style.borderColor = data.nome ? "#C17F6A" : "#D1D5DB")}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>
            Idade *
          </label>
          <input
            type="number"
            value={data.idade || ""}
            onChange={(e) => onChange("idade", parseInt(e.target.value) || "")}
            placeholder="Idade"
            min="1"
            max="120"
            className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none transition-all"
            style={{ borderColor: "#D1D5DB", background: "white" }}
            onFocus={(e) => (e.target.style.borderColor = "#C17F6A")}
            onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>
            Sexo *
          </label>
          <div className="flex gap-2">
            {["Feminino", "Masculino", "Outro"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onChange("sexo", s)}
                className="flex-1 py-3 rounded-xl text-sm font-medium transition-all border"
                style={{
                  background: data.sexo === s ? "#C17F6A" : "white",
                  color: data.sexo === s ? "white" : "#374151",
                  borderColor: data.sexo === s ? "#C17F6A" : "#D1D5DB",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>
            Telefone *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              value={data.telefone || ""}
              onChange={(e) => onChange("telefone", e.target.value)}
              placeholder="(00) 00000-0000"
              className="w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none"
              style={{ borderColor: "#D1D5DB", background: "white" }}
              onFocus={(e) => (e.target.style.borderColor = "#C17F6A")}
              onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>
            E-mail <span className="font-normal text-gray-400">(opcional)</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={data.email || ""}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="email@exemplo.com"
              className="w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none"
              style={{ borderColor: "#D1D5DB", background: "white" }}
              onFocus={(e) => (e.target.style.borderColor = "#C17F6A")}
              onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>
            <Stethoscope className="inline w-4 h-4 mr-1.5" style={{ color: "#C17F6A" }} />
            Terapia Especial *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TERAPIAS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onChange("terapia_especial", t)}
                className="px-3 py-2.5 rounded-xl text-xs font-medium text-left transition-all border"
                style={{
                  background: data.terapia_especial === t ? "#1B3A4B" : "white",
                  color: data.terapia_especial === t ? "white" : "#374151",
                  borderColor: data.terapia_especial === t ? "#1B3A4B" : "#D1D5DB",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}