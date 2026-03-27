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
  const userClinicId = selectedClinicId || user?.clinic_id;

  const selectedClinic = clinics.find((c) => c.id === userClinicId) || null;

  const selectClinic = (clinicId) => {
    setSelectedClinicId(clinicId);
    localStorage.setItem("selectedClinicId", clinicId);
  };

  const canManageUsers = isSuperAdmin || user?.role === "admin";
  const canManageClinics = user?.role === "super_admin" || user?.role === "admin";

  // Auto-setup: if user has no role yet, set them as super_admin (first-time setup)
  useEffect(() => {
    if (user && !user.role) {
      base44.auth.updateMe({ role: "super_admin", cargo: "Super Admin", aprovado: true });
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