import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Register from "./Register";
import api from "../api/axios";

vi.mock("../api/axios");
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

describe("Register Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderRegister = () =>
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>,
    );

  it("should show error when submitting without required fields", async () => {
    renderRegister();
    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", { name: /register.form.submitBtn/i }),
    );

    expect(
      screen.getByText(/register.errors.emailRequired/i),
    ).toBeInTheDocument();
  });

  it("should send correct data to API on successful registration", async () => {
    api.post.mockResolvedValueOnce({ data: { message: "Success" } });

    renderRegister();
    screen.debug();

    const user = userEvent.setup();

    await user.type(screen.getByTestId("email-input"), "test@test.com");
    await user.type(screen.getByTestId("password-input"), "password123");

    await user.click(screen.getByRole("checkbox"));

    await user.click(
      screen.getByRole("button", { name: /register.form.submitBtn/i }),
    );

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("accounts/register/", {
        email: "test@test.com",
        password: "password123",
        role: "pet_owner",
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith("/check-email");
  });
});
