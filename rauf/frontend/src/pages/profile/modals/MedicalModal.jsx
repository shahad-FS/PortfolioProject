import { useState, useEffect } from "react";
import { useMedical } from "../../../hooks/useMedical";
import { useTranslation } from "react-i18next";

export default function MedicalModal({ app, setOpen, setAppointments }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const {
    fetchMedicalByConsultation,
    createMedical,
    updateMedical,
    addDiagnosis,
    addPrescription,
  } = useMedical();

  const [form, setForm] = useState({
    general_notes: "",
    diagnosis: "",
    medication: "",
    dosage: "",
    instructions: "",
  });

  const [hasRecord, setHasRecord] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const checkRecord = async () => {
      try {
        const res = await fetchMedicalByConsultation(app.id);

        const record = res?.data?.medical_record;

        if (record) {
          setHasRecord(true);

          setForm({
            general_notes: record.notes || "",
            diagnosis: "",
            medication: "",
            dosage: "",
            instructions: "",
          });
        } else {
          setHasRecord(false);
        }
      } catch {
        setHasRecord(false);
      }
    };

    if (app?.id) checkRecord();
  }, [app?.id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const save = async (e) => {
    e.preventDefault();
    if (!app?.id) return;
    try {
      setIsSaving(true);
      let recordId;

      // ================= CREATE =================
      if (!hasRecord) {
        const created = await createMedical({
          consultation_id: app.id,
          notes: form.general_notes,
        });

        recordId = created.id;
        setHasRecord(true);
      }

      // ================= UPDATE =================
      else {
        const res = await fetchMedicalByConsultation(app.id);
        recordId = res?.data?.medical_record?.id || res?.data?.id;

        await updateMedical(recordId, {
          notes: form.general_notes,
        });
      }

      setAppointments((prev) =>
        prev.map((a) =>
          a.id === app.id
            ? {
                ...a,
                medical_record: { id: recordId },
              }
            : a,
        ),
      );

      // ================= DIAGNOSIS =================
      if (form.diagnosis && recordId) {
        await addDiagnosis({
          record: recordId,
          description: form.diagnosis,
        });
      }

      // ================= PRESCRIPTION =================
      if (form.medication || form.dosage) {
        await addPrescription({
          record: recordId,
          medication: form.medication,
          dosage: form.dosage,
          instructions: form.instructions,
        });
      }

      setOpen(false);
    } catch (err) {
      console.error("Medical save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const inputStyle = {
    border: "1px solid var(--border)",
    fontFamily: "Cairo, sans-serif",
    transition: "all 0.2s ease-in-out",
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div
        className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden p-8 relative max-h-[90vh] flex flex-col transition-all scale-100"
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
          onClick={() => !isSaving && setOpen(false)}
          disabled={isSaving}
        >
          ✖
        </button>

        {/* الهيدر */}
        <div className="mb-6">
          <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>
            🩺 {t("medical.modal.title")}
          </h2>
          <p className="text-xs mt-1" style={{ color: "var(--text-light)" }}>
            {t("medical.modal.subtitle")}
          </p>
        </div>

        {/* حقول الإدخال  */}
        <div className="space-y-4 flex-1 overflow-y-auto pr-1 pl-1 py-1 custom-scrollbar">
          {/* ملاحظات عامة */}
          <div>
            <label
              className="block text-sm font-bold mb-1.5"
              style={{ color: "var(--text)" }}
            >
              {t("medical.fields.notes")}
            </label>
            <textarea
              name="general_notes"
              value={form.general_notes}
              onChange={handleChange}
              style={inputStyle}
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] bg-gray-50/30 resize-none"
              placeholder={t("medical.placeholders.notes")}
            />
          </div>

          {/* التشخيص */}
          <div>
            <label
              className="block text-sm font-bold mb-1.5"
              style={{ color: "var(--text)" }}
            >
              {t("medical.fields.diagnosis")}
            </label>
            <textarea
              name="diagnosis"
              value={form.diagnosis}
              onChange={handleChange}
              style={inputStyle}
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] bg-gray-50/30 resize-none"
              placeholder={t("medical.placeholders.diagnosis")}
            />
          </div>

          {/* خط الفاصل للوصفة الطبيه العلاجية */}
          <div
            className="pt-2 border-t border-dashed"
            style={{ borderColor: "var(--border)" }}
          >
            <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider block mb-3">
              💊 {t("medical.sections.prescription")}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* اسم الدواء */}
              <div>
                <label
                  className="block text-sm font-bold mb-1.5"
                  style={{ color: "var(--text)" }}
                >
                  {t("medical.fields.medication")}
                </label>
                <input
                  type="text"
                  name="medication"
                  value={form.medication}
                  onChange={handleChange}
                  style={inputStyle}
                  className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] bg-gray-50/30"
                  placeholder={t("medical.placeholders.medication")}
                />
              </div>

              {/* الجرعة */}
              <div>
                <label
                  className="block text-sm font-bold mb-1.5"
                  style={{ color: "var(--text)" }}
                >
                  {t("medical.fields.dosage")}
                </label>
                <input
                  type="text"
                  name="dosage"
                  value={form.dosage}
                  onChange={handleChange}
                  style={inputStyle}
                  className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] bg-gray-50/30"
                  placeholder={t("medical.placeholders.dosage")}
                />
              </div>
            </div>
          </div>

          {/* إرشادات الاستخدام */}
          <div>
            <label
              className="block text-sm font-bold mb-1.5"
              style={{ color: "var(--text)" }}
            >
              {t("medical.fields.instructions")}
            </label>
            <textarea
              name="instructions"
              value={form.instructions}
              onChange={handleChange}
              style={inputStyle}
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] bg-gray-50/30 resize-none"
              placeholder={t("medical.placeholders.instructions")}
            />
          </div>
        </div>

        {/* أزرار التحكم بمؤشر التحميل */}
        <div
          className="flex gap-2 mt-6 pt-4 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <button
            onClick={() => setOpen(false)}
            disabled={isSaving}
            className="w-1/3 py-2.5 rounded-xl text-sm font-semibold border transition-all cursor-pointer hover:bg-gray-50 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ borderColor: "var(--border)" }}
          >
            {t("common.cancel")}
          </button>

          <button
            onClick={save}
            disabled={isSaving}
            className="w-2/3 py-2.5 rounded-xl text-sm font-bold transition-all transform active:scale-[0.98] cursor-pointer shadow-sm flex items-center justify-center gap-2 text-white disabled:opacity-80 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "var(--primary)",
            }}
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                {t("common.saving")}
              </>
            ) : (
              <>
                ✨{" "}
                {hasRecord
                  ? t("medical.buttons.update")
                  : t("medical.buttons.add")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
