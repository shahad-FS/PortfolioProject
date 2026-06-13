import { useState } from "react";
import { useTranslation } from "react-i18next";
export default function PetModal({ editing, setOpen, createPet, updatePet }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const [form, setForm] = useState({
    name: editing?.name || "",
    type: editing?.type || "",
    breed: editing?.breed || "",
    birth_year: editing?.birth_year || "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const save = async () => {
    const payload = {
      ...form,
      birth_year: form.birth_year ? Number(form.birth_year) : null,
    };

    if (editing) {
      await updatePet(editing.id, payload);
    } else {
      await createPet(payload);
    }

    setOpen(false);
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
        {/* زر الإغلاق العلوي  */}
        <button
          className="absolute text-gray-400 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer p-1"
          style={{
            top: "24px",
            [isRtl ? "left" : "right"]: "24px",
            fontSize: "1.1rem",
          }}
          onClick={() => setOpen(false)}
        >
          ✖
        </button>

        {/* الهيدر */}
        <div className="mb-6 text-center">
          <span className="text-3xl mb-2 block">🐾</span>
          <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>
            {editing ? t("pets.modal.titleEdit") : t("pets.modal.titleAdd")}
          </h2>
          <p className="text-xs mt-1" style={{ color: "var(--text-light)" }}>
            {editing
              ? t("pets.modal.subtitleEdit")
              : t("pets.modal.subtitleAdd")}
          </p>
        </div>

        {/* الحقول  */}
        <div className="space-y-4">
          {/* اسم الأليف */}
          <div>
            <label
              className="block text-sm font-bold mb-1.5"
              style={{ color: "var(--text)" }}
            >
              {t("pets.fields.name")} <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              type="text"
              style={inputStyle}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] bg-gray-50/30"
              value={form.name}
              onChange={handleChange}
              placeholder={t("pets.placeholders.name")}
            />
          </div>

          {/*  نوع الحيوان */}
          <div>
            <label
              className="block text-sm font-bold mb-1.5"
              style={{ color: "var(--text)" }}
            >
              {t("pets.fields.type")} <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              style={inputStyle}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] bg-gray-50/30 appearance-none cursor-pointer"
              value={form.type}
              onChange={handleChange}
            >
              <option value="" disabled hidden>
                {t("pets.placeholders.selectType")}
              </option>
              <option value="cat">{t("pets.types.cat")}</option>
              <option value="dog">{t("pets.types.dog")}</option>
              <option value="bird">{t("pets.types.bird")}</option>
              <option value="other">{t("pets.types.other")}</option>
            </select>
          </div>

          {/* الفصيلة / السلالة */}
          <div>
            <label
              className="block text-sm font-bold mb-1.5"
              style={{ color: "var(--text)" }}
            >
              {t("pets.fields.breed")}
            </label>
            <input
              name="breed"
              type="text"
              style={inputStyle}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] bg-gray-50/30"
              value={form.breed}
              onChange={handleChange}
              placeholder={t("pets.placeholders.breed")}
            />
          </div>

          {/* سنة الميلاد */}
          <div>
            <label
              className="block text-sm font-bold mb-1.5"
              style={{ color: "var(--text)" }}
            >
              {t("pets.fields.birthYear")}
            </label>
            <input
              name="birth_year"
              type="number"
              min="2000"
              max={new Date().getFullYear()}
              style={inputStyle}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] bg-gray-50/30"
              value={form.birth_year}
              onChange={handleChange}
              placeholder={t("pets.placeholders.birthYear")}
            />
          </div>
        </div>

        {/* أزرار التحكم السفليّة  */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={() => setOpen(false)}
            className="w-1/3 py-2.5 rounded-xl text-sm font-semibold border transition-all cursor-pointer hover:bg-gray-50 text-gray-500"
            style={{ borderColor: "var(--border)" }}
          >
            {t("common.cancel")}
          </button>

          <button
            onClick={save}
            className="w-2/3 py-2.5 rounded-xl text-sm font-bold transition-all transform active:scale-[0.98] cursor-pointer shadow-sm"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--white)",
            }}
          >
            ✨ {editing ? t("pets.buttons.update") : t("pets.buttons.add")}
          </button>
        </div>
      </div>
    </div>
  );
}
