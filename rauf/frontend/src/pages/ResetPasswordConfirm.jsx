import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/axios";
import Swal from "sweetalert2";

export default function ResetPasswordConfirm() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const isRtl = i18n.language === "ar";

  const handleSubmit = async (e) => {
    e.preventDefault();

    // التحقق من تطابق كلمتي المرور
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: t("resetPassword.alerts.mismatchTitle"),
        text: t("resetPassword.alerts.mismatchText"),
        confirmButtonColor: "var(--primary)",
        customClass: { popup: "custom-swal-font custom-swal-popup" },
      });
      return;
    }

    // التحقق من طول كلمة المرور
    if (password.length < 8) {
      Swal.fire({
        icon: "warning",
        title: t("resetPassword.alerts.weakTitle"),
        text: t("resetPassword.alerts.weakText"),
        confirmButtonColor: "var(--primary)",
        customClass: { popup: "custom-swal-font custom-swal-popup" },
      });
      return;
    }

    try {
      setLoading(true);
      await api.post("password_reset/confirm/", {
        token: token,
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
      let backendErrorMessage = t("resetPassword.alerts.errorText");
      if (err.response?.data) {
        if (err.response.data.status === "failed") {
          backendErrorMessage = isRtl
            ? "الرابط غير صالح أو انتهت صلاحيته. يرجى طلب رابط جديد."
            : "The token is invalid or has expired. Please request a new link.";
        } else if (err.response.data.password) {
          backendErrorMessage = err.response.data.password.join(" ");
        }
      }

      Swal.fire({
        icon: "error",
        title: t("resetPassword.alerts.errorTitle"),
        text: backendErrorMessage,
        confirmButtonColor: "#e53e3e",
        customClass: { popup: "custom-swal-font custom-swal-popup" },
      });
    } finally {
      setLoading(false);
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
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-start"
                placeholder="••••••••"
                style={{ borderColor: "var(--border)" }}
              />
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
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-start"
                placeholder="••••••••"
                style={{ borderColor: "var(--border)" }}
              />
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
