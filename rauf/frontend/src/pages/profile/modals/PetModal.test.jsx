import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PetModal from "./PetModal";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key, i18n: { language: "en" } }),
}));

describe("PetModal", () => {
  const mockSetOpen = vi.fn();
  const mockCreatePet = vi.fn();
  const mockUpdatePet = vi.fn();

  const samplePet = {
    id: 1,
    name: "Rex",
    type: "dog",
    breed: "German Shepherd",
    birth_year: "2022",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly for Add mode", () => {
    render(
      <PetModal
        setOpen={mockSetOpen}
        createPet={mockCreatePet}
        updatePet={mockUpdatePet}
      />,
    );

    expect(screen.getByText("pets.modal.titleAdd")).toBeDefined();
  });

  it("pre-fills data when in Edit mode", () => {
    render(
      <PetModal
        editing={samplePet}
        setOpen={mockSetOpen}
        createPet={mockCreatePet}
        updatePet={mockUpdatePet}
      />,
    );

    expect(screen.getByDisplayValue("Rex")).toBeDefined();
    expect(screen.getByDisplayValue("German Shepherd")).toBeDefined();
  });

  it("calls createPet when adding new pet", async () => {
    render(
      <PetModal
        setOpen={mockSetOpen}
        createPet={mockCreatePet}
        updatePet={mockUpdatePet}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText(/pets.placeholders.name/i), {
      target: { value: "Bella" },
    });
    fireEvent.change(screen.getByPlaceholderText(/pets.placeholders.breed/i), {
      target: { value: "Siamese" },
    });
    fireEvent.change(
      screen.getByPlaceholderText(/pets.placeholders.birthYear/i),
      { target: { value: "2023" } },
    );

    fireEvent.click(screen.getByText(/pets.buttons.add/i));

    await waitFor(() => {
      expect(mockCreatePet).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Bella",
          birth_year: 2023,
        }),
      );
      expect(mockSetOpen).toHaveBeenCalledWith(false);
    });
  });

  it("calls updatePet when editing existing pet", async () => {
    render(
      <PetModal
        editing={samplePet}
        setOpen={mockSetOpen}
        createPet={mockCreatePet}
        updatePet={mockUpdatePet}
      />,
    );

    const nameInput = screen.getByDisplayValue("Rex");
    fireEvent.change(nameInput, { target: { value: "Max" } });

    fireEvent.click(screen.getByText(/pets.buttons.update/i));

    await waitFor(() => {
      expect(mockUpdatePet).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          name: "Max",
          birth_year: 2022,
        }),
      );
      expect(mockSetOpen).toHaveBeenCalledWith(false);
    });
  });
});
