import { useState, useEffect, useRef } from "react";
import MedicalModal from "./modals/MedicalModal";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function AppointmentsSection({
  role,
  appointments,
  updateStatus,
  setAppointments,
}) {
  const [selectedApp, setSelectedApp] = useState(null);
  const [openMedical, setOpenMedical] = useState(false);

  const navigate = useNavigate();
  const socketsRef = useRef({});

  // ================= SOCKETS =================
  useEffect(() => {
    if (!appointments || appointments.length === 0) return;

    // افتح WebSockets مرة واحدة فقط
    if (Object.keys(socketsRef.current).length > 0) return;

    const newSockets = {};

    appointments.forEach((app) => {
      if (!app?.id) return;

      const socket = new WebSocket(
        `wss://${window.location.hostname}/ws/appointments/`,
      );
      newSockets[app.id] = socket;

      socket.onopen = () => {
        console.log("WebSocket connected:", app.id);
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (window._ws_debug) console.log("WS MESSAGE:", data);
        console.log("WS MESSAGE:", data);

        if (data.type === "video_started") {
          setAppointments((prev) =>
            prev.map((a) =>
              Number(a.id) === data.consultation_id
                ? {
                    ...a,
                    video_started: true,
                    video_session: data,
                  }
                : a,
            ),
          );
        }
      };

      socket.onerror = (err) => console.log("Socket error:", err);
      socket.onclose = () => console.log("Socket closed:", app.id);
    });

    socketsRef.current = newSockets;

    return () => {
      Object.values(newSockets).forEach((s) => s.close());
    };
  }, [appointments?.length]);

  // ================= START CALL =================
  const startVideoCall = async (consultationId) => {
    try {
      const res = await api.post(`/video_sessions/start/${consultationId}/`);

      console.log("START VIDEO RESPONSE:", res.data);

      setAppointments((prev) =>
        prev.map((app) =>
          app.id === consultationId
            ? {
                ...app,
                video_started: true,
                video_session: res.data,
              }
            : app,
        ),
      );
    } catch (err) {
      console.log(err?.response?.data || err);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 mt-6">
      <h2 className="text-xl font-bold mb-4">Appointments</h2>

      {appointments?.map((app) => (
        <div key={app.id} className="border p-4 rounded-lg mb-3">
          <p className="font-bold">🐾 {app.pet?.name}</p>
          <p>Status: {app.status}</p>

          <div className="flex gap-2 mt-3 flex-wrap">
            {role === "vet" && !app.video_started && (
              <button
                onClick={() => startVideoCall(app.id)}
                className="btn btn-sm btn-primary"
              >
                Start Video Call
              </button>
            )}

            {app.video_started && (
              <button
                onClick={() => {
                  const url = app.video_session?.join_url;
                  if (!url) {
                    console.log("No join url");
                    return;
                  }
                  navigate(url);
                }}
                className="btn btn-sm btn-success"
              >
                Join Video Call
              </button>
            )}
          </div>
        </div>
      ))}

      {openMedical && selectedApp && (
        <MedicalModal
          app={selectedApp}
          setOpen={setOpenMedical}
          setAppointments={setAppointments}
        />
      )}
    </div>
  );
}
