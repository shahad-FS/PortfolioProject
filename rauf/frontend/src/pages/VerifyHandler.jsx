import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/axios";
import EmailVerified from "./EmailVerified";
import { ErrorIcon } from "../components/Icons";

const VerifyHandler = () => {
  const { t } = useTranslation();
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`accounts/verify-email/${token}/`)
      .then(() => setLoading(false))
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [token]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg)] text-center p-6">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[var(--primary)] mb-4"></div>
        <h2 className="text-2xl font-bold text-[var(--text)]">
          {t("vierifyHandler.activating")}
        </h2>
        <p className="text-[var(--text-muted)] mt-2">
          {t("vierifyHandler.pleaseWait")}
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg)] text-center p-6">
        <div className="text-6xl mb-4">
          <ErrorIcon />
        </div>
        <h2 className="text-2xl font-bold text-red-600">
          {t("vierifyHandler.errorTitle")}
        </h2>
        <p className="text-[var(--text-muted)] mt-2 max-w-md">
          {t("vierifyHandler.errorDesc")}
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-2 bg-[var(--primary)] text-white rounded-[30px] hover:bg-[#c2632b] transition-all duration-200 font-bold"
        >
          {t("vierifyHandler.backHome")}
        </button>
      </div>
    );

  return <EmailVerified />;
};

export default VerifyHandler;
