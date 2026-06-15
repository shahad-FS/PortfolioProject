import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "../styles/footer.css";
import logoImg from "../assets/logoImg.png";
import {
  LocationIcon,
  PhoneIcon,
  EmailIcon,
  CalendarClockIcon,
} from "./Icons";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <>
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="logo">
              <img src={logoImg} alt="Raouf Clinic" />
            </div>
            <p className="footer-brand-desc">{t("footer.brandDesc")}</p>
          </div>

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
                <Link to="/our-story">{t("navbar.ourStory")}</Link>
              </li>
            </ul>
          </div>

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

          <div>
            <div className="footer-col-title">{t("footer.contactTitle")}</div>
            <div className="footer-contact">
              <div className="contact-row">
                <div className="contact-row-icon">
                  <LocationIcon size={18} />
                </div>
                <span>{t("footer.address")}</span>
              </div>
              <div className="contact-row">
                <div className="contact-row-icon">
                  <PhoneIcon size={18} />
                </div>
                <span dir="ltr">{t("footer.phone")}</span>
              </div>
              <div className="contact-row">
                <div className="contact-row-icon">
                  <EmailIcon size={18} />
                </div>
                <span>{t("footer.email")}</span>
              </div>
              <div className="contact-row">
                <div className="contact-row-icon">
                  <CalendarClockIcon size={18} />
                </div>
                <span>{t("footer.hours")}</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
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
