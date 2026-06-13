// src/components/Navbar.jsx
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import LanguageSwitcherBtn from "./LanguageSwitcherBtn";

import "../styles/navbar.css";
import logoImg from "../assets/logoImg.png";

export default function Navbar() {
  const { tokens, logout, user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const getInitials = () => {
    if (!user?.full_name) return "U";
    return user.full_name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <nav className="navbar">
      <div
        className="navbar-inner"
        style={{ maxWidth: "100%", padding: "0 4%" }}
      >
        {/* قسم الشعار يمين */}
        <div className="logo">
          <Link
            to="/"
            className="logo-text"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <div className="logo-icon">
              <img src={logoImg} alt="عيادة رؤوف" />
            </div>
          </Link>
        </div>

        <ul
          className="nav-links hidden md:flex"
          style={{ flexGrow: 1, justifyContent: "right" }}
        >
          <li>
            <Link to="/">{t("navbar.home")}</Link>
          </li>
          <li>
            <Link to={tokens ? "/book-appointment" : "/login"}>
              {t("navbar.book")}
            </Link>
          </li>
          <li>
            <Link to="/our-story">{t("navbar.ourStory")}</Link>
          </li>
        </ul>

        {/* الأزرار يسار */}

        <div className="nav-actions">
          {!tokens ? (
            <>
              {/* زر إنشاء حساب تفاعلي */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/register")}
                className="btn-fill"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                {t("navbar.register")}
              </motion.button>

              {/* زر تسجيل الدخول */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/login")}
                className="btn-secondary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                {t("navbar.login")}
              </motion.button>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="btn-secondary"
                style={{
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                }}
              >
                👤
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute mt-2 w-48 bg-white shadow-lg rounded-xl p-2 z-50"
                    style={{
                      position: "absolute",
                      [i18n.language === "ar" ? "left" : "right"]: 0,
                      border: "2px solid var(--border)",
                    }}
                  >
                    {/* زر الملف الشخصي داخل القائمة  */}
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setOpen(false);
                      }}
                      className="dropdown-item-btn"
                      style={{
                        color: "var(--text)",
                        display: "block",
                        width: "100%",
                        padding: "10px 12px",
                        background: "transparent",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontFamily: "Cairo",
                        textAlign: i18n.language === "ar" ? "right" : "left",
                        transition: "background 0.2s ease, color 0.2s ease",
                      }}
                    >
                      {t("navbar.profile")}
                    </button>

                    {/* زر تسجيل الخروج */}
                    <button
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                      className="dropdown-item-btn"
                      style={{
                        color: "var(--text)",
                        display: "block",
                        width: "100%",
                        padding: "10px 12px",
                        background: "transparent",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontFamily: "Cairo",
                        textAlign: i18n.language === "ar" ? "right" : "left",
                        transition: "background 0.2s ease, color 0.2s ease",
                        marginTop: "4px",
                      }}
                    >
                      {t("navbar.logout")}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          <LanguageSwitcherBtn />
        </div>
      </div>
    </nav>
  );
}
