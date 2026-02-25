import React, { useState } from "react";
import { Upload, Loader2, X } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function CameraThermalUploader({ value = [], onChange }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    const uploaded = await Promise.all(files.map((f) => base44.integrations.Core.UploadFile({ file: f })));
    const urls = uploaded.map((r) => r.file_url);
    onChange([...value, ...urls].slice(0, 6));
    setUploading(false);
  };

  const remove = (idx) => {
    const updated = value.filter((_, i) => i !== idx);
    onChange(updated);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-3">
        {value.map((url, i) => (
          <div key={i} className="relative rounded-xl overflow-hidden border" style={{ borderColor: "#D1D5DB", aspectRatio: "1" }}>
            <img src={url} alt={`Termal ${i + 1}`} className="w-full h-full object-cover" />
            <button
              onClick={() => remove(i)}
              className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.6)" }}
            >
              <X className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        ))}
        {value.length < 6 && (
          <label
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed cursor-pointer transition-all"
            style={{ borderColor: "#D1D5DB", background: "#FAFAFA", aspectRatio: "1" }}
          >
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#C17F6A" }} />
            ) : (
              <>
                <Upload className="w-5 h-5 mb-1" style={{ color: "#C17F6A" }} />
                <span className="text-xs text-gray-400 text-center px-2">Adicionar<br/>foto</span>
              </>
            )}
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleFile} disabled={uploading} />
          </label>
        )}
      </div>
      <p className="text-xs text-gray-400">{value.length}/6 fotos adicionadas</p>
    </div>
  );
}