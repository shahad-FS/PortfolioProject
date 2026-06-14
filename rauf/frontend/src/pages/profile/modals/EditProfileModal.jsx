import { useState } from "react";
import useProfile from "../../../hooks/useProfile";
import { useTranslation } from "react-i18next";

export default function EditProfileModal({
  profile,
  role,
  onClose,
  completeProfile,
}) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const [fullName, setFullName] = useState(profile.full_name || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [license, setLicense] = useState(profile.license_number || "");
  const [specialization, setSpecialization] = useState(
    profile.specialization || "",
  );
  const [sessionPrice, setSessionPrice] = useState(
    profile.session_price || "100.00",
  );
  const [bio, setBio] = useState(profile.bio || "");
  const [isApproved, setIsApproved] = useState(profile.is_approved || false);

  const handleSave = async () => {
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
        is_approved: isApproved,
        bio: bio,
      };
    }

    await completeProfile(data);
    onClose();
  };

  const inputStyle = {
    border: "1px solid var(--border)",
    fontFamily: "Cairo, sans-serif",
    transition: "all 0.2s ease-in-out",
  };
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-8 relative transition-all scale-100"
        style={{
          fontFamily: "Cairo, sans-serif",
          direction: isRtl ? "rtl" : "ltr",
        }}
      >
        {/* زر الإغلاق العلوي */}
        <button
          className="absolute text-gray-400 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer p-1"
          style={{
            top: "24px",
            [isRtl ? "left" : "right"]: "24px",
            fontSize: "1.1rem",
          }}
          onClick={onClose}
        >
          ✖
        </button>

        {/* الهيدر */}
        <div className="mb-6">
          <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>
            {t("profile.edit.title")}
          </h2>
          <p className="text-xs mt-1" style={{ color: "var(--text-light)" }}>
            {t("profile.edit.subtitle")}
          </p>
        </div>

        {/* الحقول المتناسقة */}
        <div className="space-y-4">
          <div>
            <label
              className="block text-sm font-bold mb-1.5"
              style={{ color: "var(--text)" }}
            >
              {t("profile.edit.fullName")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              style={inputStyle}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] bg-gray-50/30"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label
              className="block text-sm font-bold mb-1.5"
              style={{ color: "var(--text)" }}
            >
              {t("profile.edit.phone")} <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              style={inputStyle}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] bg-gray-50/30"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* حقول الطبيب البيطري الإضافية */}
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
                  {t("profile.edit.license")}
                </label>
                <input
                  type="text"
                  style={inputStyle}
                  className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] bg-gray-50/30"
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-bold mb-1.5"
                  style={{ color: "var(--text)" }}
                >
                  {t("profile.edit.specialization")}
                </label>
                <input
                  type="text"
                  style={inputStyle}
                  className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] bg-gray-50/30"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-bold mb-1.5"
                  style={{ color: "var(--text)" }}
                >
                  {t("profile.edit.bio")}
                </label>
                <textarea
                  style={inputStyle}
                  className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] bg-gray-50/30 min-h-[100px] resize-none"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={t("profile.edit.bioPlaceholder")}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-bold mb-1.5"
                  style={{ color: "var(--text)" }}
                >
                  {t("profile.edit.sessionPrice")}
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

        {/* أزرار التحكم السفلى */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="w-1/3 py-2.5 rounded-xl text-sm font-semibold border transition-all cursor-pointer hover:bg-gray-50 text-gray-500"
            style={{ borderColor: "var(--border)" }}
          >
            {t("common.cancel")}
          </button>

          <button
            onClick={handleSave}
            className="w-2/3 py-2.5 rounded-xl text-sm font-bold transition-all transform active:scale-[0.98] cursor-pointer shadow-sm"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--white)",
            }}
          >
            {t("profile.edit.saveBtn")}
          </button>
        </div>
      </div>
    </div>
  );
}
