import { useState } from "react";
import PetModal from "./modals/PetModal";
import ViewMedicalModal from "./modals/ViewMedicalModal";

export default function PetsSection({
  role,
  pets = [],
  appointments = [],
  deletePet,
  createPet,
  updatePet,
}) {
  const [showPetModal, setShowPetModal] = useState(false);
  const [editingPet, setEditingPet] = useState(null);

  const [showMedical, setShowMedical] = useState(false);
  const [selectedConsultationId, setSelectedConsultationId] = useState(null);

  // ================= OPEN ADD =================
  const openAdd = () => {
    setEditingPet(null);
    setShowPetModal(true);
  };

  // ================= OPEN EDIT =================
  const openEdit = (pet) => {
    setEditingPet(pet);
    setShowPetModal(true);
  };

  // ================= OPEN MEDICAL =================
  const openMedical = (petId) => {
    const petAppointments = appointments.filter((app) => app.pet === petId);

    console.log(petAppointments);

    if (petAppointments.length === 0) {
      alert("No appointments found");
      return;
    }

    const latestAppointment = petAppointments[petAppointments.length - 1];

    setSelectedConsultationId(latestAppointment.id);
    setShowMedical(true);
  };
  return (
    <>
      {role === "pet_owner" && (
        <div className="bg-white shadow-xl rounded-2xl p-8 mt-6">
          <h2 className="text-xl font-bold mb-4">My Pets 🐾</h2>

          {/* ADD BUTTON */}
          <button className="btn btn-primary mb-4" onClick={openAdd}>
            Add Pet
          </button>

          {/* EMPTY STATE */}
          {pets.length === 0 ? (
            <p className="text-gray-500">No pets yet</p>
          ) : (
            pets.map((pet) => (
              <div key={pet.id} className="border p-4 rounded-lg mb-3">
                <p className="font-bold">{pet.name}</p>

                <div className="flex gap-2 mt-2">
                  {/* EDIT */}
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => openEdit(pet)}
                  >
                    Edit
                  </button>

                  {/* DELETE */}
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => deletePet(pet.id)}
                  >
                    Delete
                  </button>

                  {/* MEDICAL */}
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => openMedical(pet.id)}
                  >
                    View Medical
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ================= PET MODAL ================= */}
      {showPetModal && (
        <PetModal
          editing={editingPet}
          setOpen={setShowPetModal}
          createPet={createPet}
          updatePet={updatePet}
        />
      )}

      {/* ================= MEDICAL MODAL ================= */}
      {showMedical && (
        <ViewMedicalModal
          consultationId={selectedConsultationId}
          setOpen={setShowMedical}
        />
      )}
    </>
  );
}
