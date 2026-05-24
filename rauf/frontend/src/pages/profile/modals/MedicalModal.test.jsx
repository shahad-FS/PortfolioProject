import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MedicalModal from "./MedicalModal";
import { useMedical } from "../../../hooks/useMedical";

vi.mock("../../../hooks/useMedical");

describe("MedicalModal", () => {
  const mockApp = { id: 123 };
  const mockSetOpen = vi.fn();
  const mockSetAppointments = vi.fn();

  const mockUseMedical = {
    fetchMedicalByConsultation: vi.fn(),
    createMedical: vi.fn(),
    updateMedical: vi.fn(),
    addDiagnosis: vi.fn(),
    addPrescription: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useMedical.mockReturnValue(mockUseMedical);
  });

  it("fetches medical record on mount", async () => {
    mockUseMedical.fetchMedicalByConsultation.mockResolvedValue({
      data: { medical_record: { notes: "Old notes" } },
    });

    render(
      <MedicalModal
        app={mockApp}
        setOpen={mockSetOpen}
        setAppointments={mockSetAppointments}
      />,
    );

    expect(mockUseMedical.fetchMedicalByConsultation).toHaveBeenCalledWith(123);
  });

  it("saves new record, diagnosis, and prescription successfully", async () => {
    mockUseMedical.fetchMedicalByConsultation.mockResolvedValue({ data: null });
    mockUseMedical.createMedical.mockResolvedValue({ id: 999 });

    render(
      <MedicalModal
        app={mockApp}
        setOpen={mockSetOpen}
        setAppointments={mockSetAppointments}
      />,
    );

    fireEvent.change(
      screen.getByPlaceholderText(/medical.placeholders.notes/i),
      { target: { value: "New Notes" } },
    );
    fireEvent.change(
      screen.getByPlaceholderText(/medical.placeholders.diagnosis/i),
      { target: { value: "Flu" } },
    );
    fireEvent.change(
      screen.getByPlaceholderText(/medical.placeholders.medication/i),
      { target: { value: "Panadol" } },
    );

    const saveBtn = screen.getByText((content, element) =>
      content.includes("medical.buttons.add"),
    );
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockUseMedical.createMedical).toHaveBeenCalledWith({
        consultation_id: 123,
        notes: "New Notes",
      });
      expect(mockUseMedical.addDiagnosis).toHaveBeenCalledWith({
        record: 999,
        description: "Flu",
      });
      expect(mockUseMedical.addPrescription).toHaveBeenCalled();
      expect(mockSetOpen).toHaveBeenCalledWith(false);
    });
  });
});
