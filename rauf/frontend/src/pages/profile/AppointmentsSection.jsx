import { useState, useEffect, useRef } from "react";
import MedicalModal from "./modals/MedicalModal";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

export default function AppointmentsSection({
  role,
  appointments,
  setAppointments,
  updateStatus,
  hideAppointmentFromUI,
}) {
  const [selectedApp, setSelectedApp] = useState(null);
  const [openMedical, setOpenMedical] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const envBaseURL = import.meta.env.VITE_WSS_BASE_URL;
  // ================= SOCKET =================
  useEffect(() => {
    if (socketRef.current) return;

    const socket = new WebSocket(`${envBaseURL}/ws/appointments/`);

    socketRef.current = socket;

    socket.onopen = () => console.log("WS OPEN");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "video_started") {
        setAppointments((prev) =>
          prev.map((a) =>
            Number(a.id) === data.consultation_id
              ? {
                  ...a,
                  video_started: true,
                  video_session: {
                    session_id: data.session_id,
                    join_url: data.join_url,
                  },
                }
              : a,
          ),
        );
      }
      if (data.type === "status_updated") {
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === data.consultation_id ? { ...a, status: data.status } : a,
          ),
        );
      }
    };

    socket.onerror = (err) => console.log("WS Error:", err);
    socket.onclose = () => console.log("WS Closed");

    // return () => socket.close();
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [setAppointments, envBaseURL]);

  // ================= START CALL =================
  const startVideoCall = async (consultationId) => {
    try {
      const res = await api.post(`/video_sessions/start/${consultationId}/`);

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

  // ================= VETUPDATE STATUS (DONE / CANCEL) =================
  const handleVetMarkAsDone = async (id) => {
    Swal.fire({
      title: t("profile.appointments.confirmDoneTitle", "تأكيد إتمام الجلسة؟"),
      text: t("profile.appointments.confirmActionText"),
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "var(--primary)",
      cancelButtonColor: "var(--border)",
      confirmButtonText: t("common.confirm", "تأكيد"),
      cancelButtonText: t("common.cancel", "إلغاء"),
      customClass: { popup: "custom-swal-font custom-swal-popup" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await updateStatus(id, "ended");
          Swal.fire({
            icon: "success",
            title: t("profile.appointments.success"),
            showConfirmButton: false,
            timer: 1500,
            customClass: { popup: "custom-swal-font custom-swal-popup" },
          });
        } catch (err) {
          console.error("Vet Update Error:", err);
        }
      }
    });
  };

  // ================= دالة إلغاء الموعد المخصصة للطرفين=================
  const handleCancelAppointment = async (id) => {
    Swal.fire({
      title: t(
        "profile.appointments.confirmCancel",
        "هل أنت متأكد من إلغاء الموعد؟",
      ),
      text: t("profile.appointments.confirmActionText"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e53e3e",
      cancelButtonColor: "var(--border)",
      confirmButtonText: t("common.confirm"),
      cancelButtonText: t("common.cancel"),
      customClass: { popup: "custom-swal-font custom-swal-popup" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await updateStatus(id, "cancelled");
          Swal.fire({
            icon: "success",
            title: t("profile.appointments.success"),
            showConfirmButton: false,
            timer: 1500,
            customClass: { popup: "custom-swal-font custom-swal-popup" },
          });
        } catch (err) {
          console.error("Cancel Error:", err);
        }
      }
    });
  };

  // =================  ترتيب المواعيد تلقائيا  =================
  const processedAppointments =
    role === "vet"
      ? [...appointments].sort(
          (a, b) => new Date(b.scheduled_at) - new Date(a.scheduled_at),
        )
      : appointments;

  const formatDateTime = (isoString) => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    return date.toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <div
      className="bg-white rounded-2xl p-8 mt-6"
      style={{
        border: "1px solid var(--border)",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.01)",
        fontFamily: "Cairo, sans-serif",
        direction: i18n.language === "ar" ? "rtl" : "ltr",
      }}
    >
      <h2 className="text-xl font-bold mb-6" style={{ color: "var(--text)" }}>
        🗓️{" "}
        {role === "vet"
          ? t("profile.appointments.vetTitle")
          : t("profile.appointments.title")}
      </h2>

      {processedAppointments?.length === 0 ? (
        <div
          className="text-center py-8 bg-gray-50/50 rounded-xl border border-dashed"
          style={{ borderColor: "var(--border)" }}
        >
          <p style={{ color: "var(--text-light)" }}>
            {t("profile.appointments.empty")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {processedAppointments?.map((app) => (
            <div
              key={app.id}
              className="p-5 rounded-xl relative transition-all"
              style={{
                border:
                  role === "vet"
                    ? "1px solid var(--primary-light)"
                    : "1px solid var(--border)",
                backgroundColor:
                  role === "vet" ? "var(--primary-pale)" : "var(--white)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.01)",
              }}
            >
              {/*  زر الحذف والإخفاء من الشاشة ) */}
              {(app.status === "cancelled" || app.status === "ended") && (
                <button
                  className="absolute text-gray-400 hover:text-red-500 transition-colors"
                  style={{
                    top: "16px",
                    [i18n.language === "ar" ? "left" : "right"]: "16px",
                    background: "transparent",
                    border: "none",
                    fontSize: "1.1rem",
                    cursor: "pointer",
                    zIndex: 10,
                  }}
                  onClick={() => hideAppointmentFromUI(app.id)}
                  title={t(
                    "profile.appointments.hideTooltip",
                    "إزالة من الشاشة",
                  )}
                >
                  ✖
                </button>
              )}
              {/* الهيكل الداخلي للمعلومات */}
              <div className="space-y-1.5">
                <h3
                  className="font-bold text-lg"
                  style={{ color: "var(--text)" }}
                >
                  🐾 {app.pet_name || t("profile.appointments.unknownPet")}’s{" "}
                  {t("profile.appointments.keyword", "Appointment")}
                </h3>

                <p style={{ color: "var(--text-light)", fontSize: "0.85rem" }}>
                  ⏰ {formatDateTime(app.scheduled_at)}
                </p>

                {role === "vet" && (
                  <p style={{ color: "var(--text)", fontSize: "0.85rem" }}>
                    🎂 {t("profile.pet.age")}:{" "}
                    {(() => {
                      const age = app.pet_age;

                      if (age === undefined || age === null || isNaN(age)) {
                        return t("profile.appointments.notSpecified");
                      }

                      return i18n.language === "ar"
                        ? Number(age) === 0
                          ? "أقل من سنة"
                          : Number(age) === 1
                            ? "سنة واحدة"
                            : Number(age) === 2
                              ? "سنتين"
                              : `${age} سنوات`
                        : Number(age) === 0
                          ? "Less than a year"
                          : Number(age) === 1
                            ? "1 Year"
                            : `${age} Years`;
                    })()}
                  </p>
                )}

                {/* الحالات   */}
                <p style={{ color: "var(--text-light)", fontSize: "0.85rem" }}>
                  ✨ {t("profile.appointments.status", "الحالة")}:{" "}
                  <span
                    style={{
                      backgroundColor:
                        app.status === "booked"
                          ? "#fffde7"
                          : app.status === "ended"
                            ? "#e8f5e9"
                            : "#ffebee",
                      color:
                        app.status === "booked"
                          ? "#b78103"
                          : app.status === "ended"
                            ? "#2e7d32"
                            : "#c62828",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      display: "inline-block",
                    }}
                  >
                    {t(
                      `profile.appointments.statuses.${app.status}`,
                      app.status,
                    )}
                  </span>
                </p>
              </div>
              {/* قسم الأزرار */}
              <div
                className="flex flex-wrap gap-2 mt-4 pt-3 border-t"
                style={{ borderColor: "var(--border)" }}
              >
                {/*بدء المكالمة للطبيب*/}
                {role === "vet" &&
                  !app.video_started &&
                  app.status !== "done" && (
                    <button
                      onClick={() => startVideoCall(app.id)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                        fontFamily: "Cairo",
                        backgroundColor: "var(--primary)",
                        color: "var(--white)",
                        border: "none",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      📹 {t("profile.appointments.startCall")}
                    </button>
                  )}

                {/*  انضمام للمكالمة (متاح للطرفين فور بدئها) */}
                {app.video_started && app.status !== "done" && (
                  <button
                    onClick={() => {
                      const url = app.video_session?.join_url;
                      if (!url) return;
                      navigate(url);
                    }}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      fontFamily: "Cairo",
                      backgroundColor: "#2e7d32",
                      color: "var(--white)",
                      border: "none",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    🤙 {t("profile.appointments.joinCall")}
                  </button>
                )}

                {/*  إدارة التقرير الطبي (خاص بالطبيب فقط) */}
                {role === "vet" && (
                  <button
                    onClick={() => {
                      setSelectedApp(app);
                      setOpenMedical(true);
                    }}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      fontFamily: "Cairo",
                      border: "1px solid var(--primary)",
                      color: "var(--primary)",
                      background: "transparent",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    📝{" "}
                    {app.medical_record
                      ? t("profile.appointments.updateReport")
                      : t("profile.appointments.addReport")}
                  </button>
                )}

                {/*  زر إتمام الجلسة */}
                {role === "vet" && app.status === "booked" && (
                  <button
                    onClick={() => handleVetMarkAsDone(app.id)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      fontFamily: "Cairo",
                      backgroundColor: "#e8f5e9",
                      color: "#2e7d32",
                      border: "1px solid #c8e6c9",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    ✅ {t("profile.appointments.doneBtn", "إتمام الجلسة")}
                  </button>
                )}

                {/* زر إلغاء الموعد للطبيب (في أي وقت قبل انتهائه) */}
                {role === "vet" && app.status === "booked" && (
                  <button
                    onClick={() => handleCancelAppointment(app.id)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      fontFamily: "Cairo",
                      backgroundColor: "#fff5f5",
                      color: "#e53e3e",
                      border: "1px solid #fed7d7",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    🚫 {t("profile.appointments.cancelBtn", "إلغاء الموعد")}
                  </button>
                )}

                {/* زر إلغاء الموعد للمستخدم (صاحب الحيوان) */}
                {role === "pet_owner" && app.status === "booked" && (
                  <button
                    onClick={() => handleCancelAppointment(app.id)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      fontFamily: "Cairo",
                      backgroundColor: "#fff5f5",
                      color: "#e53e3e",
                      border: "1px solid #fed7d7",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    🚫 {t("profile.appointments.cancelBtn")}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

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
