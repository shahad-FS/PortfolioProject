import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/auth.css";
import logoImg from "../assets/logoImg.png";
import { CelebrationIcon } from "../components/Icons";

const EmailVerified = () => {
  const { t } = useTranslation();

  return (
    <div className="page" id="page-email-verified">
      <div className="auth-wrapper">
        <div className="auth-container">
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
          </div>

          {/* لوحة النجاح والجانب الأيسر */}
          <div className="auth-form-panel">
            <div className="form-header" style={{ textAlign: "center" }}>
              <div
                className="text-5xl mb-4 animate-bounce"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CelebrationIcon />
              </div>
              <div
                className="tag-badge"
                style={{
                  margin: "0 auto 12px",
                  backgroundColor: "#e6fffa",
                  color: "#319795",
                }}
              >
                {t("emailVerified.badge")}
              </div>
              <div
                className="form-title"
                style={{ color: "#2f855a" }}
                data-testid="verified-title"
              >
                {t("emailVerified.title")}
              </div>
            </div>

            <div
              className="verified-content"
              style={{ textAlign: "center", marginTop: "20px" }}
            >
              <p
                style={{
                  lineHeight: "1.6",
                  color: "#4a5568",
                  marginBottom: "30px",
                }}
              >
                {t("emailVerified.message")}
              </p>

              {/* أزرار التوجيه */}
              <div
                className="flex flex-col gap-3"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <Link
                  to="/login"
                  data-testid="login-link"
                  className="btn-primary"
                  style={{
                    textDecoration: "none",
                    display: "block",
                    textAlign: "center",
                  }}
                >
                  {t("emailVerified.goToLogin")}
                </Link>

                <Link
                  to="/"
                  data-testid="home-link"
                  className="btn-secondary"
                  style={{
                    textDecoration: "none",
                    display: "block",
                    textAlign: "center",
                    padding: "12px",
                    borderRadius: "8px",

                    transition: "all 0.2s",
                  }}
                >
                  {t("emailVerified.goToHome")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerified;
