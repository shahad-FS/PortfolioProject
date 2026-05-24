import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CompleteProfileModal from "./CompleteProfileModal";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key, i18n: { language: "en" } }),
}));

describe("CompleteProfileModal", () => {
  const mockSubmit = vi.fn();

  it("renders owner fields correctly", () => {
    render(<CompleteProfileModal role="owner" onSubmit={mockSubmit} />);

    expect(
      screen.getByPlaceholderText(/auth.completeProfile.fullNamePlaceholder/i),
    ).toBeDefined();
    expect(screen.queryByPlaceholderText(/e.g. LIC-12345/i)).toBeNull();
  });

  it("renders vet fields when role is vet", () => {
    render(<CompleteProfileModal role="vet" onSubmit={mockSubmit} />);

    expect(screen.getByPlaceholderText(/e.g. LIC-12345/i)).toBeDefined();
  });

  it("calls onSubmit with correct data structure for vet", () => {
    render(<CompleteProfileModal role="vet" onSubmit={mockSubmit} />);

    fireEvent.change(
      screen.getByPlaceholderText(/auth.completeProfile.fullNamePlaceholder/i),
      { target: { value: "Dr. John" } },
    );
    fireEvent.change(screen.getByPlaceholderText(/05xxxxxxxx/i), {
      target: { value: "0500000000" },
    });
    fireEvent.change(screen.getByPlaceholderText(/e.g. LIC-12345/i), {
      target: { value: "LIC-999" },
    });

    const saveBtn = screen.getByText(/common.save/i);
    fireEvent.click(saveBtn);

    expect(mockSubmit).toHaveBeenCalledWith({
      profile: {
        full_name: "Dr. John",
        phone: "0500000000",
      },
      vet: {
        license_number: "LIC-999",
        specialization: "",
        session_price: "100.00",
      },
    });
  });
});
