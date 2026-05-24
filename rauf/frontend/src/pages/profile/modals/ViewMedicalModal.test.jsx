import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ViewMedicalModal from "./ViewMedicalModal";
import api from "../../../api/axios";

vi.mock("../../../api/axios");

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key, i18n: { language: "en" } }),
}));

describe("ViewMedicalModal", () => {
  const mockConsultationId = 123;
  const mockSetOpen = vi.fn();

  const mockRecord = {
    notes: "Patient is recovering well.",
    diagnoses: [{ id: 1, description: "Common Cold" }],
    prescriptions: [
      {
        id: 1,
        medication: "Paracetamol",
        dosage: "500mg",
        instructions: "Twice daily",
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially", async () => {
    api.get.mockReturnValue(
      new Promise((resolve) =>
        setTimeout(
          () => resolve({ data: { medical_record: mockRecord } }),
          100,
        ),
      ),
    );

    render(
      <ViewMedicalModal
        consultationId={mockConsultationId}
        setOpen={mockSetOpen}
      />,
    );

    expect(screen.getByText(/medical.view.loading/i)).toBeDefined();
  });

  it("renders medical record data successfully", async () => {
    api.get.mockResolvedValue({ data: { medical_record: mockRecord } });

    render(
      <ViewMedicalModal
        consultationId={mockConsultationId}
        setOpen={mockSetOpen}
      />,
    );

    await waitFor(() => {
      expect(screen.queryByText(/medical.view.loading/i)).toBeNull();
    });

    expect(screen.getByText(/Patient is recovering well./i)).toBeDefined();
    expect(screen.getByText(/Common Cold/i)).toBeDefined();
    expect(screen.getByText(/Paracetamol/i)).toBeDefined();
  });

  it('shows "no record" message when API returns no data', async () => {
    api.get.mockResolvedValue({ data: { exists: false } });

    render(
      <ViewMedicalModal
        consultationId={mockConsultationId}
        setOpen={mockSetOpen}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText(/medical.view.noRecordTitle/i)).toBeDefined();
    });
  });

  it("handles API errors gracefully", async () => {
    api.get.mockRejectedValue(new Error("Network Error"));

    render(
      <ViewMedicalModal
        consultationId={mockConsultationId}
        setOpen={mockSetOpen}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText(/medical.view.noRecordTitle/i)).toBeDefined();
    });
  });
});
