import { useTranslation } from "react-i18next";
import "../styles/auth.css";
import logoImg from "../assets/logoImg.png";
import { EmailIcon } from "../components/Icons";

const EmailConfirmation = () => {
  const { t } = useTranslation();

  return (
    <div className="page" id="page-email-confirmation">
      <div className="auth-wrapper">
        <div className="auth-container">
          {/* لوحة الهوية البراند والجانب الأيمن) */}
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

          {/* لوحة الرسالة والجانب الأيسر */}
          <div className="auth-form-panel">
            <div className="form-header" style={{ textAlign: "center" }}>
              <div className="tag-badge" style={{ margin: "0 auto 12px" }}>
                <EmailIcon size={14} /> {t("confirmEmail.badge")}
              </div>
              <div className="form-title" data-testid="confirmation-title">
                {t("confirmEmail.title")}
              </div>
            </div>

            <div
              className="confirm-email-content"
              style={{ textAlign: "center", marginTop: "20px" }}
            >
              <p
                className="text-gray-600 mb-6"
                style={{ lineHeight: "1.6", color: "#4a5568" }}
                data-testid="confirmation-message"
              >
                {t("confirmEmail.message")}
              </p>

              <p
                className="text-gray-500 text-sm"
                style={{
                  color: "#718096",
                  fontSize: "0.875rem",
                  marginTop: "24px",
                }}
              >
                {t("confirmEmail.spamNote")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmation;
