import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/auth.css";
import logoImg from "../assets/logoImg.png";
import Swal from "sweetalert2";

const Login = () => {
  const { t, i18next } = useTranslation();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState("");
  const [mounted, setMounted] = useState(true);
  const isRtl = i18next?.language === "ar";

  useEffect(() => {
    return () => setMounted(false);
  }, []);

  // Loading dots
  useEffect(() => {
    if (!loading || !mounted) return;

    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 300);

    return () => clearInterval(interval);
  }, [loading, mounted]);

  const handleRequestReset = async (email) => {
    try {
      await api.post("password_reset/", { email });

      Swal.fire({
        icon: "success",
        title: t("login.forgotPassword.successTitle"),
        text: t("login.forgotPassword.successText"),
        confirmButtonColor: "var(--primary)",
        customClass: { popup: "custom-swal-font" },
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: t("login.forgotPassword.errorTitle"),
        text: t("login.forgotPassword.errorText"),
        confirmButtonColor: "#e53e3e",
        customClass: { popup: "custom-swal-font" },
      });
    }
  };

  const showForgotPasswordModal = () => {
    Swal.fire({
      title: t("login.forgotPassword.modalTitle"),
      text: t("login.forgotPassword.modalText"),
      input: "email",
      inputPlaceholder: "example@email.com",
      showCancelButton: true,
      confirmButtonText: t("login.forgotPassword.confirmBtn"),
      cancelButtonText: t("login.forgotPassword.cancelBtn"),
      confirmButtonColor: "var(--primary)",
      cancelButtonColor: "#718096",
      customClass: { popup: "custom-swal-font" },
      inputValidator: (value) => {
        if (!value) {
          return t("login.forgotPassword.requiredError");
        }
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        handleRequestReset(result.value);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("accounts/login/", form);
      login(res.data);

      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (err) {
      console.log(err);

      if (err.response) {
        const data = err.response.data;
        const serverMessage = data.detail || data.error;

        if (
          serverMessage ===
          "Please verify your email address before logging in."
        ) {
          setError(t("login.errors.emailNotVerified"));
        } else if (serverMessage === "Incorrect email or password.") {
          setError(t("login.errors.invalidCredentials"));
        } else if (serverMessage === "Account does not exist.") {
          setError(t("login.errors.userNotFound"));
        } else {
          setError(serverMessage || t("login.errors.failed"));
        }
      } else {
        setError(t("login.errors.network"));
      }
    } finally {
      if (mounted) setLoading(false);
    }
  };

  return (
    <div className="page" id="page-login">
      <div className="auth-wrapper">
        <div className="auth-container">
          {/* Brand panel (الجانب الأيمن الموحد) */}
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
              {t("login.brand.title1")}
              <br />
              {t("login.brand.title2")}
            </div>
            <div className="brand-desc">{t("login.brand.desc")}</div>
            <div className="brand-features">
              <div className="brand-feature">
                <div className="brand-feature-icon">✅</div>
                <span>{t("login.brand.feat1")}</span>
              </div>
              <div className="brand-feature">
                <div className="brand-feature-icon">⚡</div>
                <span>{t("login.brand.feat2")}</span>
              </div>
              <div className="brand-feature">
                <div className="brand-feature-icon">🔒</div>
                <span>{t("login.brand.feat3")}</span>
              </div>
            </div>
            <div className="brand-paws">🐾 🐾 🐾</div>
          </div>

          {/* Form panel (الجانب الأيسر لتسجيل الدخول) */}
          <div className="auth-form-panel">
            <div className="form-header">
              <div className="tag-badge">{t("login.form.badge")}</div>
              <div className="form-title">{t("login.form.title")}</div>
              <div className="form-subtitle">
                {t("login.form.subtitle")}
                <Link to="/register">{t("login.form.linkRegister")}</Link>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* رسالة الخطأ */}
              {error && (
                <div
                  className="alert alert-error text-red-500 text-sm mb-4 text-right"
                  data-testid="login-error"
                  style={{
                    padding: "10px",
                    backgroundColor: "#fff5f5",
                    borderRadius: "8px",
                    border: "1px solid var(--error)",
                    textAlign: isRtl ? "right" : "left",
                  }}
                >
                  ⚠️ {error}
                </div>
              )}

              {/* EMAIL FIELD */}
              <div className="form-group">
                <label className="form-label">
                  {t("register.form.emailLabel")}{" "}
                  <span className="required">*</span>
                </label>
                <div className="input-wrap">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="example@email.com"
                    className="form-input"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* PASSWORD FIELD */}
              <div className="form-group mb-6">
                <div className="flex justify-between items-center mb-1">
                  <label className="form-label style={{ margin: 0 }}">
                    {t("register.form.passwordLabel")}{" "}
                    <span className="required">*</span>
                  </label>

                  {/* زر نسيت كلمة المرور ي */}
                  <button
                    type="button"
                    onClick={showForgotPasswordModal}
                    className="forgot-password-link"
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      color: "var(--primary)",
                      fontWeight: "600",
                      textDecoration: "underline",
                    }}
                  >
                    {t("login.form.forgotPassword")}
                  </button>
                </div>

                <div className="input-wrap">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    name="password"
                    placeholder={t("register.form.passwordLabel")}
                    className="form-input"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button className="btn-primary" type="submit" disabled={loading}>
                {loading
                  ? `${t("login.form.submitBtn")}${dots}`
                  : t("login.form.submitBtn")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
