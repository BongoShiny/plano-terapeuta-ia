import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useClinic } from "@/context/ClinicContext";
import {
  Users, CheckCircle, XCircle, Shield, UserCheck,
  Loader2, Search, ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ROLE_LABELS = {
  super_admin: "Super Admin",
  admin: "Admin da Clínica",
  terapeuta: "Terapeuta",
  recepcionista: "Recepcionista",
};

const ROLE_COLORS = {
  super_admin: { bg: "#FEE2E2", color: "#DC2626" },
  admin: { bg: "#DBEAFE", color: "#2563EB" },
  terapeuta: { bg: "#D1FAE5", color: "#059669" },
  recepcionista: { bg: "#FEF3C7", color: "#D97706" },
};

export default function ManageUsers() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user: currentUser, selectedClinicId, isSuperAdmin } = useClinic();
  const [search, setSearch] = useState("");

  const { data: allUsers = [], isLoading } = useQuery({
    queryKey: ["allUsers"],
    queryFn: () => base44.entities.User.list("-created_date", 500),
  });

  // Super admin sees all, clinic admin sees their clinic users
  const users = isSuperAdmin
    ? allUsers
    : allUsers.filter((u) => u.clinic_id === selectedClinicId || !u.clinic_id);

  const filtered = users.filter(
    (u) =>
      (u.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const pendingUsers = filtered.filter((u) => !u.aprovado && u.id !== currentUser?.id);
  const approvedUsers = filtered.filter((u) => u.aprovado || u.id === currentUser?.id);

  const updateUser = useMutation({
    mutationFn: ({ userId, data }) => base44.entities.User.update(userId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["allUsers"] }),
  });

  const approve = (userId) =>
    updateUser.mutate({ userId, data: { aprovado: true, clinic_id: selectedClinicId } });

  const reject = (userId) =>
    updateUser.mutate({ userId, data: { aprovado: false } });

  const changeRole = (userId, role) => {
    const cargo = ROLE_LABELS[role] || "Recepcionista";
    updateUser.mutate({ userId, data: { role, cargo } });
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: "#FAF9F7" }}>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm mb-6"
          style={{ color: "#7A9DB0" }}
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "#1B3A4B" }}>
              Gestão de Usuários
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Aprove e gerencie os usuários da clínica
            </p>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white border rounded-2xl text-sm focus:outline-none"
            style={{ borderColor: "#E5E7EB" }}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#C17F6A" }} />
          </div>
        ) : (
          <>
            {/* Pending approvals */}
            {pendingUsers.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: "#D97706" }}>
                  <UserCheck className="w-5 h-5" />
                  Aguardando Aprovação ({pendingUsers.length})
                </h2>
                <div className="space-y-3">
                  {pendingUsers.map((u) => (
                    <div
                      key={u.id}
                      className="bg-white rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                      style={{ borderColor: "#FDE68A" }}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                          style={{ background: "#FEF3C7", color: "#D97706" }}>
                          {(u.full_name || "?").charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate" style={{ color: "#1B3A4B" }}>{u.full_name || "Sem nome"}</p>
                          <p className="text-xs text-gray-400 truncate">{u.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => approve(u.id)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white"
                          style={{ background: "#22C55E" }}
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Aprovar
                        </button>
                        <button
                          onClick={() => reject(u.id)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border"
                          style={{ color: "#EF4444", borderColor: "#FECACA" }}
                        >
                          <XCircle className="w-3.5 h-3.5" /> Rejeitar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Approved users */}
            <div>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: "#1B3A4B" }}>
                <Users className="w-5 h-5" />
                Usuários Ativos ({approvedUsers.length})
              </h2>
              <div className="space-y-3">
                {approvedUsers.map((u) => {
                  const rc = ROLE_COLORS[u.role] || ROLE_COLORS.recepcionista;
                  const isMe = u.id === currentUser?.id;
                  return (
                    <div
                      key={u.id}
                      className="bg-white rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                      style={{ borderColor: "#E5E7EB" }}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                          style={{ background: rc.bg, color: rc.color }}>
                          {(u.full_name || "?").charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate" style={{ color: "#1B3A4B" }}>
                            {u.full_name || "Sem nome"} {isMe && <span className="text-xs text-gray-400">(você)</span>}
                          </p>
                          <p className="text-xs text-gray-400 truncate">{u.email}</p>
                          {u.clinic_nome && <p className="text-xs text-gray-400">Clínica: {u.clinic_nome}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: rc.bg, color: rc.color }}>
                          {ROLE_LABELS[u.role] || u.role}
                        </span>
                        {!isMe && isSuperAdmin && (
                          <select
                            value={u.role || "recepcionista"}
                            onChange={(e) => changeRole(u.id, e.target.value)}
                            className="text-xs border rounded-lg px-2 py-1.5"
                            style={{ borderColor: "#D1D5DB" }}
                          >
                            <option value="super_admin">Super Admin</option>
                            <option value="admin">Admin Clínica</option>
                            <option value="terapeuta">Terapeuta</option>
                            <option value="recepcionista">Recepcionista</option>
                          </select>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}