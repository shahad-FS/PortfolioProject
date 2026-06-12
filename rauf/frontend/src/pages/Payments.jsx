import { useEffect, useRef, useState } from "react";
import api from "../api/axios";

import { useTranslation } from "react-i18next";

// ملفات ميسر
import "moyasar-payment-form/dist/moyasar.css";
import Moyasar from "moyasar-payment-form";

export default function Payments({ consultationId, amount, onPaymentSuccess }) {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [error, setError] = useState("");
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!consultationId || !amount || Number(amount) === 0) {
      console.log("Waiting for real amount...", { consultationId, amount });
      return;
    }

    if (isInitialized.current) return;

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Invalid payment amount.");
      return;
    }

    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    //Moyasar
    if (typeof Moyasar !== "undefined") {
      isInitialized.current = true;
      Moyasar.init({
        element: containerRef.current,
        publishable_api_key: "pk_test_waK9Y8Eg3pSCqVT8gGJSwCXHvXhZ77KzH1jgb9TC",
        amount: Math.round(numericAmount * 100),
        currency: "SAR",
        description: `Payment for Consultation #${consultationId}`,
        config: {
          "3ds": {
            with_iframe: true,
          },
        },
        methods: ["creditcard", "mada"],

        // callback_url: window.location.href,

        on_completed: async (payment) => {
          if (payment.status === "paid") {
            await handleVerification(payment.id);
          } else {
            isInitialized.current = false;
            setError(`Payment status is ${payment.status}. Please try again.`);
          }
        },
      });
    } else {
      setError("Moyasar library failed to load. Please refresh the page.");
    }

    return () => {
      isInitialized.current = false;
    };
  }, [consultationId, amount]);

  const handleVerification = async (paymentId) => {
    if (!consultationId) {
      console.error("❌ Error: consultationId is missing or undefined!");
      setError("Cannot verify payment because Consultation ID is missing.");
      return;
    }
    setLoadingVerify(true);
    setError("");
    try {
      const intentRes = await api.post("payments/create-intent/", {
        consultation_id: consultationId,
      });
      const transactionId = intentRes.data.transaction_id;
      console.log("Intent Created, Transaction ID:", transactionId);

      const verifyRes = await api.post("payments/verify/", {
        payment_id: paymentId,
        transaction_id: transactionId,
      });

      if (verifyRes.data.status === "success") {
        console.log("Payment verified successfully on backend!");
        onPaymentSuccess();
      } else {
        setError("Payment verification failed on server.");
        isInitialized.current = false;
      }
    } catch (err) {
      console.error(err);
      console.error("Detailed Error in handleVerification:", err);
      if (err.response) {
        console.error("Server Response Data:", err.response.data);
        console.error("Server Response Status:", err.response.status);
      }
      setError("Something went wrong while verifying your payment");
      isInitialized.current = false;
    } finally {
      setLoadingVerify(false);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-center mb-4">
        {t("payment.title")}
      </h3>
      <p className="text-center text-gray-500 mb-4">
        {t("payment.amountToPay")}{" "}
        <span className="font-bold text-black">
          {amount ? `${amount} SAR` : t("payment.loadingPrice")}
        </span>
      </p>

      {error && (
        <div className="alert alert-error text-sm text-red-600 bg-red-50 p-3 rounded-lg text-center mb-4">
          {error}
        </div>
      )}

      {loadingVerify && (
        <div className="text-center my-4 text-blue-600 font-medium animate-pulse">
          {t("payment.verifying")}
        </div>
      )}

      <div ref={containerRef}></div>
    </div>
  );
}
