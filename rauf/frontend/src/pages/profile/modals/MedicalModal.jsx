import { useState, useEffect } from "react";
import { useMedical } from "../../../hooks/useMedical";

export default function MedicalModal({ app, setOpen, setAppointments }) {
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

  const save = async () => {
    try {
      if (!app?.id) return;

      let recordId;

      // ================= CREATE =================
      if (!hasRecord) {
        const created = await createMedical({
          consultation_id: app.id,
          notes: form.general_notes,
        });

        recordId = created.id;
        setHasRecord(true); // 🔥 مهم جدًا
      }

      // ================= UPDATE =================
      else {
        // نحتاج record id من أول fetch (خليه state لو تبغى تحسين لاحق)
        const res = await fetchMedicalByConsultation(app.id);
        recordId = res.data.medical_record.id;

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
      if (form.diagnosis) {
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
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[500px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-5">Medical Record</h2>

        {/* GENERAL NOTES */}
        <div className="mb-4">
          <label className="font-semibold">General Notes</label>

          <textarea
            name="general_notes"
            value={form.general_notes}
            onChange={handleChange}
            className="textarea textarea-bordered w-full mt-1"
            placeholder="General notes..."
          />
        </div>

        {/* DIAGNOSIS */}
        <div className="mb-4">
          <label className="font-semibold">Diagnosis</label>

          <textarea
            name="diagnosis"
            value={form.diagnosis}
            onChange={handleChange}
            className="textarea textarea-bordered w-full mt-1"
            placeholder="Diagnosis..."
          />
        </div>

        {/* MEDICATION */}
        <div className="mb-4">
          <label className="font-semibold">Medication</label>

          <input
            type="text"
            name="medication"
            value={form.medication}
            onChange={handleChange}
            className="input input-bordered w-full mt-1"
            placeholder="Medication..."
          />
        </div>

        {/* DOSAGE */}
        <div className="mb-4">
          <label className="font-semibold">Dosage</label>

          <input
            type="text"
            name="dosage"
            value={form.dosage}
            onChange={handleChange}
            className="input input-bordered w-full mt-1"
            placeholder="Dosage..."
          />
        </div>

        {/* INSTRUCTIONS */}
        <div className="mb-4">
          <label className="font-semibold">Instructions</label>

          <textarea
            name="instructions"
            value={form.instructions}
            onChange={handleChange}
            className="textarea textarea-bordered w-full mt-1"
            placeholder="Instructions..."
          />
        </div>

        <button onClick={save} className="btn btn-primary w-full mt-3">
          {hasRecord ? "Update Medical Record" : "Add Medical Record"}
        </button>
      </div>
    </div>
  );
}
