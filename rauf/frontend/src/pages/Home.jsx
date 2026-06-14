import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/hero.css";
import "../styles/featuresBar.css";
import "../styles/sections.css";
import "../styles/services.css";
import "../styles/howItWorks.css";
import "../styles/doctors.css";
import "../styles/testimonials.css";
import "../styles/ctaSection.css";
import petImg from "../assets/pet3.jpeg";
import {
  CatIcon,
  VideoIcon,
  LockIcon,
  StethoscopeIcon,
  CreditCardIcon,
  CalendarIcon,
  PillIcon,
  MedicalReportIcon,
  PrizeIcon,
  BellIcon,
  FollowUpIcon,
  PawIcon,
  StarIcon,
  VetIcon,
} from "../components/Icons";
export default function Home() {
  const { t } = useTranslation();
  const { tokens } = useContext(AuthContext);
  const navigate = useNavigate();

  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVets = async () => {
      try {
        const res = await api.get("accounts/vets/");

        const approvedVets = res.data.filter((vet) => vet.is_approved === true);

        setVets(approvedVets);
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
    <div
      className="doctor-card border rounded-2xl p-6 animate-pulse bg-white flex flex-col items-center text-center shadow-sm"
      data-testid="vet-skeleton"
    >
      <div className="h-14 w-14 bg-gray-200 rounded-full mb-4 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="h-3 bg-gray-100 rounded w-1/2 mb-4"></div>
      <div className="h-9 bg-gray-200 rounded w-full mt-auto"></div>
    </div>
  );

  return (
    <>
      {/* ================= HERO ================= */}

      <div className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-badge">
              <span>
                <CatIcon size={18} />
              </span>
              <span>{t("home.heroBadge")}</span>
            </div>
            <h1 className="hero-title">
              {t("home.heroTitle1")}
              <br />
              <span>{t("home.heroTitle2")}</span>
            </h1>
            <p className="hero-desc">{t("home.heroDesc")}</p>

            {/* CTA */}
            {!tokens && (
              <div className="hero-btns">
                <a href="/register" className="hero-btn-main">
                  {t("home.ctaStart")}
                </a>

                <a href="/login" className="hero-btn-sec">
                  {t("home.ctaLogin")}
                </a>
              </div>
            )}

            {tokens && (
              <p className="mt-8 text-sm text-gray-400">
                {t("home.welcomeBacke")}
              </p>
            )}
          </div>
          <div className="hero-image">
            <div className="hero-img-circle">
              <img src={petImg} />
            </div>
          </div>
        </div>
      </div>

      {/* ================= TRUST STRIP ================= */}
      <div className="features-bar">
        <div className="features-bar-inner">
          {[
            { icon: <VideoIcon size={20} />, text: t("home.trust.video") },
            { icon: <LockIcon size={20} />, text: t("home.trust.privacy") },
            {
              icon: <StethoscopeIcon size={20} />,
              text: t("home.trust.doctors"),
            },
            {
              icon: <CreditCardIcon size={20} />,
              text: t("home.trust.payment"),
            },
            {
              icon: <CalendarIcon size={20} />,
              text: t("home.trust.available"),
            },
          ].map((f, i, arr) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: 24 }}
            >
              <div className="feature-bar-item">
                <div className="feature-bar-icon">{f.icon}</div>
                <span>{f.text}</span>
              </div>
              {i < arr.length - 1 && <div className="divider-dot" />}
            </div>
          ))}
        </div>
      </div>

      {/* ================= VETS ================= */}
      <section className="section-doctors" id="doctors">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">{t("home.vets.tag")}</div>
            <h2 className="section-title">
              {t("home.vets.title1")} <span>{t("home.vets.titleSpan")}</span>
            </h2>
            <p className="section-desc">{t("home.vets.desc")}</p>
          </div>

          {/* اللودنق حقت تحميل كارد الاطباء*/}
          <div className="doctors-grid">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <VetSkeleton key={i} data-testid="vet-skeleton" />
                ))
              : vets.map((vet) => (
                  <div
                    className="doctor-card"
                    key={vet.id}
                    data-testid="vet-card"
                  >
                    <div className="doctor-avatar">
                      <VetIcon />
                    </div>

                    <h3 className="doctor-name">{vet.full_name}</h3>
                    <h3
                      className="doctor-meta"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span style={{ display: "inline-flex", gap: "2px" }}>
                        {t("home.vets.priceLabel")}{" "}
                        <strong>
                          {vet.session_price} {t("home.vets.currency")}
                        </strong>
                      </span>
                    </h3>

                    <p className="doctor-specialty">
                      {vet.specialization || t("home.vets.defaultSpecialty")}
                    </p>

                    <p className="doctor-specialty">{vet.bio}</p>

                    <button
                      onClick={() => handleBook(vet.id)}
                      className="btn-book"
                      data-testid={`book-btn-${vet.id}`}
                    >
                      {t("home.vets.bookBtn")}
                    </button>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* ================= Services ================= */}
      <section className="section-services" id="services">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">{t("home.services.tag")}</div>
            <h2 className="section-title">
              {t("home.services.title1")}
              <span>{t("home.services.titleSpan")}</span>
            </h2>
            <p className="section-desc">{t("home.services.desc")}</p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <VideoIcon size={20} />
              </div>
              <div className="service-title">
                {t("home.services.cardVideoTitle")}
              </div>
              <p className="service-desc">{t("home.services.cardVideoDesc")}</p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <MedicalReportIcon size={20} />
              </div>
              <div className="service-title">
                {t("home.services.cardRecordTitle")}
              </div>
              <p className="service-desc">
                {t("home.services.cardRecordDesc")}
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <PillIcon size={20} />
              </div>
              <div className="service-title">
                {t("home.services.cardRxTitle")}
              </div>
              <p className="service-desc">{t("home.services.cardRxDesc")}</p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <BellIcon size={20} />
              </div>
              <div className="service-title">
                {t("home.services.cardNotifyTitle")}
              </div>
              <p className="service-desc">
                {t("home.services.cardNotifyDesc")}
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <FollowUpIcon size={20} />
              </div>
              <div className="service-title">
                {t("home.services.cardFollowTitle")}
              </div>
              <p className="service-desc">
                {t("home.services.cardFollowDesc")}
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <PrizeIcon size={20} />
              </div>
              <div className="service-title">
                {t("home.services.cardLoyaltyTitle")}
              </div>
              <p className="service-desc">
                {t("home.services.cardLoyaltyDesc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= How it works ================= */}
      <section className="section-how" id="how">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">{t("home.how.tag")}</div>
            <h2 className="section-title">
              {t("home.how.title1")}
              <span>{t("home.how.titleSpan")}</span>
            </h2>
            <p className="section-desc">{t("home.how.desc")}</p>
          </div>

          <div className="steps-row">
            <div className="step-card">
              <div className="step-num">{t("home.how.step1Num")}</div>
              <div className="step-title">{t("home.how.step1Title")}</div>
              <p className="step-desc">{t("home.how.step1Desc")}</p>
            </div>
            <div className="step-card">
              <div className="step-num">{t("home.how.step2Num")}</div>
              <div className="step-title">{t("home.how.step2Title")}</div>
              <p className="step-desc">{t("home.how.step2Desc")}</p>
            </div>
            <div className="step-card">
              <div className="step-num">{t("home.how.step3Num")}</div>
              <div className="step-title">{t("home.how.step3Title")}</div>
              <p className="step-desc">{t("home.how.step3Desc")}</p>
            </div>
            <div className="step-card">
              <div className="step-num">{t("home.how.step4Num")}</div>
              <div className="step-title">{t("home.how.step4Title")}</div>
              <p className="step-desc">{t("home.how.step4Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Testimonials ================= */}
      <section className="section-testimonials" id="testimonials">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">{t("home.testimonials.tag")}</div>
            <h2 className="section-title">
              {t("home.testimonials.title1")}
              <span>{t("home.testimonials.titleSpan")}</span>
            </h2>
            <p className="section-desc">{t("home.testimonials.desc")}</p>
          </div>

          <div className="testimonials-grid">
            {/* التقييم الأول */}
            <div className="testimonial-card">
              <div className="testimonial-stars">
                <span style={{ display: "inline-flex", gap: "2px" }}>
                  <StarIcon size={18} fill="#FBBF24" />
                  <StarIcon size={18} fill="#FBBF24" />
                  <StarIcon size={18} fill="#FBBF24" />
                  <StarIcon size={18} fill="#FBBF24" />
                  <StarIcon size={18} fill="#FBBF24" />
                </span>
              </div>
              <p className="testimonial-text">
                {t("home.testimonials.user1Text")}
              </p>
              <div className="testimonial-author">
                <div>
                  <div className="author-name">
                    {t("home.testimonials.user1Name")}
                  </div>
                  <div className="author-label">
                    {t("home.testimonials.user1Label")}
                  </div>
                </div>
              </div>
            </div>

            {/* التقييم الثاني */}
            <div className="testimonial-card">
              <div className="testimonial-stars">
                <span style={{ display: "inline-flex", gap: "2px" }}>
                  <StarIcon size={18} fill="#FBBF24" />
                  <StarIcon size={18} fill="#FBBF24" />
                  <StarIcon size={18} fill="#FBBF24" />
                  <StarIcon size={18} fill="#FBBF24" />
                  <StarIcon size={18} fill="#FBBF24" />
                </span>
              </div>
              <p className="testimonial-text">
                {t("home.testimonials.user2Text")}
              </p>
              <div className="testimonial-author">
                <div>
                  <div className="author-name">
                    {t("home.testimonials.user2Name")}
                  </div>
                  <div className="author-label">
                    {t("home.testimonials.user2Label")}
                  </div>
                </div>
              </div>
            </div>

            {/* التقييم الثالث */}
            <div className="testimonial-card">
              <div className="testimonial-stars">
                <span style={{ display: "inline-flex", gap: "2px" }}>
                  <StarIcon size={18} fill="#FBBF24" />
                  <StarIcon size={18} fill="#FBBF24" />
                  <StarIcon size={18} fill="#FBBF24" />
                  <StarIcon size={18} fill="#FBBF24" />
                  <StarIcon size={18} fill="#FBBF24" />
                </span>
              </div>
              <p className="testimonial-text">
                {t("home.testimonials.user3Text")}
              </p>
              <div className="testimonial-author">
                <div>
                  <div className="author-name">
                    {t("home.testimonials.user3Name")}
                  </div>
                  <div className="author-label">
                    {t("home.testimonials.user3Label")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ================= FINAL CTA ================= */}
      <section className="section-cta">
        <div className="cta-inner">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <PawIcon size={48} color="rgb(0, 0, 0)" />
          </div>
          <h2 className="cta-title">{t("home.cta.title")}</h2>
          <p className="cta-desc">{t("home.cta.desc")}</p>

          {!tokens && (
            <a href="/register" className="cta-btn-white">
              {t("home.cta.btn")}
            </a>
          )}
        </div>
      </section>
    </>
  );
}
