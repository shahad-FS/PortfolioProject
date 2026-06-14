import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";

export const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hiddenIds, setHiddenIds] = useState(() => {
    const storedHidden = localStorage.getItem("hidden_appointments");
    return storedHidden ? JSON.parse(storedHidden) : [];
  });

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("consultations/my-appointments/");
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`consultations/${id}/update-status/`, {
        status: newStatus,
      });
      await fetchAppointments();
    } catch (err) {
      console.error("update status error:", err);
      throw err;
    }
  };

  const hideAppointmentFromUI = (id) => {
    const updatedHidden = [...hiddenIds, id];
    setHiddenIds(updatedHidden);
    localStorage.setItem("hidden_appointments", JSON.stringify(updatedHidden));
  };

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchAppointments();
    };

    loadInitialData();
  }, []);

  const visibleAppointments = appointments.filter(
    (app) => !hiddenIds.includes(app.id),
  );
  // useEffect(() => {
  //   const fetch = async () => {
  //     try {
  //       const res = await api.get("consultations/my-appointments/");
  //       setAppointments(res.data);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   fetch();
  // }, []);

  return {
    appointments: visibleAppointments,
    setAppointments,
    fetchAppointments,
    updateStatus,
    hideAppointmentFromUI,
    loading,
  };
};
