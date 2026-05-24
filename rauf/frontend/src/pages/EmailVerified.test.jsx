import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import EmailVerified from "./EmailVerified";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

describe("EmailVerified Page", () => {
  const renderVerified = () =>
    render(
      <BrowserRouter>
        <EmailVerified />
      </BrowserRouter>,
    );

  it("should render the success title", () => {
    renderVerified();
    screen.debug();
    expect(screen.getByTestId("verified-title")).toBeInTheDocument();
  });

  it("should have correct links for login and home", () => {
    renderVerified();

    const loginLink = screen.getByTestId("login-link");
    const homeLink = screen.getByTestId("home-link");

    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/login");

    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });
});
