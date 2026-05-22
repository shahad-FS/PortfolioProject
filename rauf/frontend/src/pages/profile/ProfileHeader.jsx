import { useState } from "react";
import CompleteProfileModal from "./modals/CompleteProfileModal";
import EditProfileModal from "./modals/EditProfileModal";
import { useTranslation } from "react-i18next";

export default function ProfileHeader({
  profile,
  role,
  needsCompletion,
  completeProfile,
}) {
  const [showEdit, setShowEdit] = useState(false);
  const { t, i18n } = useTranslation();

  if (!profile.full_name && !needsCompletion) return null;
  return (
    <>
      {needsCompletion && role && (
        <CompleteProfileModal role={role} onSubmit={completeProfile} />
      )}

      {showEdit && (
        <EditProfileModal
          profile={profile}
          role={role}
          completeProfile={completeProfile}
          onClose={() => setShowEdit(false)}
        />
      )}

      {/* بطاقة الهيدر */}
      <div
        className="bg-white rounded-2xl p-8 flex justify-between items-start"
        style={{
          border: "1px solid var(--border)",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.02)",
          fontFamily: "Cairo, sans-serif",
          direction: i18n.language === "ar" ? "rtl" : "ltr",
        }}
      >
        <div className="space-y-2">
          {/* الاسم الكامل */}
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
            👤 {profile.full_name}
          </h1>

          {/* البريد الإلكتروني */}
          <p style={{ color: "var(--text-light)", fontSize: "0.95rem" }}>
            ✉️ {profile.email}
          </p>

          {/* رقم الهاتف */}
          <p style={{ color: "var(--text-light)", fontSize: "0.95rem" }}>
            📞 {t("profile.header.phone")}: {profile.phone || "—"}
          </p>

          {/* الدور أو نوع الحساب */}
          <p style={{ color: "var(--text-light)", fontSize: "0.95rem" }}>
            🏷️ {t("profile.header.role")}:{" "}
            {role === "vet"
              ? t("profile.header.vet")
              : t("profile.header.client")}
          </p>

          {/* معلومات إضافية تظهر فقط إذا كان طبيب بيطري (Vet) */}
          {role === "vet" && (
            <div
              className="mt-3 p-4 rounded-xl space-y-2"
              style={{
                background: "var(--primary-pale)",
                border: "1px solid var(--border)",
                minWidth: "280px",
              }}
            >
              {/* رقم الرخصة الطبية */}
              <p
                style={{
                  color: "var(--text)",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                }}
              >
                🪪 {t("profile.header.license")}:{" "}
                <span style={{ fontWeight: "normal" }}>
                  {profile.license_number || "—"}
                </span>
              </p>

              {/* 🌟 حقل التخصص  */}
              <p
                style={{
                  color: "var(--text)",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                }}
              >
                🩺 {t("profile.header.specialization")}:{" "}
                <span style={{ fontWeight: "normal" }}>
                  {profile.specialization || "—"}
                </span>
              </p>

              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid var(--border)",
                  margin: "8px 0",
                }}
              />

              {/* حالة الاعتماد  */}
              <p
                style={{
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: "var(--text)",
                }}
              >
                ✨ {t("profile.header.status")}:{" "}
                <span
                  style={{
                    color: profile.is_approved ? "#2e7d32" : "#b78103",
                    backgroundColor: profile.is_approved
                      ? "#e8f5e9"
                      : "#fffde7",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                    display: "inline-block",
                    marginInlineStart: "5px",
                  }}
                >
                  {profile.is_approved
                    ? t("profile.header.approved")
                    : t("profile.header.pending")}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* زر التعديل  */}
        <button
          className="btn-secondary"
          onClick={() => setShowEdit(true)}
          style={{
            padding: "8px 18px",
            borderRadius: "10px",
            fontSize: "0.9rem",
            fontWeight: "600",
            cursor: "pointer",
            fontFamily: "Cairo",
            border: "1px solid var(--primary)",
            color: "var(--primary)",
            background: "transparent",
          }}
        >
          ✏️ {t("common.edit")}
        </button>
      </div>
    </>
  );
}
