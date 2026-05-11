import useProfile from "../../hooks/useProfile";
import { usePets } from "../../hooks/usePets";
import { useAppointments } from "../../hooks/useAppointments";
import ProfileHeader from "./ProfileHeader";
import PetsSection from "./PetsSection";
import AppointmentsSection from "./AppointmentsSection";

export default function Profile() {
  const { loading, role, profile } = useProfile();
  const { pets, deletePet, createPet, updatePet } = usePets();
  const { appointments, updateStatus, setAppointments } = useAppointments();

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <ProfileHeader profile={profile} role={role} />

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
    </div>
  );
}
