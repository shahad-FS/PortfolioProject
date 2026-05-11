import { useEffect, useState } from "react";
import api from "../api/axios";
import { useSearchParams } from "react-router-dom";

export default function BookAppointment() {
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState(1);

  const [pets, setPets] = useState([]);
  const [vets, setVets] = useState([]);

  const [formData, setFormData] = useState({
    pet: "",
    vet: "",
    scheduled_at: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  // ================= FETCH =================
  useEffect(() => {
    fetchPets();
    fetchVets();

    const vetId = searchParams.get("vet");
    if (vetId) {
      setFormData((prev) => ({ ...prev, vet: vetId }));
    }
  }, []);

  const fetchPets = async () => {
    try {
      const res = await api.get("/pets/");
      setPets(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchVets = async () => {
    try {
      const res = await api.get("accounts/vets/");
      setVets(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= HANDLE =================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    try {
      await api.post("/consultations/book/", formData);

      setSuccess(true); // ⭐ مهم
    } catch (err) {
      setMessage("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };
  if (success) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
        <div className="bg-white shadow-xl rounded-2xl p-10 text-center w-full max-w-md">
          <h2 className="text-2xl font-bold mb-2">Appointment Booked 🎉</h2>

          <p className="text-gray-500 mb-6">
            Your appointment has been successfully created.
          </p>

          <div className="flex gap-3">
            <a href="/" className="btn flex-1">
              Go Home
            </a>

            <a href="/profile" className="btn btn-primary flex-1">
              My Profile
            </a>
          </div>
        </div>
      </div>
    );
  }
  // ================= UI =================
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8">
        {/* ================= HEADER ================= */}
        <h1 className="text-3xl font-bold mb-6">Book Appointment</h1>

        {/* ================= STEP INDICATOR ================= */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full ${
                step >= s ? "bg-black" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <div>
            <h2 className="font-semibold mb-3">Select Your Pet 🐾</h2>

            <select
              name="pet"
              value={formData.pet}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">Choose a pet</option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name}
                </option>
              ))}
            </select>

            <button
              onClick={nextStep}
              disabled={!formData.pet}
              className="btn btn-primary w-full mt-5"
            >
              Next
            </button>
          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <div>
            <h2 className="font-semibold mb-3">Choose Vet 🩺</h2>

            <select
              name="vet"
              value={formData.vet}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">Choose a vet</option>
              {vets.map((vet) => (
                <option key={vet.id} value={vet.id}>
                  {vet.email}
                </option>
              ))}
            </select>

            <div className="flex gap-3 mt-5">
              <button onClick={prevStep} className="btn flex-1">
                Back
              </button>

              <button
                onClick={nextStep}
                disabled={!formData.vet}
                className="btn btn-primary flex-1"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <div>
            <h2 className="font-semibold mb-3">Pick Date & Confirm 📅</h2>

            <input
              type="datetime-local"
              name="scheduled_at"
              value={formData.scheduled_at}
              onChange={handleChange}
              className="input input-bordered w-full"
            />

            <div className="mt-5 text-sm text-gray-500 space-y-1">
              <p>🐾 Pet ID: {formData.pet}</p>
              <p>🩺 Vet ID: {formData.vet}</p>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={prevStep} className="btn flex-1">
                Back
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading || !formData.scheduled_at}
                className="btn btn-primary flex-1"
              >
                {loading ? "Booking..." : "Confirm"}
              </button>
            </div>
          </div>
        )}

        {/* ================= MESSAGE ================= */}
        {message && (
          <div className="mt-5 text-center text-sm text-gray-600">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
