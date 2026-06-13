import { useState } from "react";
import CompleteProfileModal from "./modals/CompleteProfileModal";
import EditProfileModal from "./modals/EditProfileModal";
import { useTranslation } from "react-i18next";
import { PencilIcon } from "../../components/Icons";

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

      {/* بطاقة الهيدر الرئيسية */}
      <div
        className="bg-white rounded-2xl p-8 flex flex-col sm:flex-row justify-between items-start gap-6"
        style={{
          border: "1px solid var(--border)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.01)",
          fontFamily: "Cairo, sans-serif",
          direction: i18n.language === "ar" ? "rtl" : "ltr",
        }}
      >
        {/* الجانب الأيمن: البيانات والنبذة */}
        <div className="flex-1 w-full space-y-4">
          {/* الكتلة العلوية: الاسم ونوع الحساب */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1
                className="text-2xl font-bold tracking-tight"
                style={{ color: "var(--text)" }}
              >
                {profile.full_name}
              </h1>
              <span
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{
                  background: "rgba(var(--primary-rgb), 0.08)",
                  color: "var(--primary)",
                }}
              >
                {role === "vet"
                  ? t("profile.header.vet")
                  : t("profile.header.client")}
              </span>
            </div>

            {/* بيانات التواصل الأساسية مرصوصة أفقيًا بنعومة */}
            <div
              className="flex flex-wrap gap-x-4 gap-y-1 text-sm"
              style={{ color: "var(--text-light)" }}
            >
              <span>{profile.email}</span>
              {profile.phone && (
                <>
                  <span style={{ color: "var(--border)" }}>•</span>
                  <span>{profile.phone}</span>
                </>
              )}
            </div>
          </div>

          {/* معلومات إضافية تظهر فقط إذا كان طبيب بيطري (Vet) */}
          {role === "vet" && (
            <div
              className="p-5 rounded-xl space-y-4 w-full"
              style={{
                background: "var(--primary-pale)",
                border: "1px solid rgba(var(--primary-rgb), 0.05)",
                marginTop: "20px",
              }}
            >
              {/* شبكة معلومات الرخصة والتخصص */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-0.5">
                  <span
                    className="block text-xs font-medium"
                    style={{ color: "var(--text-light)" }}
                  >
                    {t("profile.header.license")}
                  </span>
                  <span
                    className="font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    {profile.license_number || "—"}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <span
                    className="block text-xs font-medium"
                    style={{ color: "var(--text-light)" }}
                  >
                    {t("profile.header.specialization")}
                  </span>
                  <span
                    className="font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    {profile.specialization || "—"}
                  </span>
                </div>
              </div>

              <div
                style={{ borderTop: "1px dashed var(--border)", my: "12px" }}
              />

              {/* حقل النبذة التعريفية (Bio) */}
              <div className="text-sm">
                <span
                  className="block text-xs font-medium mb-1"
                  style={{ color: "var(--text-light)" }}
                >
                  {t("auth.completeProfile.bio")}
                </span>
                <p
                  className="leading-relaxed"
                  style={{ color: "var(--text)", fontSize: "0.9rem" }}
                >
                  {profile.bio || "—"}
                </p>
              </div>

              <div
                style={{ borderTop: "1px dashed var(--border)", my: "12px" }}
              />

              {/* حالة الاعتماد والتوثيق */}
              <div className="flex items-center text-sm gap-2">
                <span
                  text-xs
                  font-medium
                  style={{ color: "var(--text-light)" }}
                >
                  {t("profile.header.status")}:
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    profile.is_approved === true
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {profile.is_approved === true
                    ? t("profile.header.approved")
                    : t("profile.header.pending")}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* الجانب الأيسر: زر التعديل الموزون */}
        <button
          className="btn-secondary flex items-center justify-center gap-2 shrink-0"
          onClick={() => setShowEdit(true)}
          style={{
            padding: "8px 16px",
            borderRadius: "10px",
            fontSize: "0.875rem",
            fontWeight: "600",
            cursor: "pointer",
            fontFamily: "Cairo",
            border: "1px solid var(--primary)",
            color: "var(--primary)",
            background: "transparent",
            transition: "all 0.2s ease",
          }}
        >
          <span>{t("common.edit")}</span>
          <PencilIcon size={16} style={{ flexShrink: 0 }} />
        </button>
      </div>
    </>
  );
}
