import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "../styles/footer.css";
import logoImg from "../assets/logoImg.png";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <>
      {" "}
      <footer className="footer">
        <div className="footer-inner">
          {/* الهوية والشعار */}
          <div className="footer-brand">
            <div className="logo">
              <img src={logoImg} alt="Raouf Clinic" />
            </div>
            <p className="footer-brand-desc">{t("footer.brandDesc")}</p>
            <div className="social-row">
              <div className="social-btn" title={t("footer.twitter")}>
                𝕏
              </div>
              <div className="social-btn" title={t("footer.instagram")}>
                📸
              </div>
              <div className="social-btn" title={t("footer.snapchat")}>
                👻
              </div>
              <div className="social-btn" title={t("footer.youtube")}>
                ▶
              </div>
            </div>
          </div>

          {/* روابط سريعة */}
          <div>
            <div className="footer-col-title">{t("footer.quickLinks")}</div>
            <ul className="footer-links">
              <li>
                <Link to="/">{t("footer.home")}</Link>
              </li>
              <li>
                <Link to="/doctors">{t("footer.doctors")}</Link>
              </li>
              <li>
                <Link to="/services">{t("footer.services")}</Link>
              </li>
              <li>
                <Link to="/how-it-works">{t("footer.howItWorks")}</Link>
              </li>
              <li>
                <Link to="/blog">{t("footer.blog")}</Link>
              </li>
              <li>
                <Link to="/about">{t("footer.about")}</Link>
              </li>
            </ul>
          </div>

          {/* الدعم والمساعدة */}
          <div>
            <div className="footer-col-title">{t("footer.supportTitle")}</div>
            <ul className="footer-links">
              <li>
                <Link to="/help">{t("footer.helpCenter")}</Link>
              </li>
              <li>
                <Link to="/faqs">{t("footer.faqs")}</Link>
              </li>
              <li>
                <Link to="/refund">{t("footer.refundPolicy")}</Link>
              </li>
              <li>
                <Link to="/privacy">{t("footer.privacyPolicy")}</Link>
              </li>
              <li>
                <Link to="/terms">{t("footer.terms")}</Link>
              </li>
              <li>
                <Link to="/contact">{t("footer.contactUs")}</Link>
              </li>
            </ul>
          </div>

          {/* بيانات التواصل */}
          <div>
            <div className="footer-col-title">{t("footer.contactTitle")}</div>
            <div className="footer-contact">
              <div className="contact-row">
                <div className="contact-row-icon">📍</div>
                <span>{t("footer.address")}</span>
              </div>
              <div className="contact-row">
                <div className="contact-row-icon">📞</div>
                <span dir="ltr">{t("footer.phone")}</span>
              </div>
              <div className="contact-row">
                <div className="contact-row-icon">📧</div>
                <span>{t("footer.email")}</span>
              </div>
              <div className="contact-row">
                <div className="contact-row-icon">🕐</div>
                <span>{t("footer.hours")}</span>
              </div>
            </div>
          </div>
        </div>
      </footer>{" "}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-container">
          <span>{t("footer.copyright")}</span>
          <div
            className="footer-bottom-links"
            style={{ display: "flex", gap: "16px", justifyContent: "center" }}
          >
            <Link to="/privacy">{t("footer.privacyPolicy")}</Link>
            <Link to="/terms">{t("footer.terms")}</Link>
            <Link to="/sitemap">{t("footer.sitemap")}</Link>
          </div>
        </div>
      </div>
    </>
  );
}
