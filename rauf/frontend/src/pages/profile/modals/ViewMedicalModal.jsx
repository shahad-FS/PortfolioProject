import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function ViewMedicalModal({ consultationId, setOpen }) {
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  useEffect(() => {
    fetchMedical();
  }, []);

  const fetchMedical = async () => {
    try {
      const res = await api.get(
        `medical/medical-records/consultation/${consultationId}/`,
      );

      console.log(res.data);

      setRecord(res.data.medical_record);
    } catch (err) {
      console.error("fetch medical error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl">Loading...</div>
      </div>
    );
  }

  if (!record) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[500px] relative max-h-[90vh] overflow-y-auto">
        {/* CLOSE */}
        <button
          onClick={() => setOpen(false)}
          className="absolute right-3 top-2 text-xl"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-5">Medical Record</h2>

        {/* GENERAL NOTES */}
        <div className="mb-4">
          <p className="font-bold">General Notes</p>

          <div className="bg-gray-100 p-3 rounded-lg mt-2">
            {record.notes || "No notes"}
          </div>
        </div>

        {/* DIAGNOSIS */}
        <div className="mb-4">
          <p className="font-bold">Diagnosis</p>

          {record.diagnoses?.length > 0 ? (
            record.diagnoses.map((diag) => (
              <div key={diag.id} className="bg-gray-100 p-3 rounded-lg mt-2">
                {diag.description}
              </div>
            ))
          ) : (
            <div className="bg-gray-100 p-3 rounded-lg mt-2">No diagnosis</div>
          )}
        </div>

        {/* PRESCRIPTIONS */}
        <div className="mb-4">
          <p className="font-bold">Prescription</p>

          {record.prescriptions?.length > 0 ? (
            record.prescriptions.map((pres) => (
              <div
                key={pres.id}
                className="bg-gray-100 p-3 rounded-lg mt-2 space-y-1"
              >
                <p>
                  <span className="font-semibold">Medication:</span>{" "}
                  {pres.medication}
                </p>

                <p>
                  <span className="font-semibold">Dosage:</span> {pres.dosage}
                </p>

                <p>
                  <span className="font-semibold">Instructions:</span>{" "}
                  {pres.instructions}
                </p>
              </div>
            ))
          ) : (
            <div className="bg-gray-100 p-3 rounded-lg mt-2">
              No prescription
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
