import React, { useState, useEffect } from "react";

function splitPosturalText(text) {
  if (!text) return { frontal: "", lateral: "" };
  const allText = text.replace(/\n+/g, " ");
  const splitRegex = /(na vista lateral|no plano sagital)/i;
  const idx = allText.search(splitRegex);
  if (idx > 0) {
    return {
      frontal: allText.substring(0, idx).trim(),
      lateral: allText.substring(idx).trim(),
    };
  }
  return { frontal: allText.trim(), lateral: "" };
}

function joinPosturalText(frontal, lateral) {
  return [frontal.trim(), lateral.trim()].filter(Boolean).join("\n\n");
}

export default function PosturalEditor({ text, onChange }) {
  const { frontal: initFrontal, lateral: initLateral } = splitPosturalText(text);
  const [frontal, setFrontal] = useState(initFrontal);
  const [lateral, setLateral] = useState(initLateral);

  useEffect(() => {
    const { frontal: f, lateral: l } = splitPosturalText(text);
    setFrontal(f);
    setLateral(l);
  }, [text]);

  const handleChange = (field, value) => {
    const newFrontal = field === "frontal" ? value : frontal;
    const newLateral = field === "lateral" ? value : lateral;
    if (field === "frontal") setFrontal(value);
    else setLateral(value);
    onChange(joinPosturalText(newFrontal, newLateral));
  };

  const inputStyle = {
    borderColor: "#D1D5DB",
    background: "white",
  };

  return (
    <div className="mt-4 space-y-3">
      <div className="rounded-xl border p-3" style={{ borderColor: "#D1D5DB" }}>
        <label className="flex items-center gap-2 text-xs font-bold mb-2" style={{ color: "#1B3A4B" }}>
          <span className="w-2 h-2 rounded-full" style={{ background: "#C17F6A" }} />
          Na vista frontal (plano coronal)
        </label>
        <textarea
          value={frontal}
          onChange={(e) => handleChange("frontal", e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none resize-y"
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = "#C17F6A")}
          onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
        />
      </div>

      <div className="rounded-xl border p-3" style={{ borderColor: "#D1D5DB" }}>
        <label className="flex items-center gap-2 text-xs font-bold mb-2" style={{ color: "#1B3A4B" }}>
          <span className="w-2 h-2 rounded-full" style={{ background: "#C17F6A" }} />
          Na vista lateral (plano sagital)
        </label>
        <textarea
          value={lateral}
          onChange={(e) => handleChange("lateral", e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none resize-y"
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = "#C17F6A")}
          onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
        />
      </div>
    </div>
  );
}