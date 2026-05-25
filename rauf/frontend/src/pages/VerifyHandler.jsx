import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import EmailVerified from "./EmailVerified";

const VerifyHandler = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .get(`accounts/verify-email/${token}/`)
      .then((res) => {
        console.log("Success:", res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error details:", err.response?.data || err.message);
        setError(true);
        setLoading(false);
      });
  }, [token]);

  if (loading) return <div>جاري التفعيل....</div>;
  if (error) return <div>حدث خطأ أثناء التفعيل، حاول لاحقاً.</div>;

  return <EmailVerified />;
};
export default VerifyHandler;
