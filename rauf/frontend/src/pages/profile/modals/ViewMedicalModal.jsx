import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { useTranslation } from "react-i18next";
import { MedicalReportIcon } from "../../../components/Icons";
export default function ViewMedicalModal({ consultationId, setOpen }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exists, setExists] = useState(true);

  // ================= FETCH =================
  useEffect(() => {
    if (consultationId) {
      fetchMedical();
    } else {
      setExists(false);
      setRecord(null);
      setLoading(false);
    }
  }, [consultationId]);

  const fetchMedical = async () => {
    try {
      const res = await api.get(
        `medical/medical-records/consultation/${consultationId}/`,
      );

      console.log("Response Data:", res.data);

      if (res.data && (res.data.exists === false || !res.data.medical_record)) {
        setExists(false);
        setRecord(null);
      } else {
        setExists(true);
        setRecord(res.data.medical_record);
      }
    } catch (err) {
      console.error("fetch medical error:", err);
      setExists(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div
          className="bg-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 font-semibold text-sm"
          style={{ fontFamily: "Cairo, sans-serif" }}
        >
          <span className="w-5 h-5 border-2 border-gray-200 border-t-[var(--primary)] rounded-full animate-spin"></span>
          {t("medical.view.loading", "جاري تحميل التقرير الطبي...")}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div
        className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden p-8 relative max-h-[85vh] flex flex-col transition-all scale-100"
        style={{
          fontFamily: "Cairo, sans-serif",
          direction: isRtl ? "rtl" : "ltr",
        }}
      >
        {/* زر الإغلاق العلوي  */}
        <button
          onClick={() => setOpen(false)}
          className="absolute text-gray-400 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer p-1"
          style={{
            top: "24px",
            [isRtl ? "left" : "right"]: "24px",
            fontSize: "1.1rem",
          }}
        >
          ✖
        </button>

        {/* الهيدر */}
        <div
          className="mb-6 border-b pb-4"
          style={{ borderColor: "var(--border)" }}
        >
          <h2
            className="text-xl font-bold flex items-center gap-2"
            style={{ color: "var(--text)" }}
          >
            <MedicalReportIcon />{" "}
            {t("medical.view.title", "التقرير الطبي المعتمد")}
          </h2>
          <p className="text-xs mt-1" style={{ color: "var(--text-light)" }}>
            {t("medical.view.subtitle")}
          </p>
        </div>

        {/* محتوى التقرير الطبي  */}
        <div className="flex-1 overflow-y-auto pr-1 pl-1 py-1 space-y-5 custom-scrollbar">
          {/* حالة عدم وجود سجل طبي  */}
          {!exists || !record ? (
            <div className="text-center py-10 my-auto">
              <div className="text-5xl mb-4">
                <MedicalReportIcon />
              </div>
              <h3 className="text-base font-bold text-gray-700">
                {t("medical.view.noRecordTitle")}
              </h3>
              <p className="text-xs max-w-sm mx-auto mt-2 text-gray-400 leading-relaxed">
                {t("medical.view.noRecordDesc")}
              </p>
              <button
                onClick={() => setOpen(false)}
                className="mt-6 px-6 py-2 rounded-xl text-xs font-bold border transition-colors hover:bg-gray-50 text-gray-600"
                style={{ borderColor: "var(--border)" }}
              >
                {t("common.cancel")}
              </button>
            </div>
          ) : (
            /* حالة وجود السجل الطبي */
            <>
              {/* الملاحظات العامة */}
              <div
                className="p-4 rounded-xl border bg-gray-50/50"
                style={{ borderColor: "var(--border)" }}
              >
                <h4 className="text-sm font-bold mb-2 flex items-center gap-1.5 text-gray-700">
                  {t("medical.fields.notes")}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line bg-white border p-3 rounded-lg">
                  {record.notes || t("medical.view.emptyNotes")}
                </p>
              </div>

              {/* التشخيص الطبي */}
              <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/20">
                <h4 className="text-sm font-bold mb-2 flex items-center gap-1.5 text-blue-900">
                  {t("medical.fields.diagnosis")}
                </h4>
                {record.diagnoses && record.diagnoses.length > 0 ? (
                  record.diagnoses.map((diag) => (
                    <div
                      key={diag.id}
                      className="bg-white border border-blue-100 p-3 rounded-lg text-sm text-blue-950 font-medium leading-relaxed shadow-sm"
                    >
                      {diag.description}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic p-2">
                    {t("medical.view.emptyDiagnosis")}
                  </p>
                )}
              </div>

              {/* الوصفة الطبية  */}
              <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/20">
                <h4 className="text-sm font-bold mb-3 flex items-center gap-1.5 text-emerald-900 border-b border-dashed border-emerald-200/60 pb-2">
                  {t("medical.sections.prescription")}
                </h4>
                {record.prescriptions && record.prescriptions.length > 0 ? (
                  <div className="space-y-3">
                    {record.prescriptions.map((pres) => (
                      <div
                        key={pres.id}
                        className="bg-white border border-emerald-100 p-4 rounded-lg text-sm space-y-2.5 shadow-sm"
                      >
                        <div className="flex flex-wrap items-baseline gap-1">
                          <span className="font-bold text-emerald-950 text-xs bg-emerald-50 px-2 py-0.5 rounded">
                            {t("medical.fields.medication")}:
                          </span>
                          <span className="text-gray-700 font-semibold">
                            {pres.medication}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-baseline gap-1">
                          <span className="font-bold text-emerald-950 text-xs bg-emerald-50 px-2 py-0.5 rounded">
                            {t("medical.fields.dosage")}:
                          </span>
                          <span className="text-gray-600">{pres.dosage}</span>
                        </div>

                        <div className="pt-1.5 border-t border-gray-50 text-xs text-gray-500 leading-relaxed">
                          <strong className="text-emerald-900">
                            {t("medical.fields.instructions")}:
                          </strong>{" "}
                          {pres.instructions ||
                            t("medical.view.standardInstructions")}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic p-2">
                    {t("medical.view.emptyPrescription")}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* زر الإغلاق السفلي  */}
        <div
          className="mt-6 pt-4 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <button
            onClick={() => setOpen(false)}
            className="w-full py-2.5 rounded-xl text-sm font-bold transition-all text-center bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
          >
            {t("common.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
