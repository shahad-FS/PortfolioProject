import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Navbar from "./Navbar";
import { AuthContext } from "../context/AuthContext";
import { MemoryRouter } from "react-router-dom";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: "en" },
  }),
}));

vi.mock("framer-motion", () => ({
  motion: {
    button: ({ children, onClick, ...props }) => (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    ),
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

describe("Navbar Component", () => {
  const renderNavbar = (authState) => {
    return render(
      <AuthContext.Provider value={authState}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </AuthContext.Provider>,
    );
  };

  it("renders register and login buttons when user is NOT logged in", () => {
    renderNavbar({ tokens: null, logout: vi.fn(), user: null });

    expect(screen.getByText("navbar.register")).toBeDefined();
    expect(screen.getByText("navbar.login")).toBeDefined();
  });

  it("renders profile avatar when user IS logged in", () => {
    renderNavbar({
      tokens: "fake-token",
      logout: vi.fn(),
      user: { full_name: "John Doe" },
    });

    expect(screen.getByText("👤")).toBeDefined();
    expect(screen.queryByText("navbar.register")).toBeNull();
  });

  it("opens dropdown and calls logout when logout button is clicked", () => {
    const mockLogout = vi.fn();
    renderNavbar({
      tokens: "fake-token",
      logout: mockLogout,
      user: { full_name: "John Doe" },
    });

    fireEvent.click(screen.getByText("👤"));

    const logoutBtn = screen.getByText("navbar.logout");
    expect(logoutBtn).toBeDefined();

    fireEvent.click(logoutBtn);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
