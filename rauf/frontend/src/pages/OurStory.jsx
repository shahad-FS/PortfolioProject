import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../styles/OurStory.css";
import cat1 from "../assets/cat1.jpg";
import cat2 from "../assets/cat2.jpg";
import cat3 from "../assets/cat3.jpg";


export default function OurStory() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <section className="story-section">
        <div className="story-inner">
          <div className="story-card">
            <div className="story-content">
              <h2 className="story-heading">{t("ourStory.heading")}</h2>

              <div className="story-text">
                <p>{t("ourStory.paragraph1")}</p>
                <p>{t("ourStory.paragraph2")}</p>
                <p className="story-mission">{t("ourStory.mission")}</p>
              </div>
            </div>

            <div className="story-image">
              <img src={cat1} alt="cat" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-cta">
        <div className="cta-inner">
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🐾</div>
          <h2 className="cta-title">{t("ourStory.cta.title")}</h2>
          <p className="cta-desc">{t("ourStory.cta.desc")}</p>
          <button className="cta-btn-white" onClick={() => navigate("/register")}>
            {t("ourStory.cta.btn")}
          </button>
        </div>
      </section>
    </>
  );
}