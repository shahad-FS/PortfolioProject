import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "./api/axios"; // تأكد من تثبيت axios
import EmailVerified from "./EmailVerified";

const VerifyHandler = () => {
  const { token } = useParams(); // استخراج التوكن من الرابط
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // الاتصال بالـ API الحقيقي لتفعيل الحساب
    api
      .get(`accounts/verify-email/${token}/`)
      .then(() => {
        setLoading(false); // تم التفعيل بنجاح!
      })
      .catch((err) => {
        setError(true);
        setLoading(false);
      });
  }, [token]);

  if (loading) return <div>جاري التفعيل...</div>;
  if (error) return <div>حدث خطأ أثناء التفعيل، حاول لاحقاً.</div>;

  // إذا نجح كل شيء، اعرض صفحة النجاح التي صممتها
  return <EmailVerified />;
};
