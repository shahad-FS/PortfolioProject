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

  const updateStatus = async (id, action) => {
    try {
      await api.post(`consultations/${id}/vet-update/`, {
        action,
      });

      await fetchAppointments();
    } catch (err) {
      console.error("update status error:", err);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("consultations/my-appointments/");
        setAppointments(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetch();
  }, []);

  return {
    appointments,
    setAppointments,
    fetchAppointments,
    updateStatus,
  };
};
