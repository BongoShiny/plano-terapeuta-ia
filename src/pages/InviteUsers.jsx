import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const CLINIC_USERS = [
  { email: "clinicamoema@vibeterapias.com", clinic: "Moema" },
  { email: "clinicapaulista@vibeterapias.com", clinic: "Paulista" },
  { email: "clinicalondrina@vibeterapias.com", clinic: "Londrina" },
  { email: "clinicapinheiros@vibeterapias.com", clinic: "Pinheiros" },
  { email: "clinicaalphaville@vibeterapias.com", clinic: "Alphaville" },
  { email: "clinicajardins@vibeterapias.com", clinic: "Jardins" },
  { email: "clinicacampinas@vibeterapias.com", clinic: "Campinas" },
];

const PASSWORD = "Vibe@103434";

export default function InviteUsers() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const registerAll = async () => {
    setLoading(true);
    const res = [];
    for (const u of CLINIC_USERS) {
      try {
        await base44.auth.register({ email: u.email, password: PASSWORD });
        res.push({ ...u, status: "ok" });
      } catch (e) {
        res.push({ ...u, status: "error", msg: e.message || String(e) });
      }
    }
    setResults(res);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2" style={{ color: "#1B3A4B" }}>Registrar Usuários das Clínicas</h1>
      <p className="text-sm text-gray-500 mb-6">Senha padrão: <span className="font-mono font-bold">{PASSWORD}</span></p>
      
      <Button onClick={registerAll} disabled={loading} className="mb-6" style={{ background: "#C17F6A" }}>
        {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Registrando...</> : "Registrar Todos"}
      </Button>

      <div className="space-y-2">
        {CLINIC_USERS.map((u, i) => {
          const result = results.find(r => r.email === u.email);
          return (
            <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-lg border" style={{ borderColor: "#E5E7EB" }}>
              {result ? (
                result.status === "ok" 
                  ? <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" /> 
                  : <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-200 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <span className="font-medium text-sm">{u.clinic}</span>
                <p className="text-xs text-gray-400 truncate">{u.email}</p>
              </div>
              {result?.msg && <span className="text-xs text-red-400 truncate max-w-[200px]">{result.msg}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}