import { useState, useEffect } from "react";
import api from "../api/axios";

export const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const res = await api.get("consultations/my-appointments/");
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ⭐ هذا الجديد
  const updateStatus = async (id, action) => {
    try {
      await api.post(`consultations/${id}/vet-update/`, {
        action,
      });

      await fetchAppointments(); // refresh
    } catch (err) {
      console.error("update status error:", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return {
    appointments,
    setAppointments,
    fetchAppointments,
    updateStatus, // ⭐ مهم جداً
  };
};
