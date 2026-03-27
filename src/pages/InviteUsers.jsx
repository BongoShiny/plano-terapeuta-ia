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

export default function InviteUsers() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const inviteAll = async () => {
    setLoading(true);
    const res = [];
    for (const u of CLINIC_USERS) {
      try {
        await base44.users.inviteUser(u.email, "admin");
        res.push({ ...u, status: "ok" });
      } catch (e) {
        res.push({ ...u, status: "error", msg: e.message });
      }
    }
    setResults(res);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4" style={{ color: "#1B3A4B" }}>Convidar Usuários das Clínicas</h1>
      <Button onClick={inviteAll} disabled={loading} className="mb-6">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Convidando...</> : "Convidar Todos"}
      </Button>
      {results.map((r, i) => (
        <div key={i} className="flex items-center gap-3 py-2 border-b">
          {r.status === "ok" ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
          <span className="font-medium">{r.clinic}</span>
          <span className="text-sm text-gray-500">{r.email}</span>
          {r.msg && <span className="text-xs text-red-400">{r.msg}</span>}
        </div>
      ))}
    </div>
  );
}