import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PawIcon, VetIcon } from "../../../components/Icons";
export default function CompleteProfileModal({
  role,
  onSubmit,
  completeProfile,
}) {
  const { t, i18n } = useTranslation();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [license, setLicense] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [sessionPrice, setSessionPrice] = useState("100.00");
  const [bio, setBio] = useState("");

  const handleSubmit = async () => {
    const data = {
      profile: {
        full_name: fullName,
        phone: phone,
      },
    };

    if (role === "vet") {
      data.vet = {
        license_number: license,
        specialization: specialization,
        session_price: sessionPrice,
        bio: bio,
      };
    }
    console.log("Data to be sent:", data);
    if (typeof completeProfile === "function") {
      await completeProfile(data);
    }

    if (onSubmit) {
      onSubmit(data);
    }
  };

  const isRtl = i18n.language === "ar";

  const inputStyle = {
    border: "1px solid var(--border)",
    fontFamily: "Cairo, sans-serif",
    transition: "all 0.2s ease-in-out",
  };
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-8 transition-all scale-100"
        style={{
          fontFamily: "Cairo, sans-serif",
          direction: isRtl ? "rtl" : "ltr",
        }}
      >
        {/* الهيدر */}
        <div className="text-center mb-6">
          <span className="text-3xl mb-2 block">
            {role === "vet" ? <VetIcon /> : <PawIcon />}
          </span>
          <h2 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
            {role === "vet"
              ? t("auth.completeProfile.vetTitle")
              : t("auth.completeProfile.ownerTitle")}
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-light)" }}>
            {t("auth.completeProfile.subtitle")}
          </p>
        </div>

        {/* الحقول العامة */}
        <div className="space-y-4">
          <div>
            <label
              className="block text-sm font-bold mb-1.5"
              style={{ color: "var(--text)" }}
            >
              {t("auth.completeProfile.fullName")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              style={inputStyle}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] bg-gray-50/30"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t("auth.completeProfile.fullNamePlaceholder")}
            />
          </div>

          <div>
            <label
              className="block text-sm font-bold mb-1.5"
              style={{ color: "var(--text)" }}
            >
              {t("auth.completeProfile.phone")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              style={inputStyle}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] bg-gray-50/30"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="05xxxxxxxx"
            />
          </div>

          {/* حقول الطبيب فقط */}
          {role === "vet" && (
            <div
              className="space-y-4 pt-2 border-t border-dashed"
              style={{ borderColor: "var(--border)" }}
            >
              <div>
                <label
                  className="block text-sm font-bold mb-1.5"
                  style={{ color: "var(--text)" }}
                >
                  {t("auth.completeProfile.license")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  style={inputStyle}
                  className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] bg-gray-50/30"
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                  placeholder="e.g. LIC-12345"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-bold mb-1.5"
                  style={{ color: "var(--text)" }}
                >
                  {t("auth.completeProfile.specialization")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  style={inputStyle}
                  className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] bg-gray-50/30"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder={t(
                    "auth.completeProfile.specializationPlaceholder",
                  )}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-bold mb-1.5"
                  style={{ color: "var(--text)" }}
                >
                  {t("auth.completeProfile.bio")}{" "}
                </label>
                <textarea
                  style={inputStyle}
                  className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] bg-gray-50/30 min-h-[100px] resize-none"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={t("auth.completeProfile.bioPlaceholder")}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-bold mb-1.5"
                  style={{ color: "var(--text)" }}
                >
                  {t("auth.completeProfile.sessionPrice")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    style={inputStyle}
                    className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] bg-gray-50/30"
                    value={sessionPrice}
                    onChange={(e) => setSessionPrice(e.target.value)}
                  />
                  <div
                    className="absolute inset-y-0 flex items-center px-3 pointer-events-none text-xs font-bold bg-gray-100 border-t border-b text-gray-500 rounded-e-xl"
                    style={{
                      top: "1px",
                      bottom: "1px",
                      [isRtl ? "left" : "right"]: "1px",
                      borderInlineStart: "1px solid var(--border)",
                    }}
                  >
                    {t("common.sar", "SAR")}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* زر الحفظ */}
        <button
          onClick={handleSubmit}
          className="w-full mt-6 py-3 rounded-xl font-bold transition-all transform active:scale-[0.98] cursor-pointer text-sm shadow-md"
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--white)",
            fontFamily: "Cairo",
          }}
        >
          {t("common.save")}
        </button>
      </div>
    </div>
  );
}
