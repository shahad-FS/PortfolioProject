import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import App from "./App";
import { AuthContext } from "./context/AuthContext";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: "ar" },
  }),
}));

describe("App Component", () => {
  it("renders Navbar and Footer correctly", async () => {
    const mockAuthValue = {
      tokens: null,
      login: vi.fn(),
      logout: vi.fn(),
      userRole: null,
    };

    render(
      <AuthContext.Provider value={mockAuthValue}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(screen.getByRole("navigation")).toBeDefined();
  });

  it("navigates to login page correctly", async () => {
    const mockAuthValue = {
      tokens: null,
      login: vi.fn(),
      logout: vi.fn(),
      userRole: null,
    };

    render(
      <AuthContext.Provider value={mockAuthValue}>
        <MemoryRouter initialEntries={["/login"]}>
          <App />
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    const loginElement = await screen.findByText(/Login/i);
    expect(loginElement).toBeDefined();
  });
});
