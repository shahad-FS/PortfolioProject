import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/axios";
import EmailVerified from "./EmailVerified";

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-6">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-800">{t("activating")}</h2>
        <p className="text-gray-500 mt-2">{t("pleaseWait")}</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-center p-6">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-red-600">{t("errorTitle")}</h2>
        <p className="text-gray-600 mt-2 max-w-md">{t("errorDesc")}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {t("backHome")}
        </button>
      </div>
    );

  return <EmailVerified />;
};

export default VerifyHandler;
