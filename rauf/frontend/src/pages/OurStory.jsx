import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../styles/ourStory.css";
import cat1 from "../assets/cat1.jpg";

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
        <div
          className="cta-inner"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <h2 className="cta-title">{t("ourStory.cta.title")}</h2>
          <p className="cta-desc">{t("ourStory.cta.desc")}</p>
          <button
            className="btn-primary-custom"
            onClick={() => navigate("/register")}
            style={{
              marginTop: "24px",
              backgroundColor: "#d97736",
              color: "#ffffff",
              padding: "12px 32px",
              borderRadius: "12px",
              fontWeight: "bold",
              border: "none",
              cursor: "pointer",
            }}
          >
            {t("ourStory.cta.btn")}
          </button>
        </div>
      </section>
    </>
  );
}
