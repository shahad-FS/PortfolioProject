import useProfile from "../../hooks/useProfile";
import { usePets } from "../../hooks/usePets";
import { useAppointments } from "../../hooks/useAppointments";
import ProfileHeader from "./ProfileHeader";
import PetsSection from "./PetsSection";
import AppointmentsSection from "./AppointmentsSection";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Profile() {
  const { t, i18n } = useTranslation();
  const iRtl = i18n.language === "ar";
  const { loading, role, profile, needsCompletion, completeProfile } =
    useProfile();

  const { pets, deletePet, createPet, updatePet } = usePets();

  const { appointments, updateStatus, setAppointments } = useAppointments();

  const location = useLocation();
  const isVideoPage = location.pathname.startsWith("/video-call");

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-[#0b0f19] transition-colors duration-300">
        <div className="relative flex flex-col items-center">
          <div className="w-16 h-16 rounded-full border-4 border-dashed border-teal-500/20 border-t-teal-500 animate-spin"></div>

          <div className="absolute top-4 text-2xl animate-bounce">🐾</div>

          <p
            className="mt-6 text-sm font-bold tracking-wide animate-pulse"
            style={{
              color: "var(--text-light)",
              fontFamily: "Cairo, sans-serif",
            }}
          >
            {t("profile.loadingMessage")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <ProfileHeader
        profile={profile}
        role={role}
        needsCompletion={needsCompletion}
        completeProfile={completeProfile}
      />

      {!isVideoPage && (
        <>
          <PetsSection
            role={role}
            pets={pets}
            appointments={appointments}
            deletePet={deletePet}
            createPet={createPet}
            updatePet={updatePet}
          />

          <AppointmentsSection
            role={role}
            appointments={appointments}
            updateStatus={updateStatus}
            setAppointments={setAppointments}
          />
        </>
      )}
    </div>
  );
}
