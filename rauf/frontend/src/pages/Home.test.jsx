import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../api/axios");

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

describe("Home Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderHome = (tokens = null) =>
    render(
      <AuthContext.Provider value={{ tokens }}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </AuthContext.Provider>,
    );

  // --- الاختبارات الأساسية ---
  it("should show loading skeletons initially", () => {
    api.get.mockReturnValue(new Promise(() => {}));
    renderHome();
    const skeletons = screen.getAllByTestId("vet-skeleton");
    expect(skeletons.length).toBe(3);
  });

  it("should render vets list after API success", async () => {
    const mockVets = [
      {
        id: 1,
        full_name: "Dr. John Doe",
        session_price: "100",
        specialization: "Dogs",
      },
    ];
    api.get.mockResolvedValueOnce({ data: mockVets });
    renderHome();
    await waitFor(() => {
      expect(screen.getByText("Dr. John Doe")).toBeInTheDocument();
    });
  });

  it("should navigate to register when clicking book without token", async () => {
    const mockVets = [
      { id: 1, full_name: "Dr. John Doe", session_price: "100" },
    ];
    api.get.mockResolvedValueOnce({ data: mockVets });
    renderHome(null);
    const bookBtn = await screen.findByTestId("book-btn-1");
    bookBtn.click();
    expect(mockNavigate).toHaveBeenCalledWith("/register");
  });

  // --- الاختبارات الإضافية ---
  it("should handle API errors gracefully", async () => {
    api.get.mockRejectedValueOnce(new Error("Network Error"));
    renderHome();
    await waitFor(() => {
      expect(screen.queryByTestId("vet-card")).not.toBeInTheDocument();
    });
  });

  it("should show welcome message when logged in (tokens exist)", () => {
    api.get.mockResolvedValueOnce({ data: [] });
    renderHome("fake-token");
    expect(screen.getByText(/home.welcomeBacke/i)).toBeInTheDocument();
  });

  it("should show register/login buttons when not logged in", () => {
    api.get.mockResolvedValueOnce({ data: [] });
    renderHome(null);
    expect(screen.getByText(/home.ctaStart/i)).toBeInTheDocument();
  });

  it("should display nothing or a message when vets list is empty", async () => {
    api.get.mockResolvedValueOnce({ data: [] });
    renderHome();
    await waitFor(() => {
      expect(screen.queryByText("Dr. John Doe")).not.toBeInTheDocument();
    });
  });

  it("should render core section titles", () => {
    renderHome();
    expect(screen.getByText(/home.heroTitle1/i)).toBeInTheDocument();
  });
});
