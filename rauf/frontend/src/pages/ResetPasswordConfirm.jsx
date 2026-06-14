import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/axios";
import Swal from "sweetalert2";
import { ErrorIcon } from "../components/Icons";
export default function ResetPasswordConfirm() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    general: "",
  });

  const isRtl = i18n.language === "ar";

  const handleSubmit = async (e) => {
    e.preventDefault();

    // تصفير الأخطاء
    setErrors({ password: "", confirmPassword: "", general: "" });

    if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: t("resetPassword.alerts.mismatchText"),
      }));
      return;
    }

    if (password.length < 8) {
      setErrors((prev) => ({
        ...prev,
        password: t("resetPassword.alerts.weakText"),
      }));
      return;
    }

    try {
      setLoading(true);

      await api.post("password_reset/confirm/", {
        token: token ? token.trim() : "",
        password: password,
      });

      Swal.fire({
        icon: "success",
        title: t("resetPassword.alerts.successTitle"),
        text: t("resetPassword.alerts.successText"),
        confirmButtonColor: "var(--primary)",
        customClass: { popup: "custom-swal-font custom-swal-popup" },
      }).then(() => {
        navigate("/login");
      });
    } catch (err) {
      console.error("Django Error Details:", err.response?.data);

      if (err.response?.data) {
        const serverData = err.response.data;

        if (serverData.password && Array.isArray(serverData.password)) {
          const combinedErrors = serverData.password
            .map((msg) => {
              if (msg.includes("too common")) {
                return t("resetPassword.alerts.tooCommon");
              }
              if (msg.includes("entirely numeric")) {
                return t("resetPassword.alerts.entirelyNumeric");
              }
              return msg;
            })
            .join(" ");

          setErrors((prev) => ({ ...prev, password: combinedErrors }));
        }
        // إذا كان التوكن منتهي أو غير صالح
        else if (serverData.status === "failed") {
          setErrors((prev) => ({
            ...prev,
            general: t("resetPassword.alerts.tokenExpired"),
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            general: t("resetPassword.alerts.errorText"),
          }));
        }
      } else {
        setErrors((prev) => ({ ...prev, general: t("login.errors.network") }));
      }
    } finally {
      if (typeof loading !== "undefined") setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8"
      style={{
        fontFamily: "Cairo, sans-serif",
        direction: isRtl ? "rtl" : "ltr",
      }}
    >
      <div
        className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl border"
        style={{ borderColor: "var(--border)" }}
      >
        <div>
          <h2
            className="mt-6 text-center text-3xl font-extrabold"
            style={{ color: "var(--text)" }}
          >
            {t("resetPassword.form.title")}
          </h2>
          <p
            className="mt-2 text-center text-sm"
            style={{ color: "var(--text-light)" }}
          >
            {t("resetPassword.form.subtitle")}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* خطأ عام بالصفحة */}
          {errors.general && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg border border-red-200 text-start">
              <ErrorIcon /> {errors.general}
            </div>
          )}

          <div className="space-y-4 rounded-md shadow-sm">
            {/* الحقل الأول: كلمة المرور الجديدة */}
            <div>
              <label
                className="block text-sm font-medium mb-1 text-start"
                style={{ color: "var(--text)" }}
              >
                {t("resetPassword.form.passwordLabel")}{" "}
                <span className="required">*</span>
              </label>
              <input
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-start ${
                  errors.password ? "border-red-500 focus:ring-red-500" : ""
                }`}
                placeholder="••••••••"
                style={!errors.password ? { borderColor: "var(--border)" } : {}}
              />
              {/* عرض الخطأ تحت الحقل */}
              {errors.password && (
                <p className="mt-1 text-xs text-red-500 text-start font-medium animate-pulse">
                  <ErrorIcon /> {errors.password}
                </p>
              )}
            </div>

            {/* الحقل الثاني: تأكيد كلمة المرور */}
            <div>
              <label
                className="block text-sm font-medium mb-1 text-start"
                style={{ color: "var(--text)" }}
              >
                {t("resetPassword.form.confirmPasswordLabel")}{" "}
                <span className="required">*</span>
              </label>
              <input
                type="password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-start ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : ""
                }`}
                placeholder="••••••••"
                style={
                  !errors.confirmPassword
                    ? { borderColor: "var(--border)" }
                    : {}
                }
              />
              {/* عرض الخطأ تحت حقل التأكيد */}
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500 text-start font-medium">
                  <ErrorIcon /> {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* زر الحفظ والتحديث */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors"
              style={{
                backgroundColor: loading ? "var(--border)" : "var(--primary)",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading
                ? t("resetPassword.form.loadingBtn")
                : t("resetPassword.form.submitBtn")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
