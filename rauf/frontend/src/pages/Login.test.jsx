import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Login from "./Login";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

vi.mock("../api/axios");
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

describe("Login Page Use Cases", () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderLogin = () => {
    return render(
      <AuthContext.Provider value={{ login: mockLogin }}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthContext.Provider>,
    );
  };

  it("should show input and button correctly", () => {
    renderLogin();
    expect(
      screen.getByPlaceholderText("example@email.com"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /login.form.submitBtn/i }),
    ).toBeInTheDocument();
  });

  it("should raise error in login ", async () => {
    api.post.mockRejectedValueOnce({
      response: { data: { detail: "Invalid credentials" } },
    });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText("example@email.com"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(
      screen.getByPlaceholderText(/register.form.passwordLabel/i),
      { target: { value: "password123" } },
    );

    fireEvent.click(
      screen.getByRole("button", { name: /login.form.submitBtn/i }),
    );

    const errorMsg = await screen.findByText(
      /login.errors.invalidCredentials/i,
    );
    expect(errorMsg).toBeInTheDocument();
  });
});
