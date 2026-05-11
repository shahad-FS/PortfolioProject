import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { tokens } = useContext(AuthContext);
  const navigate = useNavigate();

  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVets = async () => {
      try {
        const res = await api.get("accounts/vets/");
        setVets(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVets();
  }, []);

  // ================= BOOK HANDLER =================
  const handleBook = (vetId) => {
    if (!tokens) {
      navigate("/register");
      return;
    }

    navigate(`/book-appointment?vet=${vetId}`);
  };

  const VetSkeleton = () => (
    <div className="border rounded-2xl p-6 animate-pulse bg-white">
      <div className="h-10 w-10 bg-gray-200 rounded-full mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-100 rounded w-1/2 mb-4"></div>
      <div className="h-8 bg-gray-200 rounded"></div>
    </div>
  );

  return (
    <div className="bg-white text-gray-900">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-28 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Modern Veterinary Care
            <span className="block text-gray-500 mt-2">
              for your beloved pets 🐾
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Connect with certified veterinarians, manage your pets, and book
            consultations instantly — all from one clean platform.
          </p>

          {/* CTA */}
          {!tokens && (
            <div className="flex gap-4 justify-center mt-10">
              <a
                href="/register"
                className="px-6 py-3 rounded-xl bg-black text-white hover:opacity-80 transition"
              >
                Get Started
              </a>

              <a
                href="/login"
                className="px-6 py-3 rounded-xl border hover:bg-gray-100 transition"
              >
                Login
              </a>
            </div>
          )}

          {tokens && (
            <p className="mt-8 text-sm text-gray-400">
              Welcome back 👋 You are logged in
            </p>
          )}
        </div>

        {/* subtle background glow */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-50 to-white" />
      </section>

      {/* ================= TRUST STRIP ================= */}
      <section className="border-y bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap justify-center gap-10 text-sm text-gray-500">
          <span>✔ Trusted Vets</span>
          <span>✔ Fast Booking</span>
          <span>✔ Secure Records</span>
          <span>✔ Online Consultation</span>
        </div>
      </section>

      {/* ================= VETS ================= */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-center mb-12">
          Our Veterinarians
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <VetSkeleton key={i} />)
            : vets.map((vet) => (
                <div
                  key={vet.id}
                  className="border rounded-2xl p-6 bg-white hover:shadow-xl transition"
                >
                  <div className="text-4xl mb-3">👨‍⚕️</div>

                  <h3 className="text-lg font-semibold">{vet.full_name}</h3>

                  <p className="text-gray-500 text-sm">
                    {vet.specialization || "Veterinarian"}
                  </p>

                  <button
                    onClick={() => handleBook(vet.id)}
                    className="mt-4 w-full btn btn-sm btn-primary"
                  >
                    Book Appointment
                  </button>
                </div>
              ))}
        </div>
      </section>

      {/* ================= FEATURES (Stripe style cards) ================= */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">
            Everything your pet needs in one place
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-2xl border hover:shadow-md transition">
              <h3 className="font-semibold mb-2">🐶 Pet Management</h3>
              <p className="text-gray-500 text-sm">
                Store medical history and manage pet profiles easily.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border hover:shadow-md transition">
              <h3 className="font-semibold mb-2">📅 Smart Booking</h3>
              <p className="text-gray-500 text-sm">
                Book appointments in seconds with live vet availability.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border hover:shadow-md transition">
              <h3 className="font-semibold mb-2">🩺 Online Care</h3>
              <p className="text-gray-500 text-sm">
                Consult vets remotely without leaving your home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-28 text-center bg-white">
        <h2 className="text-3xl font-bold mb-4">
          Start caring for your pet today
        </h2>

        <p className="text-gray-500 max-w-xl mx-auto">
          Join thousands of pet owners using Rauf for better, faster veterinary
          care.
        </p>

        {!tokens && (
          <a
            href="/register"
            className="inline-block mt-8 px-6 py-3 bg-black text-white rounded-xl hover:opacity-80"
          >
            Get Started
          </a>
        )}
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t py-10 text-center text-gray-400 text-sm">
        © 2026 Rauf Veterinary Platform. Built with care 🐾
      </footer>
    </div>
  );
}
