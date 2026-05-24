import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import EmailConfirmation from "./EmailConfirmation";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

describe("EmailConfirmation Page", () => {
  const renderConfirmation = () =>
    render(
      <BrowserRouter>
        <EmailConfirmation />
      </BrowserRouter>,
    );

  it("should render the confirmation message and title correctly", () => {
    renderConfirmation();

    expect(screen.getByTestId("confirmation-title")).toBeInTheDocument();
    expect(screen.getByTestId("confirmation-message")).toBeInTheDocument();

    expect(screen.getByText("confirmEmail.title")).toBeInTheDocument();
    expect(screen.getByText("confirmEmail.message")).toBeInTheDocument();
  });
});
