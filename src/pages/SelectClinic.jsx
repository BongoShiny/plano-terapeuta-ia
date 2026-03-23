import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useClinic } from "@/context/ClinicContext";
import { useNavigate } from "react-router-dom";
import { Building2, MapPin, Phone, LogOut, Loader2 } from "lucide-react";

export default function SelectClinic() {
  const navigate = useNavigate();
  const { user, clinics, selectClinic, loading } = useClinic();

  const handleSelect = async (clinic) => {
    selectClinic(clinic.id);
    await base44.auth.updateMe({ clinic_id: clinic.id, clinic_nome: clinic.nome });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FAF9F7" }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#C17F6A" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#FAF9F7" }}>
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "#C17F6A" }}>
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "#1B3A4B" }}>
            Selecione a Clínica
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Olá, {user?.full_name?.split(" ")[0]}! Escolha em qual clínica você vai trabalhar.
          </p>
        </div>

        {clinics.length === 0 ? (
          <div className="bg-white rounded-2xl border p-8 text-center" style={{ borderColor: "#E5E7EB" }}>
            <p className="text-gray-400 font-medium">Nenhuma clínica disponível</p>
            <p className="text-sm text-gray-400 mt-1">Peça ao administrador para criar uma clínica.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {clinics.filter(c => c.status === "Ativa").map((clinic) => (
              <button
                key={clinic.id}
                onClick={() => handleSelect(clinic)}
                className="w-full bg-white rounded-2xl border p-5 text-left hover:shadow-md transition-all"
                style={{ borderColor: "#E5E7EB" }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "#E8F0F4" }}>
                    <Building2 className="w-6 h-6" style={{ color: "#1B3A4B" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm" style={{ color: "#1B3A4B" }}>{clinic.nome}</h3>
                    {clinic.endereco && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> {clinic.endereco}
                      </p>
                    )}
                    {clinic.telefone && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" /> {clinic.telefone}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="text-center mt-6">
          <button
            onClick={() => base44.auth.logout()}
            className="flex items-center gap-2 mx-auto px-4 py-2 text-sm rounded-lg"
            style={{ color: "#7A9DB0" }}
          >
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </div>
    </div>
  );
}