// src/components/LanguageSwitcher.jsx
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { LanguageIcon } from "./Icons";

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  // قلب اتجاه اللغه
  useEffect(() => {
    const currentLang = i18n.language || "ar";
    document.body.dir = currentLang === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  //تبديل اللغه
  const toggleLanguage = () => {
    const nextLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(nextLang);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLanguage}
      className="nav-btn-outline"
      style={{
        padding: "6px 14px 6px 5px",
        margin: "6px 14px 6px 5px",
        borderColor: "var(--text-light)",
        color: "var(--text)",
        fontSize: "12px",
        display: "flex",
        alignItems: "center",
        gap: "1px",
        cursor: "pointer",
      }}
    >
      <span>{t("navbar.language_btn")}</span>
      <span>
        <LanguageIcon size={14} />
      </span>
    </motion.button>
  );
}
