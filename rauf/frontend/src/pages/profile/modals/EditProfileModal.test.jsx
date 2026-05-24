import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import EditProfileModal from "./EditProfileModal";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key, i18n: { language: "en" } }),
}));

describe("EditProfileModal", () => {
  const mockOnClose = vi.fn();
  const mockCompleteProfile = vi.fn();

  const sampleProfile = {
    full_name: "John Doe",
    phone: "0501234567",
    license_number: "LIC-123",
    specialization: "Dogs",
    session_price: "200.00",
  };

  it("pre-fills inputs with provided profile data", () => {
    render(
      <EditProfileModal
        profile={sampleProfile}
        role="vet"
        onClose={mockOnClose}
        completeProfile={mockCompleteProfile}
      />,
    );

    expect(screen.getByDisplayValue("John Doe")).toBeDefined();
    expect(screen.getByDisplayValue("0501234567")).toBeDefined();
    expect(screen.getByDisplayValue("LIC-123")).toBeDefined();
  });

  it("updates data and calls completeProfile with new values", async () => {
    render(
      <EditProfileModal
        profile={sampleProfile}
        role="vet"
        onClose={mockOnClose}
        completeProfile={mockCompleteProfile}
      />,
    );

    const nameInput = screen.getByDisplayValue("John Doe");
    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });

    const saveBtn = screen.getByText(/profile.edit.saveBtn/i);
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockCompleteProfile).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("calls onClose when cancel button is clicked", () => {
    render(
      <EditProfileModal
        profile={sampleProfile}
        role="owner"
        onClose={mockOnClose}
        completeProfile={mockCompleteProfile}
      />,
    );

    const cancelBtn = screen.getByText(/common.cancel/i);
    fireEvent.click(cancelBtn);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
