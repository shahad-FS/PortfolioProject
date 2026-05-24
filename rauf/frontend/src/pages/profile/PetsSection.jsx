import { useState } from "react";
import PetModal from "./modals/PetModal";
import ViewMedicalModal from "./modals/ViewMedicalModal";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

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
  const { t, i18n } = useTranslation();
  const [showMedical, setShowMedical] = useState(false);
  const [selectedConsultationId, setSelectedConsultationId] = useState(null);

  const openAdd = () => {
    setEditingPet(null);
    setShowPetModal(true);
  };

  const openEdit = (pet) => {
    setEditingPet(pet);
    setShowPetModal(true);
  };

  const openMedical = (petId) => {
    const petAppointments = appointments.filter((app) => {
      const idFromApp = app.pet?.id || app.pet;
      return String(idFromApp) === String(petId);
    });

    if (petAppointments.length === 0) {
      alert("No appointments found for this pet 🐾");
      return;
    }

    const sortedAppointments = petAppointments.sort((a, b) => b.id - a.id);
    const latestAppointment = sortedAppointments[0];

    console.log(
      "🎯 Selected Consultation ID for Medical Record:",
      latestAppointment.id,
    );

    setSelectedConsultationId(latestAppointment.id);
    setShowMedical(true);
  };
  const handleDeleteClick = (petId) => {
    Swal.fire({
      title: t("profile.pet.confirmDeleteTitle"),
      text: t("profile.pet.confirmDelete"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c62828",
      cancelButtonColor: "var(--border)",
      confirmButtonText: t("common.delete"),
      cancelButtonText: t("common.cancel"),
      background: "var(--white)",
      color: "var(--text)",
      borderRadius: "16px",
      customClass: {
        popup: "custom-swal-font",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deletePet(petId);

        // رسالة نجاح
        Swal.fire({
          title: t("profile.pet.deletedTitle"),
          text: t("profile.pet.deletedText"),
          icon: "success",
          confirmButtonColor: "var(--primary)",
          borderRadius: "16px",
        });
      }
    });
  };
  return (
    <>
      {role === "pet_owner" && (
        <div
          className="bg-white rounded-2xl p-8 mt-6"
          style={{
            border: "1px solid var(--border)",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.01)",
            fontFamily: "Cairo, sans-serif",
            direction: i18n.language === "ar" ? "rtl" : "ltr",
          }}
        >
          {/*الهيدر العلوي*/}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>
              🐾 {t("profile.pet.title")}
            </h2>

            <button
              className="btn-fill flex items-center justify-center"
              onClick={openAdd}
              title={t("profile.pet.addTooltip")}
              style={{
                width: "45px",
                height: "45px",
                borderRadius: "50%",
                fontSize: "1.5rem",
                padding: 0,
                cursor: "pointer",
                backgroundColor: "var(--primary)",
                color: "var(--white)",
                border: "none",
                boxShadow: "0 4px 12px rgba(217, 121, 64, 0.2)",
                transition: "transform 0.2s ease, background-color 0.2s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.08)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              +
            </button>
          </div>

          {/* عرض الحيوانات الأليفة */}
          {pets.length === 0 ? (
            <div className="text-center py-8 bg-gray-50/50 rounded-xl border border-dashed style={{ borderColor: 'var(--border)' }}">
              <p style={{ color: "var(--text-light)" }}>
                🐾 {t("profile.pet.empty")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pets.map((pet) => (
                <div
                  key={pet.id}
                  className="p-5 rounded-xl flex flex-col justify-between transition-all"
                  style={{
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--white)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.01)",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.borderColor = "var(--primary)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.borderColor = "var(--border)")
                  }
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                      style={{ backgroundColor: "var(--primary-pale)" }}
                    >
                      🐶{" "}
                    </div>
                    <div>
                      <h3
                        className="font-bold text-lg"
                        style={{ color: "var(--text)" }}
                      >
                        {pet.name}
                      </h3>
                      <p
                        style={{
                          color: "var(--text-light)",
                          fontSize: "0.85rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        🎂 {t("profile.pet.age")}:{" "}
                        {pet.age
                          ? i18n.language === "ar"
                            ? Number(pet.age) === 1
                              ? "سنة"
                              : Number(pet.age) === 2
                                ? "سنتين"
                                : `${pet.age} سنوات`
                            : Number(pet.age) === 1
                              ? "1 Year"
                              : `${pet.age} Years`
                          : "—"}
                      </p>
                      <p
                        style={{
                          color: "var(--text-light)",
                          fontSize: "0.85rem",
                        }}
                      >
                        ID: #{pet.id}
                      </p>
                    </div>
                  </div>

                  {/* أزرار التحكم السفلية د */}
                  <div
                    className="flex flex-wrap gap-2 mt-2 pt-3 border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {/* زر التعديل */}
                    <button
                      className="btn-outline flex-1 min-w-[70px]"
                      onClick={() => openEdit(pet)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                        fontFamily: "Cairo",
                        border: "1px solid var(--primary)",
                        color: "var(--primary)",
                        background: "transparent",
                        cursor: "pointer",
                      }}
                    >
                      ✏️ {t("common.edit")}
                    </button>

                    <button
                      className="flex-1 min-w-[110px]"
                      onClick={() => openMedical(pet.id)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                        fontFamily: "Cairo",
                        backgroundColor: "var(--primary-pale)",
                        color: "var(--primary)",
                        border: "1px solid transparent",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      📋 {t("profile.pet.medicalReport")}
                    </button>

                    {/* زر الحذفف */}
                    <button
                      onClick={() => handleDeleteClick(pet.id)}
                      aria-label={t("common.delete")}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                        backgroundColor: "#ffebee",
                        color: "#c62828",
                        border: "none",
                        cursor: "pointer",
                      }}
                      title={t("common.delete")}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {showPetModal && (
        <PetModal
          editing={editingPet}
          setOpen={setShowPetModal}
          createPet={createPet}
          updatePet={updatePet}
        />
      )}

      {showMedical && (
        <ViewMedicalModal
          consultationId={selectedConsultationId}
          setOpen={setShowMedical}
        />
      )}
    </>
  );
}
