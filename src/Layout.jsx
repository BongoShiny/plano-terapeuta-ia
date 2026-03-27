import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { LayoutDashboard, Users, Plus, Menu, X, LogOut, Building2, UserCog, ChevronDown } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useClinic } from "@/context/ClinicContext";

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, selectedClinic, clinics, selectClinic, canManageUsers, canManageClinics, isSuperAdmin } = useClinic();

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Pacientes", icon: Users, path: "/Patients" },
    { name: "Novo Atendimento", icon: Plus, path: "/NewAssessment" },
  ];

  const adminItems = [];
  if (canManageUsers) {
    adminItems.push({ name: "Gestão de Usuários", icon: UserCog, path: "/ManageUsers" });
  }
  if (canManageClinics) {
    adminItems.push({ name: "Gestão de Clínicas", icon: Building2, path: "/ManageClinics" });
  }

  const initials = user?.full_name
    ? user.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("")
    : "V";

  const ROLE_LABELS = {
    super_admin: "Super Admin",
    admin: "Admin da Clínica",
    terapeuta: "Terapeuta",
    recepcionista: "Recepcionista",
  };

  const handleClinicSwitch = (clinicId) => {
    const clinic = clinics.find(c => c.id === clinicId);
    if (clinic) {
      selectClinic(clinic.id);
      base44.auth.updateMe({ clinic_id: clinic.id, clinic_nome: clinic.nome });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#FAF9F7" }}>
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 lg:hidden" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ background: "#1B3A4B" }}
      >
        <div className="p-6 flex items-center justify-between" style={{ borderBottom: "1px solid #2A4F63" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg" style={{ background: "#C17F6A" }}>V</div>
            <div>
              <p className="font-bold text-white text-sm leading-tight">VIBE TERAPIAS</p>
              <p className="text-xs" style={{ color: "#C17F6A" }}>Clínica Especializada em Dor</p>
            </div>
          </div>
          <button className="lg:hidden text-white" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clinic selector - only for super admins */}
        {isSuperAdmin && clinics.length > 1 && (
          <div className="px-4 pt-4">
            <label className="text-xs font-medium mb-1 block" style={{ color: "#7A9DB0" }}>Clínica</label>
            <select
              value={selectedClinic?.id || ""}
              onChange={(e) => handleClinicSwitch(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-xs font-medium border-0"
              style={{ background: "#2A4F63", color: "#fff" }}
            >
              {clinics.filter(c => c.status === "Ativa").map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>
        )}

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = currentPageName === item.name || (item.path === "/" && currentPageName === "Dashboard");
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
                style={{ background: isActive ? "#C17F6A" : "transparent", color: isActive ? "#fff" : "#B0C4CF" }}
                onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = "#2A4F63"; e.currentTarget.style.color = "#fff"; }}}
                onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#B0C4CF"; }}}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}

          {adminItems.length > 0 && (
            <>
              <div className="pt-4 pb-2 px-4">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#5A8899" }}>Administração</p>
              </div>
              {adminItems.map((item) => {
                const isActive = currentPageName === item.name;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
                    style={{ background: isActive ? "#C17F6A" : "transparent", color: isActive ? "#fff" : "#B0C4CF" }}
                    onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = "#2A4F63"; e.currentTarget.style.color = "#fff"; }}}
                    onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#B0C4CF"; }}}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        <div className="p-4" style={{ borderTop: "1px solid #2A4F63" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ background: "#C17F6A", color: "#fff" }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.full_name || "Usuário"}</p>
              <p className="text-xs truncate" style={{ color: "#7A9DB0" }}>
                {ROLE_LABELS[user?.role] || "Recepcionista"}
              </p>
            </div>
          </div>
          <button
            onClick={() => base44.auth.logout()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200"
            style={{ color: "#7A9DB0" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#2A4F63"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#7A9DB0"; }}
          >
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white" style={{ borderBottom: "1px solid #E5E7EB" }}>
          <button onClick={() => setSidebarOpen(true)}><Menu className="w-6 h-6" style={{ color: "#1B3A4B" }} /></button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: "#C17F6A" }}>V</div>
            <span className="font-bold text-sm" style={{ color: "#1B3A4B" }}>
              {selectedClinic?.nome || "Vibe Terapias"}
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}