import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PetsSection from "./PetsSection";
import Swal from "sweetalert2";

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
  },
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: "en" },
  }),
}));

vi.mock("./modals/PetModal", () => ({
  default: () => <div data-testid="pet-modal" />,
}));
vi.mock("./modals/ViewMedicalModal", () => ({
  default: () => <div data-testid="medical-modal" />,
}));

describe("PetsSection", () => {
  const mockDeletePet = vi.fn();
  const mockPets = [
    { id: 1, name: "Rex", age: 2 },
    { id: 2, name: "Luna", age: 1 },
  ];
  const mockAppointments = [{ id: 101, pet: 1 }];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders pets list correctly", () => {
    render(
      <PetsSection
        role="pet_owner"
        pets={mockPets}
        deletePet={mockDeletePet}
      />,
    );

    expect(screen.getByText("Rex")).toBeDefined();
    expect(screen.getByText("Luna")).toBeDefined();
  });

  it("shows empty state when no pets", () => {
    render(<PetsSection role="pet_owner" pets={[]} />);
    expect(screen.getByText(/profile.pet.empty/i)).toBeDefined();
  });

  it("calls deletePet when confirmed in Swal", async () => {
    Swal.fire.mockResolvedValue({ isConfirmed: true });

    render(
      <PetsSection
        role="pet_owner"
        pets={mockPets}
        deletePet={mockDeletePet}
      />,
    );

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalled();
      expect(mockDeletePet).toHaveBeenCalledWith(1);
    });
  });

  it("opens medical modal when clicking report button", () => {
    render(
      <PetsSection
        role="pet_owner"
        pets={mockPets}
        appointments={mockAppointments}
      />,
    );

    const medicalButtons = screen.getAllByText(/profile.pet.medicalReport/i);
    fireEvent.click(medicalButtons[0]);

    expect(screen.getByTestId("medical-modal")).toBeDefined();
  });
});
