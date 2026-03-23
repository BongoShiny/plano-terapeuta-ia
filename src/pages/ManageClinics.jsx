import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Building2, Plus, MapPin, Phone, ArrowLeft, Loader2, X
} from "lucide-react";

export default function ManageClinics() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nome: "", endereco: "", telefone: "" });
  const [editingId, setEditingId] = useState(null);

  const { data: clinics = [], isLoading } = useQuery({
    queryKey: ["clinics"],
    queryFn: () => base44.entities.Clinic.list("-created_date", 200),
  });

  const createClinic = useMutation({
    mutationFn: (data) => base44.entities.Clinic.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinics"] });
      resetForm();
    },
  });

  const updateClinic = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Clinic.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinics"] });
      resetForm();
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setForm({ nome: "", endereco: "", telefone: "" });
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!form.nome.trim()) return;
    if (editingId) {
      updateClinic.mutate({ id: editingId, data: { ...form, status: "Ativa" } });
    } else {
      createClinic.mutate({ ...form, status: "Ativa" });
    }
  };

  const startEdit = (clinic) => {
    setForm({ nome: clinic.nome, endereco: clinic.endereco || "", telefone: clinic.telefone || "" });
    setEditingId(clinic.id);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: "#FAF9F7" }}>
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm mb-6" style={{ color: "#7A9DB0" }}>
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "#1B3A4B" }}>
              Gestão de Clínicas
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Crie e gerencie as clínicas da rede
            </p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white"
            style={{ background: "#C17F6A" }}
          >
            <Plus className="w-4 h-4" /> Nova Clínica
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border p-6 mb-6" style={{ borderColor: "#E5E7EB" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold" style={{ color: "#1B3A4B" }}>
                {editingId ? "Editar Clínica" : "Nova Clínica"}
              </h3>
              <button onClick={resetForm}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">Nome da Clínica *</label>
                <input
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none"
                  style={{ borderColor: "#D1D5DB" }}
                  placeholder="Ex: Vibe Terapias - Unidade Centro"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">Endereço</label>
                <input
                  value={form.endereco}
                  onChange={(e) => setForm({ ...form, endereco: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none"
                  style={{ borderColor: "#D1D5DB" }}
                  placeholder="Rua, número, cidade..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">Telefone</label>
                <input
                  value={form.telefone}
                  onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none"
                  style={{ borderColor: "#D1D5DB" }}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={!form.nome.trim()}
                className="px-6 py-3 rounded-xl text-sm font-bold text-white"
                style={{ background: form.nome.trim() ? "#1B3A4B" : "#E5E7EB", color: form.nome.trim() ? "white" : "#9CA3AF" }}
              >
                {editingId ? "Salvar Alterações" : "Criar Clínica"}
              </button>
            </div>
          </div>
        )}

        {/* List */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#C17F6A" }} />
          </div>
        ) : clinics.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="font-semibold text-gray-400">Nenhuma clínica cadastrada</p>
          </div>
        ) : (
          <div className="space-y-3">
            {clinics.map((clinic) => (
              <div
                key={clinic.id}
                className="bg-white rounded-2xl border p-5 flex items-center gap-4 hover:shadow-md transition-all"
                style={{ borderColor: "#E5E7EB" }}
              >
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
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{ background: clinic.status === "Ativa" ? "#F0FDF4" : "#F9FAFB", color: clinic.status === "Ativa" ? "#22C55E" : "#9CA3AF" }}
                  >
                    {clinic.status}
                  </span>
                  <button
                    onClick={() => startEdit(clinic)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border"
                    style={{ color: "#1B3A4B", borderColor: "#D1D5DB" }}
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}