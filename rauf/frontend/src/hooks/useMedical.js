import { useState } from "react";
import api from "../api/axios";

export const useMedical = () => {
  const [loading, setLoading] = useState(false);

  // ================= GET by consultation =================
  const fetchMedicalByConsultation = async (consultationId) => {
    return await api.get(
      `medical/medical-records/consultation/${consultationId}/`,
    );
  };

  // ================= CREATE =================
  const createMedical = async (data) => {
    const res = await api.post("medical/medical-records/", data);
    return res.data;
  };

  // ================= UPDATE =================
  const updateMedical = async (id, data) => {
    const res = await api.patch(`medical/medical-records/${id}/`, data);
    return res.data;
  };

  // ================= DIAGNOSIS =================
  const addDiagnosis = async (data) => {
    return await api.post("medical/diagnoses/", data);
  };

  // ================= PRESCRIPTION =================
  const addPrescription = async (data) => {
    return await api.post("medical/prescriptions/", data);
  };

  return {
    loading,
    fetchMedicalByConsultation,
    createMedical,
    updateMedical,
    addDiagnosis,
    addPrescription,
  };
};
