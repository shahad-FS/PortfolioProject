import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/axios";
import "../styles/auth.css";
import logoImg from "../assets/logoImg.png";
import {
  CalendarIcon,
  PillIcon,
  ErrorIcon,
  LockIcon,
  EmailIcon,
  GiftIcon,
  VetIcon,
  CatIcon,
} from "../components/Icons";

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "pet_owner",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim())
      newErrors.email = t("register.errors.emailRequired");
    if (!formData.password.trim())
      newErrors.password = t("register.errors.passwordRequired");

    if (!acceptedTerms) {
      newErrors.terms = t("register.errors.termsRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const renderError = (fieldError) => {
    if (!fieldError) return null;

    const rawError = Array.isArray(fieldError) ? fieldError[0] : fieldError;

    const backendErrorMap = {
      "Email already exists": "email_already_exists",
      "Invalid email format.": "invalid_email_format",
      "Please provide a valid official email address.":
        "invalid_official_email",
      "Ensure this field has at least 8 characters.": "passwordTooShort",
    };

    if (rawError.includes("extensions are not allowed")) {
      return t("register.errors.extension_not_allowed");
    }

    if (backendErrorMap[rawError]) {
      return t(`register.errors.${backendErrorMap[rawError]}`);
    }

    return rawError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await api.post("accounts/register/", formData);
      console.log("Success:", response.data);
      navigate("/check-email");
    } catch (error) {
      console.log("ERROR DATA:", error.response?.data);
      if (error.response?.data) {
        setErrors(error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" id="page-register">
      <div className="auth-wrapper">
        <div className="auth-container">
          {/* لوحة الهوية البراند والجانب الأيمن */}
          <div className="auth-brand">
            <div className="brand-logo">
              <div className="brand-logo-icon">
                <img
                  src={logoImg}
                  alt="Rauf Logo"
                  className="w-30 h-15 rounded-full object-cover mix-blend-multiply"
                />
              </div>
              <div className="brand-logo-text">{t("brandName")}</div>
            </div>
            <div className="brand-title">
              {t("register.brand.title1")}
              <br />

              {t("register.brand.title2")}
            </div>

            <div className="brand-desc">{t("register.brand.desc")}</div>
            <div className="brand-features">
              <div className="brand-feature">
                <div className="brand-feature-icon">
                  <GiftIcon size={18} />
                </div>
                <span>{t("register.brand.feat1")}</span>
              </div>
              <div className="brand-feature">
                <div className="brand-feature-icon">
                  <CalendarIcon size={18} />
                </div>
                <span>{t("register.brand.feat2")}</span>
              </div>
              <div className="brand-feature">
                <div className="brand-feature-icon">
                  <PillIcon size={18} />
                </div>
                <span>{t("register.brand.feat3")}</span>
              </div>
            </div>
          </div>
          {/* لوحة الفورم والجانب الأيسر */}
          <div className="auth-form-panel">
            <div className="form-header">
              <div className="tag-badge">
                {t("register.form.badge")}
                <CatIcon size={14} />
              </div>
              <div className="form-title">{t("register.form.title")}</div>
              <div className="form-subtitle">
                {t("register.form.subtitle")}
                <Link to="/login">{t("register.form.linkLogin")}</Link>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* EMAIL */}
              <div className="form-group">
                <label className="form-label">
                  {t("register.form.emailLabel")}
                  <span className="required">*</span>
                </label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <EmailIcon size={18} />
                  </span>
                  <input
                    name="email"
                    data-testid="email-input"
                    placeholder="examplr@email.com"
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                {errors.email && (
                  <p
                    className="text-red-500 text-xs dynamic-error"
                    style={{
                      color: "#ef4444",
                      fontSize: "12px",
                      marginTop: "6px",
                      textAlign: "start",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <ErrorIcon size={14} style={{ flexShrink: 0 }} />
                    <span>{renderError(errors.email)}</span>
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div className="form-group">
                <label className="form-label">
                  {t("register.form.passwordLabel")}
                  <span className="required">*</span>
                </label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <LockIcon size={18} />
                  </span>
                  <input
                    type="password"
                    name="password"
                    data-testid="password-input"
                    placeholder={t("register.form.passwordLabel")}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                {errors.password && (
                  <p
                    className="text-red-500 text-sm mb-4 dynamic-error"
                    style={{
                      marginTop: "6px",
                      fontSize: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      textAlign: "start",
                    }}
                  >
                    <ErrorIcon size={14} style={{ flexShrink: 0 }} />
                    <span>{renderError(errors.password)}</span>
                  </p>
                )}
              </div>

              {/* ROLE */}
              <div className="form-group mb-6">
                <label className="form-label">
                  {t("register.form.roleLabel")}
                  <span className="required">*</span>
                </label>

                <div className="grid grid-cols-2 gap-4">
                  {/* مربع صاحب الحيوان */}
                  <div
                    onClick={() =>
                      handleChange({
                        target: { name: "role", value: "pet_owner" },
                      })
                    }
                    className={`cursor-pointer p-4 rounded-xl border-2 text-center transition-all duration-200 select-none
        ${
          formData.role === "pet_owner"
            ? "border-[var(--primary)] bg-[rgba(var(--primary-rgb),0.05)] shadow-sm font-bold"
            : "border-gray-200 bg-white hover:border-gray-300"
        }`}
                  >
                    <div
                      className="text-3xl mb-2"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <CatIcon size={36} />
                    </div>
                    <div className="text-sm font-semibold text-gray-800">
                      {t("register.form.rolePetOwner")}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {t("register.form.rolePetOwnerDesc")}
                    </div>
                  </div>

                  {/* مربع الطبيب البيطري */}
                  <div
                    onClick={() =>
                      handleChange({ target: { name: "role", value: "vet" } })
                    }
                    className={`cursor-pointer p-4 rounded-xl border-2 text-center transition-all duration-200 select-none
        ${
          formData.role === "vet"
            ? "border-[var(--primary)] bg-[rgba(var(--primary-rgb),0.05)] shadow-sm font-bold"
            : "border-gray-200 bg-white hover:border-gray-300"
        }`}
                  >
                    <div
                      className="text-3xl mb-2"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <VetIcon size={36} />
                    </div>
                    <div className="text-sm font-semibold text-gray-800">
                      {t("register.form.roleVet")}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {t("register.form.roleVetDesc")}
                    </div>
                  </div>
                </div>
              </div>

              <label
                className="checkbox-label"
                style={{ marginBottom: "18px" }}
              >
                <input
                  type="checkbox"
                  className="custom-checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => {
                    setAcceptedTerms(e.target.checked);
                    if (e.target.checked) {
                      setErrors((prev) => ({ ...prev, terms: "" }));
                    }
                  }}
                />
                {t("register.form.agreeText")}{" "}
                <a
                  href="#"
                  style={{ color: "var(--primary)", margin: "0 4px" }}
                >
                  {t("register.form.termsLink")}
                </a>
                {t("register.form.and")}
                <a
                  href="#"
                  style={{ color: "var(--primary)", margin: "0 4px" }}
                >
                  {t("register.form.privacyLink")}
                </a>
              </label>

              {errors.terms && (
                <p
                  className="text-red-500 text-sm mb-4 dynamic-error"
                  style={{
                    marginBottom: "18px",
                    marginTop: "-10px",
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    textAlign: "start",
                  }}
                >
                  <ErrorIcon size={14} style={{ flexShrink: 0 }} />
                  <span>{renderError(errors.terms)}</span>
                </p>
              )}
              {/* SUBMIT BUTTON */}
              <button className="btn-primary" type="submit" disabled={loading}>
                {loading
                  ? t("register.form.loadingBtn")
                  : t("register.form.submitBtn")}
              </button>
            </form>
          </div>{" "}
        </div>
      </div>
    </div>
  );
};

export default Register;
