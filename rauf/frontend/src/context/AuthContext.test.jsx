import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthContext } from "./AuthContext";
import { AuthProvider } from "./AuthProvider";
import { useContext } from "react";
import api from "../api/axios";

vi.mock("../api/axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

const TestComponent = () => {
  const { tokens, userRole, login, logout } = useContext(AuthContext);
  return (
    <div>
      <div data-testid="role">{userRole || "no-role"}</div>
      <div data-testid="token">{tokens ? "has-token" : "no-token"}</div>
      <button onClick={() => login({ access: "fake-access-token" })}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe("AuthProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("loads initial state from localStorage", () => {
    localStorage.setItem("tokens", JSON.stringify({ access: "saved-token" }));
    localStorage.setItem("user_role", "admin");

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByTestId("role").textContent).toBe("admin");
    expect(screen.getByTestId("token").textContent).toBe("has-token");
  });

  it("updates state and calls API on login", async () => {
    api.get.mockResolvedValue({ data: { role: "user" } });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() =>
      expect(api.get).toHaveBeenCalledWith(
        "accounts/profile/",
        expect.any(Object),
      ),
    );

    expect(screen.getByTestId("role").textContent).toBe("user");
    expect(localStorage.getItem("user_role")).toBe("user");
  });

  it("clears state and storage on logout", () => {
    localStorage.setItem("tokens", JSON.stringify({ access: "token" }));
    localStorage.setItem("user_role", "admin");

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    fireEvent.click(screen.getByText("Logout"));

    expect(screen.getByTestId("role").textContent).toBe("no-role");
    expect(localStorage.getItem("tokens")).toBeNull();
  });
});
