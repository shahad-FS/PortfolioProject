import { useEffect, useState, useRef, useContext } from "react";
import api from "../api/axios";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Payments from "./Payments";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../context/AuthContext";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function BookAppointment() {
  const { t, i18n } = useTranslation();
  const { userRole } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const dateInputRef = useRef(null);

  const [step, setStep] = useState(1);

  const [pets, setPets] = useState([]);
  const [vets, setVets] = useState([]);

  const [consultationId, setConsultationId] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);

  const [formData, setFormData] = useState({
    pet: "",
    vet: "",
    scheduled_at: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);

  useEffect(() => {
    if (userRole === "vet") return;
    fetchPets();
    fetchVets();

    const vetId = searchParams.get("vet");
    if (vetId) {
      setFormData((prev) => ({ ...prev, vet: vetId }));
    }

    const paymentId = searchParams.get("id");
    const paymentStatus = searchParams.get("status");
    if (paymentId && paymentStatus === "paid") {
      const verifyReturnedPayment = async () => {
        try {
          setLoading(true);
          setIsVerifyingPayment(true);
          await api.post("payments/verify/", {
            payment_id: paymentId,
          });
          setSuccess(true);
        } catch (err) {
          console.error("Verification failed after redirect:", err);
          setMessage(
            "Payment succeeded but failed to update database. Please contact support.",
          );
        } finally {
          setLoading(false);
          setIsVerifyingPayment(false);
        }
      };

      verifyReturnedPayment();
    }
  }, [searchParams]);

  const fetchPets = async () => {
    try {
      const res = await api.get("pets/");
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "pet" && value === "ADD_PET_REDIRECT") {
      navigate("/profile");
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("consultations/book/", formData);

      const newConsultationId = res.data.id;
      const newPrice =
        res.data.price || res.data.session_price || res.data.vet?.session_price;

      if (newConsultationId && newPrice) {
        setConsultationId(newConsultationId);
        setPaymentAmount(Number(newPrice));
        setStep(4);
      } else {
        const selectedVet = vets.find(
          (v) => String(v.id) === String(formData.vet),
        );
        const backupPrice = selectedVet?.vet?.session_price || "100.00";

        setConsultationId(newConsultationId);
        setPaymentAmount(Number(backupPrice));
        setStep(4);
      }
    } catch (err) {
      console.error(err);

      if (err.response && err.response.data) {
        const serverErrors = err.response.data;

        if (serverErrors.scheduled_at) {
          const rawError = Array.isArray(serverErrors.scheduled_at)
            ? serverErrors.scheduled_at[0]
            : serverErrors.scheduled_at;

          if (rawError === "The appointment time cannot be in the past.") {
            setMessage(t("booking.errors.past_date"));
          } else {
            setMessage(rawError);
          }
        } else if (typeof serverErrors === "string") {
          setMessage(serverErrors);
        } else {
          setMessage(t("booking.errors.failed"));
        }
      } else {
        setMessage(t("booking.errors.failed"));
      }
    } finally {
      setLoading(false);
    }
  };

  if (userRole === "vet") {
    return (
      <div
        className="page"
        style={{
          minHeight: "85vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <div
          className="auth-form-panel animate-fadeIn"
          style={{
            maxWidth: "500px",
            width: "100%",
            padding: "40px",
            boxShadow: "var(--card-shadow)",
            borderRadius: "20px",
            backgroundColor: "#fff",
            border: "1px solid var(--border)",
          }}
        >
          <div className="form-header" style={{ textAlign: "center" }}>
            <div className="text-5xl mb-4">🩺</div>
            <div
              className="tag-badge"
              style={{
                margin: "0 auto 12px",
                backgroundColor: "#fffbeb",
                color: "#b45309",
              }}
            >
              {t("booking.vet_notice.badge")}
            </div>
            <div className="form-title" style={{ color: "var(--text)" }}>
              {t("booking.vet_notice.title")}
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <p
              style={{
                lineHeight: "1.7",
                color: "var(--text-muted)",
                marginBottom: "30px",
                fontSize: "14px",
              }}
            >
              {t("booking.vet_notice.message")}
            </p>

            <Link
              to="/register"
              className="btn-fill"
              style={{
                textDecoration: "none",
                textAlign: "center",
                display: "block",
                padding: "14px",
                fontWeight: "700",
                fontSize: "15px",
                boxShadow: "0 4px 12px rgba(49, 151, 149, 0.2)",
              }}
            >
              {t("booking.vet_notice.register_link")}
            </Link>
          </div>
        </div>
      </div>
    );
  }
  if (
    isVerifyingPayment ||
    (searchParams.get("id") &&
      searchParams.get("status") === "paid" &&
      !success &&
      !message)
  ) {
    return (
      <div
        className="page"
        style={{
          minHeight: "85vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="auth-form-panel animate-fadeIn"
          style={{
            maxWidth: "450px",
            width: "100%",
            padding: "40px",
            textAlign: "center",
            backgroundColor: "#fff",
            borderRadius: "16px",
            boxShadow: "var(--card-shadow)",
          }}
        >
          <div
            className="text-5xl mb-4 animate-spin"
            style={{ display: "inline-block", animationDuration: "2s" }}
          >
            ⏳
          </div>
          <div
            className="form-title"
            style={{
              marginBottom: "10px",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            {t("booking.verifying.title")}
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            {t("booking.verifying.message")}
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div
        className="page"
        style={{
          minHeight: "85vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="auth-form-panel"
          style={{
            maxWidth: "450px",
            width: "100%",
            padding: "40px",
            boxShadow: "var(--card-shadow)",
            borderRadius: "16px",
            backgroundColor: "#fff",
          }}
        >
          <div className="form-header" style={{ textAlign: "center" }}>
            <div className="text-5xl mb-4 animate-bounce">🎉</div>
            <div
              className="tag-badge"
              style={{
                margin: "0 auto 12px",
                backgroundColor: "#e6fffa",
                color: "#319795",
              }}
            >
              {t("booking.success.badge", "تم الحجز والدفع")}
            </div>
            <div className="form-title" style={{ color: "var(--success)" }}>
              {t("booking.success.title")}
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <p
              style={{
                lineHeight: "1.6",
                color: "var(--text-muted)",
                marginBottom: "30px",
              }}
            >
              {t("booking.success.message")}
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <Link
                to="/profile"
                className="btn-fill"
                style={{ textDecoration: "none", textAlign: "center" }}
              >
                {t("booking.success.goToProfile")}
              </Link>
              <Link
                to="/"
                className="btn-secondary"
                style={{ textDecoration: "none", textAlign: "center" }}
              >
                {t("booking.success.goToHome")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="page"
      style={{
        minHeight: "90vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        className="auth-form-panel"
        style={{
          maxWidth: "600px",
          width: "100%",
          boxShadow: "var(--card-shadow)",
          borderRadius: "20px",
          padding: "40px",
          backgroundColor: "#fff",
        }}
      >
        {/* العناوين الرئيسية */}
        <div className="form-header" style={{ marginBottom: "25px" }}>
          <div className="tag-badge">{t("booking.badge")}</div>
          <div className="form-title">{t("booking.title")}</div>
        </div>

        {/* مؤشر الخطوات  */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "35px",
            position: "relative",
          }}
        >
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: 1,
                position: "relative",
              }}
            >
              {/* خط التوصيل الخلفي */}
              {s > 1 && (
                <div
                  style={{
                    position: "absolute",
                    right: i18n.language === "ar" ? "-50%" : "50%",
                    left: i18n.language === "ar" ? "50%" : "-50%",
                    top: "16px",
                    height: "3px",
                    backgroundColor:
                      step >= s ? "var(--primary)" : "var(--border)",
                    zIndex: 1,
                    transition: "all 0.3s",
                  }}
                />
              )}
              {/* الدائرة الرقمية للخطوة */}
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor:
                    step === s
                      ? "var(--primary)"
                      : step > s
                        ? "var(--primary-light)"
                        : "var(--white)",
                  border:
                    step >= s
                      ? "2px solid var(--primary)"
                      : "2px solid var(--text-light)",
                  color: step >= s ? "var(--white)" : "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: "bold",
                  zIndex: 2,
                  transition: "all 0.3s",
                }}
              >
                {step > s ? "✓" : s}
              </div>
              <span
                style={{
                  fontSize: "12px",
                  marginTop: "6px",
                  fontWeight: step === s ? "8px" : "600",
                  color: step === s ? "var(--primary)" : "var(--text-muted)",
                }}
              >
                {t(`booking.steps.step${s}`)}
              </span>
            </div>
          ))}
        </div>

        {/* ================= STEP 1: اختيار الأليف ================= */}
        {step === 1 && (
          <div className="animate-fadeIn">
            <div className="form-group">
              <label className="form-label">
                {t("booking.step1.label")} <span className="required">*</span>
              </label>
              <div className="input-wrap">
                <span className="input-icon">🐶</span>
                <select
                  id="pet-select"
                  name="pet"
                  value={formData.pet}
                  onChange={handleChange}
                  className="form-input"
                  style={{ appearance: "none", cursor: "pointer" }}
                >
                  <option value="">{t("booking.step1.placeholder")}</option>

                  {/* التحقق الشرطي: إذا لم يضف أي حيوان يظهر خيار التوجيه */}
                  {pets.length === 0 ? (
                    <option
                      value="ADD_PET_REDIRECT"
                      style={{ color: "var(--primary)", fontWeight: "bold" }}
                    >
                      ➕{" "}
                      {t(
                        "booking.step1.add_pet_option",
                        "أضف حيوان أليف (اذهب للملف الشخصي)",
                      )}
                    </option>
                  ) : (
                    pets.map((pet) => (
                      <option key={pet.id} value={pet.id}>
                        {pet.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
            <button
              onClick={nextStep}
              disabled={!formData.pet || formData.pet === "ADD_PET_REDIRECT"}
              className="btn-fill"
              style={{ marginTop: "25px" }}
            >
              {t("booking.buttons.next")}
            </button>
          </div>
        )}

        {/* ================= STEP 2: اختيار الطبيب ================= */}
        {step === 2 && (
          <div className="animate-fadeIn">
            <div className="form-group">
              <label className="form-label">
                {t("booking.step2.label", "اختر الطبيب البيطري 🩺")}{" "}
                <span className="required">*</span>
              </label>
              <div className="input-wrap">
                <span className="input-icon">👨‍⚕️</span>
                <select
                  name="vet"
                  value={formData.vet}
                  onChange={handleChange}
                  className="form-input"
                  style={{ appearance: "none", cursor: "pointer" }}
                >
                  <option value="">{t("booking.step2.placeholder")}</option>
                  {vets.map((vet) => (
                    <option key={vet.id} value={vet.id}>
                      {vet.full_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "25px" }}>
              <button
                onClick={prevStep}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                {t("booking.buttons.back")}
              </button>
              <button
                onClick={nextStep}
                disabled={!formData.vet}
                className="btn-fill"
                style={{ flex: 1 }}
              >
                {t("booking.buttons.next")}
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: التاريخ والوقت والتأكيد ================= */}
        {step === 3 && (
          <div>
            <div className="form-group">
              <label className="form-label">
                {t("booking.step3.label")} <span className="required">*</span>
              </label>

              <div
                className="input-wrap"
                onClick={() =>
                  dateInputRef.current && dateInputRef.current.showPicker()
                }
                style={{ cursor: "pointer" }}
              >
                <span className="input-icon">⏰</span>
                <DatePicker
                  selected={
                    formData.scheduled_at
                      ? new Date(formData.scheduled_at)
                      : null
                  }
                  onChange={(date) => {
                    setFormData({
                      ...formData,
                      scheduled_at: date ? date.toISOString() : "",
                    });
                  }}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption={i18n.language === "ar" ? "الوقت" : "Time"}
                  dateFormat="yyyy-MM-dd h:mm aa"
                  className="form-input"
                  placeholderText={t("booking.step3.label")}
                  required
                  minDate={new Date()}
                  filterTime={(time) => {
                    const currentDate = new Date();
                    const selectedDate = formData.scheduled_at
                      ? new Date(formData.scheduled_at)
                      : null;
                    if (
                      selectedDate &&
                      selectedDate.toDateString() === currentDate.toDateString()
                    ) {
                      return time.getTime() > currentDate.getTime();
                    }
                    return true;
                  }}
                />
              </div>
            </div>

            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                backgroundColor: "var(--primary-pale)",
                borderRadius: "12px",
                border: "1px dashed var(--border)",
              }}
            >
              <h4
                style={{
                  margin: "0 0 8px 0",
                  color: "var(--text)",
                  fontSize: "14px",
                  fontWeight: "800",
                }}
              >
                📝 {t("booking.step3.summaryTitle")}
              </h4>
              <div
                style={{
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <div>
                  🐾 {t("booking.step3.petId")}{" "}
                  <strong style={{ color: "var(--text)" }}>
                    {formData.pet}
                  </strong>
                </div>
                <div>
                  🩺 {t("booking.step3.vetId")}{" "}
                  <strong style={{ color: "var(--text)" }}>
                    {formData.vet}
                  </strong>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "25px" }}>
              <button
                onClick={prevStep}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                {t("booking.buttons.back")}
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !formData.scheduled_at}
                className="btn-primary"
                style={{ flex: 1 }}
              >
                {loading
                  ? t("booking.buttons.booking")
                  : t("booking.buttons.confirm")}
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: بوابة الدفع ================= */}
        {step === 4 && (
          <div className="animate-fadeIn">
            <Payments
              key={`${consultationId}-${paymentAmount}`}
              consultationId={consultationId}
              amount={paymentAmount}
              onPaymentSuccess={() => setSuccess(true)}
            />
          </div>
        )}

        {/* رسائل التنبيه والخطأ العامة السفلى */}
        {message && (
          <div
            className="alert alert-error text-sm text-center"
            style={{
              marginTop: "20px",
              padding: "10px",
              backgroundColor: "#fff5f5",
              borderRadius: "8px",
              border: "1px solid var(--error)",
              color: "var(--error)",
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
