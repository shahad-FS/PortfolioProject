import { useState } from "react";
import PetModal from "./modals/PetModal";
import ViewMedicalModal from "./modals/ViewMedicalModal";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { PencilIcon, DeleteIcon, CatIcon } from "../../components/Icons";

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
      setSelectedConsultationId(null);
      setShowMedical(true);
      return;
    }

    const sortedAppointments = petAppointments.sort((a, b) => b.id - a.id);
    const latestAppointment = sortedAppointments[0];

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
          {/* الهيدر العلوي لـ قسم الأليفين */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>
              {t("profile.pet.title")}
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
            <div className="text-center py-8 bg-gray-50/50 rounded-xl border border-dashed border-[var(--border)]">
              <p style={{ color: "var(--text-light)" }}>
                {t("profile.pet.empty")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <div
                  key={pet.id}
                  className="p-5 rounded-xl flex flex-col justify-between transition-all"
                  style={{
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--white)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.01)",
                    position: "relative",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.borderColor = "var(--primary)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.borderColor = "var(--border)")
                  }
                >
                  {/* القسم العلوي: الصورة، البيانات وزر الحذف */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-lg shrink-0"
                        style={{ backgroundColor: "var(--primary-pale)" }}
                      >
                        <CatIcon />
                      </div>
                      <div>
                        <h3
                          className="font-bold text-lg leading-tight mb-1"
                          style={{ color: "var(--text)" }}
                        >
                          {pet.name}
                        </h3>
                        <p
                          style={{
                            color: "var(--text-light)",
                            fontSize: "0.85rem",
                          }}
                        >
                          {t("profile.pet.age")}:{" "}
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
                            opacity: 0.8,
                          }}
                        >
                          ID: #{pet.id}
                        </p>
                      </div>
                    </div>

                    {/* زر الحذف*/}
                    <button
                      onClick={() => handleDeleteClick(pet.id)}
                      aria-label={t("common.delete")}
                      className="flex items-center justify-center shrink-0 transition-colors"
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        backgroundColor: "#ffebee",
                        color: "#c62828",
                        border: "none",
                        cursor: "pointer",
                      }}
                      title={t("common.delete")}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = "#ffcdd2")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = "#ffebee")
                      }
                    >
                      <DeleteIcon size={14} />
                    </button>
                  </div>

                  {/* فاصل ناعم */}
                  <div
                    className="border-t my-2"
                    style={{ borderColor: "var(--border)", opacity: 0.6 }}
                  />

                  {/* أزرار التحكم السفلية مرتبة عمودياً لمنع الخروج عن الإطار */}
                  <div className="flex flex-col gap-2 mt-2 w-full">
                    {/* زر التعديل يأخذ كامل العرض */}
                    <button
                      className="btn-outline flex items-center justify-center gap-1.5 w-full"
                      onClick={() => openEdit(pet)}
                      style={{
                        height: "38px",
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                        fontFamily: "Cairo",
                        border: "1px solid var(--primary)",
                        color: "var(--primary)",
                        background: "transparent",
                        cursor: "pointer",
                        flexDirection:
                          i18n.language === "ar" ? "row" : "row-reverse",
                      }}
                    >
                      <PencilIcon size={14} style={{ flexShrink: 0 }} />
                      <span>{t("common.edit")}</span>
                    </button>

                    {/* زر الملف الطبي يأخذ كامل العرض */}
                    <button
                      className="flex items-center justify-center w-full"
                      onClick={() => openMedical(pet.id)}
                      style={{
                        height: "38px",
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
                      {t("profile.pet.medicalReport")}
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
