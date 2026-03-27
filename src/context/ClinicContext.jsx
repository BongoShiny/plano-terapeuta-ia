import React, { createContext, useContext, useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

const ClinicContext = createContext(null);

export function ClinicProvider({ children }) {
  const [selectedClinicId, setSelectedClinicId] = useState(
    () => localStorage.getItem("selectedClinicId") || null
  );

  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => base44.auth.me(),
  });

  const { data: clinics = [], isLoading: loadingClinics } = useQuery({
    queryKey: ["clinics"],
    queryFn: () => base44.entities.Clinic.list("-created_date", 200),
    enabled: !!user,
  });

  // "admin" is the default Base44 admin role, treat it as super_admin too
  const isSuperAdmin = user?.role === "super_admin" || user?.role === "admin";
  const isApproved = user?.aprovado === true || isSuperAdmin;
  const isBlocked = user?.bloqueado === true;
  // Non-super-admins are locked to their assigned clinic
  const userClinicId = isSuperAdmin ? (selectedClinicId || user?.clinic_id) : user?.clinic_id;

  const selectedClinic = clinics.find((c) => c.id === userClinicId) || null;

  const selectClinic = (clinicId) => {
    setSelectedClinicId(clinicId);
    localStorage.setItem("selectedClinicId", clinicId);
  };

  const canManageUsers = isSuperAdmin || user?.role === "admin";
  const canManageClinics = user?.role === "super_admin" || user?.role === "admin";

  // Email-to-clinic mapping for auto-assignment
  const EMAIL_CLINIC_MAP = {
    "clinicamoema@vibeterapias.com": { id: "69c18bf8cd2f46b911194795", nome: "Vibe Terapias Moema" },
    "clinicapaulista@vibeterapias.com": { id: "69c18bf8cd2f46b911194796", nome: "Vibe Terapias Paulista" },
    "clinicalondrina@vibeterapias.com": { id: "69c18bf8cd2f46b911194797", nome: "Vibe Terapias Londrina" },
    "clinicapinheiros@vibeterapias.com": { id: "69c18bf8cd2f46b911194798", nome: "Vibe Terapias Pinheiros" },
    "clinicaalphaville@vibeterapias.com": { id: "69c18bf8cd2f46b911194799", nome: "Vibe Terapias Alphaville" },
    "clinicajardins@vibeterapias.com": { id: "69c18bf8cd2f46b91119479a", nome: "Vibe Terapias Jardins" },
    "clinicacampinas@vibeterapias.com": { id: "69c18bf8cd2f46b91119479b", nome: "Vibe Terapias Campinas" },
  };

  // Auto-setup for new users: assign clinic based on email, or super_admin if no mapping
  useEffect(() => {
    if (user && !user.clinic_id) {
      const mapped = EMAIL_CLINIC_MAP[user.email?.toLowerCase()];
      if (mapped) {
        base44.auth.updateMe({
          role: "admin",
          cargo: "Admin da Clínica",
          aprovado: true,
          clinic_id: mapped.id,
          clinic_nome: mapped.nome,
        });
      } else if (!user.role) {
        base44.auth.updateMe({ role: "super_admin", cargo: "Super Admin", aprovado: true });
      }
    }
  }, [user]);

  useEffect(() => {
    if (user && !selectedClinicId && user.clinic_id) {
      setSelectedClinicId(user.clinic_id);
    }
  }, [user]);

  return (
    <ClinicContext.Provider
      value={{
        user,
        clinics,
        selectedClinic,
        selectedClinicId: userClinicId,
        selectClinic,
        isSuperAdmin,
        isApproved,
        isBlocked,
        canManageUsers,
        canManageClinics,
        loading: loadingUser || loadingClinics,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
}

export function useClinic() {
  const ctx = useContext(ClinicContext);
  if (!ctx) throw new Error("useClinic must be used within ClinicProvider");
  return ctx;
}