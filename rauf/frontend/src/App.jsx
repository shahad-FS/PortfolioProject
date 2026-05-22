import { Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./styles/index.css";

// lazy pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Home = lazy(() => import("./pages/Home"));
const Logout = lazy(() => import("./pages/Logout"));
const Profile = lazy(() => import("./pages/profile/Profile"));
const BookAppointment = lazy(() => import("./pages/BookAppointment"));
const VideoCall = lazy(() => import("./pages/VideoCall"));
const EmailConfirmation = lazy(() => import("./pages/EmailConfirmation"));
const EmailVerified = lazy(() => import("./pages/EmailVerified"));

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const currentLang = i18n.language || "ar";

    if (currentLang.startsWith("ar")) {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ar";
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = "en";
    }
  }, [i18n.language]);
  return (
    <>
      <Navbar />

      <Suspense fallback={<div>Loading page...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/check-email" element={<EmailConfirmation />} />
          <Route path="/email-verified" element={<EmailVerified />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/video-call/:sessionId" element={<VideoCall />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}

export default App;
