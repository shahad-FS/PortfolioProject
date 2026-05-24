import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import BookAppointment from "./BookAppointment";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

vi.mock("../api/axios");
vi.mock("./Payments", () => ({
  default: () => <div data-testid="mock-payments">Payment Gateway</div>,
}));
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      language: "en",
      changeLanguage: vi.fn(),
    },
  }),
}));
describe("BookAppointment", () => {
  const renderWithContext = (role = "user") => {
    return render(
      <MemoryRouter>
        <AuthContext.Provider value={{ userRole: role }}>
          <BookAppointment />
        </AuthContext.Provider>
      </MemoryRouter>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders "vet notice" when user is a vet', () => {
    renderWithContext("vet");
    expect(screen.getByText(/booking.vet_notice.title/i)).toBeDefined();
  });

  it("navigates through booking steps successfully", async () => {
    api.get.mockImplementation((url) => {
      if (url.includes("pets/"))
        return Promise.resolve({ data: [{ id: 1, name: "Buddy" }] });
      if (url.includes("accounts/vets/"))
        return Promise.resolve({ data: [{ id: 10, full_name: "Dr. Smith" }] });
      return Promise.resolve({ data: [] });
    });

    renderWithContext("user");

    await waitFor(() => {
      const select = screen.getByRole("combobox");
      expect(select).toBeDefined();
    });
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "1" } });
    fireEvent.click(screen.getByText(/booking.buttons.next/i));

    await waitFor(() =>
      expect(screen.getByText(/booking.step2.label/i)).toBeDefined(),
    );
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "10" } });
    fireEvent.click(screen.getByText(/booking.buttons.next/i));

    expect(screen.getByText(/booking.step3.label/i)).toBeDefined();
  });

  it("shows error message when submission fails", async () => {
    api.get.mockResolvedValue({ data: [] });
    api.post.mockRejectedValue(new Error("Network Error"));

    renderWithContext("user");

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "1" } });
    fireEvent.click(screen.getByText(/booking.buttons.next/i));
  });
});
